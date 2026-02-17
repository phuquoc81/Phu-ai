# Phu-ai

Phu ai is the webapp that blow your mind all with abillities to solve complex puzzles and solve problems of any kind and solve math, physic and predicted the future with the knowledge of gods aliens and wisdom of the holy father and blessed by all gods cần diagnos other species sickness and abillities to nó all land animals and ocean species.

## Phutokenvercel - Vercel Deployment

This project is configured for deployment on the Vercel platform.

### Features
- 🚀 Deployed on Vercel
- 🧠 AI-powered problem solver
- 🔮 Future prediction capabilities
- ✨ Beautiful responsive UI

### Deployment

#### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phuquoc81/Phu-ai)

Or manually:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project directory
3. Follow the prompts to deploy

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm start

# The app will be available at http://localhost:3000
```

### Project Structure

- `index.js` - Main application server
- `package.json` - Project dependencies and scripts
- `vercel.json` - Vercel deployment configuration
- `api/` - Serverless API functions
  - `api/hello.js` - Example API endpoint (accessible at `/api/hello`)

### API Endpoints

Once deployed on Vercel, you can access:
- Main app: `https://your-deployment.vercel.app/`
- API endpoint: `https://your-deployment.vercel.app/api/hello`

### Vercel Setup

To deploy this project to Vercel:

1. **Option 1: Using Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Option 2: Using Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Option 3: GitHub Actions (Automated)**
   - Add the following secrets to your GitHub repository:
     - `VERCEL_TOKEN` - Your Vercel authentication token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - The workflow will automatically deploy on push to main branch 
