import React from 'react';

interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location?: string;
  dueDate?: string;
  createdAt: string;
  reportedBy?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

interface NCRCardProps {
  ncr: NCR;
  viewMode?: 'grid' | 'list';
  onView: (ncr: NCR) => void;
  onEdit: (ncr: NCR) => void;
  onDelete: (id: string) => void;
}

const NCRCard: React.FC<NCRCardProps> = ({ ncr, viewMode = 'grid', onView, onEdit, onDelete }) => {
  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && ncr.status !== 'CLOSED';
  };

  const getReporterName = () => {
    if (ncr.reportedBy?.firstName && ncr.reportedBy?.lastName) {
      return `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`;
    }
    return 'Unknown Reporter';
  };

  const cardClasses = `
    bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200
    ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}
    ${isOverdue(ncr.dueDate) ? 'border-l-4 border-l-red-500' : ''}
  `;

  return (
    <div className={cardClasses}>
      {viewMode === 'grid' ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-500">{ncr.ncrNumber}</span>
                {isOverdue(ncr.dueDate) && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Overdue
                  </span>
                )}
              </div>
              <h3 
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                onClick={() => onView(ncr)}
              >
                {ncr.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {ncr.description}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onView(ncr)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="View Details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(ncr)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(ncr.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityClass(ncr.severity)}`}>
              {ncr.severity}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ncr.status)}`}>
              {ncr.status.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              {ncr.category}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {ncr.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{ncr.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Reported by {getReporterName()}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Created {formatDate(ncr.createdAt)}</span>
            </div>
            {ncr.dueDate && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={isOverdue(ncr.dueDate) ? 'text-red-600 font-medium' : ''}>
                  Due {formatDate(ncr.dueDate)}
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">{ncr.ncrNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityClass(ncr.severity)}`}>
                  {ncr.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(ncr.status)}`}>
                  {ncr.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={() => onView(ncr)}>
                {ncr.title}
              </h3>
              <p className="text-gray-600 text-sm">{ncr.description}</p>
            </div>
            <div className="text-sm text-gray-500">
              <div>Created {formatDate(ncr.createdAt)}</div>
              {ncr.dueDate && (
                <div className={isOverdue(ncr.dueDate) ? 'text-red-600 font-medium' : ''}>
                  Due {formatDate(ncr.dueDate)}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(ncr)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="View Details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(ncr)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(ncr.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NCRCard;