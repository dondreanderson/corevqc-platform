import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token'
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          organizationId: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        res.status(401).json({
          error: 'User not found',
          message: 'User account not found or deactivated'
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      };

      next();

    } catch (jwtError) {
      console.log('❌ Invalid token:', jwtError);
      res.status(401).json({
        error: 'Invalid token',
        message: 'Token is expired or invalid'
      });
      return;
    }

  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error'
    });
    return;
  }
};
