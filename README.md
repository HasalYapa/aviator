# Aviator Signal Prediction App

A web application for predicting Aviator game signals using advanced pattern recognition algorithms.

## Features

- **Authentication System**: Secure user authentication with Supabase Auth
- **Signal Dashboard**: Real-time signal feed with prediction confidence levels
- **Prediction Engine**: Advanced algorithms for pattern recognition
  - Moving Average Window
  - Streak Detection
  - Volatility Analysis
  - Weighted Recent Average
- **Interactive Charts**: Visualize historical multipliers and patterns
- **Notification System**: Get alerts for high-confidence predictions
- **User Profile**: Manage account settings and preferences
- **Admin Panel**: Configure prediction parameters and view system stats

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Chart.js
- **Backend**: Next.js API routes
- **Database**: Supabase
- **Authentication**: Supabase Auth

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Project Structure

```
aviator-signal-prediction/
├── app/                  # Next.js app directory
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # Main user dashboard
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile
│   └── ...
├── components/           # React components
├── lib/                  # Utility functions and services
│   ├── auth.ts           # Authentication functions
│   ├── predictionEngine.ts # Prediction algorithms
│   └── ...
├── public/               # Static assets
└── ...
```

## Prediction Engine

The prediction engine uses several algorithms to analyze patterns in Aviator game data:

1. **Moving Average Window**: Calculates the average of recent multipliers
2. **Streak Detection**: Identifies consecutive low or high multipliers
3. **Volatility Detector**: Measures the standard deviation of multipliers
4. **Weighted Recent Average**: Gives more weight to recent games for forecasting

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
