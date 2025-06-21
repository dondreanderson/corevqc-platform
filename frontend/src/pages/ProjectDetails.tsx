import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  client: string;
  location: string;
  contractor: string;
  projectManager: string;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setEditForm(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...project });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...project });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setIsEditing(false);
        alert('Project updated successfully!');
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
        <Link to="/projects" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const currentData = isEditing ? editForm : project;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/projects" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent w-full focus:outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            )}
            {isEditing ? (
              <textarea
                value={editForm.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-gray-600 mt-2 w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none"
                rows={2}
              />
            ) : (
              <p className="text-gray-600 mt-2">{project.description}</p>
            )}
          </div>
          <div className="flex space-x-3 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit Project
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Export Report
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
          {isEditing ? (
            <select
              value={editForm.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1 focus:border-blue-500 focus:outline-none"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : (
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {project.status}
            </span>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
          {isEditing ? (
            <div>
              <input
                type="range"
                min="0"
                max="100"
                value={editForm.progress || 0}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-gray-600 mt-1">
                {editForm.progress || 0}% Complete
              </div>
            </div>
          ) : (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{project.progress}% Complete</p>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget</h3>
          {isEditing ? (
            <input
              type="number"
              value={editForm.budget || 0}
              onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-1 focus:border-blue-500 focus:outline-none"
            />
          ) : (
            <p className="text-2xl font-bold text-green-600">
              ${project.budget?.toLocaleString() || 'N/A'}
            </p>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Client</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.client || ''}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{project.client || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{project.location || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contractor</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.contractor || ''}
                  onChange={(e) => handleInputChange('contractor', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{project.contractor || 'N/A'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Project Manager</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.projectManager || ''}
                  onChange={(e) => handleInputChange('projectManager', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{project.projectManager || 'N/A'}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.startDate?.split('T')[0] || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.endDate?.split('T')[0] || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Quality Score</label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.qualityScore || 0}
                  onChange={(e) => handleInputChange('qualityScore', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-600">{project.qualityScore}/100</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Actual Cost</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.actualCost || 0}
                  onChange={(e) => handleInputChange('actualCost', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-1 mt-1 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  ${project.actualCost?.toLocaleString() || 'N/A'}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-sm text-gray-600">
                {new Date(currentData.updatedAt || '').toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
