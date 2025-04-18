import { supabase } from '../supabase';

export interface Prediction {
  id: number;
  round_id?: number | null;
  predicted_multiplier: number;
  confidence: number;
  prediction_time: string;
  result_status: 'pending' | 'success' | 'fail';
  inserted_by?: string | null;
}

/**
 * Get recent predictions
 */
export async function getRecentPredictions(limit: number = 10): Promise<Prediction[]> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('prediction_time', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent predictions:', error);
    return [];
  }
}

/**
 * Get predictions with their associated rounds
 */
export async function getPredictionsWithRounds(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        rounds:round_id (
          id,
          multiplier,
          timestamp
        )
      `)
      .order('prediction_time', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching predictions with rounds:', error);
    return [];
  }
}

/**
 * Add a new prediction
 */
export async function addPrediction(prediction: Omit<Prediction, 'id' | 'prediction_time'>): Promise<Prediction | null> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .insert([prediction])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding prediction:', error);
    return null;
  }
}

/**
 * Update prediction status
 */
export async function updatePredictionStatus(id: number, status: 'pending' | 'success' | 'fail'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('predictions')
      .update({ result_status: status })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating prediction status:', error);
    return false;
  }
}

/**
 * Subscribe to new predictions
 */
export function subscribeToPredictions(callback: (payload: any) => void) {
  return supabase
    .channel('predictions-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'predictions' }, callback)
    .subscribe();
}
