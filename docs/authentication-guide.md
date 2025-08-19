# JWT Token and Session Management Guide

This guide explains how to use the JWT token and session management middleware in the Skooltym application.

## Overview

The authentication system provides:
- JWT token-based authentication with access and refresh tokens
- HTTP-only cookie management for secure token storage
- Session management with automatic cleanup
- Role-based access control
- Automatic token refresh
- Route protection via Next.js middleware

## Architecture

### Components

1. **Auth Middleware** (`middleware/auth.ts`)
   - Token generation and validation
   - Session management
   - Cookie handling
   - Route protection decorators

2. **Next.js Middleware** (`middleware.ts`)
   - Automatic route protection
   - Token refresh handling
   - Redirect management

3. **API Routes**
   - Authentication endpoints (`pages/api/auth/`)
   - Protected route examples (`pages/api/protected/`)
   - Public routes with optional auth (`pages/api/public/`)

## Environment Variables

Add these to your `.env.local` file:

```env
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
Login with credentials and get JWT tokens.

**Request:**
```json
{
  "staff_email": "user@example.com",
  "staff_password": "password123",
  "remember_me": false
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "teacher",
    "school": "ABC School"
  },
  "sessionId": "session_123"
}
```

#### POST `/api/auth/logout`
Logout and clear tokens.

**Headers:**
```
X-Session-ID: session_123
```

**Request:**
```json
{
  "logoutAll": false
}
```

#### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Response:**
```json
{
  "message": "Tokens refreshed successfully",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "teacher"
  }
}
```

#### GET `/api/auth/me`
Get current user information.

**Headers:**
```
X-Session-ID: session_123 (optional)
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "role": "teacher",
    "school": "ABC School"
  },
  "session": {
    "sessionId": "session_123",
    "lastActivity": 1640995200000,
    "createdAt": 1640991600000
  }
}
```

#### GET/DELETE `/api/auth/sessions`
Manage user sessions.

**GET Response:**
```json
{
  "sessions": [
    {
      "userId": "123",
      "email": "user@example.com",
      "role": "teacher",
      "lastActivity": 1640995200000,
      "createdAt": 1640991600000
    }
  ],
  "count": 1
}
```

## Middleware Usage

### Basic Authentication

```typescript
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

export default requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // req.user contains authenticated user info
    console.log(req.user.id, req.user.email, req.user.role);
    
    return res.json({ message: 'Protected endpoint accessed' });
});
```

### Role-Based Access Control

```typescript
import { requireRoles, AuthenticatedRequest } from '@/middleware/auth';

export default requireRoles(['admin', 'super_admin'])(
    async (req: AuthenticatedRequest, res: NextApiResponse) => {
        // Only admin or super_admin can access this
        return res.json({ message: 'Admin area' });
    }
);
```

### Session Management

```typescript
import { withSession, AuthenticatedRequest, SessionData } from '@/middleware/auth';

export default withSession(async (
    req: AuthenticatedRequest & { sessionData: SessionData }, 
    res: NextApiResponse
) => {
    // Access both user info and session data
    console.log(req.user.id);
    console.log(req.sessionData.lastActivity);
    
    return res.json({ message: 'Session-aware endpoint' });
});
```

### Optional Authentication

```typescript
import { optionalAuth, UserPayload } from '@/middleware/auth';

export default optionalAuth(async (
    req: NextApiRequest & { user?: UserPayload }, 
    res: NextApiResponse
) => {
    if (req.user) {
        // User is authenticated
        return res.json({ message: 'Welcome back!', user: req.user });
    } else {
        // Public access
        return res.json({ message: 'Public content' });
    }
});
```

## Frontend Integration

### Making Authenticated Requests

The tokens are stored in HTTP-only cookies, so they're automatically included in requests:

```javascript
// Regular fetch request - cookies are automatically included
const response = await fetch('/api/protected/dashboard', {
    method: 'GET',
    credentials: 'include', // Important for cookies
    headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId // Optional for session management
    }
});
```

### Login Flow

```javascript
const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            staff_email: email,
            staff_password: password
        })
    });

    if (response.ok) {
        const data = await response.json();
        // Store session ID if needed
        localStorage.setItem('sessionId', data.sessionId);
        return data;
    }
    
    throw new Error('Login failed');
};
```

### Logout Flow

```javascript
const logout = async (logoutAll = false) => {
    const sessionId = localStorage.getItem('sessionId');
    
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': sessionId
        },
        body: JSON.stringify({ logoutAll })
    });

    if (response.ok) {
        localStorage.removeItem('sessionId');
        // Redirect to login page
        window.location.href = '/auth/signin';
    }
};
```

### Auto Token Refresh

Tokens are automatically refreshed via the middleware. Handle 401 responses:

```javascript
const apiCall = async (url, options = {}) => {
    let response = await fetch(url, {
        ...options,
        credentials: 'include'
    });

    if (response.status === 401) {
        // Try to refresh tokens
        const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (refreshResponse.ok) {
            // Retry original request
            response = await fetch(url, {
                ...options,
                credentials: 'include'
            });
        } else {
            // Refresh failed, redirect to login
            window.location.href = '/auth/signin';
            return;
        }
    }

    return response;
};
```

## Route Protection

The Next.js middleware automatically protects routes based on configuration:

### Protected Routes (require authentication)
- `/dashboard/*`
- `/admin/*`
- `/profile/*`
- `/settings/*`
- `/staff/*`
- `/students/*`
- `/payments/*`
- `/reports/*`

### Auth Routes (redirect if authenticated)
- `/auth/signin`
- `/auth/signup`
- `/auth/forgot-password`
- `/auth/reset-password`

### Protected API Routes
- `/api/protected/*`
- `/api/dashboard/*`
- `/api/staff/*`
- `/api/students/*`
- `/api/payments/*`

## Security Features

1. **HTTP-Only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **Secure Cookies**: Cookies are marked secure in production
3. **SameSite Protection**: Cookies use SameSite=strict for CSRF protection
4. **Token Expiration**: Access tokens have short expiry (1 hour), refresh tokens longer (7 days)
5. **Automatic Cleanup**: Expired sessions are automatically cleaned up
6. **Role-Based Access**: Fine-grained permission control

## Error Handling

The system returns standardized error codes:

- `MISSING_TOKEN`: Access token not provided
- `INVALID_TOKEN`: Token is invalid or expired
- `MISSING_REFRESH_TOKEN`: Refresh token not provided
- `INVALID_REFRESH_TOKEN`: Refresh token is invalid
- `INSUFFICIENT_PERMISSIONS`: User doesn't have required role
- `SESSION_MISMATCH`: Session doesn't belong to user
- `INVALID_SESSION`: Session is invalid or expired

## Session Management

Sessions provide additional tracking beyond JWT tokens:

- Track user activity and session duration
- Support for multiple concurrent sessions
- Ability to logout from all devices
- Session cleanup on inactivity

### Session Headers

Include session ID in requests for session-aware endpoints:

```
X-Session-ID: session_123
```

## Best Practices

1. Always use HTTPS in production
2. Set strong JWT secrets (use crypto.randomBytes(64).toString('hex'))
3. Keep access token expiry short (1 hour or less)
4. Implement proper error handling on the frontend
5. Use session management for sensitive operations
6. Regularly clean up expired sessions
7. Monitor authentication failures and implement rate limiting
8. Use role-based access control for different permission levels

## Migration from Existing Auth

If you have existing authentication, you can gradually migrate:

1. Keep existing auth system running
2. Update login endpoints to also create new JWT tokens
3. Update protected routes to accept both old and new auth
4. Gradually move endpoints to new middleware
5. Remove old auth system once migration is complete

## Testing

Use the provided example routes to test the authentication system:

1. **Login**: POST to `/api/auth/login`
2. **Access Protected**: GET `/api/protected/dashboard`
3. **Admin Only**: GET `/api/protected/admin-only`
4. **With Session**: GET `/api/protected/with-session`
5. **Optional Auth**: GET `/api/public/optional-auth`

Remember to include appropriate headers and handle responses correctly.