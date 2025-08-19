import { NextApiRequest, NextApiResponse } from 'next';
import { AuthTokenManager, UserPayload } from '@/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { refreshToken } = AuthTokenManager.getTokensFromRequest(req);

        if (!refreshToken) {
            return res.status(401).json({ 
                message: 'Refresh token required',
                code: 'MISSING_REFRESH_TOKEN'
            });
        }

        const refreshPayload = AuthTokenManager.verifyRefreshToken(refreshToken);
        if (!refreshPayload) {
            AuthTokenManager.clearAuthCookies(res);
            return res.status(401).json({ 
                message: 'Invalid refresh token',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }

        // In a real application, you would fetch the user data from your database
        // using refreshPayload.id to ensure the user still exists and is active
        // For now, we'll create a basic user payload
        // You should replace this with your actual user fetching logic
        const user: UserPayload = { 
            id: refreshPayload.id, 
            email: '', // Fetch from DB
            role: '',  // Fetch from DB
            school: '' // Fetch from DB
        };

        // Generate new tokens
        const newAccessToken = AuthTokenManager.createAccessToken(user);
        const newRefreshToken = AuthTokenManager.createRefreshToken(user);

        // Set new cookies
        AuthTokenManager.setAuthCookies(res, newAccessToken, newRefreshToken);

        return res.status(200).json({ 
            message: 'Tokens refreshed successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        AuthTokenManager.clearAuthCookies(res);
        return res.status(500).json({ 
            message: 'Token refresh failed',
            code: 'REFRESH_ERROR'
        });
    }
}