# Phu AI - Automatic Login with Phutokenvercel

Phu AI is a webapp with automatic login capabilities using Phutokenvercel on the Vercel platform.

## Features

- ✅ Automatic login using Phutokenvercel environment variable
- ✅ Token-based authentication
- ✅ Persistent sessions using cookies
- ✅ Vercel platform optimized
- ✅ Modern Next.js architecture

## Setup

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/phuquoc81/Phu-ai.git
cd Phu-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Set your Phutokenvercel in `.env.local`:
```
PHUTOKENVERCEL=your_vercel_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Vercel Deployment

1. Push your code to GitHub

2. Import the project in Vercel

3. Set the environment variable:
   - Go to your project settings in Vercel
   - Navigate to Environment Variables
   - Add `PHUTOKENVERCEL` with your token value

4. Deploy!

The application will automatically log users in when the `PHUTOKENVERCEL` environment variable is set.

## How Automatic Login Works

1. When the application loads, it checks for the `PHUTOKENVERCEL` environment variable
2. If found and no existing session exists, it automatically creates an authenticated session
3. The token is stored in cookies with a 7-day expiration
4. Users can also manually login by entering their token on the login page

## Environment Variables

- `PHUTOKENVERCEL` - The authentication token for automatic login on Vercel

## Project Structure

```
Phu-ai/
├── pages/
│   ├── _app.js          # App wrapper
│   ├── index.js         # Home page with auto-login
│   └── login.js         # Manual login page
├── utils/
│   └── auth.js          # Authentication utilities
├── styles/
│   └── globals.css      # Global styles
├── public/              # Static assets
├── package.json         # Dependencies
├── next.config.js       # Next.js configuration
├── vercel.json          # Vercel configuration
└── .env.local.example   # Environment variables template
```

## License

Apache-2.0
