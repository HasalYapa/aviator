import { supabase } from '../supabase';

export interface Round {
  id: number;
  multiplier: number;
  timestamp: string;
  inserted_by?: string | null;
}

/**
 * Get recent rounds
 */
export async function getRecentRounds(limit: number = 100): Promise<Round[]> {
  try {
    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent rounds:', error);
    return [];
  }
}

/**
 * Get rounds for a specific time period
 */
export async function getRoundsForPeriod(period: '5m' | '15m' | '1h' | '24h'): Promise<Round[]> {
  try {
    const now = new Date();
    let timeAgo: Date;

    switch (period) {
      case '5m':
        timeAgo = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case '15m':
        timeAgo = new Date(now.getTime() - 15 * 60 * 1000);
        break;
      case '1h':
        timeAgo = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
    }

    const { data, error } = await supabase
      .from('rounds')
      .select('*')
      .gte('timestamp', timeAgo.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching rounds for period ${period}:`, error);
    return [];
  }
}

/**
 * Add a new round
 */
export async function addRound(multiplier: number): Promise<Round | null> {
  try {
    const { data, error } = await supabase
      .from('rounds')
      .insert([{ multiplier }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding round:', error);
    return null;
  }
}

/**
 * Subscribe to new rounds
 */
export function subscribeToRounds(callback: (payload: any) => void) {
  return supabase
    .channel('rounds-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rounds' }, callback)
    .subscribe();
}
