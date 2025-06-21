import { Router, Request, Response } from 'express';

const router = Router();

// Define TypeScript interfaces
interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  client: string;
  location: string;
  contractor: string;
  projectManager: string;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  client?: string;
  location?: string;
  contractor?: string;
  projectManager?: string;
  qualityScore?: number;
}

// Mock data for testing
let mockProjects: Project[] = [
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

// GET all projects
router.get('/', (req: Request, res: Response) => {
  console.log('GET /api/projects called');
  try {
    res.json(mockProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', (req: Request, res: Response) => {
  console.log(`GET /api/projects/${req.params.id} called`);
  try {
    const project = mockProjects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST new project
router.post('/', (req: Request, res: Response) => {
  console.log('POST /api/projects called');
  try {
    const body = req.body as ProjectUpdateRequest;
    
    const newProject: Project = {
      id: String(Date.now()),
      name: body.name || 'Untitled Project',
      description: body.description || '',
      status: body.status || 'planning',
      progress: body.progress || 0,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date().toISOString().split('T')[0],
      budget: body.budget || 0,
      actualCost: body.actualCost || 0,
      client: body.client || '',
      location: body.location || '',
      contractor: body.contractor || '',
      projectManager: body.projectManager || '',
      qualityScore: body.qualityScore || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProjects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update entire project
router.put('/:id', (req: Request, res: Response) => {
  console.log(`PUT /api/projects/${req.params.id} called`);
  try {
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const body = req.body as ProjectUpdateRequest;

    // Basic validation
    if (body.progress !== undefined && (body.progress < 0 || body.progress > 100)) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    if (body.budget !== undefined && body.budget < 0) {
      return res.status(400).json({ error: 'Budget cannot be negative' });
    }

    if (body.qualityScore !== undefined && (body.qualityScore < 0 || body.qualityScore > 100)) {
      return res.status(400).json({ error: 'Quality score must be between 0 and 100' });
    }

    // Update project
    const updatedProject: Project = {
      ...mockProjects[projectIndex],
      name: body.name || mockProjects[projectIndex].name,
      description: body.description || mockProjects[projectIndex].description,
      status: body.status || mockProjects[projectIndex].status,
      progress: body.progress !== undefined ? body.progress : mockProjects[projectIndex].progress,
      startDate: body.startDate || mockProjects[projectIndex].startDate,
      endDate: body.endDate || mockProjects[projectIndex].endDate,
      budget: body.budget !== undefined ? body.budget : mockProjects[projectIndex].budget,
      actualCost: body.actualCost !== undefined ? body.actualCost : mockProjects[projectIndex].actualCost,
      client: body.client || mockProjects[projectIndex].client,
      location: body.location || mockProjects[projectIndex].location,
      contractor: body.contractor || mockProjects[projectIndex].contractor,
      projectManager: body.projectManager || mockProjects[projectIndex].projectManager,
      qualityScore: body.qualityScore !== undefined ? body.qualityScore : mockProjects[projectIndex].qualityScore,
      updatedAt: new Date().toISOString()
    };

    mockProjects[projectIndex] = updatedProject;
    
    console.log('Project updated:', updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// PATCH partial update
router.patch('/:id', (req: Request, res: Response) => {
  console.log(`PATCH /api/projects/${req.params.id} called`);
  try {
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const body = req.body as ProjectUpdateRequest;

    // Basic validation
    if (body.progress !== undefined && (body.progress < 0 || body.progress > 100)) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    if (body.budget !== undefined && body.budget < 0) {
      return res.status(400).json({ error: 'Budget cannot be negative' });
    }

    if (body.qualityScore !== undefined && (body.qualityScore < 0 || body.qualityScore > 100)) {
      return res.status(400).json({ error: 'Quality score must be between 0 and 100' });
    }

    // Partial update - only update provided fields
    const updatedProject: Project = {
      ...mockProjects[projectIndex],
      updatedAt: new Date().toISOString()
    };

    // Safely update each field if provided
    if (body.name !== undefined) updatedProject.name = body.name;
    if (body.description !== undefined) updatedProject.description = body.description;
    if (body.status !== undefined) updatedProject.status = body.status;
    if (body.progress !== undefined) updatedProject.progress = body.progress;
    if (body.startDate !== undefined) updatedProject.startDate = body.startDate;
    if (body.endDate !== undefined) updatedProject.endDate = body.endDate;
    if (body.budget !== undefined) updatedProject.budget = body.budget;
    if (body.actualCost !== undefined) updatedProject.actualCost = body.actualCost;
    if (body.client !== undefined) updatedProject.client = body.client;
    if (body.location !== undefined) updatedProject.location = body.location;
    if (body.contractor !== undefined) updatedProject.contractor = body.contractor;
    if (body.projectManager !== undefined) updatedProject.projectManager = body.projectManager;
    if (body.qualityScore !== undefined) updatedProject.qualityScore = body.qualityScore;

    mockProjects[projectIndex] = updatedProject;
    
    console.log('Project partially updated:', updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', (req: Request, res: Response) => {
  console.log(`DELETE /api/projects/${req.params.id} called`);
  try {
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deletedProject = mockProjects.splice(projectIndex, 1)[0];
    console.log('Project deleted:', deletedProject);
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
