import { supabase } from './supabase';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
}

/**
 * Sign up a new user
 */
export async function signUp({ email, password, name }: UserRegistration) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

/**
 * Sign in an existing user
 */
export async function signIn({ email, password }: UserCredentials) {
  try {
    console.log('Signing in with Supabase:', { email });

    // Check if Supabase is properly initialized
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // First, sign out to clear any existing sessions
    await supabase.auth.signOut();

    // Then sign in with the provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    if (!data.user || !data.session) {
      console.error('No user or session returned from Supabase');
      throw new Error('Authentication failed. Please try again.');
    }

    // Explicitly set the session in the browser
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    });

    // Verify the session was set
    const { data: sessionCheck } = await supabase.auth.getSession();
    console.log('Session verification:', !!sessionCheck.session);

    console.log('Sign in successful, user:', data.user.id);
    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current user session
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}
