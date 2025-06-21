import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProject, clearCurrentProject, deleteProject } from '../store/projectSlice';
import toast from 'react-hot-toast';
import '../styles/projectDetails.css';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentProject: project, isLoading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
    }
    
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/projects');
    }
  }, [error, navigate]);

  const handleDeleteProject = async () => {
    if (!project || !id) return;
    
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success('Project deleted successfully');
        navigate('/projects');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="project-details-loading">
        <div className="spinner-large"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-error">
        <h2>Project not found</h2>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          ← Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="nav-logo">🏗️</span>
            <h1 className="nav-title">COREVQC</h1>
            <span className="nav-subtitle">Quality Control Platform</span>
          </div>
          
          <div className="nav-menu">
            <button className="nav-item" onClick={() => navigate('/dashboard')}>
              🏠 Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate('/projects')}>
              📋 Projects
            </button>
            <button className="nav-item active">
              📄 Project Details
            </button>
          </div>
          
          <div className="nav-user">
            <div className="user-info">
              <span className="user-greeting">Welcome back,</span>
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button className="logout-btn" onClick={() => navigate('/login')}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Project Header */}
      <div className="project-header">
        <div className="project-header-content">
          <div className="project-header-main">
            <button 
              className="back-button"
              onClick={() => navigate('/projects')}
            >
              ← Back to Projects
            </button>
            
            <div className="project-title-section">
              <h1 className="project-title">{project.name}</h1>
              <div className="project-badges">
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
            </div>
          </div>

          <div className="project-actions">
            <button 
              className="btn-secondary"
              onClick={() => navigate(`/projects/${project.id}/edit`)}
            >
              ✏️ Edit Project
            </button>
            {user?.id === project.owner.id && (
              <button 
                className="btn-danger"
                onClick={handleDeleteProject}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="project-progress">
          <div className="progress-info">
            <span className="progress-label">Project Progress</span>
            <span className="progress-value">{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="project-content">
        {/* Tabs */}
        <div className="project-tabs">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'team', label: '👥 Team', icon: '👥' },
            { id: 'documents', label: '📄 Documents', icon: '📄' },
            { id: 'activity', label: '📈 Activity', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* Project Information */}
                <div className="info-card">
                  <h3>📋 Project Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Description</label>
                      <span>{project.description || 'No description provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>Project Type</label>
                      <span>{project.projectType || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <label>Location</label>
                      <span>{project.location || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <label>Budget</label>
                      <span>{project.budget ? `$${project.budget.toLocaleString()}` : 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <label>Start Date</label>
                      <span>{project.startDate ? formatDate(project.startDate) : 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <label>End Date</label>
                      <span>{project.endDate ? formatDate(project.endDate) : 'Not set'}</span>
                    </div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="stats-card">
                  <h3>📊 Quick Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <div className="stat-number">{project._count?.members || 0}</div>
                        <div className="stat-label">Team Members</div>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">📄</div>
                      <div className="stat-content">
                        <div className="stat-number">{project._count?.documents || 0}</div>
                        <div className="stat-label">Documents</div>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-number">{project._count?.inspections || 0}</div>
                        <div className="stat-label">Inspections</div>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">⚠️</div>
                      <div className="stat-content">
                        <div className="stat-number">{project._count?.ncrs || 0}</div>
                        <div className="stat-label">NCRs</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                {(project.clientName || project.clientContact) && (
                  <div className="client-card">
                    <h3>👤 Client Information</h3>
                    <div className="client-info">
                      {project.clientName && (
                        <div className="client-item">
                          <label>Client Name</label>
                          <span>{project.clientName}</span>
                        </div>
                      )}
                      {project.clientContact && (
                        <div className="client-item">
                          <label>Contact</label>
                          <span>{project.clientContact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-tab">
              <div className="team-header">
                <h3>👥 Project Team</h3>
                <button className="btn-primary" onClick={() => toast.info('Team management coming soon!')}>
                  ➕ Add Member
                </button>
              </div>

              <div className="team-grid">
                {/* Project Owner */}
                <div className="team-member owner">
                  <div className="member-avatar">👑</div>
                  <div className="member-info">
                    <div className="member-name">{project.owner.firstName} {project.owner.lastName}</div>
                    <div className="member-role">Project Owner</div>
                    <div className="member-email">{project.owner.email}</div>
                  </div>
                  <div className="member-badge owner-badge">Owner</div>
                </div>

                {/* Team Members */}
                {project.members && project.members.length > 0 ? (
                  project.members.map((member) => (
                    <div key={member.id} className="team-member">
                      <div className="member-avatar">👤</div>
                      <div className="member-info">
                        <div className="member-name">{member.user.firstName} {member.user.lastName}</div>
                        <div className="member-role">{member.role.toLowerCase()}</div>
                        <div className="member-email">{member.user.email}</div>
                      </div>
                      <div className="member-badge">{member.role}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-members">
                    <div className="no-members-icon">👥</div>
                    <h4>No additional team members</h4>
                    <p>Add team members to collaborate on this project</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-tab">
              <div className="documents-header">
                <h3>📄 Project Documents</h3>
                <button className="btn-primary" onClick={() => toast.info('Document upload coming soon!')}>
                  📤 Upload Document
                </button>
              </div>

              {project.documents && project.documents.length > 0 ? (
                <div className="documents-grid">
                  {project.documents.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <div className="document-icon">📄</div>
                      <div className="document-info">
                        <div className="document-name">{doc.name}</div>
                        <div className="document-meta">
                          <span>Uploaded by {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                        <div className="document-type">{doc.documentType}</div>
                      </div>
                      <button className="document-download" onClick={() => toast.info('Download functionality coming soon!')}>
                        ⬇️
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-documents">
                  <div className="no-documents-icon">📄</div>
                  <h4>No documents uploaded</h4>
                  <p>Upload project documents, drawings, specifications, and other files</p>
                  <button className="btn-primary" onClick={() => toast.info('Document upload coming soon!')}>
                    📤 Upload First Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-tab">
              <h3>📈 Recent Activity</h3>
              
              <div className="activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon">🏗️</div>
                  <div className="activity-content">
                    <div className="activity-title">Project created</div>
                    <div className="activity-meta">
                      by {project.owner.firstName} {project.owner.lastName} • {formatDate(project.createdAt)}
                    </div>
                  </div>
                </div>

                {project.inspections && project.inspections.map((inspection) => (
                  <div key={inspection.id} className="activity-item">
                    <div className="activity-icon">✅</div>
                    <div className="activity-content">
                      <div className="activity-title">Inspection: {inspection.title}</div>
                      <div className="activity-meta">
                        by {inspection.inspector.firstName} {inspection.inspector.lastName} • {formatDate(inspection.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}

                {project.ncrs && project.ncrs.map((ncr) => (
                  <div key={ncr.id} className="activity-item">
                    <div className="activity-icon">⚠️</div>
                    <div className="activity-content">
                      <div className="activity-title">NCR: {ncr.title}</div>
                      <div className="activity-meta">
                        by {ncr.reportedBy.firstName} {ncr.reportedBy.lastName} • {formatDate(ncr.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}

                {(!project.inspections?.length && !project.ncrs?.length) && (
                  <div className="no-activity">
                    <div className="no-activity-icon">📈</div>
                    <h4>No recent activity</h4>
                    <p>Project activity will appear here as work progresses</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
