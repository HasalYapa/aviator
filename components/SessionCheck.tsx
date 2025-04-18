'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SessionCheck() {
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setSessionStatus('unauthenticated');
          redirectToLogin();
          return;
        }
        
        if (!data.session) {
          console.log('No active session found');
          setSessionStatus('unauthenticated');
          redirectToLogin();
          return;
        }
        
        console.log('Active session found for user:', data.session.user.id);
        setSessionStatus('authenticated');
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        setSessionStatus('unauthenticated');
        redirectToLogin();
      }
    }
    
    function redirectToLogin() {
      // Add a small delay before redirecting
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    }
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setSessionStatus('authenticated');
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSessionStatus('unauthenticated');
        redirectToLogin();
      }
    });
    
    return () => {
      // Clean up the listener when the component unmounts
      authListener.subscription.unsubscribe();
    };
  }, []);

  // This component doesn't render anything visible
  // It just performs the session check and redirects if needed
  return null;
}
