// backend/src/routes/enhanced-ncr.ts (Replace entire file)
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateToken } from './auth';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Enhanced NCR workflow statuses
const WORKFLOW_STEPS = [
  'REPORTED',
  'ASSIGNED', 
  'INVESTIGATION',
  'RESOLUTION',
  'APPROVAL',
  'CLOSED'
];

// Get enhanced NCRs with workflow data
router.get('/enhanced', authenticateToken, [
  query('projectId').optional().isString(),
  query('status').optional().isString(),
  query('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  query('assigneeId').optional().isString(),
  query('overdue').optional().isBoolean(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, status, severity, assigneeId, overdue, search } = req.query;

    let where: Prisma.NCRWhereInput = {};
    if (projectId) where.projectId = projectId as string;
    if (status) where.status = status as any;
    if (severity) where.severity = severity as any;
    if (assigneeId) where.assignedToId = assigneeId as string;
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { ncrNumber: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { notIn: ['RESOLVED', 'CLOSED'] as any };
    }

    const ncrs = await prisma.nCR.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, role: true } },
        workflowSteps: { orderBy: { createdAt: 'asc' } },
        comments: { 
          include: { author: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        attachments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data to include workflow progress and overdue status
    const enhancedNcrs = ncrs.map(ncr => ({
      ...ncr,
      workflow: {
        currentStep: getCurrentWorkflowStep(ncr.workflowSteps),
        steps: generateWorkflowSteps(ncr.workflowSteps)
      },
      isOverdue: ncr.dueDate && new Date() > new Date(ncr.dueDate) && !['RESOLVED', 'CLOSED'].includes(ncr.status),
      escalationLevel: calculateEscalationLevel(ncr)
    }));

    res.json({
      success: true,
      data: enhancedNcrs
    });

  } catch (error) {
    console.error('Get enhanced NCRs error:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced NCRs' });
  }
});

// Assign NCR to team member
router.post('/:id/assign', authenticateToken, [
  body('assigneeId').isString().notEmpty(),
  body('dueDate').optional().isISO8601(),
  body('priority').optional().isIn(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { assigneeId, dueDate, priority, notes } = req.body;

    // Verify assignee exists
    const assignee = await prisma.user.findUnique({
      where: { id: assigneeId }
    });

    if (!assignee) {
      return res.status(404).json({ error: 'Assignee not found' });
    }

    // Update NCR and create workflow step
    const updatedNcr = await prisma.$transaction(async (tx) => {
      // Update NCR
      const ncr = await tx.nCR.update({
        where: { id },
        data: {
          assignedToId: assigneeId,
          status: 'ASSIGNED' as any,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority: priority || 'NORMAL'
        }
      });

      // Create workflow step
      await tx.nCRWorkflowStep.create({
        data: {
          ncrId: id,
          step: 'ASSIGNED',
          status: 'COMPLETED',
          completedAt: new Date(),
          completedById: (req.user as any).userId,
          notes
        }
      });

      // Create assignment comment
      await tx.nCRComment.create({
        data: {
          ncrId: id,
          text: `NCR assigned to ${assignee.firstName} ${assignee.lastName}${notes ? `. Notes: ${notes}` : ''}`,
          authorId: (req.user as any).userId,
          type: 'ASSIGNMENT'
        }
      });

      return ncr;
    });

    res.json({
      success: true,
      message: 'NCR assigned successfully',
      data: updatedNcr
    });

  } catch (error) {
    console.error('Assign NCR error:', error);
    res.status(500).json({ error: 'Failed to assign NCR' });
  }
});

// Submit NCR resolution
router.post('/:id/resolve', authenticateToken, [
  body('resolutionType').isIn(['CORRECTIVE_ACTION', 'REWORK', 'ACCEPT_AS_IS', 'REJECT']),
  body('description').trim().isLength({ min: 10 }),
  body('rootCause').optional().isString(),
  body('preventiveActions').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { resolutionType, description, rootCause, preventiveActions } = req.body;

    const updatedNcr = await prisma.$transaction(async (tx) => {
      // Update NCR
      const ncr = await tx.nCR.update({
        where: { id },
        data: {
          status: 'PENDING_APPROVAL' as any,
          correctiveAction: description,
          rootCause: rootCause || null,
          resolutionType,
          resolvedAt: new Date()
        }
      });

      // Create workflow step
      await tx.nCRWorkflowStep.create({
        data: {
          ncrId: id,
          step: 'RESOLUTION',
          status: 'COMPLETED',
          completedAt: new Date(),
          completedById: (req.user as any).userId,
          notes: description
        }
      });

      // Create resolution comment
      await tx.nCRComment.create({
        data: {
          ncrId: id,
          text: `Resolution submitted: ${description}${preventiveActions ? `. Preventive actions: ${preventiveActions}` : ''}`,
          authorId: (req.user as any).userId,
          type: 'RESOLUTION'
        }
      });

      return ncr;
    });

    res.json({
      success: true,
      message: 'NCR resolution submitted successfully',
      data: updatedNcr
    });

  } catch (error) {
    console.error('Resolve NCR error:', error);
    res.status(500).json({ error: 'Failed to resolve NCR' });
  }
});

