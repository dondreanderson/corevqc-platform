import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';  // Add this import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);  // Add this line

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'OK', 
      message: 'COREVQC Backend is running!',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed'
    });
  }
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to COREVQC API',
    endpoints: [
      'GET /api/health - Health check',
      'GET /api/stats - Database statistics',
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login', 
      'GET /api/auth/profile - Get user profile (requires Bearer token)',
      'GET /api/projects - Get all projects (requires auth)',
      'POST /api/projects - Create project (requires auth)',
      'GET /api/projects/:id - Get project details (requires auth)',
      'PUT /api/projects/:id - Update project (requires auth)',
      'DELETE /api/projects/:id - Delete project (requires auth)',
      'GET /api - This endpoint'
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const [organizations, users, projects, inspections] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(), 
      prisma.project.count(),
      prisma.inspection.count()
    ]);

    res.json({
      database: 'Connected',
      statistics: { organizations, users, projects, inspections },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api', '/api/health', '/api/stats', '/api/auth/*', '/api/projects/*']
  });
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, async () => {
  console.log(`🚀 COREVQC Backend Server Started`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Statistics: http://localhost:${PORT}/api/stats`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET http://localhost:${PORT}/api/auth/profile`);
  console.log(`📋 Project endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/projects`);
  console.log(`   POST http://localhost:${PORT}/api/projects`);
  console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const organizationCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    
    console.log(`📊 Database Stats: ${organizationCount} organizations, ${userCount} users, ${projectCount} projects`);
  } catch (error) {
    console.error('❌ Database connection failed');
  }
});
