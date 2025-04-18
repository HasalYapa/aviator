/**
 * Prediction Engine for Aviator Signal Prediction
 *
 * This module contains algorithms for analyzing patterns in Aviator game data
 * and predicting future crash points.
 */

import { Round } from './services/roundsService';

// Types
export interface GameData {
  id: string | number;
  timestamp: number | string;
  multiplier: number;
}

// Convert Round to GameData
export function roundToGameData(round: Round): GameData {
  return {
    id: round.id,
    timestamp: new Date(round.timestamp).getTime(),
    multiplier: round.multiplier
  };
}

// Convert array of Rounds to array of GameData
export function roundsToGameData(rounds: Round[]): GameData[] {
  return rounds.map(round => roundToGameData(round));
}

export interface PredictionResult {
  predictedMultiplier: number;
  confidence: number;
  patterns: {
    streaks: string[];
    volatility: number;
    trend: string;
  };
}

/**
 * Calculate the moving average of multipliers
 */
export function calculateMovingAverage(data: GameData[], windowSize: number): number {
  if (data.length === 0 || windowSize <= 0 || windowSize > data.length) {
    return 0;
  }

  const recentData = data.slice(-windowSize);
  const sum = recentData.reduce((acc, game) => acc + game.multiplier, 0);
  return sum / windowSize;
}

/**
 * Detect streaks in the data (consecutive low or high multipliers)
 */
export function detectStreaks(data: GameData[], threshold: number = 1.5): string[] {
  const streaks: string[] = [];

  if (data.length < 3) return streaks;

  // Check for low multiplier streaks
  let lowStreak = 0;
  let highStreak = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    const multiplier = data[i].multiplier;

    // Low streak detection
    if (multiplier < threshold) {
      lowStreak++;
      highStreak = 0;
    }
    // High streak detection
    else if (multiplier > threshold * 2) {
      highStreak++;
      lowStreak = 0;
    }
    // Reset both
    else {
      lowStreak = 0;
      highStreak = 0;
    }

    // Report significant streaks
    if (lowStreak === 3) {
      streaks.push(`3 consecutive multipliers below ${threshold}x`);
    }

    if (highStreak === 3) {
      streaks.push(`3 consecutive multipliers above ${threshold * 2}x`);
    }
  }

  return streaks;
}

/**
 * Calculate volatility (standard deviation)
 */
export function calculateVolatility(data: GameData[]): number {
  if (data.length <= 1) return 0;

  const values = data.map(game => game.multiplier);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Calculate weighted recent average (more weight to recent games)
 */
export function calculateWeightedRecentAverage(data: GameData[], decayFactor: number = 0.9): number {
  if (data.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < data.length; i++) {
    // More recent games have higher weight
    const weight = Math.pow(decayFactor, data.length - 1 - i);
    weightedSum += data[i].multiplier * weight;
    totalWeight += weight;
  }

  return weightedSum / totalWeight;
}

/**
 * Determine trend direction
 */
export function determineTrend(data: GameData[]): string {
  if (data.length < 5) return "Insufficient data";

  const recentValues = data.slice(-5).map(game => game.multiplier);
  const firstHalf = recentValues.slice(0, 2);
  const secondHalf = recentValues.slice(-2);

  const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const difference = secondHalfAvg - firstHalfAvg;

  if (difference > 0.5) return "Strongly increasing multipliers";
  if (difference > 0.1) return "Slightly increasing multipliers";
  if (difference < -0.5) return "Strongly decreasing multipliers";
  if (difference < -0.1) return "Slightly decreasing multipliers";
  return "Stable multipliers";
}

/**
 * Generate prediction based on historical data
 */
export function generatePrediction(data: GameData[]): PredictionResult {
  if (data.length < 10) {
    return {
      predictedMultiplier: 0,
      confidence: 0,
      patterns: {
        streaks: [],
        volatility: 0,
        trend: "Insufficient data"
      }
    };
  }

  // Calculate various metrics
  const movingAvg = calculateMovingAverage(data, 10);
  const weightedAvg = calculateWeightedRecentAverage(data);
  const volatility = calculateVolatility(data);
  const streaks = detectStreaks(data);
  const trend = determineTrend(data);

  // Combine metrics to make prediction
  // This is a simplified approach - in a real system, you might use more sophisticated algorithms
  let predictedMultiplier = weightedAvg * 0.7 + movingAvg * 0.3;

  // Adjust based on streaks
  if (streaks.some(s => s.includes("below"))) {
    // After low streaks, we might expect a higher value
    predictedMultiplier *= 1.2;
  }

  // Adjust based on trend
  if (trend.includes("increasing")) {
    predictedMultiplier *= 1.1;
  } else if (trend.includes("decreasing")) {
    predictedMultiplier *= 0.9;
  }

  // Round to 2 decimal places
  predictedMultiplier = Math.round(predictedMultiplier * 100) / 100;

  // Calculate confidence (simplified)
  // Lower volatility and clear patterns increase confidence
  let confidence = 70; // Base confidence

  if (volatility < 1) confidence += 10;
  if (volatility > 2) confidence -= 10;

  if (streaks.length > 0) confidence += 5;

  // Ensure confidence is within bounds
  confidence = Math.max(0, Math.min(100, confidence));

  return {
    predictedMultiplier,
    confidence,
    patterns: {
      streaks,
      volatility,
      trend
    }
  };
}
