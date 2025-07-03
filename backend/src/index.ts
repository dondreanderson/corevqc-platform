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
app.use(cors({
  origin: true, // Allow all origins - ONLY FOR TESTING!
  credentials: true
}));

console.log('✅ Middleware configured');

// Health check endpoint - MUST work for Railway deployment
// Add both routes for Railway compatibility
app.get('/health', async (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/health', async (req, res) => {
  try {
    // Simple health check without database
    res.json({ 
      status: 'OK', 
      message: 'COREVQC Backend is running!', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      port: PORT
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Stats endpoint with database connection test
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

// Projects endpoint
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        organization: true,
        manager: true
      }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects', 
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

// Start server with error handling
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Test database connection (but don't block startup)
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    // Don't exit here - let the app run without database for now
  });
