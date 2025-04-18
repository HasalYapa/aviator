import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Create a response object that we'll modify based on the auth state
  const res = NextResponse.next();

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    // Return the response with the refreshed session cookie
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an unexpected error, just continue with the request
    return res;
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except for static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
