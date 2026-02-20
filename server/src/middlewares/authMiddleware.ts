import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    admin?: {
        adminId: string;
        email: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as {
            adminId: string;
            email: string;
        };

        req.admin = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
