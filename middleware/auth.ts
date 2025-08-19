import { NextApiRequest, NextApiResponse } from 'next';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { AuthenticatedUserModel } from '@/interfaces/AuthenticatedUserModel';

const JWT_SECRET = process.env.JWT_SECRET_KEY || '02_5k001tym_3202';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

export interface UserPayload {
    id: string;
    email: string;
    role?: string;
    school?: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
    user: UserPayload;
}

export interface SessionData {
    userId: string;
    email: string;
    role: string;
    school: string;
    lastActivity: number;
    createdAt: number;
}

class SessionManager {
    private sessions: Map<string, SessionData> = new Map();
    private readonly SESSION_TIMEOUT = 1000 * 60 * 30; // 30 minutes

    createSession(user: AuthenticatedUserModel): string {
        const sessionId = this.generateSessionId();
        const sessionData: SessionData = {
            userId: user.id,
            email: user.staff_email,
            role: user.role,
            school: user.school,
            lastActivity: Date.now(),
            createdAt: Date.now()
        };

        this.sessions.set(sessionId, sessionData);
        return sessionId;
    }

    getSession(sessionId: string): SessionData | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (this.isSessionExpired(session)) {
            this.sessions.delete(sessionId);
            return null;
        }

        session.lastActivity = Date.now();
        return session;
    }

    refreshSession(sessionId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session || this.isSessionExpired(session)) {
            if (session) this.sessions.delete(sessionId);
            return false;
        }

        session.lastActivity = Date.now();
        return true;
    }

    destroySession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }

    cleanupExpiredSessions(): void {
        const expiredSessions: string[] = [];
        this.sessions.forEach((session, sessionId) => {
            if (this.isSessionExpired(session)) {
                expiredSessions.push(sessionId);
            }
        });

        expiredSessions.forEach(sessionId => {
            this.sessions.delete(sessionId);
        });
    }

    private isSessionExpired(session: SessionData): boolean {
        return Date.now() - session.lastActivity > this.SESSION_TIMEOUT;
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    getAllActiveSessions(userId: string): SessionData[] {
        const sessions: SessionData[] = [];
        this.sessions.forEach((session) => {
            if (session.userId === userId) {
                sessions.push(session);
            }
        });
        return sessions;
    }

    destroyAllUserSessions(userId: string): number {
        let count = 0;
        const sessionIds: string[] = [];

        this.sessions.forEach((session, sessionId) => {
            if (session.userId === userId) {
                sessionIds.push(sessionId);
            }
        });

        sessionIds.forEach(sessionId => {
            this.sessions.delete(sessionId);
            count++;
        });

        return count;
    }
}

export const sessionManager = new SessionManager();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
    sessionManager.cleanupExpiredSessions();
}, 10 * 60 * 1000);

export class AuthTokenManager {
    static createAccessToken(user: UserPayload): string {
        return sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
    }

    static createRefreshToken(user: UserPayload): string {
        return sign({ id: user.id, type: 'refresh' }, JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        } as any);
    }

    static verifyAccessToken(token: string): UserPayload | null {
        try {
            const decoded = verify(token, JWT_SECRET) as JwtPayload;
            if (decoded.type === 'refresh') return null; // Ensure it's not a refresh token
            return decoded as UserPayload;
        } catch (error) {
            return null;
        }
    }

    static verifyRefreshToken(token: string): { id: string } | null {
        try {
            const decoded = verify(token, JWT_SECRET) as JwtPayload;
            if (decoded.type !== 'refresh') return null;
            return { id: decoded.id };
        } catch (error) {
            return null;
        }
    }

    static setAuthCookies(res: NextApiResponse, accessToken: string, refreshToken: string): void {
        const isProduction = process.env.NODE_ENV === 'production';

        // Set access token cookie (shorter expiry)
        const accessCookie = serialize(COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/',
        });

        // Set refresh token cookie (longer expiry)
        const refreshCookie = serialize(REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 3600, // 7 days
            path: '/',
        });

        res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    }

    static clearAuthCookies(res: NextApiResponse): void {
        const isProduction = process.env.NODE_ENV === 'production';

        const clearAccessCookie = serialize(COOKIE_NAME, '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: -1,
            path: '/',
        });

        const clearRefreshCookie = serialize(REFRESH_COOKIE_NAME, '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: -1,
            path: '/',
        });

        res.setHeader('Set-Cookie', [clearAccessCookie, clearRefreshCookie]);
    }

    static getTokensFromRequest(req: NextApiRequest): { accessToken: string | null; refreshToken: string | null } {
        const cookies = parse(req.headers.cookie || '');
        return {
            accessToken: cookies[COOKIE_NAME] || null,
            refreshToken: cookies[REFRESH_COOKIE_NAME] || null
        };
    }
}

