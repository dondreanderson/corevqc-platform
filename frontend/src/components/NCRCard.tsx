import React from 'react';

interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location?: string;
  dueDate?: string;
  createdAt: string;
  reportedBy?: {
    firstName?: string;
    lastName?: string;
  };
}

interface NCRCardProps {
  ncr: NCR;
  viewMode: 'grid' | 'list';
  onUpdate: () => void;
}

const NCRCard: React.FC<NCRCardProps> = ({ ncr, viewMode, onUpdate }) => {
  const getSeverityClass = (severity: string) => {
    return `severity-${severity.toLowerCase()}`;
  };

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && ncr.status !== 'CLOSED';
  };

  return (
    <div className={`ncr-card ${viewMode}`}>
      <div className="ncr-card-header">
        <div className="ncr-number">{ncr.ncrNumber}</div>
        <div className="ncr-badges">
          <span className={`ncr-badge ${getSeverityClass(ncr.severity)}`}>
            {ncr.severity}
          </span>
          <span className={`ncr-badge ${getStatusClass(ncr.status)}`}>
            {ncr.status.replace('_', ' ')}
          </span>
          {isOverdue(ncr.dueDate) && (
            <span className="ncr-badge overdue">OVERDUE</span>
          )}
        </div>
      </div>

      <div className="ncr-card-content">
        <h3 className="ncr-title">{ncr.title}</h3>
        <p className="ncr-description">{ncr.description}</p>
        
        <div className="ncr-meta">
          {ncr.category && (
            <div className="ncr-meta-item">
              <span className="label">Category:</span>
              <span className="value">{ncr.category}</span>
            </div>
          )}
          {ncr.location && (
            <div className="ncr-meta-item">
              <span className="label">Location:</span>
              <span className="value">{ncr.location}</span>
            </div>
          )}
          <div className="ncr-meta-item">
            <span className="label">Created:</span>
            <span className="value">{formatDate(ncr.createdAt)}</span>
          </div>
          {ncr.dueDate && (
            <div className="ncr-meta-item">
              <span className="label">Due:</span>
              <span className={`value ${isOverdue(ncr.dueDate) ? 'overdue-text' : ''}`}>
                {formatDate(ncr.dueDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="ncr-card-actions">
        <button className="btn-small btn-primary">View</button>
        <button className="btn-small btn-secondary">Edit</button>
        <button className="btn-small btn-outline">Assign</button>
      </div>
    </div>
  );
};

export default NCRCard;
