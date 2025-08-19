import { NextApiRequest, NextApiResponse } from 'next';
import { AuthTokenManager, sessionManager, AuthenticatedRequest, requireAuth } from '@/middleware/auth';

export default requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const sessionId = req.headers['x-session-id'] as string;
        const logoutAll = req.body.logoutAll === true;

        // Clear HTTP-only cookies
        AuthTokenManager.clearAuthCookies(res);

        // Handle session cleanup
        if (logoutAll) {
            // Destroy all sessions for this user
            const destroyedCount = sessionManager.destroyAllUserSessions(req.user.id);
            return res.status(200).json({ 
                message: 'Logged out from all devices successfully',
                destroyedSessions: destroyedCount
            });
        } else if (sessionId) {
            // Destroy specific session
            const destroyed = sessionManager.destroySession(sessionId);
            return res.status(200).json({ 
                message: 'Logged out successfully',
                sessionDestroyed: destroyed
            });
        } else {
            // Just clear cookies if no session management
            return res.status(200).json({ 
                message: 'Logged out successfully'
            });
        }

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ 
            message: 'Logout failed',
            code: 'LOGOUT_ERROR'
        });
    }
});