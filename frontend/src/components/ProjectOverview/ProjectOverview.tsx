import React, { useState, useEffect } from 'react';
import { Project, ProjectProgress, ProjectBudget } from '../../types/enhanced-project-types';

interface ProjectOverviewProps {
  project: Project;
  onUpdateProject?: (updates: Partial<Project>) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  onUpdateProject 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'budget'>('overview');

  const handleSave = () => {
    if (onUpdateProject) {
      onUpdateProject(editedProject);
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const calculateDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBudgetVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-blue-100 text-sm font-medium">ACTIVE PROJECT</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                  className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg px-4 py-2 text-3xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              ) : (
                project.name
              )}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              {isEditing ? (
                <textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                  className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                  rows={3}
                />
              ) : (
                project.description
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                {isEditing ? 'Save Changes' : 'Edit Project'}
              </button>
              {isEditing && (
                <button
                  onClick={() => {setIsEditing(false); setEditedProject(project);}}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-900">{project.progress.overall}%</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Overall Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress.overall)}`}
                style={{ width: `${project.progress.overall}%` }}
              ></div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {((project.budget.spent / project.budget.total) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Budget Used</p>
            <div className="text-xs text-gray-500">
              {formatCurrency(project.budget.spent)} of {formatCurrency(project.budget.total)}
            </div>
          </div>

          {/* Team Size */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-900">{project.teamMembers.length}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Team Members</p>
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 4).map((member, index) => (
                <div key={member.id} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  {member.name.charAt(0)}
                </div>
              ))}
              {project.teamMembers.length > 4 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                  +{project.teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Days Remaining */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className={`text-3xl font-bold ${calculateDaysRemaining() < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                {calculateDaysRemaining()}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-2">Days Remaining</p>
            <div className="text-xs text-gray-500">
              Due: {formatDate(project.endDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Project Overview', icon: '📊' },
            { id: 'progress', label: 'Progress Tracking', icon: '📈' },
            { id: 'budget', label: 'Budget Analysis', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Project Timeline */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span className="font-medium">Start: {formatDate(project.startDate)}</span>
                  <span className="font-medium">End: {formatDate(project.endDate)}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 relative"
                      style={{ width: `${project.progress.overall}%` }}
                    >
                      <div className="absolute right-0 top-0 w-3 h-3 bg-blue-600 rounded-full transform translate-x-1/2"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-medium text-blue-600">{project.progress.overall}% Complete</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities Preview */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Recent Activities
              </h3>
              <div className="space-y-3">
                {project.activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.userName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            {/* Phase Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Phase Progress</h3>
              <div className="space-y-6">
                {project.progress.phases.map((phase) => (
                  <div key={phase.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">{phase.name}</h4>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                          phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          phase.status === 'delayed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {phase.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">{phase.progress}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(phase.progress)}`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Start: {formatDate(phase.startDate)}</span>
                      <span>End: {formatDate(phase.endDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Milestones</h3>
              <div className="space-y-4">
                {project.progress.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-blue-500' :
                        milestone.status === 'overdue' ? 'bg-red-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-gray-800">{milestone.name}</h4>
                        <p className="text-sm text-gray-500">
                          {milestone.completedDate ? 
                            `Completed: ${formatDate(milestone.completedDate)}` :
                            `Target: ${formatDate(milestone.targetDate)}`
                          }
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      milestone.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-8">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Total Budget</h4>
                <p className="text-3xl font-bold text-blue-800">{formatCurrency(project.budget.total)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-2">Spent</h4>
                <p className="text-3xl font-bold text-green-800">{formatCurrency(project.budget.spent)}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-900 mb-2">Remaining</h4>
                <p className="text-3xl font-bold text-orange-800">{formatCurrency(project.budget.remaining)}</p>
              </div>
            </div>

            {/* Budget Categories */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Budget Breakdown by Category</h3>
              <div className="space-y-4">
                {project.budget.categories.map((category) => (
                  <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">
                          {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                        </p>
                        <p className={`text-xs font-medium ${getBudgetVarianceColor(category.variance)}`}>
                          {category.variance > 0 ? '+' : ''}{category.variance.toFixed(1)}% variance
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (category.spent / category.allocated) > 1 ? 'bg-red-500' :
                          (category.spent / category.allocated) > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectOverview;
