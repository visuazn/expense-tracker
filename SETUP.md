# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API to find your:
   - Project URL
   - Anon/Public key
3. Add these credentials to your `.env.local` file
4. Run the SQL migrations found in the `/supabase` folder to create the database tables

## Running the Application

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

