const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for user data (in production, use a database)
const users = new Map();

// Initialize or get user data
function getUserData(userId) {
  if (!users.has(userId)) {
    users.set(userId, {
      balance: 0,
      miningPower: 1,
      totalMined: 0,
      upgradeCost: 10
    });
  }
  return users.get(userId);
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/mine', (req, res) => {
  const { userId } = req.body;
  const userData = getUserData(userId);
  
  // Mining reward: $0.000001 per action * mining power
  const reward = 0.000001 * userData.miningPower;
  userData.balance += reward;
  userData.totalMined += reward;
  
  res.json({
    success: true,
    reward: reward,
    balance: userData.balance,
    miningPower: userData.miningPower,
    totalMined: userData.totalMined
  });
});

app.post('/api/upgrade', (req, res) => {
  const { userId } = req.body;
  const userData = getUserData(userId);
  
  if (userData.balance >= userData.upgradeCost) {
    userData.balance -= userData.upgradeCost;
    userData.miningPower += 1;
    userData.upgradeCost = Math.floor(userData.upgradeCost * 1.5);
    
    res.json({
      success: true,
      miningPower: userData.miningPower,
      balance: userData.balance,
      upgradeCost: userData.upgradeCost
    });
  } else {
    res.json({
      success: false,
      message: 'Insufficient balance',
      balance: userData.balance,
      upgradeCost: userData.upgradeCost
    });
  }
});

app.get('/api/user/:userId', (req, res) => {
  const userData = getUserData(req.params.userId);
  res.json(userData);
});

app.listen(PORT, () => {
  console.log(`Mining webapp running on port ${PORT}`);
});
