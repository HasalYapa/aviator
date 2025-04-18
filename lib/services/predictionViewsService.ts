import { supabase } from '../supabase';

export interface PredictionView {
  id: number;
  user_id: string;
  prediction_id: number;
  viewed_at: string;
}

/**
 * Record a prediction view
 */
export async function recordPredictionView(prediction_id: number): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('prediction_views')
      .insert([{
        user_id: user.user.id,
        prediction_id
      }]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error recording prediction view:', error);
    return false;
  }
}

/**
 * Get user's viewed predictions
 */
export async function getUserViewedPredictions(limit: number = 50): Promise<PredictionView[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('prediction_views')
      .select(`
        *,
        predictions:prediction_id (
          id,
          predicted_multiplier,
          confidence,
          result_status
        )
      `)
      .eq('user_id', user.user.id)
      .order('viewed_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user viewed predictions:', error);
    return [];
  }
}
