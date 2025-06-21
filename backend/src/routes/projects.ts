import { Router } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

// Mock data for testing (replace with database later)
let mockProjects = [
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
    riskLevel: "medium",
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
    riskLevel: "low",
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
    riskLevel: "low",
    createdAt: "2023-08-01T07:00:00Z",
    updatedAt: "2024-05-30T16:00:00Z"
  }
];

// Validation rules for project updates
const projectValidationRules = [
  body('name').notEmpty().withMessage('Project name is required').isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  body('description').notEmpty().withMessage('Description is required').isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
  body('status').isIn(['planning', 'active', 'on-hold', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('startDate').isISO8601().withMessage('Invalid start date format'),
  body('endDate').isISO8601().withMessage('Invalid end date format'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('client').notEmpty().withMessage('Client is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('contractor').optional().isLength({ max: 100 }).withMessage('Contractor name too long'),
  body('projectManager').optional().isLength({ max: 100 }).withMessage('Project manager name too long'),
  body('qualityScore').optional().isInt({ min: 0, max: 100 }).withMessage('Quality score must be between 0 and 100'),
  body('riskLevel').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid risk level')
];

// GET all projects
router.get('/', (req, res) => {
  try {
    console.log('GET /api/projects called');
    res.json(mockProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', (req, res) => {
  try {
    console.log(`GET /api/projects/${req.params.id} called`);
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

// PUT update entire project
router.put('/:id', projectValidationRules, (req, res) => {
  try {
    console.log(`PUT /api/projects/${req.params.id} called`);
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate date logic
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Update project (keep original id, createdAt)
    const updatedProject = {
      ...req.body,
      id: req.params.id,
      createdAt: mockProjects[projectIndex].createdAt,
      updatedAt: new Date().toISOString()
    };

    mockProjects[projectIndex] = updatedProject;
    
    console.log('Project updated successfully:', updatedProject.name);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// PATCH update partial project
router.patch('/:id', (req, res) => {
  try {
    console.log(`PATCH /api/projects/${req.params.id} called`);
    
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate only provided fields
    const allowedFields = ['name', 'description', 'status', 'progress', 'startDate', 'endDate', 
                          'budget', 'actualCost', 'client', 'location', 'contractor', 
                          'projectManager', 'qualityScore', 'riskLevel'];
    
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Basic validation for provided fields
    if (updateData.progress && (updateData.progress < 0 || updateData.progress > 100)) {
      return res.status(400).json({ error: 'Progress must be between 0 and 100' });
    }

    if (updateData.budget && updateData.budget < 0) {
      return res.status(400).json({ error: 'Budget must be positive' });
    }

    if (updateData.qualityScore && (updateData.qualityScore < 0 || updateData.qualityScore > 100)) {
      return res.status(400).json({ error: 'Quality score must be between 0 and 100' });
    }

    // Update project with partial data
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    mockProjects[projectIndex] = updatedProject;
    
    console.log('Project partially updated:', updatedProject.name);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', (req, res) => {
  try {
    console.log(`DELETE /api/projects/${req.params.id} called`);
    
    const projectIndex = mockProjects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deletedProject = mockProjects[projectIndex];
    mockProjects.splice(projectIndex, 1);
    
    console.log('Project deleted:', deletedProject.name);
    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST create new project
router.post('/', projectValidationRules, (req, res) => {
  try {
    console.log('POST /api/projects called');
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    // Validate date logic
    if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const newProject = {
      id: String(Date.now()), // Simple ID generation
      ...req.body,
      actualCost: req.body.actualCost || 0,
      qualityScore: req.body.qualityScore || 0,
      riskLevel: req.body.riskLevel || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockProjects.push(newProject);
    
    console.log('Project created successfully:', newProject.name);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;