'use client';

import { useEffect, useState } from 'react';
import { roundsToGameData } from '../lib/predictionEngine';
import { getRecentRounds } from '../lib/services/roundsService';
import { getUserStats } from '../lib/services/statsService';

interface PredictionStats {
  accuracy: number;
  signalsGenerated: number;
  avgMultiplier: number;
  highestToday: number;
}

export default function PredictionStats() {
  const [stats, setStats] = useState<PredictionStats>({
    accuracy: 0,
    signalsGenerated: 0,
    avgMultiplier: 0,
    highestToday: 0
  });

  useEffect(() => {
    // Fetch real data from Supabase
    const fetchData = async () => {
      try {
        // Get user stats
        const userStats = await getUserStats();

        if (userStats) {
          const accuracy = userStats.total_predictions > 0
            ? Math.round((userStats.correct_predictions / userStats.total_predictions) * 100)
            : 0;

          // Get recent rounds for average multiplier and highest today
          const rounds = await getRecentRounds(200);
          const gameData = roundsToGameData(rounds);

          // Calculate average multiplier
          const multipliers = gameData.map(game => game.multiplier);
          const avgMultiplier = multipliers.length > 0
            ? multipliers.reduce((sum, val) => sum + val, 0) / multipliers.length
            : 0;

          // Find highest multiplier today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTimestamp = today.getTime();

          const todayMultipliers = gameData
            .filter(game => {
              const timestamp = typeof game.timestamp === 'string'
                ? new Date(game.timestamp).getTime()
                : game.timestamp;
              return timestamp >= todayTimestamp;
            })
            .map(game => game.multiplier);

          const highestToday = todayMultipliers.length > 0
            ? Math.max(...todayMultipliers)
            : 0;

          setStats({
            accuracy,
            signalsGenerated: userStats.total_predictions,
            avgMultiplier,
            highestToday
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();

    // Update stats every minute
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // This function is no longer needed as we're fetching real data

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Accuracy (24h)</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{stats.accuracy}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Signals Generated</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{stats.signalsGenerated}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Avg. Multiplier</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{stats.avgMultiplier.toFixed(2)}x</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Highest Today</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{stats.highestToday.toFixed(2)}x</span>
      </div>
    </div>
  );
}
