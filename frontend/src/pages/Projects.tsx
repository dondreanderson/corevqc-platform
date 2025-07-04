import React, { useState, useEffect } from 'react';
import CreateProject from '../components/CreateProject';
import '../styles/Projects.css';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Full URL:', `${process.env.REACT_APP_API_URL}/api/projects`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projects`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched projects:', data);
      setProjects(data);
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

  const handleProjectCreated = () => {
    setShowCreateForm(false);
    fetchProjects(); // Refresh the projects list
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="error">
          <h2>Error Loading Projects</h2>
          <p>{error}</p>
          <button onClick={fetchProjects}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Manage your construction projects and track progress</p>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          New Project/Export
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              
              <div className="project-details">
                {project.clientName && (
                  <div className="detail-item">
                    <strong>Client:</strong> {project.clientName}
                  </div>
                )}
                
                {project.projectType && (
                  <div className="detail-item">
                    <strong>Type:</strong> {project.projectType}
                  </div>
                )}
                
                {project.location && (
                  <div className="detail-item">
                    <strong>Location:</strong> {project.location}
                  </div>
                )}
                
                {project.budget && (
                  <div className="detail-item">
                    <strong>Budget:</strong> ${Number(project.budget).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="project-progress">
                <div className="progress-label">
                  Progress: {project.progress || 0}%
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
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