// Approve NCR resolution
router.post('/:id/approve', authenticateToken, [
  body('approved').isBoolean(),
  body('comments').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { approved, comments } = req.body;

    const updatedNcr = await prisma.$transaction(async (tx) => {
      // Update NCR
      const ncr = await tx.nCR.update({
        where: { id },
        data: {
          status: (approved ? 'RESOLVED' : 'IN_PROGRESS') as any,
          closedAt: approved ? new Date() : null
        }
      });

      // Create workflow step
      await tx.nCRWorkflowStep.create({
        data: {
          ncrId: id,
          step: approved ? 'APPROVED' : 'REJECTED',
          status: 'COMPLETED',
          completedAt: new Date(),
          completedById: (req.user as any).userId,
          notes: comments
        }
      });

      // Create approval comment
      await tx.nCRComment.create({
        data: {
          ncrId: id,
          text: approved ? `NCR approved and closed${comments ? `. Comments: ${comments}` : ''}` : `NCR rejected and returned for revision${comments ? `. Comments: ${comments}` : ''}`,
          authorId: (req.user as any).userId,
          type: approved ? 'APPROVAL' : 'REJECTION'
        }
      });

      return ncr;
    });

    res.json({
      success: true,
      message: `NCR ${approved ? 'approved' : 'rejected'} successfully`,
      data: updatedNcr
    });

  } catch (error) {
    console.error('Approve NCR error:', error);
    res.status(500).json({ error: 'Failed to process NCR approval' });
  }
});

// Add comment to NCR
router.post('/:id/comments', authenticateToken, [
  body('text').trim().isLength({ min: 1 }),
  body('type').optional().isIn(['GENERAL', 'INVESTIGATION', 'RESOLUTION', 'APPROVAL'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { text, type } = req.body;

    const comment = await prisma.nCRComment.create({
      data: {
        ncrId: id,
        text: text.trim(),
        authorId: (req.user as any).userId,
        type: type || 'GENERAL'
      },
      include: {
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get NCR statistics for enhanced dashboard
router.get('/stats/enhanced', authenticateToken, [
  query('projectId').optional().isString()
], async (req, res) => {
  try {
    const { projectId } = req.query;

    let where: Prisma.NCRWhereInput = {};
    if (projectId) where.projectId = projectId as string;

    const [
      totalNCRs,
      openNCRs,
      assignedNCRs,
      inProgressNCRs,
      pendingApprovalNCRs,
      resolvedNCRs,
      closedNCRs,
      overdueNCRs,
      criticalNCRs,
      highNCRs,
      mediumNCRs,
      lowNCRs
    ] = await Promise.all([
      prisma.nCR.count({ where }),
      prisma.nCR.count({ where: { ...where, status: 'OPEN' as any } }),
      prisma.nCR.count({ where: { ...where, status: 'ASSIGNED' as any } }),
      prisma.nCR.count({ where: { ...where, status: 'IN_PROGRESS' as any } }),
      prisma.nCR.count({ where: { ...where, status: 'PENDING_APPROVAL' as any } }),
      prisma.nCR.count({ where: { ...where, status: 'RESOLVED' as any } }),
      prisma.nCR.count({ where: { ...where, status: 'CLOSED' as any } }),
      prisma.nCR.count({ 
        where: { 
          ...where, 
          dueDate: { lt: new Date() },
          status: { notIn: ['RESOLVED', 'CLOSED'] as any }
        } 
      }),
      prisma.nCR.count({ where: { ...where, severity: 'CRITICAL' } }),
      prisma.nCR.count({ where: { ...where, severity: 'HIGH' } }),
      prisma.nCR.count({ where: { ...where, severity: 'MEDIUM' } }),
      prisma.nCR.count({ where: { ...where, severity: 'LOW' } })
    ]);

    const stats = {
      totalNCRs,
      openNCRs,
      assignedNCRs,
      inProgressNCRs,
      pendingApprovalNCRs,
      resolvedNCRs,
      closedNCRs,
      overdueNCRs,
      criticalNCRs,
      statusDistribution: {
        OPEN: openNCRs,
        ASSIGNED: assignedNCRs,
        IN_PROGRESS: inProgressNCRs,
        PENDING_APPROVAL: pendingApprovalNCRs,
        RESOLVED: resolvedNCRs,
        CLOSED: closedNCRs
      },
      severityDistribution: {
        CRITICAL: criticalNCRs,
        HIGH: highNCRs,
        MEDIUM: mediumNCRs,
        LOW: lowNCRs
      },
      overallQualityScore: totalNCRs > 0 ? Math.round(((resolvedNCRs + closedNCRs) / totalNCRs) * 100) : 100
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get enhanced NCR stats error:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced NCR statistics' });
  }
});

// Helper functions
function getCurrentWorkflowStep(workflowSteps: any[]) {
  const completed = workflowSteps.filter(step => step.status === 'COMPLETED');
  const currentIndex = completed.length;
  return currentIndex < WORKFLOW_STEPS.length ? WORKFLOW_STEPS[currentIndex] : 'CLOSED';
}

function generateWorkflowSteps(workflowSteps: any[]) {
  return WORKFLOW_STEPS.map(stepName => {
    const step = workflowSteps.find(ws => ws.step === stepName);
    if (step) {
      return {
        name: stepName,
        status: step.status,
        completedAt: step.completedAt,
        completedBy: step.completedBy?.firstName + ' ' + step.completedBy?.lastName
      };
    }
    return {
      name: stepName,
      status: 'PENDING'
    };
  });
}

function calculateEscalationLevel(ncr: any) {
  if (!ncr.dueDate) return 0;
  const daysOverdue = Math.floor((new Date().getTime() - new Date(ncr.dueDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysOverdue <= 0) return 0;
  if (daysOverdue <= 3) return 1;
  if (daysOverdue <= 7) return 2;
  return 3;
}

export { router as enhancedNcrRouter };
