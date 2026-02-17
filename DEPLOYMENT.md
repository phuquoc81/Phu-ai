# Deployment Instructions

## Deploying to Vercel

This project is now configured for Vercel deployment with phuoptimizer 81.

### Prerequisites
- A Vercel account
- Vercel CLI (optional, for local testing)

### Deployment Steps

1. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `phuquoc81/Phu-ai`
   - Vercel will automatically detect the `vercel.json` configuration

2. **Environment Variables**:
   - The `PHUOPTIMIZER` environment variable is already set to "81" in `vercel.json`
   - No additional configuration needed

3. **Deploy**:
   - Click "Deploy"
   - Your app will be available at `https://your-project-name.vercel.app`

### API Endpoints

- **Phutokenvercel Login API**: `/api/phutokenvercel-login`
  - **Method**: POST
  - **Required Fields**: 
    - `username`: Your username
    - `password`: Your password
    - `token`: Must contain "phutokenvercel"
  - **Response**: JSON with authentication status and phuoptimizer 81 information

- **API Information**: `/api/phutokenvercel-login` (GET)
  - Returns API information and available endpoints

### Features

- ✅ Vercel configuration with phuoptimizer 81
- ✅ Phutokenvercel API login endpoint
- ✅ Modern, responsive web interface
- ✅ CORS enabled for API access
- ✅ Environment variable support

### Local Development

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Run locally
vercel dev
```

The application will be available at `http://localhost:3000`

### Testing the API

**Important Security Notes:**
- This is a demonstration implementation. For production use, implement proper authentication with secure token generation, validation, and storage.
- Use environment variables in Vercel Dashboard for sensitive values instead of committing them to the repository.
- Consider restricting CORS to specific trusted domains in production.
- Vercel enforces HTTPS by default, ensuring secure transmission of credentials.

Using curl:
```bash
# Get API information
curl https://your-project.vercel.app/api/phutokenvercel-login

# Login with Phutokenvercel
curl -X POST https://your-project.vercel.app/api/phutokenvercel-login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","token":"phutokenvercel-12345"}'
```

Using the web interface:
1. Open the deployed URL in your browser
2. Enter your credentials
3. Use a token in the format "phutokenvercel-xxxxx" (e.g., "phutokenvercel-12345")
4. Click "Login with Phutokenvercel"

### What's Included

- `vercel.json`: Vercel configuration with phuoptimizer 81 environment variable
- `api/phutokenvercel-login.js`: Phutokenvercel API login endpoint
- `index.html`: Web interface for Phu AI with login form
- `package.json`: Project configuration
- `.vercelignore`: Files to exclude from deployment

### Notes

- The project name in Vercel configuration is set to "phuoptimizer-81"
- The PHUOPTIMIZER environment variable is set to "81"
- All API responses include the phuoptimizer value
- The login requires a token containing "phutokenvercel" for authentication
