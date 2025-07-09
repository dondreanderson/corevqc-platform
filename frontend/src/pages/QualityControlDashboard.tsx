import React, { useEffect } from 'react';

const QualityControlDashboard: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Dashboard loaded');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quality Control Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage quality control processes</p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quality Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quality Score</h2>
            <div className="text-3xl font-bold text-green-600">87%</div>
            <p className="text-sm text-gray-500">Overall project quality</p>
          </div>

          {/* Active NCRs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active NCRs</h2>
            <div className="text-3xl font-bold text-red-600">8</div>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>

          {/* Completed Inspections */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inspections</h2>
            <div className="text-3xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-500">Completed this month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Foundation inspection completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New NCR created</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Quality review approved</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControlDashboard;
