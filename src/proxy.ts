import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedPaths = ['/menu', '/qr', '/settings', '/billing', '/upload', '/onboarding', '/languages'];

// Routes that are only accessible when NOT authenticated
const authPaths = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for custom domain routing
  const host = request.headers.get('host') || '';
  const appDomain = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
    : 'localhost:3000';

  // If request is from a custom domain (not our app domain), rewrite to public menu
  if (host !== appDomain && !host.startsWith('localhost')) {
    // Custom domain: look up tenant by domain and rewrite to their public menu
    // We rewrite to an internal API that resolves the domain to a slug
    const url = request.nextUrl.clone();

    // Only rewrite non-API, non-internal paths
    if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
      // Rewrite the request to our domain resolution endpoint
      // The public menu page handles this via query param
      url.pathname = '/api/domains/resolve';
      url.searchParams.set('domain', host);
      url.searchParams.set('path', pathname);

      // Fetch the slug for this domain from our API
      try {
        const resolveUrl = new URL('/api/domains/resolve', request.url);
        resolveUrl.searchParams.set('domain', host);

        const res = await fetch(resolveUrl.toString());
        if (res.ok) {
          const data = await res.json();
          if (data.slug) {
            const rewriteUrl = request.nextUrl.clone();
            rewriteUrl.pathname = `/r/${data.slug}`;
            // Preserve any query params from the original request
            return NextResponse.rewrite(rewriteUrl);
          }
        }
      } catch {
        // Fall through to normal routing if resolution fails
      }
    }
  }

  // Auth check for protected routes
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Check for session token (JWT strategy)
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value;

  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/menu', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (handled separately)
     * - _next (Next.js internals)
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};
