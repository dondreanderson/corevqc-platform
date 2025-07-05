import React from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectTimelineProps {
  project: Project;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const timelineEvents = [
    {
      id: 1,
      title: 'Project Created',
      description: 'Project was created and initialized',
      date: project.createdAt,
      type: 'milestone',
      icon: '🏁',
      completed: true
    },
    {
      id: 2,
      title: 'Planning Phase',
      description: 'Initial planning and design phase',
      date: project.startDate || project.createdAt,
      type: 'phase',
      icon: '📋',
      completed: project.progress > 0
    },
    {
      id: 3,
      title: 'Construction Start',
      description: 'Construction phase begins',
      date: project.startDate,
      type: 'milestone',
      icon: '🚧',
      completed: project.progress > 25
    },
    {
      id: 4,
      title: 'Quality Inspections',
      description: 'Ongoing quality control inspections',
      date: null,
      type: 'ongoing',
      icon: '🔍',
      completed: project.progress > 50
    },
    {
      id: 5,
      title: 'Project Completion',
      description: 'Final completion and handover',
      date: project.endDate,
      type: 'milestone',
      icon: '✅',
      completed: project.progress >= 100
    }
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="project-timeline">
      <div className="timeline-header">
        <h3>Project Timeline</h3>
        <div className="timeline-summary">
          <div className="timeline-stat">
            <span className="stat-label">Start Date:</span>
            <span className="stat-value">{formatDate(project.startDate || null)}</span>
          </div>
          <div className="timeline-stat">
            <span className="stat-label">End Date:</span>
            <span className="stat-value">{formatDate(project.endDate || null)}</span>
          </div>
          <div className="timeline-stat">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">{project.progress}%</span>
          </div>
        </div>
      </div>

      <div className="timeline-container">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className={`timeline-event ${event.completed ? 'completed' : 'pending'}`}>
            <div className="timeline-marker">
              <div className={`marker-icon ${event.type}`}>
                {event.icon}
              </div>
              {index < timelineEvents.length - 1 && (
                <div className={`timeline-line ${event.completed ? 'completed' : 'pending'}`}></div>
              )}
            </div>
            
            <div className="timeline-content">
              <div className="timeline-event-header">
                <h4 className="event-title">{event.title}</h4>
                <span className="event-date">{formatDate(event.date || null)}</span>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-status">
                <span className={`status-indicator ${event.completed ? 'completed' : 'pending'}`}>
                  {event.completed ? '✓ Completed' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-actions">
        <button className="btn-primary">
          📅 Add Milestone
        </button>
        <button className="btn-secondary">
          📊 View Gantt Chart
        </button>
      </div>
    </div>
  );
};

export default ProjectTimeline;
