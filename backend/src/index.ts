import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects'; 
import dashboardRoutes from './routes/dashboard';
import analyticsRoutes from './routes/analytics';
import qualityRoutes from './routes/quality';

dotenv.config();

const app = express();
// Railway provides PORT environment variable
const PORT = process.env.PORT || 8000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quality-control', qualityRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'OK', 
      message: 'COREVQC Backend is running!',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: PORT
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'COREVQC API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to COREVQC API',
    endpoints: [
      'GET /api/health - Health check',
      'GET /api/stats - Database statistics', 
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'GET /api/auth/profile - Get user profile',
      'GET /api/projects - Get all projects',
      'GET /api/quality-control/projects/:id/ncrs - Get NCRs',
      'GET /api/quality-control/projects/:id/itps - Get ITPs'
    ],
    timestamp: new Date().toISOString()
  });
});

// Catch all route
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api', '/api/health', '/api/stats', '/api/auth/*', '/api/projects/*']
  });
});

// Error handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 COREVQC Backend Server Started`);
  console.log(`📡 Server running on: http://0.0.0.0:${PORT}`);
  console.log(`💚 Health check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const organizationCount = await prisma.organization.count();
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    
    console.log(`📊 Database Stats: ${organizationCount} organizations, ${userCount} users, ${projectCount} projects`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
});
