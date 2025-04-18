import { GameData } from './predictionEngine';

/**
 * Generate random multiplier with realistic distribution
 * Most values will be between 1.0 and 3.0, with occasional higher values
 */
function generateRandomMultiplier(): number {
  // Base value between 1.0 and 2.0 (common range)
  let multiplier = 1.0 + Math.random();
  
  // 30% chance to add more to get into 2.0-3.0 range
  if (Math.random() < 0.3) {
    multiplier += Math.random();
  }
  
  // 10% chance to get a higher value (3.0-10.0)
  if (Math.random() < 0.1) {
    multiplier += Math.random() * 7;
  }
  
  // 2% chance to get a very high value (10.0-20.0)
  if (Math.random() < 0.02) {
    multiplier += 10 + Math.random() * 10;
  }
  
  // Round to 2 decimal places
  return Math.round(multiplier * 100) / 100;
}

/**
 * Generate mock historical game data
 */
export function generateMockHistoricalData(count: number = 100): GameData[] {
  const now = Date.now();
  const data: GameData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Games are roughly 30 seconds apart
    const timestamp = now - (count - i) * 30000;
    
    data.push({
      id: `game-${i}`,
      timestamp,
      multiplier: generateRandomMultiplier()
    });
  }
  
  return data;
}

/**
 * Generate a new game result
 */
export function generateNewGameResult(previousData: GameData[]): GameData {
  const lastGame = previousData[previousData.length - 1];
  
  return {
    id: `game-${parseInt(lastGame.id.split('-')[1]) + 1}`,
    timestamp: Date.now(),
    multiplier: generateRandomMultiplier()
  };
}

/**
 * Get mock data for a specific time period
 */
export function getMockDataForPeriod(period: '5m' | '15m' | '1h' | '24h'): GameData[] {
  const allData = generateMockHistoricalData(500);
  const now = Date.now();
  
  let timeThreshold: number;
  
  switch (period) {
    case '5m':
      timeThreshold = now - 5 * 60 * 1000;
      break;
    case '15m':
      timeThreshold = now - 15 * 60 * 1000;
      break;
    case '1h':
      timeThreshold = now - 60 * 60 * 1000;
      break;
    case '24h':
      timeThreshold = now - 24 * 60 * 60 * 1000;
      break;
  }
  
  return allData.filter(game => game.timestamp >= timeThreshold);
}
