import React from 'react';

export const NewProject: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Project</h1>
            <p className="text-gray-600">Set up a new construction project in CoreVQC</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
            <p className="text-blue-700">
              The project creation form is under development. 
              This feature will allow you to create and configure new construction projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;