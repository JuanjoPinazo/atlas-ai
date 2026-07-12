import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/auth/callback', '/auth/accept-invite'];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const isDemoRoute = isDemoMode && path.startsWith('/demo-dental');

  const isPublicDemoMode = process.env.VELSORA_DEMO_PUBLIC === 'true';
  const isPublicDemoRoute = isPublicDemoMode && (path === '/' || path.startsWith('/demo-dental/discovery/interview'));

  if (!user && !isPublicRoute && !isDemoRoute && !isPublicDemoRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isPublicRoute && path !== '/auth/callback') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
