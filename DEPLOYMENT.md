# Vercel Deployment Guide

This guide will help you deploy your Narb Hacks application to Vercel.

## Prerequisites

1. [Vercel account](https://vercel.com/signup)
2. [Convex account](https://convex.dev) with your backend deployed
3. [Clerk account](https://clerk.com) with authentication set up

## Environment Variables

You'll need to set up the following environment variables in Vercel:

### Required Environment Variables

1. **NEXT_PUBLIC_CONVEX_URL**
   - Description: Your Convex deployment URL
   - Example: `https://youthful-fish-429.convex.cloud`
   - Get from: Convex Dashboard → Settings → URL
   - **Note**: Use your **production** Convex deployment URL for production

2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Description: Your Clerk publishable key
   - Example: `pk_test_...` or `pk_live_...`
   - Get from: Clerk Dashboard → API Keys → Publishable Key

3. **CLERK_SECRET_KEY**
   - Description: Your Clerk secret key (keep this secure!)
   - Example: `sk_test_...` or `sk_live_...`
   - Get from: Clerk Dashboard → API Keys → Secret Key

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect your repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure the project:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build and Output Settings**: Leave as default (our config will handle this)

3. **Set environment variables:**
   - In the "Environment Variables" section, add all the variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to the web app directory:**
   ```bash
   cd apps/web
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_CONVEX_URL
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   ```

## Configuration Files

The following configuration files have been created for optimal deployment:

### `apps/web/vercel.json`
- Configures Vercel to handle the monorepo structure
- Uses pnpm and Turbo for building
- Optimized for Next.js framework deployment

### `apps/web/next.config.js`
- Handles workspace dependencies
- Optimizes for standalone output
- Configures image optimization
- Sets up security headers

## Post-Deployment Checklist

After deployment, verify the following:

- [ ] Application loads without errors
- [ ] Authentication with Clerk works
- [ ] Database queries to Convex work
- [ ] All routes are accessible
- [ ] Images load properly
- [ ] API routes function correctly

## Troubleshooting

### Common Issues and Solutions

1. **"Module not found" errors:**
   - Ensure `transpilePackages: ['@packages/backend']` is in `next.config.js`
   - Check that your workspace dependencies are properly configured

2. **Environment variables not working:**
   - Verify all environment variables are set in Vercel dashboard
   - Make sure to redeploy after changing environment variables
   - Check that client-side variables start with `NEXT_PUBLIC_`

3. **Build failures:**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly installed
   - Verify that the build command is correct

4. **"Function Runtimes must have a valid version" error:**
   - This was fixed by removing unnecessary function runtime configuration
   - The error occurred because we initially included API function settings when no API routes exist

5. **Authentication issues:**
   - Verify Clerk keys are correct and match your environment
   - Check that your Clerk application is properly configured
   - Ensure middleware.ts is correctly set up

6. **Database connection issues:**
   - Verify Convex URL is correct
   - Check that your Convex deployment is running
   - Ensure you're using the production Convex URL for production deployment

## Domain Setup

1. **Custom Domain (Optional):**
   - Go to your project in Vercel dashboard
   - Navigate to "Settings" → "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

2. **SSL Certificate:**
   - Vercel automatically provides SSL certificates
   - Your app will be available at `https://your-app.vercel.app`

## Monitoring and Analytics

- Enable Vercel Analytics for performance insights
- Set up error monitoring with services like Sentry
- Monitor Convex usage in the Convex dashboard
- Track authentication metrics in Clerk dashboard

## Production Considerations

- Use production Convex deployment URL
- Use live Clerk keys for production
- Enable security headers (already configured in next.config.js)
- Consider implementing rate limiting for API routes
- Set up proper error boundaries for better user experience

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Convex Deployment Guide](https://docs.convex.dev/production/hosting)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/overview) 