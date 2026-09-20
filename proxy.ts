import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      const nextResponse = isAuthRoute
        ? NextResponse.redirect(new URL('/profile', request.url))
        : NextResponse.next();

      const setCookie = response.headers['set-cookie'];

      if (setCookie) {
        const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

        cookies.forEach(cookie => {
          nextResponse.headers.append('Set-Cookie', cookie);
        });
      }

      return nextResponse;
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  const isAuthenticated = Boolean(accessToken);

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
