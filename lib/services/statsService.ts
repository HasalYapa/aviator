import { supabase } from '../supabase';

export interface UserStats {
  id: number;
  user_id: string;
  correct_predictions: number;
  total_predictions: number;
  last_updated: string;
}

/**
 * Get stats for the current user
 */
export async function getUserStats(): Promise<UserStats | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error) {
      // If no stats found, create a new entry
      if (error.code === 'PGRST116') {
        return createUserStats(user.user.id);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

/**
 * Create initial stats for a user
 */
export async function createUserStats(userId: string): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from('stats')
      .insert([{
        user_id: userId,
        correct_predictions: 0,
        total_predictions: 0
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user stats:', error);
    return null;
  }
}

/**
 * Update user stats
 */
export async function updateUserStats(
  correct_predictions: number,
  total_predictions: number
): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('stats')
      .update({
        correct_predictions,
        total_predictions,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', user.user.id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
}

/**
 * Increment prediction counters
 */
export async function incrementPredictionCounters(correct: boolean): Promise<boolean> {
  try {
    const stats = await getUserStats();
    
    if (!stats) {
      return false;
    }
    
    const correct_predictions = correct ? stats.correct_predictions + 1 : stats.correct_predictions;
    const total_predictions = stats.total_predictions + 1;
    
    return updateUserStats(correct_predictions, total_predictions);
  } catch (error) {
    console.error('Error incrementing prediction counters:', error);
    return false;
  }
}
