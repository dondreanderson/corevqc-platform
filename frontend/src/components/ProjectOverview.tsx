import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  budget?: number;
  clientName?: string;
  clientContact?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectOverviewProps {
  project: Project;
  onProgressUpdate?: (progress: number) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, onProgressUpdate }) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(project.progress);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const handleProgressSubmit = () => {
    if (newProgress >= 0 && newProgress <= 100) {
      onProgressUpdate?.(newProgress);
      setIsEditingProgress(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!project.endDate) return null;
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(project.priority)}`}>
                {project.priority} Priority
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mb-4">{project.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {project.clientName && (
                <div>
                  <span className="font-medium text-gray-500">Client:</span>
                  <div className="text-gray-900">{project.clientName}</div>
                </div>
              )}
              {project.projectType && (
                <div>
                  <span className="font-medium text-gray-500">Type:</span>
                  <div className="text-gray-900">{project.projectType}</div>
                </div>
              )}
              {project.location && (
                <div>
                  <span className="font-medium text-gray-500">Location:</span>
                  <div className="text-gray-900">{project.location}</div>
                </div>
              )}
              {project.startDate && (
                <div>
                  <span className="font-medium text-gray-500">Start Date:</span>
                  <div className="text-gray-900">{formatDate(project.startDate)}</div>
                </div>
              )}
              {project.endDate && (
                <div>
                  <span className="font-medium text-gray-500">End Date:</span>
                  <div className="text-gray-900">{formatDate(project.endDate)}</div>
                </div>
              )}
              {daysRemaining !== null && (
                <div>
                  <span className="font-medium text-gray-500">Days Remaining:</span>
                  <div className={`${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 30 ? 'text-yellow-600' : 'text-gray-900'}`}>
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {project.budget && (
            <div className="mt-6 lg:mt-0 lg:ml-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Budget</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Project Progress</h2>
          {!isEditingProgress ? (
            <button
              onClick={() => setIsEditingProgress(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Update Progress
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-sm text-gray-500">%</span>
              <button
                onClick={handleProgressSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingProgress(false);
                  setNewProgress(project.progress);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">25%</div>
            <div className="text-sm text-gray-600">Planning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">40%</div>
            <div className="text-sm text-gray-600">Execution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">20%</div>
            <div className="text-sm text-gray-600">Quality Control</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">15%</div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">24</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Completed</div>
              <div className="text-2xl font-bold text-gray-900">12</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Issues</div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 rounded-full">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">Foundation inspection completed</div>
              <div className="text-xs text-gray-500">2 hours ago by John Smith</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-yellow-100 rounded-full">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">NCR-002 created for safety equipment</div>
              <div className="text-xs text-gray-500">5 hours ago by Sarah Johnson</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-green-100 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">Steel frame welding inspection approved</div>
              <div className="text-xs text-gray-500">1 day ago by Mike Davis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;