import React, { useState } from 'react';

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

interface ProjectOverviewProps {
  project: Project;
  onStatusChange: (status: string) => void;
  onProgressUpdate: (progress: number) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  onStatusChange, 
  onProgressUpdate 
}) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(project.progress);

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
      month: 'long',
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

  const handleProgressSubmit = () => {
    if (newProgress >= 0 && newProgress <= 100) {
      onProgressUpdate(newProgress);
      setIsEditingProgress(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!project.endDate) return null;
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="project-overview">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>Project Status</h3>
            <select 
              value={project.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`status-select ${getStatusColor(project.status)}`}
            >
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Progress</h3>
            {isEditingProgress ? (
              <div className="progress-edit">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(parseInt(e.target.value) || 0)}
                  className="progress-input"
                />
                <button onClick={handleProgressSubmit} className="btn-save">✓</button>
                <button onClick={() => setIsEditingProgress(false)} className="btn-cancel">✕</button>
              </div>
            ) : (
              <div className="progress-display" onClick={() => setIsEditingProgress(true)}>
                <span className="progress-percentage">{project.progress}%</span>
                <button className="edit-progress-btn">✏️</button>
              </div>
            )}
          </div>
          <div className="progress-bar-large">
            <div 
              className="progress-fill" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Priority</h3>
            <span className={`priority-badge-large ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>

        {daysRemaining !== null && (
          <div className="metric-card">
            <div className="metric-header">
              <h3>Days Remaining</h3>
              <span className={`days-remaining ${daysRemaining < 7 ? 'urgent' : daysRemaining < 30 ? 'warning' : 'normal'}`}>
                {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="info-grid">
        <div className="info-section">
          <h3>Project Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Project Type:</span>
              <span className="info-value">{project.projectType || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{project.location || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">{formatDate(project.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Client Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Client Name:</span>
              <span className="info-value">{project.clientName || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact:</span>
              <span className="info-value">{project.clientContact || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Timeline</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Start Date:</span>
              <span className="info-value">
                {project.startDate ? formatDate(project.startDate) : 'Not set'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">End Date:</span>
              <span className="info-value">
                {project.endDate ? formatDate(project.endDate) : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Budget</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Total Budget:</span>
              <span className="info-value budget">
                {project.budget ? formatCurrency(project.budget) : 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn ncr">
            📋 Create NCR
          </button>
          <button className="action-btn itp">
            ✅ Create ITP
          </button>
          <button className="action-btn document">
            📁 Upload Document
          </button>
          <button className="action-btn inspection">
            🔍 Schedule Inspection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
