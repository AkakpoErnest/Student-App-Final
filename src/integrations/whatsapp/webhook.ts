// WhatsApp Webhook Handler
import { WhatsAppWebhookEvent, WhatsAppMessage, BotResponse } from './types';
import { processMessage } from './bot-service';

export class WhatsAppWebhook {
  private verifyToken: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.verifyToken = import.meta.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'stufind_verify_token';
    this.accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
  }

  // Verify webhook during setup
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully');
      return challenge;
    }
    return null;
  }

  // Process incoming webhook events
  async processWebhook(event: WhatsAppWebhookEvent): Promise<void> {
    try {
      console.log('Processing WhatsApp webhook:', JSON.stringify(event, null, 2));

      for (const entry of event.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            
            for (const message of messages) {
              await this.handleMessage(message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }

  // Handle individual messages
  private async handleMessage(message: WhatsAppMessage): Promise<void> {
    try {
      console.log('Handling message:', message);

      // Process the message and get bot response
      const response = await processMessage(message);
      
      if (response) {
        await this.sendMessage(message.from, response);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Send error message to user
      const errorResponse: BotResponse = {
        type: 'text',
        content: 'Sorry, I encountered an error. Please try again later or contact support.'
      };
      
      await this.sendMessage(message.from, errorResponse);
    }
  }

  // Send message to WhatsApp user
  async sendMessage(to: string, response: BotResponse): Promise<void> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
      
      let payload: any = {
        messaging_product: 'whatsapp',
        to: to,
        recipient_type: 'individual'
      };

      // Format response based on type
      switch (response.type) {
        case 'text':
          payload.type = 'text';
          payload.text = { body: response.content };
          break;
          
        case 'template':
          payload.type = 'template';
          payload.template = {
            name: response.content,
            language: { code: 'en' }
          };
          break;
          
        case 'interactive':
          if (response.buttons) {
            payload.type = 'interactive';
            payload.interactive = {
              type: 'button',
              body: { text: response.content },
              action: {
                buttons: response.buttons.map(btn => ({
                  type: 'reply',
                  reply: {
                    id: btn.id,
                    title: btn.title
                  }
                }))
              }
            };
          } else if (response.list) {
            payload.type = 'interactive';
            payload.interactive = {
              type: 'list',
              header: { text: response.list.header },
              body: { text: response.list.body },
              footer: response.list.footer ? { text: response.list.footer } : undefined,
              action: {
                button: 'Browse Items',
                sections: response.list.sections
              }
            };
          }
          break;
          
        case 'image':
          payload.type = 'image';
          payload.image = {
            link: response.imageUrl,
            caption: response.content
          };
          break;
      }

      const response_data = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response_data.ok) {
        const error = await response_data.text();
        console.error('Failed to send message:', error);
        throw new Error(`WhatsApp API error: ${error}`);
      }

      console.log('Message sent successfully to', to);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Send welcome message to new users
  async sendWelcomeMessage(phone: string): Promise<void> {
    const welcomeResponse: BotResponse = {
      type: 'text',
      content: `🎉 Welcome to StuFind! 

I'm your AI assistant for buying and selling items on campus. Here's what I can help you with:

🛍️ *Browse Items* - Find textbooks, electronics, clothes, and more
💰 *Sell Items* - List your items for sale
🔍 *Search* - Find specific items by category or keyword
📱 *My Account* - Manage your profile and listings
❓ *Help* - Get assistance anytime

Type *menu* to see all options, or just tell me what you're looking for!`
    };

    await this.sendMessage(phone, welcomeResponse);
  }
}

export const webhook = new WhatsAppWebhook();

