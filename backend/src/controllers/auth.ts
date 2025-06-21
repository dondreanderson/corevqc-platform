import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role = 'viewer' } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const userId = uuidv4();
  const [user] = await db('users')
    .insert({
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning(['id', 'email', 'firstName', 'lastName', 'role', 'createdAt']);

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(userId);

  // Store refresh token
  await db('refresh_tokens').insert({
    id: uuidv4(),
    userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdAt: new Date()
  });

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await db('users')
    .select('id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive')
    .where({ email })
    .first();

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Store refresh token
  await db('refresh_tokens').insert({
    id: uuidv4(),
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  });

  // Update last login
  await db('users')
    .where({ id: user.id })
    .update({ lastLogin: new Date() });

  logger.info(`User logged in: ${email}`);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  });
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken) {
    await db('refresh_tokens').where({ token: refreshToken }).del();
  }

  logger.info(`User logged out: ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if refresh token exists in database
    const tokenRecord = await db('refresh_tokens')
      .where({ token: refreshToken, userId: decoded.id })
      .first();

    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    // Replace old refresh token
    await db('refresh_tokens')
      .where({ token: refreshToken })
      .update({
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await db('users')
    .select('id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'lastLogin')
    .where({ id: req.user!.id })
    .first();

  res.json({
    success: true,
    data: { user }
  });
});
