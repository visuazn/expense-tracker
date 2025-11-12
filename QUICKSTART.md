# Quick Start Guide 🚀

Get your expense tracker up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher installed
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account (for deployment)

## Step 1: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - Name: `expense-tracker` (or your choice)
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project creation (~2 minutes)
5. Go to **SQL Editor** in the left sidebar
6. Open the file `supabase/migrations.sql` from this project
7. Copy all the SQL code
8. Paste it into the SQL Editor and click **Run**
9. Go to **Settings** > **API**
10. Copy these two values:
    - **Project URL** (like `https://xxxxx.supabase.co`)
    - **anon public key** (long string starting with `eyJ...`)

## Step 2: Configure Local Environment (1 minute)

1. Create a file named `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

2. Replace the values with what you copied from Supabase

## Step 3: Run Locally (1 minute)

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 4: Deploy to Vercel (2 minutes)

### Option A: Via GitHub (Recommended)

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click **Add New** > **Project**
4. Import your GitHub repository
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click **Deploy**
7. Wait ~2 minutes
8. Your app is live! 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## Step 5: Test Your App

### Add Your First Expense

1. Click **Add Expense**
2. Enter an amount (e.g., 50.00)
3. Add description (e.g., "Grocery shopping")
4. Select category (e.g., "Food")
5. Pick today's date
6. Click **Save Expense**

### Set a Budget

1. Go to **Budgets** page
2. Click **Add Budget**
3. Set amount (e.g., 500.00)
4. Select category or leave blank for overall budget
5. Choose period (e.g., "Monthly")
6. Click **Save Budget**

### View Analytics

1. Go to **Dashboard** to see overview
2. Visit **Analytics** for detailed insights
3. Try different time periods (week, month, year)

## What You Get

✅ **Dashboard** - Overview of your spending with charts
✅ **Expenses** - Add, edit, delete, search, and filter expenses
✅ **Analytics** - Detailed insights with multiple chart types
✅ **Budgets** - Track spending against limits with visual alerts
✅ **Recurring Expenses** - Set up daily, weekly, or monthly expenses
✅ **Mobile Responsive** - Works great on phone, tablet, and desktop

## Default Categories

The app comes with 8 pre-configured categories:

- 🍴 Food
- 🚗 Transport
- 📺 Entertainment
- 📄 Bills
- 🛍️ Shopping
- ❤️ Health
- 📚 Education
- ⋯ Other

## Common Issues

### "Failed to load expenses"

- Check your `.env.local` file has correct Supabase credentials
- Verify the SQL migration ran successfully in Supabase
- Check Supabase project is not paused (free tier pauses after inactivity)

### "supabaseUrl is required"

- Environment variables are missing
- Make sure `.env.local` exists and has both variables
- Restart the dev server after creating `.env.local`

### Build errors

- Run `npm run build` locally to check for errors
- Make sure all TypeScript errors are resolved
- Check that all imports are correct

## Need Help?

- 📖 Read [README.md](./README.md) for full documentation
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide
- 🛠️ Check [SETUP.md](./SETUP.md) for detailed setup instructions
- 📊 Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for technical details

## What's Next?

Now that your app is running:

1. **Add Real Data** - Start tracking your actual expenses
2. **Set Budgets** - Create monthly budgets for different categories
3. **Analyze Trends** - Use the analytics page to understand your spending
4. **Share** - Share your Vercel URL with friends (note: this is a demo mode without authentication)

## Pro Tips

💡 **Use Recurring Expenses** - Set up bills and subscriptions as recurring to see upcoming expenses

💡 **Filter by Date** - Use date range filters to analyze specific time periods

💡 **Set Category Budgets** - Create separate budgets for different spending categories

💡 **Check Dashboard Daily** - Make it a habit to review your dashboard regularly

💡 **Mobile Friendly** - Add the Vercel URL to your phone's home screen for quick access

---

**Congratulations!** 🎉 You now have a fully functional expense tracker!

Happy budgeting! 💰
