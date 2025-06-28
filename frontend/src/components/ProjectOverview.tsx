
// src/components/ProjectOverview.tsx
import React from 'react';
import type { EnhancedProject } from '../types/project';

interface ProjectOverviewProps {
  project: EnhancedProject;
  onAction?: (action: string, data?: any) => void;
  isEditable?: boolean;
  showActions?: boolean;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  onAction,
  isEditable = false,
  showActions = true
}) => {
  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Event handlers
  const handleEdit = () => {
    if (onAction) {
      onAction('edit');
    }
  };

  const handleSave = () => {
    if (onAction) {
      onAction('save', project);
    }
  };

  const handleDelete = () => {
    if (onAction && window.confirm('Are you sure you want to delete this project?')) {
      onAction('delete');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {project.title}
          </h1>
          <p className="text-gray-600">
            {project.description}
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-4 mb-6">
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{project.completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.completion}%` }}
          ></div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Dates */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Start: {formatDate(project.startDate)}</div>
            <div>End: {formatDate(project.endDate)}</div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Budget</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Total: {formatCurrency(project.budget)}</div>
            <div>Spent: {formatCurrency(project.spent)}</div>
            <div>Remaining: {formatCurrency(project.budget - project.spent)}</div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Team</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Team Size: {project.teamSize} members</div>
            <div>Owner: {project.owner}</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-sm text-gray-500 text-center">
        Last updated: {formatDate(project.lastUpdated)}
      </div>
    </div>
  );
};

export default ProjectOverview;
            