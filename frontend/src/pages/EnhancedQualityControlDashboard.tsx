import React, { useState, useEffect } from 'react';

interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location?: string;
  createdAt: string;
  reportedBy?: string;
}

const EnhancedQualityControlDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNCRList, setShowNCRList] = useState(false);
  const [ncrs, setNCRs] = useState<NCR[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for development
  const mockNCRs: NCR[] = [
    {
      id: '1',
      ncrNumber: 'NCR-001',
      title: 'Concrete Quality Issue',
      description: 'Concrete strength below specification',
      severity: 'HIGH',
      status: 'OPEN',
      category: 'Quality',
      location: 'Foundation Block A',
      createdAt: '2025-01-05T10:30:00Z',
      reportedBy: 'John Smith'
    },
    {
      id: '2',
      ncrNumber: 'NCR-002',
      title: 'Safety Equipment Missing',
      description: 'PPE not available at worksite',
      severity: 'CRITICAL',
      status: 'IN_PROGRESS',
      category: 'Safety',
      location: 'Level 5',
      createdAt: '2025-01-04T14:15:00Z',
      reportedBy: 'Sarah Johnson'
    }
  ];

  useEffect(() => {
    // Load NCRs from API or use mock data
    setNCRs(mockNCRs);
  }, []);

  const handleCreateNCR = () => {
    setShowCreateModal(true);
  };

  const handleViewAllNCRs = () => {
    setShowNCRList(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowNCRList(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#3b82f6';
      case 'LOW': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#ef4444';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'RESOLVED': return '#10b981';
      case 'CLOSED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Calculate metrics
  const totalNCRs = ncrs.length;
  const openNCRs = ncrs.filter(ncr => ncr.status === 'OPEN' || ncr.status === 'IN_PROGRESS').length;
  const criticalNCRs = ncrs.filter(ncr => ncr.severity === 'CRITICAL').length;
  const qualityScore = totalNCRs > 0 ? Math.round(((totalNCRs - openNCRs) / totalNCRs) * 100) : 87;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '2rem' 
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: '0 0 0.5rem 0' 
        }}>
          Quality Control Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.9, 
          margin: 0 
        }}>
          Monitor and manage Non-Conformance Reports (NCRs)
        </p>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: '0 0 0.5rem 0' 
              }}>
                Total NCRs
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                margin: 0 
              }}>
                {totalNCRs}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📊
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: '0 0 0.5rem 0' 
              }}>
                Open NCRs
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#ef4444', 
                margin: 0 
              }}>
                {openNCRs}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🔓
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: '0 0 0.5rem 0' 
              }}>
                Critical NCRs
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#f59e0b', 
                margin: 0 
              }}>
                {criticalNCRs}
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ⚠️
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: '0 0 0.5rem 0' 
              }}>
                Quality Score
              </p>
              <p style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#10b981', 
                margin: 0 
              }}>
                {qualityScore}%
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#d1fae5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ⭐
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          Quality Control Actions
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleCreateNCR}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Create NCR
          </button>
          <button 
            onClick={handleViewAllNCRs}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            View All NCRs
          </button>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent NCRs */}
      {ncrs.length > 0 && (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#1f2937', 
            marginBottom: '1.5rem' 
          }}>
            Recent NCRs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ncrs.slice(0, 3).map((ncr) => (
              <div key={ncr.id} style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '1.1rem', 
                      color: '#1f2937' 
                    }}>
                      {ncr.ncrNumber} - {ncr.title}
                    </h4>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: '#6b7280', 
                      fontSize: '0.9rem' 
                    }}>
                      {ncr.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: getSeverityColor(ncr.severity) + '20',
                        color: getSeverityColor(ncr.severity),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {ncr.severity}
                      </span>
                      <span style={{
                        backgroundColor: getStatusColor(ncr.status) + '20',
                        color: getStatusColor(ncr.status),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {ncr.status.replace('_', ' ')}
                      </span>
                      <span style={{
                        color: '#6b7280',
                        fontSize: '0.75rem'
                      }}>
                        📍 {ncr.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Modals */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Create New NCR</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              NCR creation form will be implemented here with all the fields for title, description, severity, category, etc.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCloseModal}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}>
                Create NCR
              </button>
            </div>
          </div>
        </div>
      )}

      {showNCRList && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>All NCRs</h2>
              <button 
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ncrs.map((ncr) => (
                <div key={ncr.id} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>
                        {ncr.ncrNumber} - {ncr.title}
                      </h4>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        {ncr.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{
                          backgroundColor: getSeverityColor(ncr.severity) + '20',
                          color: getSeverityColor(ncr.severity),
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {ncr.severity}
                        </span>
                        <span style={{
                          backgroundColor: getStatusColor(ncr.status) + '20',
                          color: getStatusColor(ncr.status),
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {ncr.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQualityControlDashboard;
