# Phu AI - Video Mining Webapp

## 🎬 Overview
Phu AI is an interactive mining webapp that allows users to earn rewards through video mining! Users start with a basic mining power and can upgrade their capabilities to earn more rewards per mining action.

## ✨ Features

- **Mining System**: Earn $0.000001 per mining action
- **Upgrade System**: Purchase upgrades to increase mining power (costs scale as you upgrade)
- **Real-time Balance Tracking**: Track your earnings and total mined amount
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Social Media Integration**: Share buttons for:
  - 📘 Facebook
  - 🐦 Twitter/Thread
  - 📺 YouTube
  - 🎮 Twitch
- **Modern UI**: Beautiful gradient design with animations
- **Persistent Storage**: User data saved using localStorage
- **Browser Compatible**: Works on Chrome, Firefox, Edge, Safari

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/phuquoc81/Phu-ai.git
cd Phu-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Deployment

### Azure Web Apps (Recommended)

This project is configured for automatic deployment to Azure Web Apps via GitHub Actions.

1. Create an Azure Web App (Node.js runtime)
2. Download the publish profile from Azure Portal
3. Add the publish profile as a GitHub secret named `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Push to the `main` branch to trigger automatic deployment

The deployment workflow is configured in `.github/workflows/azure-webapps-node.yml`

### Other Platforms

The app can be deployed to any platform that supports Node.js:

- **Heroku**: Add a `Procfile` with `web: node server.js`
- **Vercel**: Works out of the box
- **Google Cloud Run**: Containerize with the provided Node.js setup
- **AWS Elastic Beanstalk**: Deploy directly from the repository

## 🎮 How to Use

1. **Mine**: Click the "MINE NOW" button to earn rewards
2. **Upgrade**: When you have enough balance, click "UPGRADE POWER" to increase your mining rate
3. **Share**: Use the social media buttons to share with friends
4. **Track Progress**: Monitor your balance, mining power, and total mined amount in real-time

### Keyboard Shortcuts (Debug/Demo Mode)
- Press `A` to toggle auto-mining (mines once per second)

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: In-memory (can be upgraded to a database)
- **Deployment**: Azure Web Apps, GitHub Actions

## 📊 Game Mechanics

- **Base Mining Reward**: $0.000001 per click
- **Mining Power**: Multiplies the base reward
- **Upgrade Cost**: Starts at $10.00 and increases by 50% with each upgrade
- **Formula**: Reward = $0.000001 × Mining Power

Example progression:
- Mining Power 1x: $0.000001 per click
- Mining Power 2x: $0.000002 per click
- Mining Power 10x: $0.000010 per click

## 🔒 Security Notes

- User data is stored in-memory (not persistent across server restarts)
- For production, consider implementing:
  - Database for persistent storage
  - User authentication
  - Rate limiting to prevent abuse
  - HTTPS/SSL encryption

## 🌐 Social Media & Marketing

The webapp includes built-in social sharing functionality for:

- **Facebook**: Direct share link
- **Twitter/Thread**: Tweet with custom message
- **YouTube**: Link to platform
- **Twitch**: Link to platform
- **Google Ads**: Ready for ad integration
- **Firefox/Chrome**: Browser-optimized experience

## 📝 API Endpoints

### POST /api/mine
Mine and earn rewards.

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "reward": 0.000001,
  "balance": 0.000001,
  "miningPower": 1,
  "totalMined": 0.000001
}
```

### POST /api/upgrade
Purchase mining power upgrade.

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "miningPower": 2,
  "balance": 0.000000,
  "upgradeCost": 15
}
```

### GET /api/user/:userId
Get user data.

**Response:**
```json
{
  "balance": 0.000001,
  "miningPower": 1,
  "totalMined": 0.000001,
  "upgradeCost": 10
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔮 Future Enhancements

- Database integration for persistent storage
- User authentication and profiles
- Leaderboards
- Daily rewards and bonuses
- Achievement system
- Referral program
- Multiple mining types (short videos, long videos)
- Real cryptocurrency integration (optional)

---

**Powered by Phu AI** - Advanced mining algorithms for the modern web!
