import { supabase } from '../supabase';

export interface Notification {
  id: number;
  user_id: string;
  message: string;
  triggered_at: string;
  read: boolean;
}

/**
 * Get notifications for the current user
 */
export async function getUserNotifications(limit: number = 10): Promise<Notification[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .order('triggered_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
}

/**
 * Add a new notification
 */
export async function addNotification(message: string): Promise<Notification | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: user.user.id,
        message,
        read: false
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding notification:', error);
    return null;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.user.id)
      .eq('read', false);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

/**
 * Subscribe to new notifications
 */
export function subscribeToNotifications(callback: (payload: any) => void) {
  return supabase
    .channel('notifications-channel')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, callback)
    .subscribe();
}
