import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from './auth';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Get team members
router.get('/members', authenticateToken, [
  query('projectId').optional().isString(),
  query('role').optional().isIn(['MANAGER', 'SUPERVISOR', 'INSPECTOR', 'MEMBER']),
  query('status').optional().isIn(['active', 'inactive', 'pending']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, role, status, search } = req.query;

    let where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      if (status === 'active') {
        where.isActive = true;
      } else if (status === 'inactive') {
        where.isActive = false;
      }
      // For 'pending', we'll handle this differently based on project membership
    }

    let include: any = {
      organization: {
        select: { id: true, name: true }
      }
    };

    // If filtering by project, include project member info
    if (projectId) {
      include.projectMemberships = {
        where: { projectId: projectId as string },
        select: {
          id: true,
          role: true,
          joinedAt: true
        }
      };

      if (role) {
        include.projectMemberships.where.role = role as string;
      }
    }

   const users = await prisma.user.findMany({
  where,
  include: {
    organization: {
      select: { id: true, name: true }
    },
    projectMemberships: projectId ? {
      where: { projectId: projectId as string },
      select: {
        id: true,
        role: true,
        joinedAt: true
      }
    } : true
  },
  orderBy: { createdAt: 'desc' }
});

    // Transform the data to match frontend expectations
    const teamMembers = users.map(user => ({
  id: user.id,
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  role: projectId && user.projectMemberships.length > 0 
    ? (user.projectMemberships[0] as any).role 
    : user.role,
  company: (user.organization as any)?.name || 'No Organization',
  status: user.isActive ? 'active' : 'inactive',
  joinedAt: projectId && user.projectMemberships.length > 0 
    ? (user.projectMemberships[0] as any).joinedAt 
    : user.createdAt,
  lastActive: user.lastLoginAt
}));

    res.json({
      success: true,
      data: teamMembers
    });

  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Add team member to project
router.post('/members', authenticateToken, [
  body('userId').isString().notEmpty(),
  body('projectId').isString().notEmpty(),
  body('role').isIn(['MANAGER', 'SUPERVISOR', 'INSPECTOR', 'MEMBER'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, projectId, role } = req.body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if membership already exists
    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });

    if (existingMembership) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    // Create project membership
    const membership = await prisma.projectMember.create({
      data: {
        userId,
        projectId,
        role: role || 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: membership
    });

  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// Update team member role
router.put('/members/:membershipId', authenticateToken, [
  body('role').isIn(['MANAGER', 'SUPERVISOR', 'INSPECTOR', 'MEMBER'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { membershipId } = req.params;
    const { role } = req.body;

    const membership = await prisma.projectMember.update({
      where: { id: membershipId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Team member role updated successfully',
      data: membership
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Remove team member from project
router.delete('/members/:membershipId', authenticateToken, async (req, res) => {
  try {
    const { membershipId } = req.params;

    await prisma.projectMember.delete({
      where: { id: membershipId }
    });

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});

// Get team statistics
router.get('/stats', authenticateToken, [
  query('projectId').optional().isString()
], async (req, res) => {
  try {
    const { projectId } = req.query;

    let where: any = {};
    if (projectId) {
      where.projectMemberships = {
        some: { projectId: projectId as string }
      };
    }

    const [
      totalMembers,
      activeMembers,
      managers,
      supervisors,
      inspectors,
      members
    ] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...where, isActive: true } }),
      projectId 
        ? prisma.projectMember.count({ where: { projectId: projectId as string, role: 'MANAGER' } })
        : prisma.user.count({ where: { ...where, role: 'MANAGER' } }),
      projectId
        ? prisma.projectMember.count({ where: { projectId: projectId as string, role: 'SUPERVISOR' } })
        : prisma.user.count({ where: { ...where, role: 'USER' } }),
      projectId
        ? prisma.projectMember.count({ where: { projectId: projectId as string, role: 'INSPECTOR' } })
        : prisma.user.count({ where: { ...where, role: 'USER' } }),
      projectId
        ? prisma.projectMember.count({ where: { projectId: projectId as string, role: 'MEMBER' } })
        : prisma.user.count({ where: { ...where, role: 'USER' } })
    ]);

    const stats = {
      totalMembers,
      activeMembers,
      pendingMembers: totalMembers - activeMembers,
      roleDistribution: {
        MANAGER: managers,
        SUPERVISOR: supervisors,
        INSPECTOR: inspectors,
        MEMBER: members
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
});

export { router as teamRouter };