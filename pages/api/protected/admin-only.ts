import { NextApiResponse } from 'next';
import { requireRoles, AuthenticatedRequest } from '@/middleware/auth';

export default requireRoles(['admin', 'super_admin'])(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // This is an admin-only endpoint
        return res.status(200).json({
            message: 'Welcome to the admin area!',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            },
            adminData: {
                totalUsers: 150,
                totalSchools: 5,
                systemStatus: 'operational'
            }
        });

    } catch (error) {
        console.error('Admin endpoint error:', error);
        return res.status(500).json({ 
            message: 'Admin endpoint failed',
            code: 'ADMIN_ERROR'
        });
    }
});