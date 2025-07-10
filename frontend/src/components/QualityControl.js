import React, { useState, useEffect } from 'react';

const QualityControl = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [ncrs, setNCRs] = useState([]);
  const [stats, setStats] = useState({
    totalNCRs: 0,
    openNCRs: 0,
    criticalNCRs: 0,
    qualityScore: 100
  });
  const [loading, setLoading] = useState(true);
  const [showCreateNCR, setShowCreateNCR] = useState(false);
  const [newNCR, setNewNCR] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    category: 'Quality',
    location: '',
    projectId: ''
  });

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
      const projectsRes = await fetch('http://localhost:8000/api/projects');
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // Fetch NCRs
      const ncrUrl = selectedProject 
        ? `http://localhost:8000/api/ncrs?projectId=${selectedProject}`
        : 'http://localhost:8000/api/ncrs';
      
      const ncrsRes = await fetch(ncrUrl);
      const ncrsData = await ncrsRes.json();
      setNCRs(ncrsData);

      // Fetch stats
      const statsUrl = selectedProject 
        ? `http://localhost:8000/api/ncrs/stats?projectId=${selectedProject}`
        : 'http://localhost:8000/api/ncrs/stats';
      
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();
      setStats(statsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNCR = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/ncrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNCR)
      });

      if (!response.ok) {
        throw new Error('Failed to create NCR');
      }

      const createdNCR = await response.json();
      
      // Add to local state
      setNCRs([createdNCR, ...ncrs]);
      
      // Reset form
      setNewNCR({
        title: '',
        description: '',
        severity: 'MEDIUM',
        category: 'Quality',
        location: '',
        projectId: ''
      });
      
      setShowCreateNCR(false);
      
      // Refresh stats
      fetchData();
      
    } catch (error) {
      console.error('Error creating NCR:', error);
      alert('Failed to create NCR. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setNewNCR({
      ...newNCR,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectFilter = (e) => {
    setSelectedProject(e.target.value);
  };

  if (loading) {
    return <div className="loading">Loading quality control data...</div>;
  }

  return (
    <div className="quality-control">
      <div className="quality-header">
        <h1>Quality Control Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateNCR(true)}
        >
          + Create NCR
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total NCRs</h3>
          <div className="stat-number">{stats.totalNCRs}</div>
        </div>
        <div className="stat-card">
          <h3>Open NCRs</h3>
          <div className="stat-number critical">{stats.openNCRs}</div>
        </div>
        <div className="stat-card">
          <h3>Critical NCRs</h3>
          <div className="stat-number warning">{stats.criticalNCRs}</div>
        </div>
        <div className="stat-card">
          <h3>Quality Score</h3>
          <div className="stat-number success">{stats.qualityScore}%</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by Project:</label>
          <select 
            value={selectedProject} 
            onChange={handleProjectFilter}
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Create NCR Modal */}
      {showCreateNCR && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Non-Conformance Report</h2>
            <form onSubmit={handleCreateNCR}>
              <div className="form-group">
                <label>NCR Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newNCR.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={newNCR.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Severity</label>
                  <select name="severity" value={newNCR.severity} onChange={handleInputChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={newNCR.category} onChange={handleInputChange}>
                    <option value="Quality">Quality</option>
                    <option value="Safety">Safety</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Environmental">Environmental</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Project *</label>
                  <select name="projectId" value={newNCR.projectId} onChange={handleInputChange} required>
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newNCR.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateNCR(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create NCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NCRs List */}
      <div className="ncrs-section">
        <h2>Non-Conformance Reports ({ncrs.length})</h2>
        <div className="ncrs-grid">
          {ncrs.map(ncr => (
            <div key={ncr.id} className="ncr-card">
              <div className="ncr-header">
                <div className="ncr-number">{ncr.ncrNumber}</div>
                <div className="ncr-badges">
                  <span className={`badge severity-${ncr.severity.toLowerCase()}`}>
                    {ncr.severity}
                  </span>
                  <span className={`badge status-${ncr.status.toLowerCase().replace('_', '-')}`}>
                    {ncr.status}
                  </span>
                </div>
              </div>
              
              <h3>{ncr.title}</h3>
              <p className="ncr-description">{ncr.description}</p>
              
              <div className="ncr-details">
                <div className="detail-item">
                  <strong>Project:</strong> {ncr.project?.name || 'Unknown'}
                </div>
                <div className="detail-item">
                  <strong>Category:</strong> {ncr.category}
                </div>
                {ncr.location && (
                  <div className="detail-item">
                    <strong>Location:</strong> {ncr.location}
                  </div>
                )}
                <div className="detail-item">
                  <strong>Created:</strong> {new Date(ncr.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="ncr-actions">
                <button className="btn btn-sm btn-secondary">Edit</button>
                <button className="btn btn-sm btn-outline">View Details</button>
              </div>
            </div>
          ))}
        </div>
        
        {ncrs.length === 0 && (
          <div className="empty-state">
            <p>No NCRs found. Create your first NCR to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityControl;