app.get('/api/stats', async (req, res) => {
  try {
    console.log('Checking database connection...');
    
    // Test basic connection first
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection OK');
    
    // Get counts one by one to identify which one fails
    let organizations = 0;
    let users = 0; 
    let projects = 0;
    let inspections = 0;
    
    try {
      organizations = await prisma.organization.count();
      console.log('Organizations count:', organizations);
    } catch (e) {
      console.error('Organizations count failed:', e.message);
    }
    
    try {
      users = await prisma.user.count();
      console.log('Users count:', users);
    } catch (e) {
      console.error('Users count failed:', e.message);
    }
    
    try {
      projects = await prisma.project.count();
      console.log('Projects count:', projects);
    } catch (e) {
      console.error('Projects count failed:', e.message);
    }
    
    try {
      inspections = await prisma.inspection.count();
      console.log('Inspections count:', inspections);
    } catch (e) {
      console.error('Inspections count failed:', e.message);
    }

    res.json({
      database: 'Connected',
      statistics: { organizations, users, projects, inspections },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://corevqc-platform-frontend-5rrnv4857-dondre-andersons-projects.vercel.app',
    'https://corevqc-platform-frontend.vercel.app',
    // Add a wildcard pattern for all Vercel preview URLs
    /^https:\/\/corevqc-platform-frontend-.*-dondre-andersons-projects\.vercel\.app$/
  ]
}));

