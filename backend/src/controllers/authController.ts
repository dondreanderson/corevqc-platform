import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthUtils } from '../utils/auth';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, organizationName } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(400).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
        return;
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(password);

      // Create organization and user in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create organization
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
            description: `${organizationName} - Construction Quality Control`
          }
        });

        // Create user as admin of the organization
        const user = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: 'ADMIN', // First user is admin
            organizationId: organization.id
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            organizationId: true,
            createdAt: true
          }
        });

        return { organization, user };
      });

      // Generate tokens
      const tokenPayload = {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        organizationId: result.user.organizationId
      };

      const accessToken = AuthUtils.generateAccessToken(tokenPayload);
      const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      res.status(201).json({
        message: 'Registration successful',
        user: result.user,
        organization: result.organization,
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (err) {
      const error = err as Error;
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: 'Internal server error'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user with organization details
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });

      if (!user) {
        res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          error: 'Account deactivated',
          message: 'Your account has been deactivated. Please contact your administrator.'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await AuthUtils.comparePassword(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
        return;
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      };

      const accessToken = AuthUtils.generateAccessToken(tokenPayload);
      const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({
        message: 'Login successful',
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (err) {
      const error = err as Error;
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'Internal server error'
      });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token required'
        });
        return;
      }

      try {
        const payload = AuthUtils.verifyRefreshToken(refreshToken);
        
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
            error: 'Invalid refresh token'
          });
          return;
        }

        // Generate new tokens
        const newTokenPayload = {
          userId: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        };

        const newAccessToken = AuthUtils.generateAccessToken(newTokenPayload);
        const newRefreshToken = AuthUtils.generateRefreshToken(newTokenPayload);

        res.json({
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        });

      } catch (jwtError) {
        res.status(401).json({
          error: 'Invalid refresh token'
        });
        return;
      }

    } catch (err) {
      const error = err as Error;
      console.error('Token refresh error:', error);
      res.status(500).json({
        error: 'Token refresh failed',
        message: 'Internal server error'
      });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          organization: true
        }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }

      res.json({
        user
      });

    } catch (err) {
      const error = err as Error;
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to get profile',
        message: 'Internal server error'
      });
    }
  }
}
