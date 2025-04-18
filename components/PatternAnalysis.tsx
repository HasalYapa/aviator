'use client';

import { useEffect, useState } from 'react';
import { GameData, detectStreaks, calculateVolatility, determineTrend, roundsToGameData } from '@/lib/predictionEngine';
import { getRecentRounds, subscribeToRounds } from '@/lib/services/roundsService';

export default function PatternAnalysis() {
  const [gameData, setGameData] = useState<GameData[]>([]);
  const [streaks, setStreaks] = useState<string[]>([]);
  const [volatility, setVolatility] = useState<number>(0);
  const [trend, setTrend] = useState<string>('');

  useEffect(() => {
    // Initialize with historical data from Supabase
    const fetchData = async () => {
      try {
        const rounds = await getRecentRounds(100);
        const gameDataFromRounds = roundsToGameData(rounds);
        setGameData(gameDataFromRounds);

        // Analyze patterns
        updatePatternAnalysis(gameDataFromRounds);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();

    // Subscribe to new rounds
    const subscription = subscribeToRounds(async () => {
      // When a new round is added, refresh the data and update analysis
      await fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update pattern analysis when game data changes
  useEffect(() => {
    if (gameData.length > 0) {
      updatePatternAnalysis(gameData);
    }
  }, [gameData]);

  const updatePatternAnalysis = (data: GameData[]) => {
    setStreaks(detectStreaks(data));
    setVolatility(calculateVolatility(data));
    setTrend(determineTrend(data));
  };

  // Helper function to determine volatility description
  const getVolatilityDescription = (vol: number): string => {
    if (vol < 1) return 'Low';
    if (vol < 2) return 'Medium';
    return 'High';
  };

  return (
    <div className="space-y-3">
      {streaks.length > 0 ? (
        streaks.map((streak, index) => (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <span className="font-medium">Streak Alert:</span> {streak}
            </p>
          </div>
        ))
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">No Streaks Detected</span>
          </p>
        </div>
      )}

      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-medium">Volatility:</span> {getVolatilityDescription(volatility)} (σ = {volatility.toFixed(2)})
        </p>
      </div>

      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-300">
          <span className="font-medium">Trend:</span> {trend}
        </p>
      </div>
    </div>
  );
}
