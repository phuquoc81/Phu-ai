# Phu AI

Phu AI is an advanced AI-powered web application with capabilities to solve complex puzzles, mathematical problems, physics challenges, and provide intelligent predictions.

## Features

- 🧩 **Complex Puzzle Solving**: Solve intricate puzzles and logical challenges
- 🔢 **Mathematics**: Advanced mathematical problem solving
- ⚛️ **Physics**: Physics problems and calculations
- 🔮 **Predictions**: Data-driven predictions and insights

## Project Structure

```
Phu-ai/
├── src/
│   ├── index.js           # Main application entry point
│   ├── config/            # Configuration files
│   │   └── index.js       # App configuration
│   └── routes/            # API route handlers
│       └── api.js         # API endpoints
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles/            # CSS stylesheets
│   │   └── main.css       # Main stylesheet
│   └── scripts/           # Client-side JavaScript
│       └── main.js        # Main client script
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phuquoc81/Phu-ai.git
cd Phu-ai
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development

For development with auto-reload, you can use:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the health status of the API.

### Solve Problem
```
POST /api/solve
Content-Type: application/json

{
  "problem": "Your problem description"
}
```
Submits a problem for AI analysis and solution.

## Deployment

This application is configured for deployment on:
- Azure Web Apps (via GitHub Actions)
- Vercel

The deployment is automatically triggered on push to the main branch.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
