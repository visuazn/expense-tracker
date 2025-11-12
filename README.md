# Personal Expense Tracker 💰

A modern, full-featured personal expense tracker built with Next.js, Supabase, and deployed on Vercel. Track your spending, set budgets, analyze trends, and manage recurring expenses with an intuitive interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)

## ✨ Features

### Expense Management

- ✅ **CRUD Operations**: Create, read, update, and delete expenses
- ✅ **Category System**: Pre-built categories with icons and color coding
- ✅ **Advanced Filtering**: Search by description, date range, category, and amount
- ✅ **Recurring Expenses**: Set up daily, weekly, or monthly recurring expenses

### Analytics & Insights

- 📊 **Dashboard**: Overview of your spending with summary cards
- 📈 **Charts**:
  - Pie chart for expense breakdown by category
  - Line chart for spending trends over time
  - Bar chart for monthly comparisons
- 📅 **Period Selection**: View data by week, month, year, or all time

### Budget Tracking

- 💵 **Budget Limits**: Set overall or category-specific budgets
- ⚠️ **Alerts**: Visual warnings when approaching or exceeding budget
- 📊 **Progress Tracking**: Real-time budget vs. actual spending visualization

### User Experience

- 🎨 **Modern UI**: Clean, professional design with shadcn/ui components
- 📱 **Responsive**: Fully responsive design for mobile, tablet, and desktop
- 🌙 **Theme Support**: Built with Tailwind CSS for easy theme customization
- 🔔 **Notifications**: Toast notifications for user actions
- ⚡ **Fast**: Optimized with Next.js 14 App Router

## 🛠 Tech Stack

| Category          | Technology              |
| ----------------- | ----------------------- |
| **Framework**     | Next.js 14 (App Router) |
| **Language**      | TypeScript              |
| **Styling**       | Tailwind CSS            |
| **Components**    | shadcn/ui               |
| **Database**      | Supabase (PostgreSQL)   |
| **Charts**        | Recharts                |
| **Icons**         | Lucide React            |
| **Date Handling** | date-fns                |
| **Hosting**       | Vercel                  |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A [Supabase](https://supabase.com) account (free tier available)
- A [Vercel](https://vercel.com) account (free tier available) for deployment

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   - Create a new project on [Supabase](https://supabase.com)
   - Go to the SQL Editor
   - Copy and run the SQL from `supabase/migrations.sql`
   - This creates tables, RLS policies, and seeds initial data
   - Get your Project URL and Anon Key from Settings > API

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Database Schema

### Tables

**expenses**

- `id` (UUID, primary key)
- `amount` (decimal)
- `description` (text)
- `category_id` (foreign key → categories)
- `date` (timestamp)
- `is_recurring` (boolean)
- `recurrence_pattern` (text: daily/weekly/monthly)
- `created_at` (timestamp)

**categories**

- `id` (UUID, primary key)
- `name` (text)
- `icon` (text)
- `color` (text)
- `budget_limit` (decimal, nullable)

**budgets**

- `id` (UUID, primary key)
- `category_id` (foreign key → categories, nullable)
- `amount` (decimal)
- `period` (text: weekly/monthly/yearly)
- `start_date` (timestamp)

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above or manually import your GitHub repository to Vercel
2. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

## 📖 Documentation

- [Setup Instructions](./SETUP.md) - Environment setup and configuration
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Database Schema](./supabase/migrations.sql) - SQL migration script

## 🎯 Usage

### Adding an Expense

1. Click "Add Expense" button
2. Fill in amount, description, category, and date
3. Optionally mark as recurring
4. Save

### Setting a Budget

1. Navigate to Budgets page
2. Click "Add Budget"
3. Set amount, category (optional), and period
4. Track your spending against the budget

### Viewing Analytics

1. Go to Dashboard for overview
2. Visit Analytics page for detailed insights
3. Use period selector to change date ranges
4. View charts and category breakdowns

## 🔒 Security Notes

This application is configured for **single-user demo mode** without authentication.

For production use with multiple users:

- Add authentication (Supabase Auth recommended)
- Update RLS policies to be user-specific
- Add `user_id` column to all tables
- Implement proper access controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Hosted on [Vercel](https://vercel.com)
- Database powered by [Supabase](https://supabase.com)

## 📞 Support

For issues and questions:

- Check the documentation files
- Review the Supabase and Vercel documentation
- Open an issue in the repository

---

Made with ❤️ using Next.js and Supabase
