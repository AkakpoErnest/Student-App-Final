# 🤖 Claude AI API Setup Guide

## Quick Setup

### Option 1: Environment Variable (Recommended)

1. **Get your API key** from [Anthropic Console](https://console.anthropic.com/settings/keys)
2. **Create a `.env` file** in your project root:
   ```env
   VITE_CLAUDE_API_KEY=your_actual_api_key_here
   ```
3. **Restart the development server**:
   ```bash
   npm run dev
   ```

### Option 2: Direct Update (Quick Test)

If you want to test immediately, the app already has a working API key built-in.

## How to Get Your API Key

1. **Visit**: https://console.anthropic.com/settings/keys
2. **Sign in** to your Anthropic account
3. **Create a new API key** or copy an existing one
4. **Add it to your `.env` file** as shown above

## Testing the AI Assistant

1. **Visit**: http://localhost:8080/
2. **Click**: "Ask AI Assistant" button
3. **Try these questions**:
   - "How do I sell an item?"
   - "What is university verification?"
   - "How do I use the WhatsApp bot?"

## Troubleshooting

### If AI Assistant Shows Errors:

1. **Check browser console** for error messages
2. **Verify API key** is correctly set in `.env`
3. **Restart the server** after adding the API key
4. **Check API key format** - should start with `sk-ant-`

### Common Issues:

- **"Invalid API key"**: Check the key format and ensure it's correct
- **"API key not found"**: Add `VITE_CLAUDE_API_KEY` to your `.env` file
- **"Rate limit exceeded"**: Wait a moment and try again

## Cost Information

- **Claude 3 Haiku**: Very cost-effective model
- **Typical cost**: ~$0.001 per message
- **Free tier**: Available for testing

## Security Note

- **Never commit** your `.env` file to version control
- **Keep your API key** private and secure
- **Use environment variables** for production deployment

---

**🎉 That's it!** Your AI assistant should now be working perfectly with your own API key.

