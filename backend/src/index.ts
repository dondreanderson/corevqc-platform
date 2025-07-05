import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 8000;

console.log('🚀 Starting COREVQC Backend...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Initialize Prisma with error handling
let prisma: PrismaClient;
try {
  prisma = new PrismaClient();
  console.log('✅ Prisma client initialized');
} catch (error) {
  console.error('❌ Failed to initialize Prisma client:', error);
  process.exit(1);
}

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('✅ Middleware configured');

// Debug logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('POST Body:', req.body);
  }
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'COREVQC Backend is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    port: PORT
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test route working!',
    timestamp: new Date().toISOString()
  });
});

// GET projects endpoint
app.get('/api/projects', async (req, res) => {
  try {
    console.log('🔍 GET Projects endpoint called');
    const projects = await prisma.project.findMany();
    console.log('📊 Found projects:', projects.length);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST projects endpoint - NO OWNER REQUIRED
app.post('/api/projects', async (req, res) => {
  try {
    console.log('🔍 Creating new project - received data:', req.body);
    
    const { name, description, status, priority } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('❌ Validation failed: name is required');
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create project without owner (now optional)
    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      status: status || 'PLANNING',
      priority: priority || 'MEDIUM',
      progress: 0
      // No ownerId needed now
    };

    console.log('📝 Prepared project data:', projectData);

    // Create the project
    const newProject = await prisma.project.create({
      data: projectData
    });

    console.log('✅ Project created successfully:', newProject);
    res.status(201).json(newProject);

  } catch (error) {
    console.error('❌ Error creating project:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Failed to create project', 
        details: error.message,
        errorType: error.name
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create project', 
        details: 'Unknown error occurred'
      });
    }
  }
});

// Add this to your backend index.ts
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});


// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const organizationCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    
    res.json({
      organizations: organizationCount,
      users: userCount,
      projects: projectCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 COREVQC Backend Server Started');
  console.log(`📡 Server running on: http://0.0.0.0:${PORT}`);
  console.log(`💚 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });
