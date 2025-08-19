import { NextApiResponse } from 'next';
import { withSession, AuthenticatedRequest, SessionData } from '@/middleware/auth';

export default withSession(async (req: AuthenticatedRequest & { sessionData: SessionData }, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // This endpoint requires both authentication and session management
        // You can access both req.user and req.sessionData
        
        return res.status(200).json({
            message: 'Session-aware endpoint accessed successfully',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            },
            session: {
                userId: req.sessionData.userId,
                email: req.sessionData.email,
                role: req.sessionData.role,
                school: req.sessionData.school,
                lastActivity: new Date(req.sessionData.lastActivity).toISOString(),
                createdAt: new Date(req.sessionData.createdAt).toISOString(),
                sessionDuration: Date.now() - req.sessionData.createdAt
            },
            data: {
                message: 'This data is only available with active session management'
            }
        });

    } catch (error) {
        console.error('Session endpoint error:', error);
        return res.status(500).json({ 
            message: 'Session endpoint failed',
            code: 'SESSION_ENDPOINT_ERROR'
        });
    }
});