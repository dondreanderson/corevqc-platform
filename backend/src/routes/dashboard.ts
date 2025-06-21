import { Router, Request, Response } from 'express';

const router = Router();

// Import projects data (you'll import this from your projects route)
import { mockProjects } from './projects';

// GET /api/dashboard/statistics - Overall project statistics
router.get('/statistics', (req: Request, res: Response) => {
  try {
    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
    const planningProjects = mockProjects.filter(p => p.status === 'planning').length;
    
    const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalActualCost = mockProjects.reduce((sum, p) => sum + p.actualCost, 0);
    const averageProgress = mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects;
    const averageQualityScore = mockProjects.reduce((sum, p) => sum + p.qualityScore, 0) / totalProjects;

    const statistics = {
      overview: {
        totalProjects,
        activeProjects,
        completedProjects,
        planningProjects,
        averageProgress: Math.round(averageProgress),
        averageQualityScore: Math.round(averageQualityScore)
      },
      financial: {
        totalBudget,
        totalActualCost,
        costVariance: totalActualCost - totalBudget,
        costVariancePercentage: Math.round(((totalActualCost - totalBudget) / totalBudget) * 100)
      },
      quality: {
        averageQualityScore: Math.round(averageQualityScore),
        highQualityProjects: mockProjects.filter(p => p.qualityScore >= 90).length,
        mediumQualityProjects: mockProjects.filter(p => p.qualityScore >= 80 && p.qualityScore < 90).length,
        lowQualityProjects: mockProjects.filter(p => p.qualityScore < 80).length
      }
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/dashboard/financial - Financial analytics
router.get('/financial', (req: Request, res: Response) => {
  try {
    const financialData = mockProjects.map(project => ({
      id: project.id,
      name: project.name,
      budget: project.budget,
      actualCost: project.actualCost,
      variance: project.actualCost - project.budget,
      variancePercentage: Math.round(((project.actualCost - project.budget) / project.budget) * 100),
      status: project.status,
      progress: project.progress
    }));

    const monthlySpending = [
      { month: 'Jan', budget: 4200000, actual: 3800000 },
      { month: 'Feb', budget: 4500000, actual: 4200000 },
      { month: 'Mar', budget: 5100000, actual: 5300000 },
      { month: 'Apr', budget: 4800000, actual: 4600000 },
      { month: 'May', budget: 5200000, actual: 5100000 },
      { month: 'Jun', budget: 4900000, actual: 5200000 }
    ];

    res.json({
      projects: financialData,
      monthlySpending,
      summary: {
        totalBudget: financialData.reduce((sum, p) => sum + p.budget, 0),
        totalActualCost: financialData.reduce((sum, p) => sum + p.actualCost, 0),
        projectsOverBudget: financialData.filter(p => p.variance > 0).length,
        projectsUnderBudget: financialData.filter(p => p.variance < 0).length
      }
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// GET /api/dashboard/quality - Quality metrics and trends
router.get('/quality', (req: Request, res: Response) => {
  try {
    const qualityData = mockProjects.map(project => ({
      id: project.id,
      name: project.name,
      qualityScore: project.qualityScore,
      status: project.status,
      progress: project.progress,
      category: project.qualityScore >= 90 ? 'Excellent' :
                project.qualityScore >= 80 ? 'Good' :
                project.qualityScore >= 70 ? 'Fair' : 'Poor'
    }));

    // Mock quality trends over time
    const qualityTrends = [
      { month: 'Jan', score: 82 },
      { month: 'Feb', score: 85 },
      { month: 'Mar', score: 88 },
      { month: 'Apr', score: 87 },
      { month: 'May', score: 91 },
      { month: 'Jun', score: 89 }
    ];

    // Mock defect tracking
    const defectData = [
      { type: 'Structural', count: 12, severity: 'High' },
      { type: 'Electrical', count: 8, severity: 'Medium' },
      { type: 'Plumbing', count: 15, severity: 'Low' },
      { type: 'HVAC', count: 6, severity: 'Medium' },
      { type: 'Finishing', count: 23, severity: 'Low' }
    ];

    res.json({
      projects: qualityData,
      trends: qualityTrends,
      defects: defectData,
      summary: {
        averageQualityScore: Math.round(qualityData.reduce((sum, p) => sum + p.qualityScore, 0) / qualityData.length),
        excellentProjects: qualityData.filter(p => p.category === 'Excellent').length,
        totalDefects: defectData.reduce((sum, d) => sum + d.count, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching quality data:', error);
    res.status(500).json({ error: 'Failed to fetch quality data' });
  }
});

// GET /api/dashboard/timeline - Timeline and milestone data
router.get('/timeline', (req: Request, res: Response) => {
  try {
    const timelineData = mockProjects.map(project => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const currentDate = new Date();
      
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedTime = currentDate.getTime() - startDate.getTime();
      const timeProgress = Math.min(Math.max(elapsedTime / totalDuration * 100, 0), 100);
      
      const isDelayed = project.progress < timeProgress;
      const daysRemaining = Math.max(Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)), 0);

      return {
        id: project.id,
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        progress: project.progress,
        timeProgress: Math.round(timeProgress),
        isDelayed,
        daysRemaining,
        status: project.status
      };
    });

    // Mock upcoming milestones
    const upcomingMilestones = [
      { id: 1, projectId: '1', title: 'Foundation Complete', dueDate: '2024-07-15', status: 'on-track' },
      { id: 2, projectId: '2', title: 'Design Approval', dueDate: '2024-07-20', status: 'at-risk' },
      { id: 3, projectId: '1', title: 'Steel Framework', dueDate: '2024-08-01', status: 'on-track' },
      { id: 4, projectId: '3', title: 'Final Inspection', dueDate: '2024-07-10', status: 'completed' }
    ];

    res.json({
      projects: timelineData,
      milestones: upcomingMilestones,
      summary: {
        projectsOnSchedule: timelineData.filter(p => !p.isDelayed).length,
        projectsDelayed: timelineData.filter(p => p.isDelayed).length,
        averageProgress: Math.round(timelineData.reduce((sum, p) => sum + p.progress, 0) / timelineData.length)
      }
    });
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    res.status(500).json({ error: 'Failed to fetch timeline data' });
  }
});

// GET /api/dashboard/kpi - Key Performance Indicators
router.get('/kpi', (req: Request, res: Response) => {
  try {
    const totalProjects = mockProjects.length;
    const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    
    const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalActualCost = mockProjects.reduce((sum, p) => sum + p.actualCost, 0);
    const averageQualityScore = mockProjects.reduce((sum, p) => sum + p.qualityScore, 0) / totalProjects;

    const kpis = {
      projectCompletionRate: Math.round((completedProjects / totalProjects) * 100),
      budgetEfficiency: Math.round((totalBudget / totalActualCost) * 100),
      qualityIndex: Math.round(averageQualityScore),
      activeProjectsCount: activeProjects,
      totalProjectValue: totalBudget,
      costSavings: totalBudget - totalActualCost,
      averageProjectDuration: 12, // months
      customerSatisfaction: 94, // percentage
      safetyScore: 98, // percentage
      onTimeDelivery: 87 // percentage
    };

    res.json(kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

export default router;