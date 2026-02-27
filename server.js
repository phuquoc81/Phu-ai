'use strict';

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai').default;

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Supported models including GPT-5.5
const SUPPORTED_MODELS = [
  { id: 'gpt-5.5', name: 'GPT-5.5', description: 'Latest GPT-5.5 model with advanced reasoning' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Fast and capable GPT-4o model' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High-capability GPT-4 Turbo model' },
];

// Copilot extension system prompt for code assistance mode
const COPILOT_SYSTEM_PROMPT = `You are Phu AI Copilot, an advanced AI coding assistant.
You help with code completion, debugging, code review, and explaining complex code.
You can analyze code in any programming language, suggest improvements, find bugs, and generate new code.
Always provide clear, well-commented code examples when relevant.`;

// General assistant system prompt
const GENERAL_SYSTEM_PROMPT = `You are Phu AI, an incredibly powerful assistant with abilities to solve complex puzzles, 
solve problems of any kind, solve math and physics problems, predict future trends based on vast knowledge, 
diagnose issues across various domains, and provide deep wisdom. You are knowledgeable about all land animals 
and ocean species. Provide thorough, insightful responses.`;

// GET /api/models - list available models
app.get('/api/models', (req, res) => {
  res.json({ models: SUPPORTED_MODELS });
});

// POST /api/chat - main chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, model, mode, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const selectedModel = model || 'gpt-5.5';
  const isCopilotMode = mode === 'copilot';
  const systemPrompt = isCopilotMode ? COPILOT_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;

  // Build message history
  const messages = [{ role: 'system', content: systemPrompt }];
  if (Array.isArray(history)) {
    for (const entry of history) {
      if (entry.role && entry.content) {
        messages.push({ role: entry.role, content: entry.content });
      }
    }
  }
  messages.push({ role: 'user', content: message.trim() });

  // If no API key, return a demo response indicating the model and mode
  if (!process.env.OPENAI_API_KEY) {
    const demoReply = isCopilotMode
      ? `[Phu AI Copilot – ${selectedModel}] This is a demo response. To enable live AI responses, set the OPENAI_API_KEY environment variable.\n\nYour message: "${message}"`
      : `[Phu AI – ${selectedModel}] This is a demo response. To enable live AI responses, set the OPENAI_API_KEY environment variable.\n\nYour message: "${message}"`;
    return res.json({ reply: demoReply, model: selectedModel, mode: isCopilotMode ? 'copilot' : 'general' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';
    res.json({ reply, model: selectedModel, mode: isCopilotMode ? 'copilot' : 'general' });
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    res.status(502).json({ error: 'Failed to get a response from the AI model.', details: err.message });
  }
});

// Serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phu AI server running on port ${PORT}`);
});

module.exports = app;
