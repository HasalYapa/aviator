'use client';

import { useEffect, useState } from 'react';
import { getRecentRounds, Round, subscribeToRounds } from '@/lib/services/roundsService';

export default function RecentSignals() {
  const [recentGames, setRecentGames] = useState<Round[]>([]);

  useEffect(() => {
    // Get initial data (last 5 games)
    const fetchData = async () => {
      try {
        const rounds = await getRecentRounds(5);
        setRecentGames(rounds);
      } catch (error) {
        console.error('Error fetching recent rounds:', error);
      }
    };

    fetchData();

    // Subscribe to new rounds
    const subscription = subscribeToRounds(async () => {
      // When a new round is added, refresh the data
      await fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4">
      {recentGames.map((game) => {
        const date = new Date(game.timestamp);
        const timeString = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

        // Determine color based on multiplier value
        let multiplierClass = '';
        if (game.multiplier < 1.5) {
          multiplierClass = 'text-red-600 dark:text-red-400';
        } else if (game.multiplier > 5) {
          multiplierClass = 'text-green-600 dark:text-green-400';
        } else {
          multiplierClass = 'text-gray-900 dark:text-gray-100';
        }

        return (
          <div key={game.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">{timeString}</div>
            <div className={`font-medium ${multiplierClass}`}>{game.multiplier.toFixed(2)}x</div>
            <div className="text-sm text-red-600 dark:text-red-400">Crashed</div>
          </div>
        );
      })}
    </div>
  );
}
