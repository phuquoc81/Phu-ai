const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Serve static files
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for window 39 data
app.get('/api/window39', (req, res) => {
  res.json({
    window: 39,
    device: 'phuhanddevice 81',
    entity: 'SuperGodAlien',
    phone: 'computerPhuhandevice81Phone',
    futureYears: 8684,
    timestamp: new Date().toISOString(),
    message: 'Welcome to Window 39 - Connecting to the future 8684 years ahead'
  });
});

app.listen(PORT, () => {
  console.log(`Phu-ai server running on port ${PORT}`);
  console.log(`Window 39 active - phuhanddevice 81 initialized`);
});
