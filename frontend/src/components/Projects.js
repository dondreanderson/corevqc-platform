// src/components/Projects.js
import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    clientName: '',
    location: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject)
    })
    .then(res => res.json())
    .then(data => {
      setProjects([data, ...projects]);
      setNewProject({
        name: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        clientName: '',
        location: ''
      });
      setShowCreateForm(false);
    })
    .catch(err => console.error('Error creating project:', err));
  };

  const handleInputChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects ({projects.length})</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New Project
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={newProject.status} onChange={handleInputChange}>
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={newProject.priority} onChange={handleInputChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={newProject.clientName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newProject.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <div className="project-badges">
                <span className={`badge status-${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
                <span className={`badge priority-${project.priority.toLowerCase()}`}>
                  {project.priority}
                </span>
              </div>
            </div>
            
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
            
            <div className="project-details">
              {project.clientName && (
                <div className="detail-item">
                  <strong>Client:</strong> {project.clientName}
                </div>
              )}
              {project.location && (
                <div className="detail-item">
                  <strong>Location:</strong> {project.location}
                </div>
              )}
              <div className="detail-item">
                <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="project-actions">
              <button className="btn btn-sm btn-secondary">Edit</button>
              <button className="btn btn-sm btn-outline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
