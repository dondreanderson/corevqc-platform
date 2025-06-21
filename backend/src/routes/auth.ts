import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Helper function to generate JWT token
function generateToken(userId: string, email: string, role: string, organizationId: string) {
  return jwt.sign(
    { userId, email, role, organizationId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

// Test route (keep this for debugging)
router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

// FULL REGISTRATION ENDPOINT
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body;

    console.log('📝 Registration request:', { email, firstName, lastName, organizationName });

    // Validation
    if (!email || !password || !firstName || !lastName || !organizationName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'firstName', 'lastName', 'organizationName'],
        received: Object.keys(req.body)
      });
    }

    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password too weak',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create organization and user in transaction
    console.log('🏢 Creating organization and user...');
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName.trim(),
          description: `${organizationName.trim()} - Construction Quality Control`
        }
      });

      console.log('✅ Organization created:', organization.id);

      // Create user as admin
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password: hashedPassword,
          role: 'ADMIN',
          organizationId: organization.id
        }
      });

      console.log('✅ User created:', user.id);

      return { organization, user };
    });

    // Generate JWT token
    const token = generateToken(
      result.user.id,
      result.user.email,
      result.user.role,
      result.user.organizationId
    );

    // Remove password from response
    const { password: _, ...userResponse } = result.user;

    console.log('🎉 Registration successful for:', email);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to COREVQC!',
      user: userResponse,
      organization: result.organization,
      token: token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Export the interface for other files to use
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

// LOGIN ENDPOINT
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user with organization
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: true
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Contact your administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role, user.organizationId);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    console.log('✅ Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful! Welcome back!',
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// GET PROFILE ENDPOINT
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token'
      });
    }

    const token = authHeader.substring(7);

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // Get user with organization
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          organization: true
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User not found',
          message: 'User account not found or deactivated'
        });
      }

      // Remove password from response
      const { password, ...userResponse } = user;

      res.json({
        success: true,
        user: userResponse
      });

    } catch (jwtError) {
      console.log('❌ Invalid token:', jwtError.message);
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is expired or invalid'
      });
    }

  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Internal server error'
    });
  }
});

export default router;
