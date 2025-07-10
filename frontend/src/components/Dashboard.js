// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalNCRs: 0,
    openNCRs: 0,
    qualityScore: 0
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects for dashboard
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        // Calculate stats from projects
        const activeProjects = data.filter(p => p.status === 'IN_PROGRESS').length;
        setStats({
          totalProjects: data.length,
          activeProjects: activeProjects,
          totalNCRs: 24, // Mock data for now
          openNCRs: 8,   // Mock data for now
          qualityScore: 87 // Mock data for now
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>CoreVQC Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <div className="stat-number">{stats.totalProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Active Projects</h3>
          <div className="stat-number">{stats.activeProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Total NCRs</h3>
          <div className="stat-number">{stats.totalNCRs}</div>
        </div>
        <div className="stat-card">
          <h3>Open NCRs</h3>
          <div className="stat-number">{stats.openNCRs}</div>
        </div>
        <div className="stat-card">
          <h3>Quality Score</h3>
          <div className="stat-number">{stats.qualityScore}%</div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="recent-projects">
        <h2>Recent Projects</h2>
        <div className="projects-grid">
          {projects.slice(0, 6).map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>Status: <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span></p>
              <p>Priority: <span className={`priority ${project.priority.toLowerCase()}`}>{project.priority}</span></p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p>Progress: {project.progress}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;