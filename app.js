const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for AI processing
app.post('/api/solve', (req, res) => {
  const { problem, type } = req.body;
  
  // Input validation
  if (!problem || typeof problem !== 'string' || problem.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Problem is required and must be a non-empty string'
    });
  }
  
  const validTypes = ['math', 'physics', 'puzzle', 'prediction', 'diagnosis', 'general'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid problem type'
    });
  }
  
  // Placeholder AI response
  const response = {
    success: true,
    problem: problem,
    type: type || 'general',
    solution: generateSolution(problem, type || 'general'),
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Generate solution based on problem type
// NOTE: This is a placeholder implementation for demonstration purposes.
// In production, this should be replaced with actual AI/problem-solving logic.
function generateSolution(problem, type) {
  const solutions = {
    math: `Mathematical solution for: ${problem}`,
    physics: `Physics analysis for: ${problem}`,
    puzzle: `Puzzle solution for: ${problem}`,
    prediction: `Future prediction for: ${problem}`,
    diagnosis: `Diagnosis for: ${problem}`,
    general: `General solution for: ${problem}`
  };
  
  return solutions[type] || solutions.general;
}

// Start server
app.listen(PORT, () => {
  console.log(`Phu-ai server is running on port ${PORT}`);
});
