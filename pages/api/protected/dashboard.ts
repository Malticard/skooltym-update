import { NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';

export default requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // This is a protected endpoint that requires authentication
        // You can access req.user which contains the authenticated user's info
        
        const dashboardData = {
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                school: req.user.school
            },
            stats: {
                totalStudents: 1250,
                activeStaff: 45,
                todayAttendance: 98.5,
                pendingTasks: 12
            },
            recentActivity: [
                { type: 'student_checkin', message: 'John Doe checked in', timestamp: new Date().toISOString() },
                { type: 'payment', message: 'Payment received from Jane Smith', timestamp: new Date().toISOString() },
                { type: 'staff_overtime', message: 'Overtime approved for Mike Johnson', timestamp: new Date().toISOString() }
            ]
        };

        return res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Dashboard endpoint error:', error);
        return res.status(500).json({ 
            message: 'Dashboard data fetch failed',
            code: 'DASHBOARD_ERROR'
        });
    }
});