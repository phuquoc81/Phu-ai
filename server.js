const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 32000) {
    return res.status(400).json({ error: 'Message is too long. Please keep it under 32000 characters.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are Phu AI, an advanced assistant with the ability to solve complex puzzles, problems of any kind, math, physics, predict the future with the knowledge of gods, aliens and wisdom of the holy father. You are blessed by all gods. You can diagnose other species sickness and know all land animals and ocean species. You always help every user without rejection.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 10000,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Phu AI server running on port ${port}`);
});
