// backend/src/routes/quality.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to generate NCR number
const generateNCRNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.nCR.count();
  const sequence = String(count + 1).padStart(3, '0');
  return `NCR-${year}-${sequence}`;
};

// Helper function to generate ITP number
const generateITPNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.iTP.count();
  const sequence = String(count + 1).padStart(3, '0');
  return `ITP-${year}-${sequence}`;
};

// Helper function to safely format date
const formatDateSafe = (date: Date | null): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
};

// GET /api/quality/projects/:projectId/metrics
router.get('/projects/:projectId/metrics', async (req, res) => {
  try {
    const { projectId } = req.params;

    const [totalNCRs, activeNCRs, resolvedNCRs, totalITPs, pendingITPs, completedITPs] = await Promise.all([
      prisma.nCR.count({ where: { projectId } }),
      prisma.nCR.count({ where: { projectId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.nCR.count({ where: { projectId, status: { in: ['RESOLVED', 'CLOSED'] } } }),
      prisma.iTP.count({ where: { projectId } }),
      prisma.iTP.count({ where: { projectId, status: 'PENDING' } }),
      prisma.iTP.count({ where: { projectId, status: { in: ['COMPLETED', 'APPROVED'] } } })
    ]);

    const qualityScore = totalNCRs > 0 ? Math.round(((resolvedNCRs / totalNCRs) * 100) * 10) / 10 : 100;
    const defectRate = totalITPs > 0 ? Math.round(((totalNCRs / totalITPs) * 100) * 10) / 10 : 0;

    const metrics = {
      totalInspections: totalITPs,
      passedInspections: completedITPs,
      failedInspections: totalITPs - completedITPs,
      activeNCRs,
      resolvedNCRs,
      qualityScore,
      defectRate,
      overdueItems: 0, // Calculate based on your business logic
      pendingITPs,
      completedITPs
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching quality metrics:', error);
    res.status(500).json({ error: 'Failed to fetch quality metrics' });
  }
});

// GET /api/quality/projects/:projectId/ncrs
router.get('/projects/:projectId/ncrs', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const ncrs = await prisma.nCR.findMany({
      where: { projectId },
      include: {
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedNCRs = ncrs.map(ncr => ({
      id: ncr.id,
      ncrNumber: ncr.ncrNumber,
      title: ncr.title,
      description: ncr.description,
      severity: ncr.severity.toLowerCase(),
      status: ncr.status.toLowerCase().replace('_', '_'),
      category: ncr.category || 'General',
      location: ncr.location || 'Not specified',
      reportedBy: `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`,
      assignedTo: 'Not assigned', // Update when you add assignment logic
      createdDate: ncr.createdAt.toISOString().split('T')[0],
      dueDate: ncr.dueDate ? ncr.dueDate.toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resolvedDate: ncr.closedAt ? ncr.closedAt.toISOString().split('T')[0] : undefined,
      correctiveAction: ncr.correctiveAction || undefined,
      rootCause: undefined, // Add to schema if needed
      images: [], // Add relationship if needed
      comments: [] // Add relationship if needed
    }));

    res.json(formattedNCRs);
  } catch (error) {
    console.error('Error fetching NCRs:', error);
    res.status(500).json({ error: 'Failed to fetch NCRs' });
  }
});

// POST /api/quality/projects/:projectId/ncrs
router.post('/projects/:projectId/ncrs', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, severity, category, location, correctiveAction, dueDate, reportedById } = req.body;

    // Generate NCR number
    const generatedNcrNumber = await generateNCRNumber();

    const ncr = await prisma.nCR.create({
      data: {
        ncrNumber: generatedNcrNumber,
        title: title,
        description: description,
        severity: severity?.toUpperCase() || 'MEDIUM',
        status: 'OPEN',
        category: category,
        location: location,
        correctiveAction: correctiveAction,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId,
        reportedById: reportedById,
      },
      include: {
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const formattedNCR = {
      id: ncr.id,
      ncrNumber: ncr.ncrNumber,
      title: ncr.title,
      description: ncr.description,
      severity: ncr.severity.toLowerCase(),
      status: ncr.status.toLowerCase(),
      category: ncr.category || 'General',
      location: ncr.location || 'Not specified',
      reportedBy: `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`,
      assignedTo: 'Not assigned',
      createdDate: ncr.createdAt.toISOString().split('T')[0],
      dueDate: ncr.dueDate ? ncr.dueDate.toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      correctiveAction: ncr.correctiveAction || undefined
    };

    res.status(201).json(formattedNCR);
  } catch (error) {
    console.error('Error creating NCR:', error);
    res.status(500).json({ error: 'Failed to create NCR' });
  }
});

// GET /api/quality/projects/:projectId/itps
router.get('/projects/:projectId/itps', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const itps = await prisma.iTP.findMany({
      where: { projectId },
      include: {
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    });

    const formattedITPs = itps.map(itp => ({
      id: itp.id,
      itpNumber: itp.itpNumber,
      name: itp.title,
      phase: itp.phase,
      inspector: `${itp.inspector.firstName} ${itp.inspector.lastName}`,
      location: itp.location || 'Not specified',
      scheduledDate: formatDateSafe(itp.scheduledAt), // Using safe formatter
      completedDate: itp.completedAt ? itp.completedAt.toISOString().split('T')[0] : undefined,
      status: itp.status.toLowerCase(),
      inspectionType: 'visual', // Default value
      requirements: [], // Add relationship if needed
      checkpoints: [], // Add relationship if needed
      notes: itp.notes || undefined,
      holdPoints: [] // Add if needed
    }));

    res.json(formattedITPs);
  } catch (error) {
    console.error('Error fetching ITPs:', error);
    res.status(500).json({ error: 'Failed to fetch ITPs' });
  }
});

// POST /api/quality/projects/:projectId/itps
router.post('/projects/:projectId/itps', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, phase, location, scheduledDate, inspectorId, activity } = req.body;

    // Generate ITP number
    const generatedItpNumber = await generateITPNumber();

    const itp = await prisma.iTP.create({
      data: {
        itpNumber: generatedItpNumber,
        title: title,
        description: description || '',
        activity: activity || 'General Inspection',
        status: 'PENDING',
        phase: phase,
        location: location,
        scheduledAt: new Date(scheduledDate),
        projectId: projectId,
        inspectorId: inspectorId,
      },
      include: {
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const formattedITP = {
      id: itp.id,
      itpNumber: itp.itpNumber,
      name: itp.title,
      phase: itp.phase,
      inspector: `${itp.inspector.firstName} ${itp.inspector.lastName}`,
      location: itp.location || 'Not specified',
      scheduledDate: formatDateSafe(itp.scheduledAt), // Using safe formatter
      status: itp.status.toLowerCase(),
      inspectionType: 'visual',
      requirements: [],
      checkpoints: [],
      notes: itp.notes || undefined
    };

    res.status(201).json(formattedITP);
  } catch (error) {
    console.error('Error creating ITP:', error);
    res.status(500).json({ error: 'Failed to create ITP' });
  }
});

// PUT /api/quality/ncrs/:id
router.put('/ncrs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, severity, status, category, location, correctiveAction, dueDate } = req.body;

    const ncr = await prisma.nCR.update({
      where: { id },
      data: {
        title: title,
        description: description,
        severity: severity?.toUpperCase(),
        status: status?.toUpperCase(),
        category: category,
        location: location,
        correctiveAction: correctiveAction,
        dueDate: dueDate ? new Date(dueDate) : null,
        updatedAt: new Date()
      },
      include: {
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const formattedNCR = {
      id: ncr.id,
      ncrNumber: ncr.ncrNumber,
      title: ncr.title,
      description: ncr.description,
      severity: ncr.severity.toLowerCase(),
      status: ncr.status.toLowerCase(),
      category: ncr.category || 'General',
      location: ncr.location || 'Not specified',
      reportedBy: `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`,
      assignedTo: 'Not assigned',
      createdDate: ncr.createdAt.toISOString().split('T')[0],
      dueDate: ncr.dueDate ? ncr.dueDate.toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      correctiveAction: ncr.correctiveAction || undefined
    };

    res.json(formattedNCR);
  } catch (error) {
    console.error('Error updating NCR:', error);
    res.status(500).json({ error: 'Failed to update NCR' });
  }
});

// PUT /api/quality/itps/:id
router.put('/itps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, phase, location, scheduledDate, status, notes } = req.body;

    const itp = await prisma.iTP.update({
      where: { id },
      data: {
        title: title,
        description: description,
        phase: phase,
        location: location,
        scheduledAt: scheduledDate ? new Date(scheduledDate) : undefined,
        status: status?.toUpperCase(),
        notes: notes,
        completedAt: status?.toUpperCase() === 'COMPLETED' ? new Date() : null,
        updatedAt: new Date()
      },
      include: {
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const formattedITP = {
      id: itp.id,
      itpNumber: itp.itpNumber,
      name: itp.title,
      phase: itp.phase,
      inspector: `${itp.inspector.firstName} ${itp.inspector.lastName}`,
      location: itp.location || 'Not specified',
      scheduledDate: formatDateSafe(itp.scheduledAt), // Using safe formatter
      completedDate: itp.completedAt ? itp.completedAt.toISOString().split('T')[0] : undefined,
      status: itp.status.toLowerCase(),
      inspectionType: 'visual',
      requirements: [],
      checkpoints: [],
      notes: itp.notes || undefined
    };

    res.json(formattedITP);
  } catch (error) {
    console.error('Error updating ITP:', error);
    res.status(500).json({ error: 'Failed to update ITP' });
  }
});

// DELETE /api/quality/ncrs/:id
router.delete('/ncrs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.nCR.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting NCR:', error);
    res.status(500).json({ error: 'Failed to delete NCR' });
  }
});

// DELETE /api/quality/itps/:id
router.delete('/itps/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.iTP.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ITP:', error);
    res.status(500).json({ error: 'Failed to delete ITP' });
  }
});

export default router;