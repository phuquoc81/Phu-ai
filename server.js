'use strict';

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static('public'));

// Input validation
function validateInput(prompt, maxLength = 5000) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }
  if (prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
  if (prompt.length > maxLength) {
    throw new Error(`Prompt exceeds maximum length of ${maxLength} characters`);
  }
  return prompt.trim();
}

// Validate model selection
function validateModel(model) {
  const validModels = ['copilot', 'gpt5.2'];
  if (!model || !validModels.includes(model)) {
    throw new Error(`Invalid model. Must be one of: ${validModels.join(', ')}`);
  }
  return model;
}

// Phu AI endpoint
app.post('/api/phu-ai', (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    const model = validateModel(req.body.model);

    res.json({
      success: true,
      service: 'phu-ai',
      model,
      response: `Phu AI with ${model === 'copilot' ? 'Copilot' : 'GPT-5.2'}: ${prompt}`,
      capabilities: ['solve complex puzzles', 'solve math problems', 'physics', 'predictions'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Phubers.blog endpoint
app.post('/api/phubers-blog', (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    const model = validateModel(req.body.model);
    const action = req.body.action || 'generate';

    res.json({
      success: true,
      service: 'phubers-blog',
      model,
      action,
      response: `Phubers.blog with ${model === 'copilot' ? 'Copilot' : 'GPT-5.2'}: ${prompt}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    services: ['phu-ai', 'phubers-blog'],
    models: ['copilot', 'gpt5.2'],
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Phu AI server running on port ${port}`);
});

module.exports = app;
