import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProjects, deleteProject, clearError } from '../store/projectSlice';
import toast from 'react-hot-toast';
import '../styles/projects.css';

export const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, isLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return '#6b7280';
      case 'IN_PROGRESS': return '#2563eb';
      case 'ON_HOLD': return '#f59e0b';
      case 'COMPLETED': return '#059669';
      case 'CANCELLED': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#059669';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#dc2626';
      case 'URGENT': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'ALL') return true;
    return project.status === filter;
  });

  const statusCounts = {
    ALL: projects.length,
    PLANNING: projects.filter(p => p.status === 'PLANNING').length,
    IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
    ON_HOLD: projects.filter(p => p.status === 'ON_HOLD').length,
    COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
  };

  if (isLoading) {
    return (
      <div className="projects-loading">
        <div className="spinner-large"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
     <nav className="navbar">
  <div className="nav-container">
    <div className="nav-brand">
      <span className="nav-logo">🏗️</span>
      <h1 className="nav-title">COREVQC</h1>
      <span className="nav-subtitle">Quality Control Platform</span>
    </div>
    
    <div className="nav-menu">
      <button 
        className="nav-item"
        onClick={() => navigate('/dashboard')}
      >
        🏠 Dashboard
      </button>
      <button 
        className="nav-item active"
        onClick={() => navigate('/projects')}
      >
        📋 Projects
      </button>
      <button 
        className="nav-item"
        onClick={() => navigate('/projects/new')}
      >
        ➕ New Project
      </button>
    </div>
    
    <div className="nav-user">
      <div className="user-info">
        <span className="user-greeting">Welcome back,</span>
        <span className="user-name">{user?.firstName} {user?.lastName}</span>
        <span className="user-role">{user?.role}</span>
      </div>
      <button className="logout-btn" onClick={() => {
        // Add logout functionality
        navigate('/login');
      }}>
        <span>🚪</span> Logout
      </button>
    </div>
  </div>
</nav>
      <div className="projects-header">
        <div className="projects-title">
          <h1>📋 Projects</h1>
          <p>Manage your construction projects and track progress</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/projects/new')}
        >
          ➕ New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="projects-filters">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.replace('_', ' ')} ({count})
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <div className="no-projects-icon">📋</div>
            <h3>No projects found</h3>
            <p>
              {filter === 'ALL' 
                ? "You haven't created any projects yet." 
                : `No projects with status "${filter.replace('_', ' ')}".`
              }
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <h3 
                  className="project-name"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {project.name}
                </h3>
                <div className="project-actions">
                  <button
                    className="btn-icon"
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                    title="Edit project"
                  >
                    ✏️
                  </button>
                  {user?.id === project.owner.id && (
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div className="project-info">
                <div className="project-meta">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(project.priority) }}
                  >
                    {project.priority}
                  </span>
                </div>

                <p className="project-description">
                  {project.description || 'No description provided'}
                </p>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Owner:</span>
                    <span>{project.owner.firstName} {project.owner.lastName}</span>
                  </div>
                  
                  {project.clientName && (
                    <div className="detail-item">
                      <span className="detail-label">Client:</span>
                      <span>{project.clientName}</span>
                    </div>
                  )}
                  
                  {project.location && (
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span>{project.location}</span>
                    </div>
                  )}

                  {project.budget && (
                    <div className="detail-item">
                      <span className="detail-label">Budget:</span>
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                {project._count && (
                  <div className="project-stats">
                    <div className="stat-item">
                      <span className="stat-icon">📄</span>
                      <span>{project._count.documents} docs</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">✅</span>
                      <span>{project._count.inspections} inspections</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">⚠️</span>
                      <span>{project._count.ncrs} NCRs</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
