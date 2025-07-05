<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NCRCard Component - CoreVQC</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .status-open {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .status-in-progress {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .status-resolved {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .status-closed {
            background-color: rgba(156, 163, 175, 0.1);
            color: #6b7280;
            border: 1px solid rgba(156, 163, 175, 0.3);
        }
        
        .severity-critical {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .severity-high {
            background-color: rgba(251, 191, 36, 0.1);
            color: #f59e0b;
            border: 1px solid rgba(251, 191, 36, 0.3);
        }
        
        .severity-medium {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .severity-low {
            background-color: rgba(156, 163, 175, 0.1);
            color: #6b7280;
            border: 1px solid rgba(156, 163, 175, 0.3);
        }
        
        .ncr-card {
            transition: all 0.2s ease;
        }
        
        .ncr-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .code-container {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
        }
    </style>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">NCRCard Component</h1>
            <p class="text-gray-600">Individual NCR Display Component for CoreVQC Platform</p>
        </div>

        <!-- Component Code -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">React TypeScript Component Code</h2>
            <div class="code-container">
                <pre>import React from 'react';

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
    firstName?: string;
    lastName?: string;
  };
}

interface NCRCardProps {
  ncr: NCR;
  viewMode: 'grid' | 'list';
  onView: (ncr: NCR) => void;
  onEdit: (ncr: NCR) => void;
  onDelete: (id: string) => void;
}

const NCRCard: React.FC&lt;NCRCardProps&gt; = ({ ncr, viewMode, onView, onEdit, onDelete }) => {
  const getSeverityClass = (severity: string) => {
    return `severity-${severity.toLowerCase()}`;
  };

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace('_', '-')}`;
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
    return 'Unknown';
  };

  return (
    &lt;div className={`ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer ${
      viewMode === 'list' ? 'flex items-center space-x-4' : 'block'
    }`}
    onClick={() => onView(ncr)}&gt;
      {/* Header */}
      &lt;div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-3'}`}&gt;
        &lt;div className="flex items-center justify-between"&gt;
          &lt;h3 className="text-lg font-semibold text-gray-900"&gt;{ncr.ncrNumber}&lt;/h3&gt;
          &lt;div className="flex space-x-2"&gt;
            &lt;span className={`status-badge ${getStatusClass(ncr.status)}`}&gt;
              {ncr.status.replace('_', ' ')}
            &lt;/span&gt;
            &lt;span className={`status-badge ${getSeverityClass(ncr.severity)}`}&gt;
              {ncr.severity}
            &lt;/span&gt;
            {isOverdue(ncr.dueDate) && (
              &lt;span className="status-badge" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}&gt;
                OVERDUE
              &lt;/span&gt;
            )}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Content */}
      &lt;div className={`${viewMode === 'list' ? 'flex-1' : ''}`}&gt;
        &lt;h4 className="text-md font-medium text-gray-800 mb-2"&gt;{ncr.title}&lt;/h4&gt;
        &lt;p className="text-gray-600 text-sm mb-3 line-clamp-2"&gt;{ncr.description}&lt;/p&gt;
        
        &lt;div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3"&gt;
          {ncr.category && (
            &lt;span className="flex items-center"&gt;
              &lt;i className="fas fa-tag mr-1"&gt;&lt;/i&gt;
              {ncr.category}
            &lt;/span&gt;
          )}
          {ncr.location && (
            &lt;span className="flex items-center"&gt;
              &lt;i className="fas fa-map-marker-alt mr-1"&gt;&lt;/i&gt;
              {ncr.location}
            &lt;/span&gt;
          )}
          &lt;span className="flex items-center"&gt;
            &lt;i className="fas fa-user mr-1"&gt;&lt;/i&gt;
            {getReporterName()}
          &lt;/span&gt;
          &lt;span className="flex items-center"&gt;
            &lt;i className="fas fa-calendar mr-1"&gt;&lt;/i&gt;
            {formatDate(ncr.createdAt)}
          &lt;/span&gt;
          {ncr.dueDate && (
            &lt;span className={`flex items-center ${isOverdue(ncr.dueDate) ? 'text-red-600' : ''}`}&gt;
              &lt;i className="fas fa-clock mr-1"&gt;&lt;/i&gt;
              Due: {formatDate(ncr.dueDate)}
            &lt;/span&gt;
          )}
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Actions */}
      &lt;div className={`${viewMode === 'list' ? 'flex-shrink-0' : ''} flex space-x-2`}&gt;
        &lt;button
          onClick={(e) => {
            e.stopPropagation();
            onView(ncr);
          }}
          className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          title="View Details"
        &gt;
          &lt;i className="fas fa-eye"&gt;&lt;/i&gt;
        &lt;/button&gt;
        &lt;button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(ncr);
          }}
          className="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
          title="Edit NCR"
        &gt;
          &lt;i className="fas fa-edit"&gt;&lt;/i&gt;
        &lt;/button&gt;
        &lt;button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ncr.id);
          }}
          className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          title="Delete NCR"
        &gt;
          &lt;i className="fas fa-trash"&gt;&lt;/i&gt;
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default NCRCard;</pre>
            </div>
        </div>

        <!-- Live Preview -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
            
            <!-- View Mode Toggle -->
            <div class="flex items-center space-x-4 mb-6">
                <span class="text-sm font-medium text-gray-700">View Mode:</span>
                <button onclick="toggleViewMode('grid')" id="gridBtn" class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded">Grid</button>
                <button onclick="toggleViewMode('list')" id="listBtn" class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded">List</button>
            </div>

            <!-- Grid View Container -->
            <div id="gridContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- NCR Card 1 -->
                <div class="ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer">
                    <div class="mb-3">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">NCR-001</h3>
                            <div class="flex space-x-2">
                                <span class="status-badge status-open">OPEN</span>
                                <span class="status-badge severity-high">HIGH</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-md font-medium text-gray-800 mb-2">Concrete Quality Issue</h4>
                        <p class="text-gray-600 text-sm mb-3">Concrete strength below specification requirements for foundation section A-3.</p>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span class="flex items-center">
                                <i class="fas fa-tag mr-1"></i>
                                Quality
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                Foundation Block A
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-user mr-1"></i>
                                John Smith
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-calendar mr-1"></i>
                                Jan 5, 2025
                            </span>
                            <span class="flex items-center text-red-600">
                                <i class="fas fa-clock mr-1"></i>
                                Due: Jan 10, 2025
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors" title="Edit NCR">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete NCR">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- NCR Card 2 -->
                <div class="ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer">
                    <div class="mb-3">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">NCR-002</h3>
                            <div class="flex space-x-2">
                                <span class="status-badge status-in-progress">IN PROGRESS</span>
                                <span class="status-badge severity-critical">CRITICAL</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-md font-medium text-gray-800 mb-2">Safety Equipment Missing</h4>
                        <p class="text-gray-600 text-sm mb-3">Personal protective equipment not available at worksite for Level 5 construction.</p>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span class="flex items-center">
                                <i class="fas fa-tag mr-1"></i>
                                Safety
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                Level 5 Construction Area
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-user mr-1"></i>
                                Sarah Johnson
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-calendar mr-1"></i>
                                Jan 4, 2025
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-clock mr-1"></i>
                                Due: Jan 6, 2025
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors" title="Edit NCR">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete NCR">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- NCR Card 3 -->
                <div class="ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer">
                    <div class="mb-3">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">NCR-003</h3>
                            <div class="flex space-x-2">
                                <span class="status-badge status-resolved">RESOLVED</span>
                                <span class="status-badge severity-medium">MEDIUM</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-md font-medium text-gray-800 mb-2">Improper Rebar Spacing</h4>
                        <p class="text-gray-600 text-sm mb-3">Rebar spacing does not meet design specifications in slab area C-2.</p>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span class="flex items-center">
                                <i class="fas fa-tag mr-1"></i>
                                Material
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                Slab Area C-2
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-user mr-1"></i>
                                Mike Davis
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-calendar mr-1"></i>
                                Jan 3, 2025
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors" title="Edit NCR">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete NCR">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- List View Container (Hidden by default) -->
            <div id="listContainer" class="space-y-4 hidden">
                <!-- NCR Card 1 - List View -->
                <div class="ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">NCR-001</h3>
                            <div class="flex space-x-2 ml-4">
                                <span class="status-badge status-open">OPEN</span>
                                <span class="status-badge severity-high">HIGH</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-md font-medium text-gray-800 mb-2">Concrete Quality Issue</h4>
                        <p class="text-gray-600 text-sm mb-3">Concrete strength below specification requirements for foundation section A-3.</p>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span class="flex items-center">
                                <i class="fas fa-tag mr-1"></i>
                                Quality
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                Foundation Block A
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-user mr-1"></i>
                                John Smith
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-calendar mr-1"></i>
                                Jan 5, 2025
                            </span>
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex space-x-2">
                        <button class="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors" title="Edit NCR">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete NCR">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- NCR Card 2 - List View -->
                <div class="ncr-card bg-white rounded-lg border border-gray-200 p-4 cursor-pointer flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">NCR-002</h3>
                            <div class="flex space-x-2 ml-4">
                                <span class="status-badge status-in-progress">IN PROGRESS</span>
                                <span class="status-badge severity-critical">CRITICAL</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-md font-medium text-gray-800 mb-2">Safety Equipment Missing</h4>
                        <p class="text-gray-600 text-sm mb-3">Personal protective equipment not available at worksite for Level 5 construction.</p>
                        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span class="flex items-center">
                                <i class="fas fa-tag mr-1"></i>
                                Safety
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                Level 5 Construction Area
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-user mr-1"></i>
                                Sarah Johnson
                            </span>
                            <span class="flex items-center">
                                <i class="fas fa-calendar mr-1"></i>
                                Jan 4, 2025
                            </span>
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex space-x-2">
                        <button class="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors" title="Edit NCR">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete NCR">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Component Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Display Features</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Grid and List view modes</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Status and severity badges</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Overdue indication</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Responsive design</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Hover effects</li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Interactive Features</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Click to view details</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Edit action button</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Delete action button</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Event propagation handling</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>TypeScript support</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        function toggleViewMode(mode) {
            const gridContainer = document.getElementById('gridContainer');
            const listContainer = document.getElementById('listContainer');
            const gridBtn = document.getElementById('gridBtn');
            const listBtn = document.getElementById('listBtn');

            if (mode === 'grid') {
                gridContainer.classList.remove('hidden');
                listContainer.classList.add('hidden');
                gridBtn.className = 'px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded';
                listBtn.className = 'px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded';
            } else {
                gridContainer.classList.add('hidden');
                listContainer.classList.remove('hidden');
                gridBtn.className = 'px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded';
                listBtn.className = 'px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded';
            }
        }
    </script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"95a953d1d95da3ba","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"version":"2025.6.2","token":"4edd5f8ec12a48cfa682ab8261b80a79"}' crossorigin="anonymous"></script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv%2Bq%2F2LYCLJjJQJ0hFrzA7K2P%2FMOos5MuMXNLhuyw%2FQGA%2F7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx%2Fv1flc3PGv%2FqXJwUnDQTAnsAhd1%2FGOqhDFj0%2BCrYE5%2F0w6dfBd%2Fn%2BQQfoFxcFuttD8EKOrFawAPkgREdPvcjUSqmOhjAiLQQVBvQggDmqqMvhsCPzT2yT94fYH2Mfz%2BXDS07Ekgh1TY%2Bc1ja3zUC%2B%2FF%2F8zG%2FtETQxKfNPDADCec%2F5hcJdFnP7ycwdEodJKI%2BD6l2wzgkdkDzMxafoqU%2B1eNWBeG94s1Ngg0%2BIxnWw3TB2yFzHU2qYbPU%2FNyQZuNJgS1NWeG7Kx3p2lnpgpVKRV5o%2B03xwJHKzv4f67GPCerTFc3X9RLRH9aXiQlx75Fyt8vo96J1hXWJHC9uehIpGiRMxOA9RRmuGdO0DCJ%2FEWyx6OlTQcvBFApz8Kcp%2F8Rcl2Se%2FGLloUE3cpPGUrM%2BmeqU7aWmhI7w%3D%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtFrrvLF08orYqcKP79qEuap3kAZsbBNMeQrstaPQjQW1MJhUy14JAKyNchv+q/2LYCLJjJQJ0hFrzA7K2P/MOos5MuMXNLhuyw/QGA/7buOL3J4G84zopeSoH0fhTIZUAEUFCrTzHm9FHaflDFdcLDjzH64Ahzrmx/v1flc3PGv/qXJwUnDQTAnsAhd1/GOqhDFj0+CrYE5/0w6dfBd/n+QQfoFxcFuttD8EKOrFawAPkgREdPvcjUSqmOhjAiLQQVBvQggDmqqMvhsCPzT2yT94fYH2Mfz+XDS07Ekgh1TY+c1ja3zUC+/F/8zG/tETQxKfNPDADCec/5hcJdFnP7ycwdEodJKI+D6l2wzgkdkDzMxafoqU+1eNWBeG94s1Ngg0+IxnWw3TB2yFzHU2qYbPU/NyQZuNJgS1NWeG7Kx3p2lnpgpVKRV5o+03xwJHKzv4f67GPCerTFc3X9RLRH9aXiQlx75Fyt8vo96J1hXWJHC9uehIpGiRMxOA9RRmuGdO0DCJ/EWyx6OlTQcvBFApz8Kcp/8Rcl2Se/GLloUE3cpPGUrM+meqU7aWmhI7w==";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    