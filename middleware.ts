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
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware auth error:', error);
      // If there's an error getting the session, treat as not authenticated
      return res;
    }

    const session = data.session;

    // Check if the user is authenticated
    const isAuthenticated = !!session;

    // Get the pathname from the URL
    const { pathname } = req.nextUrl;

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/admin'];

    // Define authentication routes
    const authRoutes = ['/login', '/register', '/forgot-password'];

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Check if the route is an auth route
    const isAuthRoute = authRoutes.some(route => pathname === route);

    // Add debugging headers (these won't be visible to users but will be in the response)
    res.headers.set('x-middleware-cache', 'no-cache');
    res.headers.set('x-is-authenticated', isAuthenticated.toString());
    res.headers.set('x-is-protected-route', isProtectedRoute.toString());
    res.headers.set('x-is-auth-route', isAuthRoute.toString());

    // If the route is protected and the user is not authenticated, redirect to login
    if (isProtectedRoute && !isAuthenticated) {
      console.log('Middleware: Redirecting unauthenticated user from protected route to login');
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If the user is authenticated and trying to access an auth route, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      console.log('Middleware: Redirecting authenticated user from auth route to dashboard');
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // For all other cases, continue with the request
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
