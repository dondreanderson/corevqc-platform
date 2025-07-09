import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'COREVQC Backend is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: PORT
  });
});

// Get all projects
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, status, priority, clientName, location } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const newProject = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: status || 'PLANNING',
        priority: priority || 'MEDIUM',
        clientName: clientName?.trim() || null,
        location: location?.trim() || null,
        progress: 0
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get all NCRs
app.get('/api/ncrs', async (req, res) => {
  try {
    const { projectId } = req.query;
    
    const where = projectId ? { projectId: projectId as string } : {};
    
    const ncrs = await prisma.nCR.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ncrs);
  } catch (error) {
    console.error('Error fetching NCRs:', error);
    res.status(500).json({ error: 'Failed to fetch NCRs' });
  }
});

// Create new NCR
app.post('/api/ncrs', async (req, res) => {
  try {
    const { title, description, severity, category, location, projectId } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: 'NCR title is required' });
    }

    if (!description?.trim()) {
      return res.status(400).json({ error: 'NCR description is required' });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate NCR number
    const ncrCount = await prisma.nCR.count();
    const ncrNumber = `NCR-${String(ncrCount + 1).padStart(3, '0')}`;

    // Create a dummy user for now (we'll add proper auth later)
    let reportedBy = await prisma.user.findFirst();
    if (!reportedBy) {
      reportedBy = await prisma.user.create({
        data: {
          email: 'admin@corevqc.com',
          firstName: 'System',
          lastName: 'Admin',
          role: 'ADMIN'
        }
      });
    }

    const newNCR = await prisma.nCR.create({
      data: {
        ncrNumber,
        title: title.trim(),
        description: description.trim(),
        severity: severity || 'MEDIUM',
        status: 'OPEN',
        category: category || 'Quality',
        location: location?.trim() || null,
        projectId,
        reportedById: reportedBy.id
      },
      include: {
        project: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(newNCR);
  } catch (error) {
    console.error('Error creating NCR:', error);
    res.status(500).json({ error: 'Failed to create NCR' });
  }
});

// Get NCR statistics
app.get('/api/ncrs/stats', async (req, res) => {
  try {
    const { projectId } = req.query;
    
    const where = projectId ? { projectId: projectId as string } : {};
    
    const [
      totalNCRs,
      openNCRs,
      inProgressNCRs,
      resolvedNCRs,
      closedNCRs,
      criticalNCRs,
      highNCRs,
      mediumNCRs,
      lowNCRs
    ] = await Promise.all([
      prisma.nCR.count({ where }),
      prisma.nCR.count({ where: { ...where, status: 'OPEN' } }),
      prisma.nCR.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.nCR.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.nCR.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.nCR.count({ where: { ...where, severity: 'CRITICAL' } }),
      prisma.nCR.count({ where: { ...where, severity: 'HIGH' } }),
      prisma.nCR.count({ where: { ...where, severity: 'MEDIUM' } }),
      prisma.nCR.count({ where: { ...where, severity: 'LOW' } })
    ]);

    const resolvedCount = resolvedNCRs + closedNCRs;
    const qualityScore = totalNCRs > 0 ? Math.round((resolvedCount / totalNCRs) * 100) : 100;

    const stats = {
      totalNCRs,
      openNCRs: openNCRs + inProgressNCRs,
      criticalNCRs,
      qualityScore,
      statusDistribution: {
        OPEN: openNCRs,
        IN_PROGRESS: inProgressNCRs,
        RESOLVED: resolvedNCRs,
        CLOSED: closedNCRs
      },
      severityDistribution: {
        CRITICAL: criticalNCRs,
        HIGH: highNCRs,
        MEDIUM: mediumNCRs,
        LOW: lowNCRs
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching NCR stats:', error);
    res.status(500).json({ error: 'Failed to fetch NCR statistics' });
  }
});

// Global error handler - fix unused parameters
app.use((error: any, _req: any, res: any, _next: any) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to database
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));