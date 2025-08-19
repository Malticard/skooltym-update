import { NextApiRequest, NextApiResponse } from 'next';
import { AuthTokenManager, UserPayload, sessionManager } from '@/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Test user payload
        const testUser: UserPayload = {
            id: 'test-123',
            email: 'test@example.com',
            role: 'admin',
            school: 'Test School'
        };

        // Test token generation
        const accessToken = AuthTokenManager.createAccessToken(testUser);
        const refreshToken = AuthTokenManager.createRefreshToken(testUser);

        // Test token verification
        const verifiedUser = AuthTokenManager.verifyAccessToken(accessToken);
        const verifiedRefresh = AuthTokenManager.verifyRefreshToken(refreshToken);

        // Test session creation
        const mockUser = {
            id: testUser.id,
            staff_email: testUser.email,
            fname: 'Test',
            lname: 'User',
            contact: 1234567890,
            profile_pic: '',
            role: testUser.role || 'user',
            school: testUser.school || '',
            school_badge: '',
            schoolName: testUser.school || '',
            schoolEmail: '',
            isNewUser: false,
            _token: accessToken,
            isDeleted: false
        };

        const sessionId = sessionManager.createSession(mockUser);
        const sessionData = sessionManager.getSession(sessionId);

        // Set auth cookies for testing
        AuthTokenManager.setAuthCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            message: 'Authentication system test successful',
            results: {
                tokenGeneration: !!accessToken && !!refreshToken,
                accessTokenVerification: !!verifiedUser,
                refreshTokenVerification: !!verifiedRefresh,
                sessionCreation: !!sessionId,
                sessionRetrieval: !!sessionData,
                cookiesSet: true
            },
            testData: {
                user: verifiedUser,
                sessionId,
                sessionData: sessionData ? {
                    userId: sessionData.userId,
                    email: sessionData.email,
                    role: sessionData.role,
                    lastActivity: new Date(sessionData.lastActivity).toISOString(),
                    createdAt: new Date(sessionData.createdAt).toISOString()
                } : null
            }
        });

    } catch (error) {
        console.error('Authentication test error:', error);
        return res.status(500).json({ 
            message: 'Authentication test failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}