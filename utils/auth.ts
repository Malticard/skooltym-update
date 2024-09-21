import { NextApiRequest, NextApiResponse } from 'next';
import { sign, verify } from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET_KEY || '02_5k001tym_3202';
const JWT_EXPIRES_IN = '1h';
const COOKIE_NAME = 'auth_token';

interface UserPayload {
    id: string;
    email: string;
}

export function createToken(user: UserPayload): string {
    return sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
    try {
        console.log(JWT_SECRET)
        return verify(token, JWT_SECRET);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function setTokenCookie(res: NextApiResponse, token: string): void {
    const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res: NextApiResponse): void {
    const cookie = serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromServerSideProps(req: NextApiRequest): string | null {
    const cookies = parse(req.headers.cookie || '');
    return cookies[COOKIE_NAME] || null;
}

export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse, user: UserPayload) => Promise<void>) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const token = getTokenFromServerSideProps(req);

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const user = verifyToken(token);

        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        return handler(req, res, user);
    };
}