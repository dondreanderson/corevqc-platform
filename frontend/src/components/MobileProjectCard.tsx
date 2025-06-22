import React from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  client: string;
  budget: number;
  qualityScore: number;
  location: string;
}

interface MobileProjectCardProps {
  project: Project;
}

const MobileProjectCard: React.FC<MobileProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow active:bg-gray-50"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 pr-2">
          {project.name}
        </h3>
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Client</span>
          <p className="font-medium text-gray-900 truncate">{project.client}</p>
        </div>
        <div>
          <span className="text-gray-500">Budget</span>
          <p className="font-medium text-green-600">${(project.budget / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <span className="text-gray-500">Quality</span>
          <p className={`font-medium ${project.qualityScore >= 90 ? 'text-green-600' : project.qualityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
            {project.qualityScore}/100
          </p>
        </div>
        <div>
          <span className="text-gray-500">Location</span>
          <p className="font-medium text-gray-900 truncate">{project.location}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex space-x-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add quick action logic
            }}
            className="flex items-center text-blue-600 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add quick action logic
            }}
            className="flex items-center text-green-600 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            QC
          </button>
        </div>
        <div className="text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default MobileProjectCard;
