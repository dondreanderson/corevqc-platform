import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectOverview } from '../components/ProjectOverview';
import type { EnhancedProject, ProjectStatus, ProjectPriority } from '../types/project';

// Existing COREVQC Project type (basic structure)
interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  team_members?: string[];
  budget?: number;
  deadline?: string;
  progress?: number;
}

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

  // Determine priority based on deadline and other factors
  const determinePriority = (project: Project): ProjectPriority => {
    if (project.deadline) {
      const deadline = new Date(project.deadline);
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
    startDate: project.created_at || new Date().toISOString(),
    endDate: project.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Default 90 days
    budget: project.budget || 0,
    spent: Math.floor((project.budget || 0) * (calculateCompletion(project) / 100)), // Estimate spent based on completion
    teamSize: project.team_members?.length || 1,
    owner: project.owner_id || 'Unknown',
    tags: [], // Default empty tags
    milestones: [], // Default empty milestones
    risks: [], // Default empty risks
    lastUpdated: project.updated_at || new Date().toISOString()
  };
};

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [project, setProject] = useState<Project | null>(null);
  const [enhancedProject, setEnhancedProject] = useState<EnhancedProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  // Fetch project data
  const fetchProject = async () => {
    if (!id) {
      setError('Project ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ProjectResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch project');
      }

      setProject(result.data);
      setEnhancedProject(transformToEnhancedProject(result.data));
      setFormData(result.data);

    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (updatedData: Partial<Project>) => {
    if (!id || !project) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ProjectResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update project');
      }

      setProject(result.data);
      setEnhancedProject(transformToEnhancedProject(result.data));
      setFormData(result.data);
      setIsEditing(false);

    } catch (err) {
      console.error('Error updating project:', err);
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProject(formData);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle project actions from ProjectOverview
  const handleProjectAction = async (action: string, data?: any) => {
    switch (action) {
      case 'edit':
        setIsEditing(true);
        break;
      case 'save':
        if (data) {
          // Transform enhanced project data back to basic project format
          const basicProjectData: Partial<Project> = {
            name: data.title,
            description: data.description,
            status: data.status,
            budget: data.budget,
            deadline: data.endDate,
            progress: data.completion
          };
          await updateProject(basicProjectData);
        }
        break;
      case 'cancel':
        setIsEditing(false);
        setFormData(project || {});
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this project?')) {
          try {
            const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (response.ok) {
              navigate('/projects');
            }
          } catch (err) {
            setError('Failed to delete project');
          }
        }
        break;
      case 'refresh':
        await fetchProject();
        break;
      default:
        console.log(`Unhandled action: ${action}`, data);
    }
  };

  // Load project on component mount or ID change
  useEffect(() => {
    fetchProject();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading project details...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Project</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchProject}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="ml-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No project found
  if (!project || !enhancedProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The requested project could not be found.</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Projects
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date(enhancedProject.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legacy Form (Hidden when using ProjectOverview) */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => handleProjectAction('cancel')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Enhanced Project Overview */}
        <ProjectOverview
          project={enhancedProject}
          onAction={handleProjectAction}
          isEditable={true}
          showActions={true}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
