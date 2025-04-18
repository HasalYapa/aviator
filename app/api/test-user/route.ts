import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a test route to create a user for debugging purposes
// In production, you would remove this route
export async function GET() {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check connection to Supabase
    const { data: connectionTest, error: connectionError } = await supabase.from('rounds').select('count');
    
    if (connectionError) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to Supabase', 
          details: connectionError,
          credentials: {
            url: supabaseUrl ? 'Set' : 'Not set',
            key: supabaseKey ? 'Set' : 'Not set'
          }
        },
        { status: 500 }
      );
    }
    
    // Return success with environment info
    return NextResponse.json({
      message: 'Supabase connection successful',
      environment: process.env.NODE_ENV,
      connectionTest,
      credentials: {
        url: supabaseUrl ? 'Set' : 'Not set',
        key: supabaseKey ? 'Set' : 'Not set'
      }
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
