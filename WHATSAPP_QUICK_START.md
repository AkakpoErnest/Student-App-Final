# 🚀 WhatsApp Bot Quick Start Guide

## 📋 **Step-by-Step Setup**

### **1. Get WhatsApp Business API Access**
- **URL**: https://business.facebook.com/wa/manage
- **Steps**:
  1. Create Facebook Business Account
  2. Choose "Cloud API" option
  3. Complete verification process
  4. Get your credentials (see below)

### **2. Get Your Credentials**
From WhatsApp Business Platform dashboard:

| Credential | Where to Find | Example |
|------------|---------------|---------|
| **Phone Number ID** | Configuration → Phone numbers | `123456789012345` |
| **Access Token** | Configuration → API setup | `EAABwzLixnjYBO...` |
| **App Secret** | App settings → Basic | `abc123def456...` |
| **Webhook Verify Token** | Create your own | `stufind_webhook_2024` |

### **3. Deploy Your Webhook**

#### **Option A: Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy your app
vercel --prod

# 3. Your webhook URL will be:
# https://your-app-name.vercel.app/api/whatsapp/webhook
```

#### **Option B: Netlify**
```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Deploy your app
netlify deploy --prod

# 3. Your webhook URL will be:
# https://your-app-name.netlify.app/.netlify/functions/whatsapp-webhook
```

### **4. Configure Environment Variables**
Add to your `.env.local` file:
```env
# WhatsApp Business API
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN=stufind_webhook_2024
VITE_WHATSAPP_APP_SECRET=your_app_secret_here
```

### **5. Set Up Webhook in WhatsApp**
1. Go to: https://business.facebook.com/wa/manage
2. Navigate to **Configuration** → **Webhook**
3. Set **Callback URL**: `https://your-app.vercel.app/api/whatsapp/webhook`
4. Set **Verify Token**: `stufind_webhook_2024`
5. Click **"Verify and Save"**

### **6. Test Your Bot**
1. Send a WhatsApp message to your business number
2. Try these commands:
   - `menu` - Show main menu
   - `browse` - Browse items
   - `textbooks` - Search for textbooks
   - `help` - Get help

## 🔗 **Important URLs**

| Purpose | URL |
|---------|-----|
| **WhatsApp Business Platform** | https://business.facebook.com/wa/manage |
| **Facebook Business** | https://business.facebook.com/ |
| **WhatsApp API Docs** | https://developers.facebook.com/docs/whatsapp |
| **Webhook Testing Tool** | https://webhook.site/ |

## 📱 **Bot Features Ready**

✅ **Browse Items** - Users can browse by category  
✅ **Search Items** - Text-based search  
✅ **Item Details** - Full item information  
✅ **Contact Seller** - Direct contact info  
✅ **Account Management** - User profiles  
✅ **Interactive Menus** - Button navigation  
✅ **Real-time Data** - Connected to your Firebase  

## 🛠️ **Current Status**

- ✅ Bot logic implemented
- ✅ Webhook handler ready
- ✅ Firebase integration complete
- ✅ Interactive UI ready
- ⏳ **Next**: Deploy webhook endpoint
- ⏳ **Next**: Get WhatsApp Business API access
- ⏳ **Next**: Configure webhook in WhatsApp

## 🚨 **Quick Troubleshooting**

| Problem | Solution |
|---------|----------|
| Webhook not receiving messages | Check URL and verify token |
| Bot not responding | Verify access token and phone number ID |
| Messages not sending | Check API limits and permissions |
| Environment variables not loading | Restart development server |

## 📞 **Need Help?**

1. Check the full guide: `WHATSAPP_BOT_SETUP.md`
2. Test webhook: Use webhook.site to test your endpoint
3. Check logs: `vercel logs` or `netlify functions:log`
4. Verify credentials: Double-check all IDs and tokens

---

**🎯 Your bot is 90% ready! Just need to deploy the webhook and get WhatsApp API access.**
