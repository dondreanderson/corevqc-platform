import React, { useState, useEffect } from 'react';

const QualityControlDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h2 style={{ color: '#374151' }}>Loading Quality Control Dashboard...</h2>
        </div>
      </div>
    );
  }

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
                24
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
                8
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
                3
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
                87%
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
        textAlign: 'center'
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
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Create NCR
          </button>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            View All NCRs
          </button>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Add inline keyframes for spin animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default QualityControlDashboard;
