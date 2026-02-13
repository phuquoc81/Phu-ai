# ⚔️ Legendary Swords Merge & BTC Mining Web App

A comprehensive web application featuring:
- **Legendary Swords Merge Game**: Collect and merge swords to create powerful weapons
- **Bitcoin Mining Game**: Click-to-mine BTC with an engaging interface
- **Microtasks & Passive Income**: Complete tasks to earn real money
- **Affiliate Marketing**: Earn commissions by referring friends
- **Payment Integration**: Withdraw via Stripe and TD Bank

## Features

### 🎮 Legendary Swords Merge Game
- Start with a rusty blade and merge your way to legendary weapons
- Swords have different rarities: Common, Uncommon, Rare, Epic, and Legendary
- Drag and drop swords of the same level to merge them
- Each merge increases power and rarity
- Purchase new swords with your BTC earnings

### ⛏️ Bitcoin Mining Game
- Click the mine button to earn BTC
- Each click earns 0.00001 BTC (simulated)
- Track your total clicks and mining earnings
- Real-time balance updates
- Engaging visual feedback and animations

### 📋 Microtasks System
- Complete simple tasks to earn USD
- Task types include:
  - Watch advertisements (earn $0.05)
  - Complete surveys (earn $0.15)
  - Social media sharing (earn $0.10)
  - Daily check-ins (earn $0.25)
  - Friend invitations (earn $1.00)

### 🤝 Affiliate Marketing
- Get your unique referral code
- Earn $1.00 for each friend who signs up
- Your friends get $0.50 signup bonus
- Track referrals and earnings in real-time
- Share your code on social media

### 💰 Payment & Withdrawals
- Minimum withdrawal: $10
- Payment methods:
  - Stripe (Credit/Debit Card)
  - TD Bank Transfer
- Track withdrawal history and status
- Processing time: 24-48 hours

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/phuquoc81/Phu-ai.git
   cd Phu-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   SESSION_SECRET=your_session_secret_here
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Getting Started
1. **Register an account**: Click the "Register" tab and create your account
2. **Optional**: Enter an affiliate code during registration to get a $0.50 bonus
3. **Start mining**: Go to the Mining tab and click the mine button to earn BTC
4. **Buy swords**: Use your BTC to purchase swords in the Swords tab
5. **Merge swords**: Drag and drop swords of the same level to merge them
6. **Complete tasks**: Visit the Tasks tab to complete microtasks for USD earnings
7. **Refer friends**: Share your referral code from the Affiliate tab
8. **Withdraw earnings**: Request withdrawals from the Withdraw tab (minimum $10)

### Tips for Maximum Earnings
- **Mine regularly**: Each click earns BTC instantly
- **Complete daily tasks**: Daily check-ins provide steady passive income
- **Merge strategically**: Higher-level swords are more valuable
- **Share your referral code**: Affiliate earnings add up quickly
- **Complete all tasks**: Every task completed increases your balance

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **SQLite3**: Lightweight database
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **Stripe**: Payment processing API

### Frontend
- **HTML5**: Structure and semantics
- **CSS3**: Styling with gradients and animations
- **Vanilla JavaScript**: Interactive functionality
- **Drag & Drop API**: Sword merging interface

### Database Schema
- **users**: User accounts and balances
- **mining_stats**: Mining activity tracking
- **swords**: User sword inventory
- **tasks**: Available microtasks
- **completed_tasks**: Task completion records
- **affiliate_earnings**: Referral earnings tracking
- **withdrawals**: Payment requests

## API Endpoints

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile
- `GET /api/balance` - Get user balance

### Mining
- `POST /api/mine` - Record mining click
- `GET /api/mining-stats` - Get mining statistics

### Swords
- `GET /api/swords` - Get user swords
- `POST /api/swords/merge` - Merge two swords
- `POST /api/swords/buy` - Purchase new sword

### Tasks
- `GET /api/tasks` - Get available tasks
- `POST /api/tasks/:taskId/complete` - Complete a task

### Affiliate
- `GET /api/affiliate/code` - Get referral code
- `POST /api/affiliate/apply` - Apply affiliate code
- `GET /api/affiliate/stats` - Get affiliate statistics

### Payments
- `POST /api/withdraw` - Request withdrawal
- `GET /api/withdrawals` - Get withdrawal history
- `POST /api/stripe/create-checkout` - Create Stripe checkout

## Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Session Management**: Secure session handling with express-session
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **Authentication Middleware**: Protected routes require authentication
- **Input Validation**: Server-side validation for all user inputs

## Payment Integration

### Stripe Setup
1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Add your secret key to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

### TD Bank Integration
TD Bank integration is structured but requires bank API credentials:
1. Contact TD Bank for API access
2. Configure bank API credentials
3. Implement bank transfer logic in production

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a production database (PostgreSQL recommended)
3. Configure HTTPS/SSL certificates
4. Set secure session cookies
5. Add rate limiting and DDoS protection
6. Implement proper error logging
7. Set up monitoring and alerts

### Recommended Services
- **Hosting**: Heroku, AWS, DigitalOcean, Azure
- **Database**: PostgreSQL, MySQL
- **Payment**: Stripe, PayPal
- **Monitoring**: New Relic, DataDog

## Legal & Compliance

**Important Notice**: This application simulates Bitcoin mining and handles financial transactions. Before deploying to production:

1. **Cryptocurrency Compliance**: Research regulations in your jurisdiction
2. **Financial Licensing**: Obtain necessary licenses for money transmission
3. **Terms of Service**: Create comprehensive ToS
4. **Privacy Policy**: Implement GDPR/CCPA compliance
5. **AML/KYC**: Add identity verification for withdrawals
6. **Tax Reporting**: Implement required tax reporting features

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For questions or issues:
- Open an issue on GitHub
- Email: support@phu-ai.com

## Disclaimer

This application is for educational and entertainment purposes. The BTC mining is simulated and does not involve actual cryptocurrency mining. All financial transactions should be implemented with proper security, compliance, and legal considerations before production use.

---

Made with ⚔️ and ₿ by Phu-ai Team
