'use client';

import { useEffect, useState } from 'react';
import { GameData, PredictionResult, generatePrediction, roundsToGameData } from '@/lib/predictionEngine';
import { getRecentRounds, subscribeToRounds } from '@/lib/services/roundsService';
import { addPrediction } from '@/lib/services/predictionsService';

export default function PredictionEngine() {
  const [gameData, setGameData] = useState<GameData[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with historical data from Supabase
    const fetchData = async () => {
      try {
        const rounds = await getRecentRounds(100);
        const gameDataFromRounds = roundsToGameData(rounds);
        setGameData(gameDataFromRounds);

        // Generate initial prediction
        const initialPrediction = generatePrediction(gameDataFromRounds);
        setPrediction(initialPrediction);

        // Save prediction to Supabase
        if (initialPrediction && initialPrediction.predictedMultiplier > 0) {
          await addPrediction({
            predicted_multiplier: initialPrediction.predictedMultiplier,
            confidence: initialPrediction.confidence,
            result_status: 'pending'
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to new rounds
    const subscription = subscribeToRounds(async (payload) => {
      // When a new round is added, refresh the data and update prediction
      const rounds = await getRecentRounds(100);
      const gameDataFromRounds = roundsToGameData(rounds);
      setGameData(gameDataFromRounds);

      // Generate new prediction
      const newPrediction = generatePrediction(gameDataFromRounds);
      setPrediction(newPrediction);

      // Save prediction to Supabase
      if (newPrediction && newPrediction.predictedMultiplier > 0) {
        await addPrediction({
          predicted_multiplier: newPrediction.predictedMultiplier,
          confidence: newPrediction.confidence,
          result_status: 'pending'
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update prediction when game data changes
  useEffect(() => {
    if (gameData.length > 0) {
      setPrediction(generatePrediction(gameData));
    }
  }, [gameData]);

  if (loading || !prediction) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Next likely crash point:</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {prediction.predictedMultiplier.toFixed(2)}x
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full ${
          prediction.confidence > 70
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
            : prediction.confidence > 50
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          <p className="font-medium">{prediction.confidence}% Confidence</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on pattern analysis of the last {gameData.length} rounds
        </p>
      </div>
    </div>
  );
}
