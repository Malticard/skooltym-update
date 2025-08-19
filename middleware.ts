import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY || '02_5k001tym_3202');

// Routes that require authentication
const protectedRoutes = [

    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/staff',
    '/students',
    '/payments',
    '/reports'
];

// Routes that are only accessible when NOT authenticated (login, register, etc.)
const authRoutes = [
    '/auth/signin',
    '/auth/forgot-password',
    '/auth/reset-password'
];
async function isValidToken(token: string): Promise<{ valid: boolean; expired: boolean }> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return { valid: true, expired: false };
    } catch (error: any) {
        const isExpired = error.code === 'ERR_JWT_EXPIRED' || error.message.includes('exp');
        return { valid: false, expired: isExpired };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies
    const accessToken = request.cookies.get('auth_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    let tokenStatus = { valid: false, expired: false };
    if (accessToken) {
        tokenStatus = await isValidToken(accessToken);
    }

    const isAuthenticated = tokenStatus.valid;

    // Handle protected routes (especially /dashboard/*)
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            // Redirect to login with return URL
            const loginUrl = new URL('/auth/signin', request.url);
            loginUrl.searchParams.set('redirect', pathname);

            // Add additional query params if they exist
            if (request.nextUrl.search) {
                loginUrl.searchParams.set('returnParams', request.nextUrl.search);
            }

            return NextResponse.redirect(loginUrl);
        }
    }

    // Handle root route (/)
    if (pathname === '/') {
        if (isAuthenticated) {
            // Redirect authenticated users to dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            // Redirect unauthenticated users to signin
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }
    }

    // Handle auth routes (redirect if already authenticated)
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Handle token refresh for API routes
    if (pathname.startsWith('/api/') && !isAuthenticated && refreshToken) {
        // Add header to indicate token should be refreshed
        const response = NextResponse.next();
        response.headers.set('X-Refresh-Token', 'true');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (authentication endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)  
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};