// AI Bot Service for WhatsApp
import { WhatsAppMessage, BotResponse, BotUser, StuFindOpportunity } from './types';
import { getOpportunities } from '@/integrations/firebase/client';
import { webhook } from './webhook';

// In-memory storage for bot users (in production, use database)
const botUsers = new Map<string, BotUser>();

export async function processMessage(message: WhatsAppMessage): Promise<BotResponse | null> {
  const phone = message.from;
  const text = message.text?.body?.toLowerCase().trim() || '';
  
  console.log(`Processing message from ${phone}: "${text}"`);

  // Get or create user
  let user = botUsers.get(phone);
  if (!user) {
    user = {
      phone,
      preferences: {
        categories: [],
        priceRange: { min: 0, max: 1000 }
      },
      conversationState: 'idle',
      lastActivity: new Date()
    };
    botUsers.set(phone, user);
    
    // Send welcome message for new users
    await webhook.sendWelcomeMessage(phone);
    return null;
  }

  // Update last activity
  user.lastActivity = new Date();
  botUsers.set(phone, user);

  // Handle different message types
  if (message.type === 'interactive') {
    return handleInteractiveMessage(message, user);
  }

  // Handle text messages
  return handleTextMessage(text, user);
}

function handleInteractiveMessage(message: WhatsAppMessage, user: BotUser): BotResponse | null {
  const buttonId = message.interactive?.button_reply?.id || message.interactive?.list_reply?.id;
  
  switch (buttonId) {
    case 'browse_items':
      return showBrowseMenu(user);
    case 'sell_item':
      return showSellMenu(user);
    case 'my_account':
      return showAccountMenu(user);
    case 'help':
      return showHelpMenu(user);
    case 'back_to_menu':
      return showMainMenu(user);
    default:
      if (buttonId?.startsWith('item_')) {
        const itemId = buttonId.replace('item_', '');
        return showItemDetails(itemId, user);
      }
      if (buttonId?.startsWith('category_')) {
        const category = buttonId.replace('category_', '');
        return showCategoryItems(category, user);
      }
      return showMainMenu(user);
  }
}

function handleTextMessage(text: string, user: BotUser): BotResponse | null {
  // Handle common commands
  if (text.includes('menu') || text.includes('help')) {
    return showMainMenu(user);
  }
  
  if (text.includes('browse') || text.includes('buy') || text.includes('find')) {
    return showBrowseMenu(user);
  }
  
  if (text.includes('sell') || text.includes('list')) {
    return showSellMenu(user);
  }
  
  if (text.includes('account') || text.includes('profile')) {
    return showAccountMenu(user);
  }
  
  // Handle search queries
  if (text.length > 2 && !text.includes('hi') && !text.includes('hello')) {
    return handleSearchQuery(text, user);
  }
  
  // Default greeting
  return showMainMenu(user);
}

function showMainMenu(user: BotUser): BotResponse {
  return {
    type: 'interactive',
    content: 'Welcome to StuFind! What would you like to do?',
    buttons: [
      { id: 'browse_items', title: '🛍️ Browse Items' },
      { id: 'sell_item', title: '💰 Sell Item' },
      { id: 'my_account', title: '👤 My Account' },
      { id: 'help', title: '❓ Help' }
    ]
  };
}

function showBrowseMenu(user: BotUser): BotResponse {
  return {
    type: 'interactive',
    content: 'Browse items by category:',
    buttons: [
      { id: 'category_textbooks', title: '📚 Textbooks' },
      { id: 'category_electronics', title: '💻 Electronics' },
      { id: 'category_clothing', title: '👕 Clothing' },
      { id: 'category_furniture', title: '🪑 Furniture' },
      { id: 'back_to_menu', title: '🔙 Back to Menu' }
    ]
  };
}

function showSellMenu(user: BotUser): BotResponse {
  return {
    type: 'text',
    content: `To sell an item, please visit our website: https://stufind.vercel.app/post-opportunity

Or you can tell me:
• Item name
• Price
• Category
• Description

I'll help you create the listing!`
  };
}

function showAccountMenu(user: BotUser): BotResponse {
  return {
    type: 'text',
    content: `👤 *Your Account*

📱 Phone: ${user.phone}
🏫 University: ${user.university || 'Not set'}
🎓 Student ID: ${user.studentId || 'Not set'}

To update your profile, visit: https://stufind.vercel.app/dashboard

*Recent Activity:*
• Last active: ${user.lastActivity.toLocaleDateString()}
• State: ${user.conversationState}

Type *menu* to go back to main menu.`
  };
}

