import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/projectdetails.css';

// TypeScript interfaces
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
  organizationId?: string;
  ownerId?: string;
}

interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  totalNCRs: number;
  openNCRs: number;
  totalInspections: number;
  passedInspections: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  date?: string | null; // Made optional and nullable
  title?: string;
  user: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'team' | 'files'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projectResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/projects/${id}`);
      if (!projectResponse.ok) {
        throw new Error('Failed to fetch project details');
      }
      const projectData = await projectResponse.json();
      setProject(projectData);

      // Mock data for stats
      setStats({
        totalTasks: 24,
        completedTasks: 12,
        activeTasks: 8,
        overdueTasks: 4,
        totalNCRs: 5,
        openNCRs: 2,
        totalInspections: 15,
        passedInspections: 12
      });

      // Mock data for activities with proper date handling
      setActivities([
        {
          id: '1',
          type: 'inspection',
          description: 'Foundation inspection completed',
          timestamp: '2025-01-05T10:30:00Z',
          date: '2025-01-05T10:30:00Z',
          title: 'Foundation Inspection',
          user: 'John Smith'
        },
        {
          id: '2',
          type: 'ncr',
          description: 'NCR-001 reported for concrete quality',
          timestamp: '2025-01-04T14:15:00Z',
          date: '2025-01-04T14:15:00Z',
          title: 'Quality Issue NCR',
          user: 'Sarah Johnson'
        },
        {
          id: '3',
          type: 'document',
          description: 'Updated project blueprints uploaded',
          timestamp: '2025-01-03T09:45:00Z',
          date: '2025-01-03T09:45:00Z',
          title: 'Blueprint Update',
          user: 'Mike Davis'
        }
      ]);

      // Mock data for team members
      setTeamMembers([
        { id: '1', name: 'John Smith', role: 'Project Manager' },
        { id: '2', name: 'Sarah Johnson', role: 'Quality Inspector' },
        { id: '3', name: 'Mike Davis', role: 'Site Engineer' },
        { id: '4', name: 'Lisa Chen', role: 'Safety Officer' }
      ]);

      // Mock data for files
      setFiles([
        { id: '1', name: 'Project_Blueprint_v2.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2025-01-03T09:45:00Z', uploadedBy: 'Mike Davis' },
        { id: '2', name: 'Safety_Report_Q1.docx', type: 'Word', size: '1.2 MB', uploadedAt: '2025-01-02T16:20:00Z', uploadedBy: 'Lisa Chen' },
        { id: '3', name: 'Quality_Checklist.xlsx', type: 'Excel', size: '890 KB', uploadedAt: '2025-01-01T11:10:00Z', uploadedBy: 'Sarah Johnson' }
      ]);

    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date available';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date available';
    
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getBadgeClass = (status: string, type: 'status' | 'priority') => {
    const baseClass = 'project-details-badge';
    const statusClass = `${baseClass} ${status.toLowerCase().replace('_', '-')}`;
    return statusClass;
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'word':
        return '📝';
      case 'excel':
        return '📊';
      case 'image':
        return '🖼️';
      default:
        return '📁';
    }
  };

  if (loading) {
    return (
      <div className="project-details-container">
        <div className="project-details-loading">
          <div className="project-details-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-container">
        <div className="project-details-error">
          <h2>Error Loading Project</h2>
          <p>{error || 'Project not found'}</p>
          <button onClick={() => navigate('/projects')} className="project-details-btn project-details-btn-primary">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-container project-details-fade-in">
      {/* Header */}
      <div className="project-details-header">
        <div className="project-details-header-content">
          <div className="project-details-breadcrumb">
            <Link to="/projects">Projects</Link>
            <span>/</span>
            <span>{project.name}</span>
          </div>
          
          <h1 className="project-details-title">{project.name}</h1>
          
          <div className="project-details-meta">
            <span className={getBadgeClass(project.status, 'status')}>
              {project.status.replace('_', ' ')}
            </span>
            <span className={getBadgeClass(project.priority, 'priority')}>
              {project.priority} Priority
            </span>
            {project.location && (
              <span className="project-details-badge">
                📍 {project.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="project-details-main">
        {/* Content Area */}
        <div className="project-details-content">
          {/* Progress Section */}
          <div className="project-details-card">
            <div className="project-details-progress-section">
              <h3>
                <svg className="project-details-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Project Progress
              </h3>
              <div className="project-details-progress-bar">
                <div 
                  className="project-details-progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="project-details-progress-text">
                {project.progress}% Complete
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="project-details-card">
            <div className="project-details-tabs">
              <button 
                className={`project-details-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`project-details-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                Timeline
              </button>
              <button 
                className={`project-details-tab ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                Team
              </button>
              <button 
                className={`project-details-tab ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
              >
                Files
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="project-details-info-grid">
                <div className="project-details-info-item">
                  <div className="project-details-info-label">Description</div>
                  <div className="project-details-info-value">
                    {project.description || 'No description available'}
                  </div>
                </div>
                <div className="project-details-info-item">
                  <div className="project-details-info-label">Client</div>
                  <div className="project-details-info-value">
                    {project.clientName || 'Not specified'}
                  </div>
                </div>
                <div className="project-details-info-item">
                  <div className="project-details-info-label">Project Type</div>
                  <div className="project-details-info-value">
                    {project.projectType || 'Not specified'}
                  </div>
                </div>
                <div className="project-details-info-item">
                  <div className="project-details-info-label">Start Date</div>
                  <div className="project-details-info-value">
                    {formatDate(project.startDate)}
                  </div>
                </div>
                <div className="project-details-info-item">
                  <div className="project-details-info-label">End Date</div>
                  <div className="project-details-info-value">
                    {formatDate(project.endDate)}
                  </div>
                </div>
                <div className="project-details-info-item">
                  <div className="project-details-info-label">Budget</div>
                  <div className="project-details-info-value">
                    {project.budget ? `$${project.budget.toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="project-details-timeline">
                {activities.map((activity) => (
                  <div key={activity.id} className="project-details-timeline-item">
                    <div className="project-details-timeline-date">
                      {formatDateTime(activity.date || activity.timestamp)}
                    </div>
                    <div className="project-details-timeline-content">
                      {activity.title && (
                        <div className="timeline-event-header">
                          <h4 className="event-title">{activity.title}</h4>
                        </div>
                      )}
                      <p className="event-description">{activity.description}</p>
                      <div className="project-details-text-muted">by {activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'team' && (
              <div className="project-details-team">
                {teamMembers.map((member) => (
                  <div key={member.id} className="project-details-team-member">
                    <div className="project-details-team-avatar">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div>{member.name}</div>
                      <div className="project-details-text-muted">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="project-details-files">
                {files.map((file) => (
                  <div key={file.id} className="project-details-file">
                    <div className="project-details-file-icon">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="project-details-file-info">
                      <div className="project-details-file-name">{file.name}</div>
                      <div className="project-details-file-meta">
                        {file.size} • Uploaded {formatDateTime(file.uploadedAt)} by {file.uploadedBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="project-details-sidebar">
          {/* Quick Actions */}
          <div className="project-details-card">
            <h3>Quick Actions</h3>
            <div className="project-details-actions">
              <button className="project-details-btn project-details-btn-primary">
                Create NCR
              </button>
              <button className="project-details-btn project-details-btn-secondary">
                Schedule Inspection
              </button>
              <button className="project-details-btn project-details-btn-outline">
                Upload Document
              </button>
              <button className="project-details-btn project-details-btn-outline">
                Generate Report
              </button>
            </div>
          </div>

          {/* Project Stats */}
          {stats && (
            <div className="project-details-card">
              <h3>Project Statistics</h3>
              <div className="project-details-stats">
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Total Tasks</span>
                  <span className="project-details-stat-value">{stats.totalTasks}</span>
                </div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Completed</span>
                  <span className="project-details-stat-value project-details-text-success">{stats.completedTasks}</span>
                </div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Active</span>
                  <span className="project-details-stat-value">{stats.activeTasks}</span>
                </div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Overdue</span>
                  <span className="project-details-stat-value project-details-text-error">{stats.overdueTasks}</span>
                </div>
                <div className="project-details-divider"></div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Total NCRs</span>
                  <span className="project-details-stat-value">{stats.totalNCRs}</span>
                </div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Open NCRs</span>
                  <span className="project-details-stat-value project-details-text-warning">{stats.openNCRs}</span>
                </div>
                <div className="project-details-divider"></div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Inspections</span>
                  <span className="project-details-stat-value">{stats.totalInspections}</span>
                </div>
                <div className="project-details-stat">
                  <span className="project-details-stat-label">Passed</span>
                  <span className="project-details-stat-value project-details-text-success">{stats.passedInspections}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;