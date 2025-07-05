import React from 'react';

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

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode, onView, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'status-planning';
      case 'in_progress':
      case 'active':
        return 'status-active';
      case 'on_hold':
        return 'status-on-hold';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'urgent':
        return 'priority-urgent';
      default:
        return 'priority-medium';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`project-card ${viewMode}`}>
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="project-title" onClick={onView} style={{ cursor: 'pointer' }}>
            {project.name}
          </h3>
          <div className="project-badges">
            <span className={`status-badge ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
            <span className={`priority-badge ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        <div className="card-actions">
          <button 
            onClick={onView}
            className="btn-icon"
            title="View project details"
          >
            👁️
          </button>
          <button 
            onClick={onEdit}
            className="btn-icon"
            title="Edit project"
          >
            ✏️
          </button>
          <button 
            onClick={onDelete}
            className="btn-icon delete"
            title="Delete project"
          >
            🗑️
          </button>
        </div>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-details">
        {project.clientName && (
          <div className="detail-item">
            <span className="detail-label">Client:</span>
            <span className="detail-value">{project.clientName}</span>
          </div>
        )}
        
        {project.projectType && (
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{project.projectType}</span>
          </div>
        )}
        
        {project.location && (
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{project.location}</span>
          </div>
        )}
        
        {project.budget && (
          <div className="detail-item">
            <span className="detail-label">Budget:</span>
            <span className="detail-value">{formatCurrency(project.budget)}</span>
          </div>
        )}
      </div>

      <div className="project-progress">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="project-dates">
        {project.startDate && (
          <div className="date-item">
            <span className="date-label">Start:</span>
            <span className="date-value">{formatDate(project.startDate)}</span>
          </div>
        )}
        {project.endDate && (
          <div className="date-item">
            <span className="date-label">End:</span>
            <span className="date-value">{formatDate(project.endDate)}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <span className="created-date">
          Created {formatDate(project.createdAt)}
        </span>
        <button onClick={onView} className="btn-view-details">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
