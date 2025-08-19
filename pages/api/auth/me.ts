import { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest, sessionManager } from '@/middleware/auth';

export default requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const sessionId = req.headers['x-session-id'] as string;
        let sessionInfo = null;

        if (sessionId) {
            const sessionData = sessionManager.getSession(sessionId);
            if (sessionData) {
                sessionInfo = {
                    sessionId,
                    lastActivity: sessionData.lastActivity,
                    createdAt: sessionData.createdAt
                };
            }
        }

        return res.status(200).json({
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                school: req.user.school
            },
            session: sessionInfo
        });

    } catch (error) {
        console.error('Get user info error:', error);
        return res.status(500).json({ 
            message: 'Failed to get user information',
            code: 'USER_INFO_ERROR'
        });
    }
});