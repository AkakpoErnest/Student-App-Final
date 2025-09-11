# 🤖 WhatsApp Bot Setup Guide for StuFind

## Overview
This guide will help you set up a WhatsApp Business bot that allows users to buy and sell items through WhatsApp messages.

## Prerequisites
- WhatsApp Business Account
- Facebook Business Account
- Vercel/Netlify account (for webhook deployment)
- StuFind app deployed

## Step 1: WhatsApp Business API Setup

### 1.1 Create Facebook Business Account
1. Go to [Facebook Business](https://business.facebook.com/)
2. Create a business account or use existing one
3. Complete business verification if required

### 1.2 Set Up WhatsApp Business Platform
1. Go to [WhatsApp Business Platform](https://business.facebook.com/wa/manage)
2. Click **"Get Started"**
3. Choose **"Cloud API"** (recommended for beginners)
4. Follow the setup wizard

### 1.3 Get Your Credentials
In your WhatsApp Business Platform dashboard, note down:
- **Phone Number ID**: Found in "Configuration" → "Phone numbers"
- **Access Token**: Found in "Configuration" → "API setup"
- **App Secret**: Found in "App settings" → "Basic"
- **Webhook Verify Token**: Create a random string (e.g., "stufind_webhook_2024")

## Step 2: Environment Variables

Create a `.env` file in your project root:

```env
# WhatsApp Business API
VITE_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN=stufind_webhook_2024
VITE_WHATSAPP_APP_SECRET=your_app_secret_here

# Firebase (existing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 3: Deploy Webhook

### 3.1 For Vercel Deployment
1. Create `api/whatsapp/webhook.ts` in your project root:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { webhook } from '../../src/integrations/whatsapp/webhook';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
    
    if (mode && token && challenge) {
      const result = webhook.verifyWebhook(mode as string, token as string, challenge as string);
      if (result) {
        return res.status(200).send(result);
      }
    }
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  if (req.method === 'POST') {
    try {
      await webhook.processWebhook(req.body);
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. Note your webhook URL: `https://your-app.vercel.app/api/whatsapp/webhook`

### 3.2 For Netlify Deployment
1. Create `netlify/functions/whatsapp-webhook.ts`:
```typescript
import { Handler } from '@netlify/functions';
import { webhook } from '../../src/integrations/whatsapp/webhook';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = event.queryStringParameters || {};
    
    if (mode && token && challenge) {
      const result = webhook.verifyWebhook(mode, token, challenge);
      if (result) {
        return {
          statusCode: 200,
          body: result
        };
      }
    }
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden' })
    };
  }
  
  if (event.httpMethod === 'POST') {
    try {
      await webhook.processWebhook(JSON.parse(event.body || '{}'));
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success' })
      };
    } catch (error) {
      console.error('Webhook error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

3. Note your webhook URL: `https://your-app.netlify.app/.netlify/functions/whatsapp-webhook`

## Step 4: Configure Webhook in WhatsApp

1. Go to your WhatsApp Business Platform dashboard
2. Navigate to **"Configuration"** → **"Webhook"**
3. Set **Callback URL**: Your deployed webhook URL
4. Set **Verify Token**: The same token from your `.env` file
5. Click **"Verify and Save"**

## Step 5: Test Your Bot

### 5.1 Send Test Message
1. Send a WhatsApp message to your business number
2. You should receive an automated response
3. Check your webhook logs for incoming messages

### 5.2 Test Bot Commands
Try these commands:
- `menu` - Show main menu
- `browse` - Browse items
- `help` - Get help
- `textbooks` - Search for textbooks

## Step 6: Monitor Bot Performance

1. Visit `/whatsapp-bot` in your StuFind app
2. Monitor:
   - Total users
   - Active conversations
   - Transactions
   - Recent activity

## Bot Features

### 🤖 **Core Features**
- **Browse Items**: Users can browse items by category
- **Search**: Text-based search for specific items
- **Item Details**: View detailed item information
- **Contact Seller**: Get seller contact information
- **Account Management**: View user profile and settings

### 📱 **User Experience**
- **Interactive Menus**: Button and list-based navigation
- **Smart Responses**: Context-aware responses
- **Error Handling**: Graceful error messages
- **Welcome Flow**: New user onboarding

### 🔧 **Technical Features**
- **Webhook Processing**: Real-time message handling
- **Firebase Integration**: Access to your existing data
- **Scalable Architecture**: Handles multiple users
- **Error Recovery**: Robust error handling

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Messages**
   - Check webhook URL is correct
   - Verify webhook token matches
   - Check server logs for errors

2. **Bot Not Responding**
   - Verify access token is valid
   - Check phone number ID is correct
   - Ensure webhook is deployed and running

3. **Messages Not Sending**
   - Check WhatsApp Business API limits
   - Verify phone number is approved
   - Check access token permissions

### Debug Steps

1. **Check Webhook Logs**
   ```bash
   # For Vercel
   vercel logs
   
   # For Netlify
   netlify functions:log
   ```

2. **Test Webhook Manually**
   ```bash
   curl -X POST https://your-webhook-url.com/api/whatsapp/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "message"}'
   ```

3. **Verify Environment Variables**
   - Check all required variables are set
   - Verify values are correct
   - Ensure no extra spaces or quotes

## Next Steps

1. **Customize Bot Responses**: Modify bot responses in `bot-service.ts`
2. **Add More Features**: Implement payment processing, notifications
3. **Analytics**: Add detailed analytics and reporting
4. **Multi-language**: Support multiple languages
5. **AI Integration**: Add more intelligent responses

## Support

If you need help:
1. Check the troubleshooting section
2. Review WhatsApp Business API documentation
3. Check your webhook logs
4. Contact support at support@stufind.com

---

**🎉 Congratulations!** Your WhatsApp bot is now ready to help students buy and sell items through WhatsApp!

