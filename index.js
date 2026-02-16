const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Phu AI - The webapp that blows your mind!',
    description: 'Abilities to solve complex puzzles and solve problems of any kind',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start the server
app.listen(port, () => {
  console.log(`Phu AI server is running on port ${port}`);
});

module.exports = app;
