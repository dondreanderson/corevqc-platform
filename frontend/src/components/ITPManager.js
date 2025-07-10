import React, { useState, useEffect } from 'react';
import './ITPManager.css';

const ITPManager = () => {
  const [itps, setItps] = useState([]);
  const [filteredItps, setFilteredItps] = useState([]);
  const [filters, setFilters] = useState({
    status: 'ALL',
    inspectionType: 'ALL',
    projectId: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItp, setSelectedItp] = useState(null);

  useEffect(() => {
    loadItps();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [itps, filters]);

  const loadItps = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockItps = [
        {
          id: '1',
          itpNumber: 'ITP-001',
          title: 'Foundation Concrete Pour',
          description: 'Inspection of foundation concrete pour for Building A',
          phase: 'Foundation',
          activity: 'Concrete Pour',
          status: 'PENDING',
          inspectionType: 'VISUAL',
          scheduledAt: '2024-01-20T09:00:00Z',
          location: 'Building A - Foundation',
          requirements: ['Check concrete mix', 'Verify rebar placement', 'Test slump'],
          holdPoints: ['Pre-pour inspection', 'Post-pour curing'],
          checkpoints: [
            { id: '1', description: 'Concrete mix verification', status: 'PENDING' },
            { id: '2', description: 'Rebar placement check', status: 'PENDING' },
            { id: '3', description: 'Slump test', status: 'PENDING' }
          ],
          project: { id: 'proj-1', name: 'Downtown Office Complex' },
          inspector: { firstName: 'John', lastName: 'Doe' }
        },
        {
          id: '2',
          itpNumber: 'ITP-002',
          title: 'Steel Frame Inspection',
          description: 'Structural steel frame inspection',
          phase: 'Structure',
          activity: 'Steel Installation',
          status: 'IN_PROGRESS',
          inspectionType: 'DIMENSIONAL',
          scheduledAt: '2024-01-22T14:00:00Z',
          location: 'Building A - Level 1',
          requirements: ['Measure beam alignment', 'Check weld quality'],
          holdPoints: ['Pre-welding inspection'],
          checkpoints: [
            { id: '4', description: 'Beam alignment check', status: 'PASSED' },
            { id: '5', description: 'Weld quality inspection', status: 'PENDING' }
          ],
          project: { id: 'proj-1', name: 'Downtown Office Complex' },
          inspector: { firstName: 'Jane', lastName: 'Smith' }
        }
      ];
      setItps(mockItps);
    } catch (error) {
      console.error('Failed to load ITPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...itps];

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(itp => itp.status === filters.status);
    }

    if (filters.inspectionType !== 'ALL') {
      filtered = filtered.filter(itp => itp.inspectionType === filters.inspectionType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(itp => 
        itp.title.toLowerCase().includes(searchLower) ||
        itp.itpNumber.toLowerCase().includes(searchLower) ||
        itp.phase.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItps(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'status-yellow',
      'IN_PROGRESS': 'status-blue',
      'COMPLETED': 'status-green',
      'APPROVED': 'status-green',
      'REJECTED': 'status-red'
    };
    return colors[status] || 'status-gray';
  };

  const getInspectionTypeColor = (type) => {
    const colors = {
      'VISUAL': 'type-blue',
      'DIMENSIONAL': 'type-green',
      'MATERIAL_TEST': 'type-orange',
      'PERFORMANCE': 'type-purple',
      'SAFETY': 'type-red'
    };
    return colors[type] || 'type-gray';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProgressPercentage = (checkpoints) => {
    if (!checkpoints || checkpoints.length === 0) return 0;
    const passed = checkpoints.filter(cp => cp.status === 'PASSED').length;
    return Math.round((passed / checkpoints.length) * 100);
  };

  const handleStartInspection = (itp) => {
    setSelectedItp(itp);
    // Here you would navigate to inspection interface or open modal
    console.log('Starting inspection for:', itp.itpNumber);
  };

  const itpStats = {
    total: itps.length,
    pending: itps.filter(i => i.status === 'PENDING').length,
    inProgress: itps.filter(i => i.status === 'IN_PROGRESS').length,
    completed: itps.filter(i => i.status === 'COMPLETED' || i.status === 'APPROVED').length
  };

  if (loading) {
    return (
      <div className="itp-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="itp-manager">
      <div className="itp-header">
        <h1>ITP Management</h1>
        <p>Inspection & Test Plan Management</p>
      </div>

      {/* Stats Cards */}
      <div className="itp-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <p className="stat-label">Total ITPs</p>
            <p className="stat-value">{itpStats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{itpStats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{itpStats.inProgress}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{itpStats.completed}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="itp-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search ITPs..."
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
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={filters.inspectionType}
          onChange={(e) => setFilters({ ...filters, inspectionType: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Types</option>
          <option value="VISUAL">Visual</option>
          <option value="DIMENSIONAL">Dimensional</option>
          <option value="MATERIAL_TEST">Material Test</option>
          <option value="PERFORMANCE">Performance</option>
          <option value="SAFETY">Safety</option>
        </select>

        <button
          onClick={() => setShowCreateModal(true)}
          className="create-button"
        >
          + Create ITP
        </button>
      </div>

      {/* ITP Cards Grid */}
      <div className="itp-grid">
        {filteredItps.map((itp) => (
          <div key={itp.id} className="itp-card">
            <div className="itp-card-header">
              <div className="itp-number">{itp.itpNumber}</div>
              <div className="itp-badges">
                <span className={`status-badge ${getStatusColor(itp.status)}`}>
                  {itp.status}
                </span>
                <span className={`type-badge ${getInspectionTypeColor(itp.inspectionType)}`}>
                  {itp.inspectionType}
                </span>
              </div>
            </div>

            <div className="itp-card-content">
              <h3 className="itp-title">{itp.title}</h3>
              <p className="itp-description">{itp.description}</p>

              <div className="itp-details">
                <div className="detail-item">
                  <span className="detail-label">Phase:</span>
                  <span className="detail-value">{itp.phase}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Activity:</span>
                  <span className="detail-value">{itp.activity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{itp.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Inspector:</span>
                  <span className="detail-value">
                    {itp.inspector.firstName} {itp.inspector.lastName}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Scheduled:</span>
                  <span className="detail-value">
                    {formatDate(itp.scheduledAt)} at {formatTime(itp.scheduledAt)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{getProgressPercentage(itp.checkpoints)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProgressPercentage(itp.checkpoints)}%` }}
                  ></div>
                </div>
              </div>

              {/* Checkpoints Preview */}
              <div className="checkpoints-preview">
                <p className="checkpoints-title">Checkpoints ({itp.checkpoints.length})</p>
                <div className="checkpoints-list">
                  {itp.checkpoints.slice(0, 3).map((checkpoint) => (
                    <div key={checkpoint.id} className="checkpoint-item">
                      <span className={`checkpoint-status ${checkpoint.status.toLowerCase()}`}>
                        {checkpoint.status === 'PASSED' ? '✅' : 
                         checkpoint.status === 'FAILED' ? '❌' : '⏳'}
                      </span>
                      <span className="checkpoint-desc">{checkpoint.description}</span>
                    </div>
                  ))}
                  {itp.checkpoints.length > 3 && (
                    <div className="checkpoint-more">
                      +{itp.checkpoints.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {/* Hold Points */}
              {itp.holdPoints.length > 0 && (
                <div className="hold-points">
                  <p className="hold-points-title">Hold Points ({itp.holdPoints.length})</p>
                  <div className="hold-points-list">
                    {itp.holdPoints.map((point, index) => (
                      <span key={index} className="hold-point-tag">
                        🛑 {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="itp-card-actions">
              <button 
                className="action-btn view-btn"
                onClick={() => setSelectedItp(itp)}
              >
                👁️ View Details
              </button>
              
              {itp.status === 'PENDING' && (
                <button 
                  className="action-btn start-btn"
                  onClick={() => handleStartInspection(itp)}
                >
                  ▶️ Start Inspection
                </button>
              )}
              
              {itp.status === 'IN_PROGRESS' && (
                <button 
                  className="action-btn continue-btn"
                  onClick={() => handleStartInspection(itp)}
                >
                  🔄 Continue
                </button>
              )}
              
              <button className="action-btn edit-btn">
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItps.length === 0 && (
        <div className="no-itps">
          <div className="no-itps-icon">📋</div>
          <p>No ITPs found matching your criteria</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="create-first-btn"
          >
            Create Your First ITP
          </button>
        </div>
      )}
    </div>
  );
};

export default ITPManager;