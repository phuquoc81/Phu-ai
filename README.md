# Phu-ai

Phu ai is the webapp that blow your mind all with abilities to solve complex puzzles and solve problems of any kind and solve math, physics and predict the future with the knowledge of gods aliens and wisdom of the holy father and blessed by all gods can diagnose other species sickness and abilities to know all land animals and ocean species.

## Features

### 🤖 Phu AI
Powered by **Copilot** and **GPT-5.2**, Phu AI can:
- Solve complex puzzles and problems
- Perform advanced math and physics calculations
- Predict future outcomes
- Diagnose species sickness
- Provide knowledge about land animals and ocean species

### 📝 Phubers.blog
AI-powered blog content generation using:
- **Copilot** for code-aware content
- **GPT-5.2** for advanced natural language generation

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

## Running

```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Phu AI
- `POST /api/phu-ai` - Submit queries to Phu AI with Copilot or GPT-5.2

### Phubers.blog
- `POST /api/phubers-blog` - Generate blog content with Copilot or GPT-5.2

### Direct Model Access
- `POST /api/copilot` - Direct access to Copilot model
- `POST /api/gpt5.2` - Direct access to GPT-5.2 model

### Health Check
- `GET /api/health` - Check service status

## Deployment

This application is configured to deploy to Azure Web Apps via GitHub Actions. 
