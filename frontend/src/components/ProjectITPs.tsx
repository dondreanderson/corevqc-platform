import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
}

interface ProjectITPsProps {
  project: Project;
}

interface ITP {
  id: string;
  itpNumber: string;
  title: string;
  description: string;
  phase: string;
  activity: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  inspectionType: string;
  inspector: string;
  scheduledDate?: string;
  completedDate?: string;
  checkpoints: number;
  completedCheckpoints: number;
}

const ProjectITPs: React.FC<ProjectITPsProps> = ({ project }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateITP, setShowCreateITP] = useState(false);

  // Mock ITP data
  const itps: ITP[] = [
    {
      id: '1',
      itpNumber: 'ITP-001',
      title: 'Foundation Concrete Pour',
      description: 'Inspection and testing of foundation concrete pour',
      phase: 'Foundation',
      activity: 'Concrete Pour',
      status: 'completed',
      inspectionType: 'Material Test',
      inspector: 'Mike Chen',
      scheduledDate: '2024-06-15',
      completedDate: '2024-06-15',
      checkpoints: 8,
      completedCheckpoints: 8
    },
    {
      id: '2',
      itpNumber: 'ITP-002',
      title: 'Rebar Installation - Floor 1',
      description: 'Visual inspection of rebar placement and spacing',
      phase: 'Structure',
      activity: 'Rebar Installation',
      status: 'in_progress',
      inspectionType: 'Visual',
      inspector: 'Sarah Johnson',
      scheduledDate: '2024-07-05',
      checkpoints: 12,
      completedCheckpoints: 7
    },
    {
      id: '3',
      itpNumber: 'ITP-003',
      title: 'Electrical Rough-in',
      description: 'Inspection of electrical rough-in installation',
      phase: 'MEP',
      activity: 'Electrical Installation',
      status: 'pending',
      inspectionType: 'Dimensional',
      inspector: 'John Smith',
      scheduledDate: '2024-07-10',
      checkpoints: 15,
      completedCheckpoints: 0
    }
  ];

  const statusOptions = [
    { id: 'all', label: 'All ITPs', count: itps.length },
    { id: 'pending', label: 'Pending', count: itps.filter(i => i.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: itps.filter(i => i.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: itps.filter(i => i.status === 'completed').length },
    { id: 'approved', label: 'Approved', count: itps.filter(i => i.status === 'approved').length }
  ];

  const filteredITPs = selectedStatus === 'all' 
    ? itps 
    : itps.filter(itp => itp.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="project-itps">
      <div className="itps-header">
        <div className="header-info">
          <h3>Inspection & Test Plans</h3>
          <span className="itp-count">{filteredITPs.length} ITPs</span>
        </div>
        <button 
          onClick={() => setShowCreateITP(true)}
          className="btn-primary"
        >
          ✅ Create ITP
        </button>
      </div>

      <div className="itps-filters">
        <div className="status-tabs">
          {statusOptions.map((status) => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`status-tab ${selectedStatus === status.id ? 'active' : ''}`}
            >
              {status.label}
              <span className="status-count">({status.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="itps-grid">
        {filteredITPs.map((itp) => (
          <div key={itp.id} className="itp-card">
            <div className="itp-header">
              <div className="itp-number">{itp.itpNumber}</div>
              <span className={`status-badge ${getStatusColor(itp.status)}`}>
                {itp.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="itp-content">
              <h4 className="itp-title">{itp.title}</h4>
              <p className="itp-description">{itp.description}</p>
              
              <div className="itp-details">
                <div className="detail-row">
                  <span className="detail-label">Phase:</span>
                  <span className="detail-value">{itp.phase}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Activity:</span>
                  <span className="detail-value">{itp.activity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{itp.inspectionType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Inspector:</span>
                  <span className="detail-value">{itp.inspector}</span>
                </div>
                {itp.scheduledDate && (
                  <div className="detail-row">
                    <span className="detail-label">Scheduled:</span>
                    <span className="detail-value">{formatDate(itp.scheduledDate)}</span>
                  </div>
                )}
                {itp.completedDate && (
                  <div className="detail-row">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value">{formatDate(itp.completedDate)}</span>
                  </div>
                )}
              </div>

              <div className="itp-progress">
                <div className="progress-header">
                  <span className="progress-label">Checkpoints</span>
                  <span className="progress-text">
                    {itp.completedCheckpoints} / {itp.checkpoints}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(itp.completedCheckpoints, itp.checkpoints)}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {getProgressPercentage(itp.completedCheckpoints, itp.checkpoints)}%
                </span>
              </div>
            </div>

            <div className="itp-actions">
              <button className="action-btn">👁️ View</button>
              <button className="action-btn">✏️ Edit</button>
              <button className="action-btn">📋 Inspect</button>
            </div>
          </div>
        ))}
      </div>

      {filteredITPs.length === 0 && (
        <div className="empty-itps">
          <div className="empty-icon">✅</div>
          <h4>No ITPs found</h4>
          <p>No inspection and test plans match the selected filter</p>
        </div>
      )}

      {showCreateITP && (
        <div className="create-itp-modal">
          <div className="modal-overlay" onClick={() => setShowCreateITP(false)}></div>
          <div className="modal-content">
            <h4>Create Inspection & Test Plan</h4>
            <form className="itp-form">
              <input type="text" placeholder="ITP Title" required />
              <textarea placeholder="Description" rows={3} required></textarea>
              <div className="form-row">
                <select required>
                  <option value="">Select Phase</option>
                  <option value="foundation">Foundation</option>
                  <option value="structure">Structure</option>
                  <option value="mep">MEP</option>
                  <option value="finishes">Finishes</option>
                  <option value="external">External Works</option>
                </select>
                <select required>
                  <option value="">Inspection Type</option>
                  <option value="visual">Visual</option>
                  <option value="dimensional">Dimensional</option>
                  <option value="material_test">Material Test</option>
                  <option value="performance">Performance</option>
                  <option value="safety">Safety</option>
                </select>
              </div>
              <input type="text" placeholder="Activity" required />
              <input type="date" placeholder="Scheduled Date" />
              <select required>
                <option value="">Select Inspector</option>
                <option value="mike_chen">Mike Chen</option>
                <option value="sarah_johnson">Sarah Johnson</option>
                <option value="john_smith">John Smith</option>
                <option value="emily_davis">Emily Davis</option>
              </select>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateITP(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create ITP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectITPs;
