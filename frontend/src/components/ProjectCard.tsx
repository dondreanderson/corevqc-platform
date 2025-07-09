// frontend/src/components/ProjectCard.tsx
import React from 'react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  viewMode,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'urgent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{project.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              {project.clientName && <span>Client: {project.clientName}</span>}
              {project.location && <span>Location: {project.location}</span>}
              {project.budget && <span>Budget: {formatCurrency(project.budget)}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{project.progress}%</div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onView}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                View
              </button>
              <button
                onClick={onEdit}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
            <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-2 text-sm mb-4">
        {project.clientName && (
          <div className="flex justify-between">
            <span className="text-gray-500">Client:</span>
            <span className="text-gray-900">{project.clientName}</span>
          </div>
        )}
        {project.location && (
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-900">{project.location}</span>
          </div>
        )}
        {project.budget && (
          <div className="flex justify-between">
            <span className="text-gray-500">Budget:</span>
            <span className="text-gray-900">{formatCurrency(project.budget)}</span>
          </div>
        )}
        {project.startDate && (
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="text-gray-900">{formatDate(project.startDate)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between space-x-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          View Details
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
