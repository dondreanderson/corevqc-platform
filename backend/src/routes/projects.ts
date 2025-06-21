import { Router } from 'express';

const router = Router();

// Mock data for testing
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

// GET all projects
router.get('/', (req, res) => {
  console.log('GET /api/projects called');
  res.json(mockProjects);
});

// GET single project
router.get('/:id', (req, res) => {
  console.log(`GET /api/projects/${req.params.id} called`);
  const project = mockProjects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// POST new project
router.post('/', (req, res) => {
  console.log('POST /api/projects called');
  const newProject = {
    id: String(Date.now()),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

export default router;
