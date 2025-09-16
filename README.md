# StuFind - Student Marketplace

A marketplace platform for Ghanaian university students to buy, sell, and find opportunities.

## What It Does

- **Buy & Sell Items**: Textbooks, electronics, clothing, furniture
- **Find Jobs**: Internships and part-time work opportunities  
- **Offer Services**: Tutoring, project help, freelance work
- **Secure Payments**: Mobile Money integration (MTN, Vodafone, AirtelTigo)
- **WhatsApp Bot**: Buy and sell through WhatsApp
- **AI Assistant**: Get help with app features

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Mobile Money APIs
- **AI**: Claude API for assistant
- **Styling**: Tailwind CSS + shadcn/ui

## Getting Started

1. **Clone the repo**
```bash
git clone <your-repo-url>
cd Student-App-Final
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local`:
```
VITE_CLAUDE_API_KEY=your-claude-api-key
```

4. **Run the app**
```bash
npm run dev
```

5. **Open in browser**
Visit: http://localhost:8080

## Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database (test mode)
4. Enable Storage
5. Update config in `src/integrations/firebase/config.ts`

## Key Features

### Authentication
- Email/password signup and login
- University verification system
- Profile management

### Marketplace
- Browse opportunities by category
- Post new items/services
- Search and filter options
- Image uploads

### Payments
- Mobile Money integration
- Secure transaction handling
- Payment status tracking

### WhatsApp Bot
- Real-time analytics dashboard
- Bot management interface
- Message handling

### AI Assistant
- Contextual help system
- App feature explanations
- User guidance

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main app pages
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   ├── firebase/       # Firebase config and client
│   ├── ai/            # Claude API integration
│   └── payment/        # Mobile Money APIs
└── utils/             # Helper functions
```

## Available Routes

- `/` - Home page
- `/marketplace` - Browse opportunities
- `/dashboard` - User dashboard
- `/auth` - Login/Register
- `/post-opportunity` - Create new listing
- `/whatsapp-bot` - Bot dashboard
- `/momo-test` - Payment testing
- `/api-test` - AI API testing
- `/firebase-test` - Database testing

## Mobile Money Integration

Supports Ghana's major providers:
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

## Development

- **Hot reload**: Changes update automatically
- **TypeScript**: Full type safety
- **ESLint**: Code quality checks
- **Tailwind**: Utility-first CSS

## Deployment

The app is ready for deployment on:
- Vercel
- Netlify
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is for educational purposes.

---

**Built for Ghanaian students, by students.** 🇬🇭
