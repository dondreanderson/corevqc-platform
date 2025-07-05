import React, { useState, useEffect } from 'react';
import CreateProject from '../components/CreateProject';
import ProjectCard from '../components/ProjectCard';
import ProjectFilters from '../components/ProjectFilters';
import '../styles/Projects.css';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  budget?: number;
  clientName?: string;
  clientContact?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched projects:', data);
      setProjects(data);
      setFilteredProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, priorityFilter, sortBy]);

  const handleProjectCreated = () => {
    setShowCreateForm(false);
    fetchProjects();
  };

  const handleEditProject = (project: Project) => {
    console.log('Edit project:', project);
    // TODO: Implement edit functionality
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${projectId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProjects();
        } else {
          throw new Error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Projects</h2>
          <p>{error}</p>
          <button onClick={fetchProjects} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Projects</h1>
            <p>Manage your construction projects and track progress</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              <span className="btn-icon">+</span>
              New Project
            </button>
          </div>
        </div>
      </div>

      <ProjectFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalProjects={projects.length}
        filteredCount={filteredProjects.length}
      />

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          {projects.length === 0 ? (
            <>
              <div className="empty-icon">🏗️</div>
              <h3>No projects yet</h3>
              <p>Create your first project to get started with COREVQC</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Create First Project
              </button>
            </>
          ) : (
            <>
              <div className="empty-icon">🔍</div>
              <h3>No projects match your filters</h3>
              <p>Try adjusting your search terms or filters</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={`projects-content ${viewMode}`}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateProject
          onProjectCreated={handleProjectCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Projects;
