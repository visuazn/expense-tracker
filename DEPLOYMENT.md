# Deployment Guide

This guide will help you deploy the Expense Tracker application to Vercel with Supabase as the database.

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier available)
- A [Vercel](https://vercel.com) account (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in your project details
   - Wait for the project to be created (this may take a few minutes)

2. **Run the Database Migration**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations.sql`
   - Paste and execute the SQL commands
   - This will create all necessary tables, functions, and seed data

3. **Get Your Supabase Credentials**
   - Go to Settings > API
   - Copy your:
     - Project URL (looks like: `https://xxxxx.supabase.co`)
     - Anon/Public key (a long string starting with `eyJ...`)
   - Keep these handy for the next step

4. **Verify Row Level Security (RLS) Policies**
   - The migration script already set up RLS policies
   - These policies allow all operations (for demo mode)
   - In production, you would add authentication and user-specific policies

## Step 2: Deploy to Vercel

1. **Connect Your Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" > "Project"
   - Import your Git repository
   - Vercel will automatically detect Next.js

2. **Configure Environment Variables**
   - In the "Environment Variables" section, add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Replace the values with your actual Supabase credentials from Step 1

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - This typically takes 2-3 minutes

4. **Access Your Application**
   - Once deployed, Vercel will provide you with a URL
   - Click on it to access your expense tracker
   - The URL will be something like: `https://your-project.vercel.app`

## Step 3: Verify the Deployment

1. **Test Basic Functionality**
   - Add an expense
   - View the dashboard
   - Create a budget
   - Check analytics

2. **Monitor for Errors**
   - Check the Vercel dashboard for any build or runtime errors
   - Check the Supabase dashboard for database query logs

## Optional: Custom Domain

1. **Add a Custom Domain**
   - In Vercel, go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

## Optional: Set Up Recurring Expense Automation

For automatic generation of recurring expenses, you can set up a scheduled function:

1. **Using Vercel Cron Jobs** (if available in your plan)
   - Create a new API route at `app/api/cron/recurring/route.ts`
   - Add the recurring expense generation logic
   - Configure the cron schedule in `vercel.json`

2. **Using Supabase Edge Functions**
   - Create a new Edge Function in Supabase
   - Call the `generateRecurringExpenses` function
   - Set up a cron trigger

3. **Manual Approach**
   - Add a button in the UI to manually trigger recurring expense generation
   - This is simpler for a demo application

## Troubleshooting

### Build Errors

- **Module not found**: Run `npm install` locally to ensure all dependencies are installed
- **TypeScript errors**: Run `npm run build` locally to catch any TypeScript issues before deploying

### Runtime Errors

- **Supabase connection failed**: Double-check your environment variables in Vercel
- **No data showing**: Verify the SQL migration ran successfully in Supabase
- **CORS errors**: Make sure your Vercel URL is added to Supabase's allowed origins (though this shouldn't be necessary for this setup)

### Performance Issues

- **Slow loading**: Check your Supabase query performance in the dashboard
- **High latency**: Consider upgrading to a paid Supabase plan with better geographical distribution

## Security Considerations

**Important**: This application is configured for demo/single-user mode without authentication.

For production use, you should:

1. Add authentication (Supabase Auth is recommended)
2. Update RLS policies to be user-specific
3. Add user_id columns to all tables
4. Implement proper access controls
5. Use environment-specific API keys
6. Enable rate limiting

## Updating Your Deployment

1. Push changes to your Git repository
2. Vercel will automatically deploy the changes
3. You can also manually trigger a deployment from the Vercel dashboard

## Cost Considerations

Both Supabase and Vercel offer generous free tiers:

- **Supabase Free Tier**: 500MB database, 1GB file storage, 2GB bandwidth
- **Vercel Free Tier**: Unlimited deployments, 100GB bandwidth, serverless function executions

For a personal expense tracker, these free tiers should be more than sufficient.

## Support

- Supabase Documentation: https://supabase.com/docs
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs

