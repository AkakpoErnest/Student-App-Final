#!/bin/bash

# WhatsApp Bot Deployment Script
echo "🚀 Deploying StuFind WhatsApp Bot..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "📋 Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        echo "✅ Deployed! Your webhook URL: https://your-app.vercel.app/api/whatsapp/webhook"
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod
        echo "✅ Deployed! Your webhook URL: https://your-app.netlify.app/.netlify/functions/whatsapp-webhook"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📝 Next steps:"
echo "1. Copy your webhook URL above"
echo "2. Go to https://business.facebook.com/wa/manage"
echo "3. Navigate to Configuration → Webhook"
echo "4. Set Callback URL to your webhook URL"
echo "5. Set Verify Token to: stufind_webhook_2024"
echo "6. Click 'Verify and Save'"
echo ""
echo "🎉 Your WhatsApp bot is ready!"