export function requireAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const { accessToken, refreshToken } = AuthTokenManager.getTokensFromRequest(req);

            if (!accessToken) {
                return res.status(401).json({
                    message: 'Access token required',
                    code: 'MISSING_TOKEN'
                });
            }

            let user = AuthTokenManager.verifyAccessToken(accessToken);

            // If access token is invalid, try to refresh it
            if (!user && refreshToken) {
                const refreshPayload = AuthTokenManager.verifyRefreshToken(refreshToken);
                if (refreshPayload) {
                    // In a real app, you'd fetch user data from database
                    // For now, we'll create a basic user payload
                    const newUser: UserPayload = { id: refreshPayload.id, email: '' };
                    const newAccessToken = AuthTokenManager.createAccessToken(newUser);
                    const newRefreshToken = AuthTokenManager.createRefreshToken(newUser);

                    AuthTokenManager.setAuthCookies(res, newAccessToken, newRefreshToken);
                    user = newUser;
                }
            }

            if (!user) {
                AuthTokenManager.clearAuthCookies(res);
                return res.status(401).json({
                    message: 'Invalid or expired token',
                    code: 'INVALID_TOKEN'
                });
            }

            // Attach user to request
            (req as AuthenticatedRequest).user = user;

            return handler(req as AuthenticatedRequest, res);
        } catch (error) {
            console.error('Authentication error:', error);
            return res.status(500).json({
                message: 'Authentication service error',
                code: 'AUTH_ERROR'
            });
        }
    };
}

export function optionalAuth(
    handler: (req: NextApiRequest & { user?: UserPayload }, res: NextApiResponse) => Promise<void>
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const { accessToken } = AuthTokenManager.getTokensFromRequest(req);

            if (accessToken) {
                const user = AuthTokenManager.verifyAccessToken(accessToken);
                if (user) {
                    (req as any).user = user;
                }
            }

            return handler(req as NextApiRequest & { user?: UserPayload }, res);
        } catch (error) {
            console.error('Optional auth error:', error);
            return handler(req as NextApiRequest & { user?: UserPayload }, res);
        }
    };
}

export function requireRoles(roles: string[]) {
    return function (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
        return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
            if (!req.user.role || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Insufficient permissions',
                    code: 'INSUFFICIENT_PERMISSIONS',
                    requiredRoles: roles
                });
            }

            return handler(req, res);
        });
    };
}

export function withSession(
    handler: (req: AuthenticatedRequest & { sessionData: SessionData }, res: NextApiResponse) => Promise<void>
) {
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const sessionId = req.headers['x-session-id'] as string;

        if (!sessionId) {
            return res.status(400).json({
                message: 'Session ID required',
                code: 'MISSING_SESSION_ID'
            });
        }

        const sessionData = sessionManager.getSession(sessionId);
        if (!sessionData) {
            return res.status(401).json({
                message: 'Invalid or expired session',
                code: 'INVALID_SESSION'
            });
        }

        // Verify session belongs to authenticated user
        if (sessionData.userId !== req.user.id) {
            return res.status(403).json({
                message: 'Session does not belong to authenticated user',
                code: 'SESSION_MISMATCH'
            });
        }

        (req as any).sessionData = sessionData;
        return handler(req as AuthenticatedRequest & { sessionData: SessionData }, res);
    });
}

export function createAuthResponse(user: AuthenticatedUserModel) {
    const userPayload: UserPayload = {
        id: user.id,
        email: user.staff_email,
        role: user.role,
        school: user.school
    };

    const accessToken = AuthTokenManager.createAccessToken(userPayload);
    const refreshToken = AuthTokenManager.createRefreshToken(userPayload);
    const sessionId = sessionManager.createSession(user);

    return {
        user: {
            id: user.id,
            email: user.staff_email,
            firstName: user.fname,
            lastName: user.lname,
            school_badge: user.school_badge,
            role: user.role,
            school: user.school,
            schoolName: user.schoolName,
            profile_pic: user.profile_pic,
            isNewUser: user.isNewUser
        },
        tokens: {
            accessToken,
            refreshToken,
            sessionId
        }
    };
}