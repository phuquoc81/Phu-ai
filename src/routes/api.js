const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Phu AI is running',
    timestamp: new Date().toISOString()
  });
});

// Placeholder for AI problem solving endpoint
router.post('/solve', (req, res) => {
  const { problem } = req.body;
  
  if (!problem) {
    return res.status(400).json({ 
      error: 'Problem description is required' 
    });
  }

  // Placeholder response - would integrate with actual AI service
  res.json({
    problem: problem,
    solution: 'This is a placeholder response. Integration with AI services pending.',
    status: 'success'
  });
});

module.exports = router;
