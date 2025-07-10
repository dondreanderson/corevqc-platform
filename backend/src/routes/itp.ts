import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from './auth';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Get all ITPs
router.get('/', authenticateToken, [
  query('projectId').optional().isString(),
  query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED']),
  query('inspectionType').optional().isIn(['VISUAL', 'DIMENSIONAL', 'MATERIAL_TEST', 'PERFORMANCE', 'SAFETY']),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, status, inspectionType, search } = req.query;

    let where: any = {};

    if (projectId) {
      where.projectId = projectId as string;
    }

    if (status) {
      where.status = status as string;
    }

    if (inspectionType) {
      where.inspectionType = inspectionType as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { itpNumber: { contains: search as string, mode: 'insensitive' } },
        { phase: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const itps = await prisma.iTP.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true }
        },
        inspector: {
          select: { id: true, firstName: true, lastName: true }
        },
        checkpoints: {
          orderBy: { order: 'asc' }
        },
        photos: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: itps
    });

  } catch (error) {
    console.error('Get ITPs error:', error);
    res.status(500).json({ error: 'Failed to fetch ITPs' });
  }
});

// Create new ITP
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1 }),
  body('projectId').isString().notEmpty(),
  body('inspectorId').isString().notEmpty(),
  body('phase').trim().isLength({ min: 1 }),
  body('activity').trim().isLength({ min: 1 }),
  body('inspectionType').isIn(['VISUAL', 'DIMENSIONAL', 'MATERIAL_TEST', 'PERFORMANCE', 'SAFETY'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      projectId,
      inspectorId,
      phase,
      activity,
      inspectionType,
      scheduledAt,
      location,
      notes,
      requirements,
      holdPoints,
      checkpoints
    } = req.body;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify inspector exists
    const inspector = await prisma.user.findUnique({
      where: { id: inspectorId }
    });

    if (!inspector) {
      return res.status(404).json({ error: 'Inspector not found' });
    }

    // Generate ITP number
    const itpCount = await prisma.iTP.count();
    const itpNumber = `ITP-${String(itpCount + 1).padStart(3, '0')}`;

    // Create ITP with checkpoints
    const itp = await prisma.iTP.create({
      data: {
        itpNumber,
        title: title.trim(),
        description: description?.trim() || null,
        phase: phase.trim(),
        activity: activity.trim(),
        inspectionType,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
         location: location?.trim() || null,
        notes: notes?.trim() || null,
        requirements: requirements || [],
        holdPoints: holdPoints || [],
        projectId,
        inspectorId,
        checkpoints: {
          create: checkpoints?.map((checkpoint: any, index: number) => ({
            description: checkpoint.description,
            order: index,
            status: 'PENDING'
          })) || []
        }
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        inspector: {
          select: { id: true, firstName: true, lastName: true }
        },
        checkpoints: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'ITP created successfully',
      data: itp
    });

  } catch (error) {
    console.error('Create ITP error:', error);
    res.status(500).json({ error: 'Failed to create ITP' });
  }
});

// Get ITP by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const itp = await prisma.iTP.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true }
        },
        inspector: {
          select: { id: true, firstName: true, lastName: true }
        },
        checkpoints: {
          orderBy: { order: 'asc' }
        },
        photos: true
      }
    });

    if (!itp) {
      return res.status(404).json({ error: 'ITP not found' });
    }

    res.json({
      success: true,
      data: itp
    });

  } catch (error) {
    console.error('Get ITP error:', error);
    res.status(500).json({ error: 'Failed to fetch ITP' });
  }
});

// Update ITP status
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const itp = await prisma.iTP.update({
      where: { id },
      data: { 
        status,
        completedAt: status === 'COMPLETED' || status === 'APPROVED' ? new Date() : null
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        inspector: {
          select: { id: true, firstName: true, lastName: true }
        },
        checkpoints: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      message: 'ITP status updated successfully',
      data: itp
    });

  } catch (error) {
    console.error('Update ITP status error:', error);
    res.status(500).json({ error: 'Failed to update ITP status' });
  }
});

// Update checkpoint status
router.patch('/checkpoints/:checkpointId', authenticateToken, [
  body('status').isIn(['PENDING', 'PASSED', 'FAILED']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { checkpointId } = req.params;
    const { status, notes } = req.body;

    const checkpoint = await prisma.iTPCheckpoint.update({
      where: { id: checkpointId },
      data: {
        status,
        notes: notes?.trim() || null,
        checkedBy: req.user.userId,
        checkedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Checkpoint updated successfully',
      data: checkpoint
    });

  } catch (error) {
    console.error('Update checkpoint error:', error);
    res.status(500).json({ error: 'Failed to update checkpoint' });
  }
});

// Get ITP statistics
router.get('/stats/overview', authenticateToken, [
  query('projectId').optional().isString()
], async (req, res) => {
  try {
    const { projectId } = req.query;

    let where: any = {};
    if (projectId) {
      where.projectId = projectId as string;
    }

    const [
      totalITPs,
      pendingITPs,
      inProgressITPs,
      completedITPs,
      approvedITPs,
      rejectedITPs
    ] = await Promise.all([
      prisma.iTP.count({ where }),
      prisma.iTP.count({ where: { ...where, status: 'PENDING' } }),
      prisma.iTP.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.iTP.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.iTP.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.iTP.count({ where: { ...where, status: 'REJECTED' } })
    ]);

    const stats = {
      totalITPs,
      pendingITPs,
      inProgressITPs,
      completedITPs,
      approvedITPs,
      rejectedITPs,
      statusDistribution: {
        PENDING: pendingITPs,
        IN_PROGRESS: inProgressITPs,
        COMPLETED: completedITPs,
        APPROVED: approvedITPs,
        REJECTED: rejectedITPs
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get ITP stats error:', error);
    res.status(500).json({ error: 'Failed to fetch ITP statistics' });
  }
});

export { router as itpRouter };