import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
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
  
  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the user is authenticated and trying to access an auth route, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except for static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
