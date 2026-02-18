const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Input validation middleware
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

// Helper function to create model response
function createModelResponse(service, model, prompt, additionalData = {}) {
  const baseResponse = {
    success: true,
    service,
    model,
    response: `${service === 'phu-ai' ? 'Phu AI' : 'Phubers.blog'} with ${model === 'copilot' ? 'Copilot' : 'GPT-5.2'}: ${prompt}`,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  if (service === 'phu-ai') {
    baseResponse.capabilities = ['solve complex puzzles', 'solve math problems', 'physics', 'predictions'];
  } else if (service === 'phubers-blog') {
    baseResponse.action = additionalData.action || 'generate';
  }
  
  return baseResponse;
}

// Copilot endpoint
app.post('/api/copilot', async (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    
    // Copilot integration logic
    const response = {
      success: true,
      model: 'copilot',
      response: `Copilot response for: ${prompt}`,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GPT-5.2 endpoint
app.post('/api/gpt5.2', async (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    
    // GPT-5.2 integration logic
    const response = {
      success: true,
      model: 'gpt5.2',
      response: `GPT-5.2 response for: ${prompt}`,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Phu AI endpoint
app.post('/api/phu-ai', async (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    const model = validateModel(req.body.model);
    
    const response = createModelResponse('phu-ai', model, prompt);
    res.json(response);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Phubers.blog endpoint
app.post('/api/phubers-blog', async (req, res) => {
  try {
    const prompt = validateInput(req.body.prompt);
    const model = validateModel(req.body.model);
    const action = req.body.action || 'generate';
    
    const response = createModelResponse('phubers-blog', model, prompt, { action });
    res.json(response);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    services: ['phu-ai', 'phubers-blog'],
    models: ['copilot', 'gpt5.2'],
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Phu AI server running on port ${port}`);
  console.log(`Services available: phu-ai, phubers-blog`);
  console.log(`Models available: copilot, gpt5.2`);
});
