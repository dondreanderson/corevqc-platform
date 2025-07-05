import React, { useState, useEffect } from 'react';
import CreateNCR from '../components/CreateNCR';
import NCRCard from '../components/NCRCard';
import NCRFilters from '../components/NCRFilters';
import '../styles/qualitycontrol.css';

interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location?: string;
  correctiveAction?: string;
  rootCause?: string;
  dueDate?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  reportedById: string;
  reportedBy?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

interface QualityMetrics {
  totalNCRs: number;
  openNCRs: number;
  criticalNCRs: number;
  overdue: number;
  qualityScore: number;
  averageResolutionTime: number;
}

const QualityControlDashboard: React.FC = () => {
  const [ncrs, setNCRs] = useState<NCR[]>([]);
  const [filteredNCRs, setFilteredNCRs] = useState<NCR[]>([]);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchNCRs();
    fetchMetrics();
  }, []);

  useEffect(() => {
    filterNCRs();
  }, [ncrs, searchTerm, statusFilter, severityFilter, categoryFilter]);

  const fetchNCRs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ncrs`);
      if (response.ok) {
        const data = await response.json();
        setNCRs(data);
      } else {
        // Mock data for development
        const mockNCRs: NCR[] = [
          {
            id: '1',
            ncrNumber: 'NCR-001',
            title: 'Concrete Quality Issue',
            description: 'Concrete strength below specification requirements',
            severity: 'HIGH',
            status: 'OPEN',
            category: 'Quality',
            location: 'Foundation Block A',
            createdAt: '2025-01-05T10:30:00Z',
            updatedAt: '2025-01-05T10:30:00Z',
            projectId: 'proj1',
            reportedById: 'user1',
            dueDate: '2025-01-10T00:00:00Z'
          },
          {
            id: '2',
            ncrNumber: 'NCR-002',
            title: 'Safety Equipment Missing',
            description: 'Personal protective equipment not available at worksite',
            severity: 'CRITICAL',
            status: 'IN_PROGRESS',
            category: 'Safety',
            location: 'Level 5 Construction Area',
            createdAt: '2025-01-04T14:15:00Z',
            updatedAt: '2025-01-05T09:20:00Z',
            projectId: 'proj1',
            reportedById: 'user2',
            dueDate: '2025-01-06T00:00:00Z'
          }
        ];
        setNCRs(mockNCRs);
      }
    } catch (err) {
      console.error('Error fetching NCRs:', err);
      setError('Failed to load NCRs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ncrs/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        // Mock metrics
        setMetrics({
          totalNCRs: 15,
          openNCRs: 8,
          criticalNCRs: 3,
          overdue: 2,
          qualityScore: 85,
          averageResolutionTime: 4.5
        });
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  const filterNCRs = () => {
    let filtered = [...ncrs];

    if (searchTerm) {
      filtered = filtered.filter(ncr =>
        ncr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ncr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ncr.ncrNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ncr => ncr.status === statusFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(ncr => ncr.severity === severityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ncr => ncr.category === categoryFilter);
    }

    setFilteredNCRs(filtered);
  };

  const handleNCRCreated = () => {
    setShowCreateModal(false);
    fetchNCRs();
    fetchMetrics();
  };

  const handleNCRUpdated = () => {
    fetchNCRs();
    fetchMetrics();
  };

  if (loading) {
    return (
      <div className="quality-dashboard-container">
        <div className="quality-loading">
          <div className="quality-spinner"></div>
          <p>Loading Quality Control Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quality-dashboard-container">
      {/* Header */}
      <div className="quality-header">
        <div className="quality-header-content">
          <h1>Quality Control Dashboard</h1>
          <p>Monitor and manage Non-Conformance Reports (NCRs)</p>
          <div className="quality-header-actions">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + Create NCR
            </button>
            <button className="btn-secondary">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="quality-metrics">
          <div className="metric-card">
            <div className="metric-icon total">📊</div>
            <div className="metric-value">{metrics.totalNCRs}</div>
            <div className="metric-label">Total NCRs</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon open">🔓</div>
            <div className="metric-value">{metrics.openNCRs}</div>
            <div className="metric-label">Open NCRs</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon critical">⚠️</div>
            <div className="metric-value">{metrics.criticalNCRs}</div>
            <div className="metric-label">Critical</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon overdue">⏰</div>
            <div className="metric-value">{metrics.overdue}</div>
            <div className="metric-label">Overdue</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon score">⭐</div>
            <div className="metric-value">{metrics.qualityScore}%</div>
            <div className="metric-label">Quality Score</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="quality-main">
        <div className="quality-content">
          {/* Filters */}
          <NCRFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalCount={ncrs.length}
            filteredCount={filteredNCRs.length}
          />

          {/* NCR List */}
          {filteredNCRs.length === 0 ? (
            <div className="quality-empty-state">
              <div className="empty-icon">📋</div>
              <h3>No NCRs Found</h3>
              <p>
                {ncrs.length === 0 
                  ? 'No NCRs have been created yet.'
                  : 'No NCRs match your current filters.'
                }
              </p>
              {ncrs.length === 0 && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  Create First NCR
                </button>
              )}
            </div>
          ) : (
            <div className={`quality-ncr-list ${viewMode}`}>
              {filteredNCRs.map((ncr) => (
                <NCRCard
                  key={ncr.id}
                  ncr={ncr}
                  viewMode={viewMode}
                  onUpdate={handleNCRUpdated}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create NCR Modal */}
      {showCreateModal && (
        <CreateNCR
          onNCRCreated={handleNCRCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default QualityControlDashboard;
