import { NextApiRequest, NextApiResponse } from 'next';
import { optionalAuth, UserPayload } from '@/middleware/auth';

export default optionalAuth(async (req: NextApiRequest & { user?: UserPayload }, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // This is a public endpoint that provides different data based on auth status
        const publicData = {
            message: 'Welcome to our public API',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            publicInfo: 'This information is available to everyone'
        };

        if (req.user) {
            // User is authenticated, provide additional data
            return res.status(200).json({
                ...publicData,
                message: `Welcome back, ${req.user.email}!`,
                authenticatedFeatures: ['Premium Feature 1', 'Premium Feature 2'],
                personalizedData: {
                    userId: req.user.id,
                    role: req.user.role,
                    recommendations: ['Based on your role', 'Personalized content']
                }
            });
        } else {
            // User is not authenticated, provide public data only
            return res.status(200).json({
                ...publicData,
                guestMessage: 'Sign in to access premium features!'
            });
        }

    } catch (error) {
        console.error('Optional auth endpoint error:', error);
        return res.status(500).json({ 
            message: 'Endpoint failed',
            code: 'ENDPOINT_ERROR'
        });
    }
});