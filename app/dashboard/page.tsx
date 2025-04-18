'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useEffect } from 'react';

// Dynamically import components with no SSR to avoid hydration issues
const MultiplierChart = dynamic(
  () => import('../../components/MultiplierChart'),
  { ssr: false }
);

const PredictionEngine = dynamic(
  () => import('../../components/PredictionEngine'),
  { ssr: false }
);

const RecentSignals = dynamic(
  () => import('../../components/RecentSignals'),
  { ssr: false }
);

const PatternAnalysis = dynamic(
  () => import('../../components/PatternAnalysis'),
  { ssr: false }
);

const PredictionStats = dynamic(
  () => import('../../components/PredictionStats'),
  { ssr: false }
);

const NotificationSettings = dynamic(
  () => import('../../components/NotificationSettings'),
  { ssr: false }
);

export default function Dashboard() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force a hard navigation instead of client-side routing
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not loading, the useEffect will redirect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Aviator Signal Prediction</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Profile
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Admin
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Signal Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Prediction */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Current Prediction</h2>
              <PredictionEngine />
            </div>

            {/* Live Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Multiplier History</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md">
                    5m
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md">
                    15m
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md">
                    1h
                  </button>
                </div>
              </div>
              <MultiplierChart period="5m" />
            </div>

            {/* Recent Signals */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Signals</h2>
              <RecentSignals />
            </div>
          </div>

          {/* Right Column - Stats & Settings */}
          <div className="space-y-8">
            {/* Prediction Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Prediction Stats</h2>
              <PredictionStats />
            </div>

            {/* Pattern Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pattern Analysis</h2>
              <PatternAnalysis />
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Notifications</h2>
              <NotificationSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
