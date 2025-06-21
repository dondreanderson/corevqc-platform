import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
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
        message: 'Please provide a valid access token' 
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const payload = AuthUtils.verifyAccessToken(token);
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
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
          error: 'Invalid token',
          message: 'User not found or inactive' 
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
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token is expired or invalid' 
      });
      return;
    }
  } catch (err) {
    const error = err as Error;
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error' 
    });
    return;
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `Requires one of: ${roles.join(', ')}` 
      });
      return;
    }

    next();
  };
};
