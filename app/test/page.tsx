'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    async function checkSupabase() {
      try {
        // Check if Supabase URL and key are set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        setDetails({
          supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
          supabaseKey: supabaseKey ? 'Set' : 'Not set',
        });
        
        if (!supabaseUrl || !supabaseKey) {
          setStatus('error');
          setMessage('Supabase credentials are not configured');
          return;
        }
        
        // Test connection to Supabase
        const { data, error } = await supabase.from('rounds').select('count');
        
        if (error) {
          setStatus('error');
          setMessage('Failed to connect to Supabase');
          setDetails(prev => ({ ...prev, error }));
          return;
        }
        
        // Also test the API route
        const apiResponse = await fetch('/api/test-user');
        const apiData = await apiResponse.json();
        
        setStatus('success');
        setMessage('Supabase connection successful');
        setDetails(prev => ({ 
          ...prev, 
          data,
          apiResponse: apiData
        }));
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while testing Supabase connection');
        setDetails(prev => ({ ...prev, error }));
      }
    }
    
    checkSupabase();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          Supabase Connection Test
        </h1>
        
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md">
            <p className="font-medium">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
            <p className="font-medium">{message}</p>
          </div>
        )}
        
        {details && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Details</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <a 
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
