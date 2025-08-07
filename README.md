# StuFind - Financial Freedom Hub for Students

StuFind is a modern web app that empowers students to find financial opportunities, connect with peers, and earn blockchain-based rewards. Built with React, Vite, Supabase, and Base blockchain integration.

## 🚀 Features
- **Student Authentication & Profiles**: Secure login with university verification and profile picture upload
- **Opportunity Marketplace**: Post and browse jobs, internships, and side-hustle opportunities
- **Blockchain Integration**: Base blockchain-powered escrow and secure payments
- **Token Rewards System**: Earn tokens for daily activity and email verification
- **Student Network**: Connect with peers from your university and beyond
- **Mobile-First Design**: Responsive UI optimized for all devices

## 🎓 Use Cases

**StuFind helps students:**

- **Find Financial Opportunities:**
  - Browse and apply for jobs, internships, and side hustles posted by other students or organizations
  - Post your own opportunities to earn or collaborate with others
  - Filter opportunities by location, type, and requirements

- **Earn Blockchain Rewards:**
  - Claim daily login bonuses and email verification rewards as tokens on the Base blockchain
  - Use tokens for platform perks or future integrations
  - Build your digital asset portfolio while using the platform

- **Secure Transactions:**
  - Use blockchain escrow for safe payments between students and opportunity posters
  - Transparent and immutable transaction records
  - No middleman fees or delays

- **Build Your Network:**
  - Connect with students from your university and beyond
  - Showcase your skills and experience with a verified profile
  - Build professional relationships early in your career

- **Student Essentials Marketplace:**
  - Buy and sell student essentials (books, electronics, etc.) in a trusted, student-only environment
  - Save money on textbooks and supplies
  - Earn money by selling items you no longer need

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Blockchain**: Base (Ethereum L2) for escrow and token rewards
- **Deployment**: Vercel
- **Development**: ESLint, Prettier, Husky

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun
- Supabase account
- Base blockchain wallet (MetaMask recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd STUDENT-WEB-APP-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BASE_CHAIN_ID=8453
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in the `supabase/` directory to set up your database schema
   - Configure authentication providers as needed
   - Set up storage buckets for profile pictures

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

Run the following SQL scripts in your Supabase SQL editor:

1. `supabase/check-tables.sql` - Creates the main database tables
2. `supabase/fix-tokens.sql` - Sets up the token rewards system

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add your environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com) for backend services
- Powered by [Base](https://base.org) blockchain
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check our documentation
- Join our community discussions

---

**Made with ❤️ for students everywhere**

*Last updated: December 2024*
