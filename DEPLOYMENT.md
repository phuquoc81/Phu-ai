# Deployment Guide for Phu AI on Vercel

This guide will help you deploy Phu AI with automatic login functionality on Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at https://vercel.com)
- Your Phutokenvercel token

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:
```bash
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Sign in with your GitHub account if not already logged in
3. Click "Import Git Repository"
4. Select the `phuquoc81/Phu-ai` repository
5. Click "Import"

### 3. Configure Environment Variables

Before deploying, you need to add the environment variable:

1. In the "Configure Project" page, expand the "Environment Variables" section
2. Add the following variable:
   - **Name**: `PHUTOKENVERCEL`
   - **Value**: Your actual token value (e.g., `your-secret-token-here`)
   - **Environments**: Select all (Production, Preview, Development)
3. Click "Add"

### 4. Deploy

1. Leave all other settings as default (Vercel will auto-detect Next.js)
2. Click "Deploy"
3. Wait for the deployment to complete (usually takes 1-2 minutes)

### 5. Verify Deployment

Once deployed:
1. Click on the deployment URL provided by Vercel
2. The application should automatically log you in using the PHUTOKENVERCEL token
3. You should see the "Welcome to Phu AI" dashboard

## Setting Up Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Updating Environment Variables

If you need to change the PHUTOKENVERCEL token:

1. Go to your project in Vercel
2. Click "Settings"
3. Go to "Environment Variables"
4. Find `PHUTOKENVERCEL` and click "Edit"
5. Update the value
6. Click "Save"
7. Redeploy your application for changes to take effect

## Troubleshooting

### Application Not Auto-Logging In

1. Check that `PHUTOKENVERCEL` is set in Vercel environment variables
2. Ensure the variable is enabled for Production environment
3. Try redeploying the application
4. Clear your browser cache and cookies

### Build Failures

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are correctly specified in package.json
3. Verify that the repository has all necessary files

### Manual Login

If automatic login fails, users can still manually log in:
1. Go to `/login` page
2. Enter the token manually
3. Click "Login"

## Security Recommendations

1. **Never commit** your actual PHUTOKENVERCEL token to the repository
2. Use different tokens for production and development environments
3. Regularly rotate your tokens
4. Monitor access logs in Vercel dashboard

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

For issues or questions:
- Check the README.md in the repository
- Review Vercel's documentation
- Check the application logs in Vercel dashboard
