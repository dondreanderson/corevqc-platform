import { Router, Request, Response } from 'express';

const router = Router();

// Import your projects data (adjust path as needed)
// For now, we'll duplicate the mock data here
const mockProjects = [
  {
    id: "1",
    name: "Downtown Office Complex",
    description: "50-story office building construction",
    status: "active",
    progress: 65,
    startDate: "2024-01-15",
    endDate: "2025-06-30",
    budget: 25000000,
    actualCost: 16000000,
    client: "ABC Corp",
    location: "123 Main St, Downtown",
    contractor: "BuildCorp Inc",
    projectManager: "John Smith",
    qualityScore: 85,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-21T10:30:00Z"
  },
  {
    id: "2", 
    name: "Residential Tower",
    description: "Luxury residential tower with 200 units",
    status: "planning",
    progress: 25,
    startDate: "2024-03-01",
    endDate: "2025-12-15",
    budget: 18000000,
    actualCost: 4500000,
    client: "XYZ Development",
    location: "456 Oak Ave, Midtown",
    contractor: "ResidentialPro LLC",
    projectManager: "Sarah Johnson",
    qualityScore: 92,
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-06-21T09:15:00Z"
  },
  {
    id: "3",
    name: "Hospital Renovation",
    description: "Complete renovation of emergency wing",
    status: "completed",
    progress: 100,
    startDate: "2023-08-01",
    endDate: "2024-05-30",
    budget: 12000000,
    actualCost: 11800000,
    client: "City Hospital",
    location: "789 Health Blvd",
    contractor: "MedBuild Co",
    projectManager: "Dr. Michael Brown",
    qualityScore: 98,
    createdAt: "2023-08-01T07:00:00Z",
    updatedAt: "2024-05-30T16:00:00Z"
  }
];

// GET /api/analytics/overview - Overall project statistics
router.get('/overview', (req: Request, res: Response) => {
  try {
    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
    const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalActualCost = mockProjects.reduce((sum, p) => sum + p.actualCost, 0);
    const averageQualityScore = Math.round(mockProjects.reduce((sum, p) => sum + p.qualityScore, 0) / totalProjects);
    const averageProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);

    const overview = {
      totalProjects,
      activeProjects,
      completedProjects,
      totalBudget,
      totalActualCost,
      budgetVariance: totalBudget - totalActualCost,
      averageQualityScore,
      averageProgress,
      costEfficiency: Math.round((totalActualCost / totalBudget) * 100)
    };

    res.json(overview);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// GET /api/analytics/progress - Progress data for charts
router.get('/progress', (req: Request, res: Response) => {
  try {
    const progressData = mockProjects.map(project => ({
      name: project.name.substring(0, 20) + (project.name.length > 20 ? '...' : ''),
      progress: project.progress,
      status: project.status,
      id: project.id
    }));

    res.json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
});

// GET /api/analytics/financial - Financial data for charts
router.get('/financial', (req: Request, res: Response) => {
  try {
    const financialData = mockProjects.map(project => ({
      name: project.name.substring(0, 15) + (project.name.length > 15 ? '...' : ''),
      budget: project.budget,
      actualCost: project.actualCost,
      variance: project.budget - project.actualCost,
      efficiency: Math.round((project.actualCost / project.budget) * 100)
    }));

    res.json(financialData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// GET /api/analytics/quality - Quality metrics
router.get('/quality', (req: Request, res: Response) => {
  try {
    const qualityData = {
      averageScore: Math.round(mockProjects.reduce((sum, p) => sum + p.qualityScore, 0) / mockProjects.length),
      scoreDistribution: mockProjects.map(project => ({
        name: project.name.substring(0, 20) + (project.name.length > 20 ? '...' : ''),
        score: project.qualityScore,
        status: project.status
      })),
      qualityTrends: [
        { month: 'Jan', score: 82 },
        { month: 'Feb', score: 85 },
        { month: 'Mar', score: 88 },
        { month: 'Apr', score: 87 },
        { month: 'May', score: 90 },
        { month: 'Jun', score: 92 }
      ]
    };

    res.json(qualityData);
  } catch (error) {
    console.error('Error fetching quality data:', error);
    res.status(500).json({ error: 'Failed to fetch quality data' });
  }
});

export default router;
