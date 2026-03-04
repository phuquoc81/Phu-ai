# Vercel Web Analytics Integration Guide

This document provides comprehensive instructions for the Vercel Web Analytics integration in the Phu AI project.

## Overview

Vercel Web Analytics has been successfully integrated into this Blitz.js application. This enables tracking of visitors, page views, and custom events when deployed to Vercel.

## What Has Been Implemented

### 1. Package Installation

The `@vercel/analytics` package (version 1.4.0) has been added to the project dependencies in `package.json`.

### 2. Analytics Component Integration

The `<Analytics />` component from `@vercel/analytics/next` has been integrated into the main app file at `src/pages/_app.tsx`. This component:
- Automatically tracks page views
- Supports Next.js routing (including Blitz.js routes)
- Works seamlessly with client-side navigation
- Only sends data in production environments

### 3. Implementation Details

**File: `src/pages/_app.tsx`**
```tsx
import { Analytics } from "@vercel/analytics/next"

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
    </ErrorBoundary>
  )
}
```

The `<Analytics />` component is placed at the root level of the application, ensuring it tracks all page navigations throughout the app.

## Setup Instructions

### Prerequisites

1. **Vercel Account**: Ensure you have a Vercel account. Sign up at [vercel.com/signup](https://vercel.com/signup) if needed.
2. **Vercel Project**: Create a project on Vercel linked to this repository.
3. **Vercel CLI** (optional): For local deployment testing.

### Enabling Web Analytics on Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (phu-ai)
3. Click on the **Analytics** tab
4. Click **Enable** to activate Web Analytics
5. After your next deployment, analytics will start collecting data

**Important Note**: Enabling Web Analytics adds new routes scoped at `/_vercel/insights/*` that handle the analytics data collection.

### Installation and Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel deploy
   ```

   Or connect your Git repository to Vercel for automatic deployments on push to main.

### Verifying the Integration

After deployment, verify the analytics integration is working:

1. Visit your deployed application
2. Open browser DevTools (F12)
3. Go to the **Network** tab
4. Look for a Fetch/XHR request to `/_vercel/insights/view`
5. If you see this request, analytics is working correctly

### Viewing Analytics Data

1. Navigate to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on the **Analytics** tab
4. After visitors access your site, you'll see data including:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers
   - Devices and browsers

## Project Structure

```
phu-ai/
├── src/
│   ├── pages/
│   │   ├── _app.tsx          # Main app file with Analytics component
│   │   ├── _document.tsx     # Document wrapper
│   │   ├── index.tsx          # Home page
│   │   └── 404.tsx            # 404 error page
│   ├── blitz-client.ts        # Blitz client configuration
│   └── blitz-server.ts        # Blitz server configuration
├── db/
│   ├── schema.prisma          # Prisma schema
│   └── index.ts               # Database client
├── package.json               # Dependencies including @vercel/analytics
├── next.config.js             # Next.js/Blitz configuration
├── tsconfig.json              # TypeScript configuration
└── .eslintrc.js              # ESLint configuration
```

## Advanced Features

### Custom Events (Pro and Enterprise Plans)

For Pro and Enterprise plans, you can track custom events:

```tsx
import { track } from '@vercel/analytics'

// Track a custom event
track('button_clicked', { location: 'header' })
```

### Filtering Data

In the Analytics dashboard, you can filter data by:
- Date range
- Pages
- Referrers
- Countries
- Devices

## Privacy and Compliance

Vercel Web Analytics is privacy-friendly:
- No cookies are used
- No personal data is collected
- GDPR and CCPA compliant
- Does not require cookie consent banners

Learn more: [Analytics Privacy Policy](https://vercel.com/docs/analytics/privacy-policy)

## Development vs Production

The Analytics component automatically detects the environment:
- **Development**: No data is sent (unless configured otherwise)
- **Production**: Analytics data is collected and sent to Vercel

## Troubleshooting

### Analytics Not Showing Data

1. Ensure analytics is enabled in your Vercel project settings
2. Verify the application is deployed to Vercel
3. Check that requests to `/_vercel/insights/view` are successful
4. Wait a few minutes for data to propagate

### Build Errors

If you encounter build errors:
1. Ensure all dependencies are installed: `npm install`
2. Check TypeScript compilation: `npm run build`
3. Verify ESLint passes: `npm run lint`

## Next Steps

- [Learn more about the @vercel/analytics package](https://vercel.com/docs/analytics/package)
- [Set up custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting guide](https://vercel.com/docs/analytics/troubleshooting)

## Support

For issues or questions:
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Vercel Support](https://vercel.com/support)
- [Blitz.js Documentation](https://blitzjs.com)
