import { NextApiRequest, NextApiResponse } from 'next';
import { AuthTokenManager, createAuthResponse } from '@/middleware/auth';
import { AuthenticatedUserModel } from '@/interfaces/AuthenticatedUserModel';
import axios from 'axios';
import AppUrls from '@/utils/apis';

interface LoginRequest {
    staff_contact: string;
    staff_password: string;
    remember_me?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { staff_contact, staff_password, remember_me = false } = req.body as LoginRequest;

        if (!staff_contact || !staff_password) {
            return res.status(400).json({
                message: 'Contact and password are required',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Make request to your backend authentication service
        const response = await axios.post(AppUrls.login, {
            staff_contact,
            staff_password
        });

        if (response.status !== 200 || !response.data) {
            return res.status(401).json({
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const user: AuthenticatedUserModel = response.data;

        // Create authentication response with tokens and session
        const authResponse = createAuthResponse(user);

        // Set HTTP-only cookies
        AuthTokenManager.setAuthCookies(res, authResponse.tokens.accessToken, authResponse.tokens.refreshToken);

        // Return user data and session info (without sensitive tokens)
        return res.status(200).json({
            message: 'Login successful',
            user: authResponse.user,
            sessionId: authResponse.tokens.sessionId
        });

    } catch (error: any) {
        if (error.response?.status === 401) {
            return res.status(401).json({
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        return res.status(500).json({
            message: 'Internal server error',
            code: 'SERVER_ERROR'
        });
    }
}