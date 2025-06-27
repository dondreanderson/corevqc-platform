import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectOverview from '../components/ProjectOverview';
import QualityControlDashboard from '../components/QualityControlDashboard';
import type { Project, EnhancedProject, ProjectStatus, ProjectPriority } from '../types/project';

// API Response type
interface ProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

// Transform basic Project to EnhancedProject
const transformToEnhancedProject = (project: Project): EnhancedProject => {
  // Map status string to ProjectStatus enum
  const mapStatus = (status?: string): ProjectStatus => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in_progress':
      case 'in-progress':
        return 'in-progress';
      case 'completed':
      case 'done':
        return 'completed';
      case 'on_hold':
      case 'on-hold':
      case 'paused':
        return 'on-hold';
      case 'cancelled':
      case 'canceled':
        return 'cancelled';
      default:
        return 'planning';
    }
  };

  // Determine priority based on endDate and other factors
  const determinePriority = (project: Project): ProjectPriority => {
    if (project.endDate) {
      const deadline = new Date(project.endDate);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDeadline <= 7) return 'high';
      if (daysUntilDeadline <= 30) return 'medium';
    }
    return 'low';
  };

  // Calculate completion percentage
  const calculateCompletion = (project: Project): number => {
    if (project.progress !== undefined) return Math.max(0, Math.min(100, project.progress));

    const status = mapStatus(project.status);
    switch (status) {
      case 'completed': return 100;
      case 'in-progress': return 50;
      case 'on-hold': return 25;
      case 'cancelled': return 0;
      default: return 10;
    }
  };

  return {
    id: project.id,
    title: project.name,
    description: project.description || 'No description provided',
    status: mapStatus(project.status),
    priority: determinePriority(project),
    completion: calculateCompletion(project),
    startDate: project.startDate || project.createdAt || new Date().toISOString(),
    endDate: project.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    budget: project.budget || 0,
    spent: Math.floor((project.budget || 0) * (calculateCompletion(project) / 100)),
    teamSize: 1, // Default team size
    owner: 'Project Owner', // Default owner
    tags: [],
    milestones: [],
    risks: [],
    lastUpdated: project.updatedAt || new Date().toISOString()
  };
};

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'quality'>('overview');
  const [project, setProject] = useState(null);
  const [enhancedProject, setEnhancedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock project data for demo purposes
  React.useEffect(() => {
    if (id) {
      // Simulate API call with mock data
      const mockProject: Project = {
        id: id,
        name: `Project ${id}`,
        description: 'This is a sample project for demonstration',
        status: 'in_progress',
        progress: 65,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        budget: 250000,
        location: 'Downtown Construction Site',
        client: 'ABC Corporation',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      };

      setProject(mockProject);
      setEnhancedProject(transformToEnhancedProject(mockProject));
      setLoading(false);
    }
  }, [id]);

  // Handle project actions from ProjectOverview
  const handleProjectAction = async (action: string, data?: any) => {
    switch (action) {
      case 'edit':
        console.log('Edit project:', data);
        break;
      case 'save':
        console.log('Save project:', data);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this project?')) {
          navigate('/projects');
        }
        break;
      case 'refresh':
        console.log('Refresh project');
        break;
      default:
        console.log(`Unhandled action: ${action}`, data);
    }
  };

  // Loading state
  if (loading) {
    return (
      
        
        Loading project details...
      
    );
  }

  // Error state
  if (error) {
    return (
      
        
          
            
              
                
              
            
            
              Error Loading Project
              {error}
            
          
          
             navigate('/projects')}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Back to Projects
            
          
        
      
    );
  }

  // No project found
  if (!project || !enhancedProject) {
    return (
      
        
          Project Not Found
          The requested project could not be found.
           navigate('/projects')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Back to Projects
          
        
      
    );
  }

  // Main render
  return (
    
      {/* Header */}
      
        
          
            
               navigate('/projects')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                
                  
                
                Back to Projects
              
            
            
              
                Last updated: {new Date(enhancedProject.lastUpdated).toLocaleDateString()}
              
            
          
        
      

      {/* Tab Navigation */}
      
        
          
             setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              Project Overview
            
             setActiveTab('quality')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quality'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              Quality Control
            
          
        
      

      {/* Tab Content */}
      
        {activeTab === 'overview' && enhancedProject && (
          
        )}

        {activeTab === 'quality' && (
          
        )}
      
    
  );
};

export default ProjectDetails;