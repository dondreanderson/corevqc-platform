import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('👋 Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Navigation Header */}
      <nav className="navbar">
       <div className="nav-container">
        <div className="nav-brand">
      <span className="nav-logo">🏗️</span>
      <h1 className="nav-title">COREVQC</h1>
      <span className="nav-subtitle">Quality Control Platform</span>
    </div>
    
    <div className="nav-menu">
      <button 
        className="nav-item"
        onClick={() => navigate('/dashboard')}
      >
        🏠 Dashboard
      </button>
      <button 
        className="nav-item"
        onClick={() => navigate('/projects')}
      >
        📋 Projects
      </button>
      <button 
        className="nav-item"
        onClick={() => navigate('/projects/new')}
      >
        ➕ New Project
      </button>
    </div>
    
    <div className="nav-user">
      <div className="user-info">
        <span className="user-greeting">Welcome back,</span>
        <span className="user-name">{user.firstName} {user.lastName}</span>
        <span className="user-role">{user.role}</span>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </div>
  </div>
</nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>🎉 Welcome to COREVQC Dashboard</h2>
              <p>Manage your construction quality control processes with ease and efficiency.</p>
              <div className="welcome-stats">
                <span>✅ System Active</span>
                <span>🔒 Secure Access</span>
                <span>📊 Real-time Data</span>
              </div>
            </div>
            <div className="welcome-icon">
              <span>🏗️</span>
            </div>
          </div>
        </section>

        {/* User Profile Card */}
        <section className="profile-section">
          <div className="profile-card">
            <h3>👤 Your Profile</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>Full Name</label>
                <span className="profile-value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="profile-item">
                <label>Email Address</label>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-item">
                <label>Role</label>
                <span className="profile-value">
                  <span className="role-badge">{user.role}</span>
                </span>
              </div>
              <div className="profile-item">
                <label>Organization</label>
                <span className="profile-value">{user.organization.name}</span>
              </div>
              <div className="profile-item">
                <label>Organization ID</label>
                <span className="profile-value org-id">{user.organizationId}</span>
              </div>
              <div className="profile-item">
                <label>Account Status</label>
                <span className="profile-value">
                  <span className="status-active">Active</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="stats-section">
          <h3>📊 Quick Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h4>Projects</h4>
                <p className="stat-number">0</p>
                <span className="stat-label">Active projects</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h4>Inspections</h4>
                <p className="stat-number">0</p>
                <span className="stat-label">Completed this month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h4>NCRs</h4>
                <p className="stat-number">0</p>
                <span className="stat-label">Non-conformance reports</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h4>Team</h4>
                <p className="stat-number">1</p>
                <span className="stat-label">Organization members</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Preview */}
        <section className="features-section">
          <div className="features-card">
            <h3>🚀 Coming Soon</h3>
            <p>Exciting features are being developed to enhance your quality control experience:</p>
            
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <h4>Project Management</h4>
                <p>Create and manage construction projects with team collaboration</p>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <h4>AI-Powered Inspections</h4>
                <p>Automated defect detection using computer vision technology</p>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h4>Advanced Analytics</h4>
                <p>Comprehensive reports and insights for quality metrics</p>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🥽</span>
                <h4>AR Integration</h4>
                <p>Augmented reality for real-time model overlay and inspections</p>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">⛓️</span>
                <h4>Blockchain Audit</h4>
                <p>Immutable record keeping and smart contract automation</p>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <h4>Mobile App</h4>
                <p>On-site quality control with mobile device integration</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
