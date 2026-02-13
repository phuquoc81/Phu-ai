const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
  
  // Placeholder AI response
  const response = {
    success: true,
    problem: problem,
    type: type,
    solution: generateSolution(problem, type),
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Generate solution based on problem type
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
