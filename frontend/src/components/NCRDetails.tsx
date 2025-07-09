import React, { useState } from 'react';

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

interface NCRDetailsProps {
  ncr: NCR;
  onClose: () => void;
  onEdit: (ncr: NCR) => void;
  onDelete: (id: string) => void;
}

const NCRDetails: React.FC<NCRDetailsProps> = ({ ncr, onClose, onEdit, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedNCR, setEditedNCR] = useState(ncr);

  const getSeverityColor = (severity: string) => {
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

  const getStatusColor = (status: string) => {
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    onEdit(editedNCR);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedNCR(ncr);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this NCR? This action cannot be undone.')) {
      onDelete(ncr.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">NCR Details</h1>
              <div className="flex items-center space-x-4">
                <span className="text-blue-100">{ncr.ncrNumber}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(ncr.severity)}`}>
                  {ncr.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ncr.status)}`}>
                  {ncr.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isEditMode ? (
            // View Mode
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{ncr.title}</h2>
                <p className="text-gray-700 leading-relaxed">{ncr.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{ncr.category}</p>
                </div>
                {ncr.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{ncr.location}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(ncr.createdAt)}</p>
                </div>
                {ncr.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <p className="text-gray-900">{formatDate(ncr.dueDate)}</p>
                  </div>
                )}
                {ncr.reportedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                    <p className="text-gray-900">
                      {ncr.reportedBy.firstName && ncr.reportedBy.lastName 
                        ? `${ncr.reportedBy.firstName} ${ncr.reportedBy.lastName}`
                        : 'Unknown Reporter'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit NCR
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete NCR
                </button>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={editedNCR.title}
                  onChange={(e) => setEditedNCR({...editedNCR, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={editedNCR.description}
                  onChange={(e) => setEditedNCR({...editedNCR, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    id="category"
                    value={editedNCR.category}
                    onChange={(e) => setEditedNCR({...editedNCR, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Quality">Quality</option>
                    <option value="Safety">Safety</option>
                    <option value="Process">Process</option>
                    <option value="Material">Material</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    id="severity"
                    value={editedNCR.severity}
                    onChange={(e) => setEditedNCR({...editedNCR, severity: e.target.value as NCR['severity']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    id="status"
                    value={editedNCR.status}
                    onChange={(e) => setEditedNCR({...editedNCR, status: e.target.value as NCR['status']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={editedNCR.location || ''}
                    onChange={(e) => setEditedNCR({...editedNCR, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={editedNCR.dueDate || ''}
                    onChange={(e) => setEditedNCR({...editedNCR, dueDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Edit Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NCRDetails;