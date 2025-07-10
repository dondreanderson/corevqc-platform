import React, { useState, useEffect } from 'react';
import './EnhancedNCRManager.css';

const EnhancedNCRManager = () => {
  const [ncrs, setNcrs] = useState([]);
  const [filteredNcrs, setFilteredNcrs] = useState([]);
  const [filters, setFilters] = useState({
    status: 'ALL',
    severity: 'ALL',
    assignee: 'ALL',
    overdue: false,
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedNcr, setSelectedNcr] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    loadNcrs();
    loadTeamMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ncrs, filters]);

  const loadNcrs = async () => {
    setLoading(true);
    try {
      // Mock enhanced NCR data with workflow information
      const mockNcrs = [
        {
          id: '1',
          ncrNumber: 'NCR-001',
          title: 'Concrete Pour Quality Issue',
          description: 'Concrete mix does not meet specified strength requirements',
          severity: 'HIGH',
          status: 'ASSIGNED',
          category: 'Quality Control',
          location: 'Building A - Foundation',
          dueDate: '2024-01-25T00:00:00Z',
          createdAt: '2024-01-15T10:30:00Z',
          assignedTo: {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            role: 'SUPERVISOR'
          },
          reportedBy: {
            firstName: 'Jane',
            lastName: 'Smith'
          },
          project: {
            id: 'proj-1',
            name: 'Downtown Office Complex'
          },
          workflow: {
            currentStep: 'INVESTIGATION',
            steps: [
              { name: 'REPORTED', status: 'COMPLETED', completedAt: '2024-01-15T10:30:00Z', completedBy: 'Jane Smith' },
              { name: 'ASSIGNED', status: 'COMPLETED', completedAt: '2024-01-15T11:00:00Z', completedBy: 'System' },
              { name: 'INVESTIGATION', status: 'IN_PROGRESS', startedAt: '2024-01-15T11:00:00Z' },
              { name: 'RESOLUTION', status: 'PENDING' },
              { name: 'APPROVAL', status: 'PENDING' },
              { name: 'CLOSED', status: 'PENDING' }
            ]
          },
          comments: [
            {
              id: '1',
              text: 'Initial investigation started. Checking concrete batch records.',
              author: 'John Doe',
              createdAt: '2024-01-15T14:00:00Z',
              type: 'INVESTIGATION'
            }
          ],
          attachments: [],
          escalationLevel: 0,
          isOverdue: false
        },
        {
          id: '2',
          ncrNumber: 'NCR-002',
          title: 'Steel Beam Alignment Issue',
          description: 'Steel beam not aligned to specifications',
          severity: 'MEDIUM',
          status: 'PENDING_APPROVAL',
          category: 'Construction',
          location: 'Building A - Level 2',
          dueDate: '2024-01-20T00:00:00Z',
          createdAt: '2024-01-10T09:15:00Z',
          assignedTo: {
            id: 'user-2',
            firstName: 'Mike',
            lastName: 'Johnson',
            role: 'INSPECTOR'
          },
          reportedBy: {
            firstName: 'Sarah',
            lastName: 'Wilson'
          },
          project: {
            id: 'proj-1',
            name: 'Downtown Office Complex'
          },
          workflow: {
            currentStep: 'APPROVAL',
            steps: [
              { name: 'REPORTED', status: 'COMPLETED', completedAt: '2024-01-10T09:15:00Z', completedBy: 'Sarah Wilson' },
              { name: 'ASSIGNED', status: 'COMPLETED', completedAt: '2024-01-10T10:00:00Z', completedBy: 'System' },
              { name: 'INVESTIGATION', status: 'COMPLETED', completedAt: '2024-01-12T16:00:00Z', completedBy: 'Mike Johnson' },
              { name: 'RESOLUTION', status: 'COMPLETED', completedAt: '2024-01-14T14:00:00Z', completedBy: 'Mike Johnson' },
              { name: 'APPROVAL', status: 'IN_PROGRESS', startedAt: '2024-01-14T14:30:00Z' },
              { name: 'CLOSED', status: 'PENDING' }
            ]
          },
          comments: [
            {
              id: '2',
              text: 'Beam realigned and re-measured. Within tolerance now.',
              author: 'Mike Johnson',
              createdAt: '2024-01-14T14:00:00Z',
              type: 'RESOLUTION'
            }
          ],
          attachments: [
            { id: '1', name: 'realignment_photos.jpg', type: 'image' }
          ],
          escalationLevel: 0,
          isOverdue: true
        }
      ];
      setNcrs(mockNcrs);
    } catch (error) {
      console.error('Failed to load NCRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // Mock team members data
      const mockTeamMembers = [
        { id: 'user-1', firstName: 'John', lastName: 'Doe', role: 'SUPERVISOR' },
        { id: 'user-2', firstName: 'Mike', lastName: 'Johnson', role: 'INSPECTOR' },
        { id: 'user-3', firstName: 'Sarah', lastName: 'Wilson', role: 'MANAGER' },
        { id: 'user-4', firstName: 'Lisa', lastName: 'Brown', role: 'INSPECTOR' }
      ];
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...ncrs];

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(ncr => ncr.status === filters.status);
    }

    if (filters.severity !== 'ALL') {
      filtered = filtered.filter(ncr => ncr.severity === filters.severity);
    }

    if (filters.assignee !== 'ALL') {
      filtered = filtered.filter(ncr => ncr.assignedTo?.id === filters.assignee);
    }

    if (filters.overdue) {
      filtered = filtered.filter(ncr => ncr.isOverdue);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ncr => 
        ncr.title.toLowerCase().includes(searchLower) ||
        ncr.ncrNumber.toLowerCase().includes(searchLower) ||
        ncr.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredNcrs(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'OPEN': 'status-red',
      'ASSIGNED': 'status-blue',
      'IN_PROGRESS': 'status-orange',
      'PENDING_APPROVAL': 'status-purple',
      'RESOLVED': 'status-green',
      'CLOSED': 'status-gray'
    };
    return colors[status] || 'status-gray';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'CRITICAL': 'severity-critical',
      'HIGH': 'severity-high',
      'MEDIUM': 'severity-medium',
      'LOW': 'severity-low'
    };
    return colors[severity] || 'severity-medium';
  };

  const getWorkflowProgress = (workflow) => {
    const completed = workflow.steps.filter(step => step.status === 'COMPLETED').length;
    return Math.round((completed / workflow.steps.length) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleAssignNCR = (ncr) => {
    setSelectedNcr(ncr);
    setShowAssignModal(true);
  };

  const handleResolveNCR = (ncr) => {
    setSelectedNcr(ncr);
    setShowResolveModal(true);
  };

  const handleApproveNCR = async (ncrId) => {
    try {
      // API call to approve NCR
      console.log('Approving NCR:', ncrId);
      // Reload NCRs after approval
      await loadNcrs();
    } catch (error) {
      console.error('Failed to approve NCR:', error);
    }
  };

  const ncrStats = {
    total: ncrs.length,
    open: ncrs.filter(n => n.status === 'OPEN').length,
    assigned: ncrs.filter(n => n.status === 'ASSIGNED').length,
    inProgress: ncrs.filter(n => n.status === 'IN_PROGRESS').length,
    pendingApproval: ncrs.filter(n => n.status === 'PENDING_APPROVAL').length,
    overdue: ncrs.filter(n => n.isOverdue).length,
    critical: ncrs.filter(n => n.severity === 'CRITICAL').length
  };

  if (loading) {
    return (
      <div className="enhanced-ncr-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="enhanced-ncr-manager">
      <div className="enhanced-ncr-header">
        <h1>Enhanced NCR Management</h1>
        <p>Advanced Non-Conformance Report workflow management</p>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="enhanced-ncr-stats">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <p className="stat-label">Total NCRs</p>
            <p className="stat-value">{ncrStats.total}</p>
          </div>
        </div>

        <div className="stat-card open">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <p className="stat-label">Open</p>
            <p className="stat-value">{ncrStats.open}</p>
          </div>
        </div>

        <div className="stat-card assigned">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <p className="stat-label">Assigned</p>
            <p className="stat-value">{ncrStats.assigned}</p>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{ncrStats.inProgress}</p>
          </div>
        </div>

        <div className="stat-card approval">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Pending Approval</p>
            <p className="stat-value">{ncrStats.pendingApproval}</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Overdue</p>
            <p className="stat-value">{ncrStats.overdue}</p>
          </div>
        </div>

        <div className="stat-card critical">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <p className="stat-label">Critical</p>
            <p className="stat-value">{ncrStats.critical}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="enhanced-ncr-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search NCRs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Assignees</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.firstName} {member.lastName}
            </option>
          ))}
        </select>

        <label className="overdue-filter">
          <input
            type="checkbox"
            checked={filters.overdue}
            onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
          />
          <span>Show Overdue Only</span>
        </label>

        <button className="create-button">
          + Create NCR
        </button>
      </div>

      {/* Enhanced NCR Cards */}
      <div className="enhanced-ncr-grid">
        {filteredNcrs.map((ncr) => (
          <div key={ncr.id} className={`enhanced-ncr-card ${ncr.isOverdue ? 'overdue' : ''}`}>
            <div className="ncr-card-header">
              <div className="ncr-number">{ncr.ncrNumber}</div>
              <div className="ncr-badges">
                <span className={`status-badge ${getStatusColor(ncr.status)}`}>
                  {ncr.status.replace('_', ' ')}
                </span>
                <span className={`severity-badge ${getSeverityColor(ncr.severity)}`}>
                  {ncr.severity}
                </span>
                {ncr.isOverdue && (
                  <span className="overdue-badge">
                    {getDaysOverdue(ncr.dueDate)} days overdue
                  </span>
                )}
              </div>
            </div>

            <div className="ncr-card-content">
              <h3 className="ncr-title">{ncr.title}</h3>
              <p className="ncr-description">{ncr.description}</p>

              <div className="ncr-details">
                <div className="detail-row">
                  <span className="detail-label">Project:</span>
                  <span className="detail-value">{ncr.project.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{ncr.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Reported by:</span>
                  <span className="detail-value">
                    {ncr.reportedBy.firstName} {ncr.reportedBy.lastName}
                  </span>
                </div>
                {ncr.assignedTo && (
                  <div className="detail-row">
                    <span className="detail-label">Assigned to:</span>
                    <span className="detail-value">
                      {ncr.assignedTo.firstName} {ncr.assignedTo.lastName} ({ncr.assignedTo.role})
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Due Date:</span>
                  <span className="detail-value">{formatDate(ncr.dueDate)}</span>
                </div>
              </div>

              {/* Workflow Progress */}
              <div className="workflow-section">
                <div className="workflow-header">
                  <span>Workflow Progress</span>
                  <span>{getWorkflowProgress(ncr.workflow)}%</span>
                </div>
                <div className="workflow-progress">
                  <div 
                    className="workflow-fill" 
                    style={{ width: `${getWorkflowProgress(ncr.workflow)}%` }}
                  ></div>
                </div>
                <div className="workflow-steps">
                  {ncr.workflow.steps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`workflow-step ${step.status.toLowerCase()} ${step.name === ncr.workflow.currentStep ? 'current' : ''}`}
                    >
                      <div className="step-indicator">
                        {step.status === 'COMPLETED' ? '✅' : 
                         step.status === 'IN_PROGRESS' ? '🔄' : '⏳'}
                      </div>
                      <div className="step-info">
                        <div className="step-name">{step.name.replace('_', ' ')}</div>
                        {step.completedAt && (
                          <div className="step-time">
                            {formatDateTime(step.completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Comments */}
              {ncr.comments.length > 0 && (
                <div className="comments-section">
                  <p className="comments-title">Recent Activity</p>
                  <div className="comments-list">
                    {ncr.comments.slice(-2).map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-time">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {ncr.attachments.length > 0 && (
                <div className="attachments-section">
                  <p className="attachments-title">Attachments ({ncr.attachments.length})</p>
                  <div className="attachments-list">
                    {ncr.attachments.map((attachment) => (
                      <div key={attachment.id} className="attachment-item">
                        📎 {attachment.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Actions */}
            <div className="ncr-card-actions">
              <button className="action-btn view-btn">
                👁️ View Details
              </button>
              
              {ncr.status === 'OPEN' && (
                <button 
                  className="action-btn assign-btn"
                  onClick={() => handleAssignNCR(ncr)}
                >
                  👤 Assign
                </button>
              )}

              {(ncr.status === 'ASSIGNED' || ncr.status === 'IN_PROGRESS') && (
                <button 
                  className="action-btn resolve-btn"
                  onClick={() => handleResolveNCR(ncr)}
                >
                  ✅ Resolve
                </button>
              )}

              {ncr.status === 'PENDING_APPROVAL' && (
                <button 
                  className="action-btn approve-btn"
                  onClick={() => handleApproveNCR(ncr.id)}
                >
                  ✅ Approve
                </button>
              )}

              <button className="action-btn comment-btn">
                💬 Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNcrs.length === 0 && (
        <div className="no-ncrs">
          <div className="no-ncrs-icon">📋</div>
          <p>No NCRs found matching your criteria</p>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedNcr && (
        <AssignmentModal 
          ncr={selectedNcr}
          teamMembers={teamMembers}
          onClose={() => setShowAssignModal(false)}
          onAssign={(ncrId, assigneeId) => {
            console.log('Assigning NCR:', ncrId, 'to:', assigneeId);
            setShowAssignModal(false);
            loadNcrs();
          }}
        />
      )}

      {/* Resolution Modal */}
      {showResolveModal && selectedNcr && (
        <ResolutionModal 
          ncr={selectedNcr}
          onClose={() => setShowResolveModal(false)}
          onResolve={(ncrId, resolutionData) => {
            console.log('Resolving NCR:', ncrId, resolutionData);
            setShowResolveModal(false);
            loadNcrs();
          }}
        />
      )}
    </div>
  );
};

// Assignment Modal Component
const AssignmentModal = ({ ncr, teamMembers, onClose, onAssign }) => {
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAssignee) {
      onAssign(ncr.id, {
        assigneeId: selectedAssignee,
        dueDate,
        priority,
        notes
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Assign NCR: {ncr.ncrNumber}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Assign to:</label>
            <select 
              value={selectedAssignee} 
              onChange={(e) => setSelectedAssignee(e.target.value)}
              required
            >
              <option value="">Select team member...</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Due Date:</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assignment Notes:</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows="3"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-assign">
              Assign NCR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Resolution Modal Component
const ResolutionModal = ({ ncr, onClose, onResolve }) => {
  const [resolutionType, setResolutionType] = useState('CORRECTIVE_ACTION');
  const [description, setDescription] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [preventiveActions, setPreventiveActions] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onResolve(ncr.id, {
      resolutionType,
      description,
      rootCause,
      preventiveActions,
      attachments
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content resolution-modal">
        <div className="modal-header">
          <h3>Resolve NCR: {ncr.ncrNumber}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Resolution Type:</label>
            <select 
              value={resolutionType} 
              onChange={(e) => setResolutionType(e.target.value)}
            >
              <option value="CORRECTIVE_ACTION">Corrective Action</option>
              <option value="REWORK">Rework Required</option>
              <option value="ACCEPT_AS_IS">Accept As-Is</option>
              <option value="REJECT">Reject/Replace</option>
            </select>
          </div>

          <div className="form-group">
            <label>Resolution Description:</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the actions taken to resolve this NCR..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Root Cause Analysis:</label>
            <textarea 
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="What was the root cause of this non-conformance?"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Preventive Actions:</label>
            <textarea 
              value={preventiveActions}
              onChange={(e) => setPreventiveActions(e.target.value)}
              placeholder="What actions will prevent this issue from recurring?"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attachments:</label>
            <input 
              type="file" 
              multiple 
              onChange={(e) => setAttachments(Array.from(e.target.files))}
              accept="image/*,.pdf,.doc,.docx"
            />
            <small>Upload photos, documents, or other evidence</small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-resolve">
              Submit Resolution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedNCRManager;