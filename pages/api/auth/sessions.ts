import { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest, sessionManager } from '@/middleware/auth';

export default requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                // Get all active sessions for the user
                const sessions = sessionManager.getAllActiveSessions(req.user.id);
                const sessionList = sessions.map(session => ({
                    userId: session.userId,
                    email: session.email,
                    role: session.role,
                    lastActivity: session.lastActivity,
                    createdAt: session.createdAt
                }));

                return res.status(200).json({
                    sessions: sessionList,
                    count: sessionList.length
                });

            case 'DELETE':
                // Destroy all sessions for the user (logout from all devices)
                const destroyedCount = sessionManager.destroyAllUserSessions(req.user.id);
                
                return res.status(200).json({
                    message: 'All sessions destroyed successfully',
                    destroyedCount
                });

            default:
                return res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Session management error:', error);
        return res.status(500).json({ 
            message: 'Session management failed',
            code: 'SESSION_ERROR'
        });
    }
});