function showHelpMenu(user: BotUser): BotResponse {
  return {
    type: 'text',
    content: `❓ *StuFind Help*

*How to Browse:*
• Type "browse" or click Browse Items
• Select a category
• View item details and contact seller

*How to Sell:*
• Visit our website to post items
• Or describe your item to me

*Commands:*
• "menu" - Show main menu
• "browse" - Browse items
• "sell" - Sell an item
• "account" - View account info
• "help" - Show this help

*Need more help?*
Contact us at support@stufind.com`
  };
}

async function handleSearchQuery(query: string, user: BotUser): Promise<BotResponse> {
  try {
    // Get opportunities from Firebase
    const { opportunities, error } = await getOpportunities();
    
    if (error || !opportunities) {
      return {
        type: 'text',
        content: 'Sorry, I couldn\'t search right now. Please try again later.'
      };
    }

    // Filter opportunities based on search query
    const filteredItems = opportunities.filter(opp => 
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.description.toLowerCase().includes(query.toLowerCase()) ||
      opp.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    if (filteredItems.length === 0) {
      return {
        type: 'text',
        content: `No items found for "${query}". Try browsing categories or visit our website: https://stufind.vercel.app/marketplace`
      };
    }

    // Create list response
    const sections = [{
      title: `Search Results for "${query}"`,
      rows: filteredItems.map(item => ({
        id: `item_${item.id}`,
        title: `${item.title} - GHS ${item.price}`,
        description: `${item.category} • ${item.university}`
      }))
    }];

    return {
      type: 'interactive',
      content: `Found ${filteredItems.length} items matching "${query}":`,
      list: {
        header: 'Search Results',
        body: `Items matching "${query}"`,
        sections
      }
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      type: 'text',
      content: 'Sorry, search is temporarily unavailable. Please try again later.'
    };
  }
}

async function showCategoryItems(category: string, user: BotUser): Promise<BotResponse> {
  try {
    const { opportunities, error } = await getOpportunities();
    
    if (error || !opportunities) {
      return {
        type: 'text',
        content: 'Sorry, I couldn\'t load items right now. Please try again later.'
      };
    }

    const categoryItems = opportunities.filter(opp => 
      opp.category.toLowerCase() === category.toLowerCase()
    ).slice(0, 10); // Limit to 10 results

    if (categoryItems.length === 0) {
      return {
        type: 'text',
        content: `No ${category} items available right now. Check back later or visit our website: https://stufind.vercel.app/marketplace`
      };
    }

    const sections = [{
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Items`,
      rows: categoryItems.map(item => ({
        id: `item_${item.id}`,
        title: `${item.title} - GHS ${item.price}`,
        description: `${item.university} • ${item.status}`
      }))
    }];

    return {
      type: 'interactive',
      content: `Here are the ${category} items available:`,
      list: {
        header: `${category.charAt(0).toUpperCase() + category.slice(1)} Items`,
        body: `Available ${category} items`,
        sections
      }
    };
  } catch (error) {
    console.error('Category error:', error);
    return {
      type: 'text',
      content: 'Sorry, I couldn\'t load items right now. Please try again later.'
    };
  }
}

async function showItemDetails(itemId: string, user: BotUser): Promise<BotResponse> {
  try {
    const { opportunities, error } = await getOpportunities();
    
    if (error || !opportunities) {
      return {
        type: 'text',
        content: 'Sorry, I couldn\'t load item details right now.'
      };
    }

    const item = opportunities.find(opp => opp.id === itemId);
    
    if (!item) {
      return {
        type: 'text',
        content: 'Item not found. It may have been sold or removed.'
      };
    }

    return {
      type: 'text',
      content: `📦 *${item.title}*

💰 *Price:* GHS ${item.price}
📂 *Category:* ${item.category}
🏫 *University:* ${item.university}
👤 *Seller:* ${item.seller.name}
✅ *Verified:* ${item.seller.verified ? 'Yes' : 'No'}

📝 *Description:*
${item.description}

📱 *Contact Seller:* ${item.seller.phone}

*Status:* ${item.status}

To buy this item, contact the seller directly or visit our website for secure escrow payment.`
    };
  } catch (error) {
    console.error('Item details error:', error);
    return {
      type: 'text',
      content: 'Sorry, I couldn\'t load item details right now.'
    };
  }
}

