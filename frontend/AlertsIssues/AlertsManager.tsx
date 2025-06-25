import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  User, 
  Filter,
  Plus,
  Edit3,
  Trash2,
  Search,
  Calendar,
  Tag,
  ArrowUpDown,
  X,
  Save,
  MessageSquare,
  MapPin,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  UserCheck,
  AlertOctagon,
  Settings,
  MoreHorizontal
} from 'lucide-react';

// Enhanced types for alerts and issues management
interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: 'Quality' | 'Safety' | 'Schedule' | 'Budget' | 'Compliance' | 'Technical';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  projectId: string;
  location?: string;
  tags: string[];
  attachments?: string[];
  comments: Comment[];
  reporter: string;
  estimatedResolutionTime?: number; // in hours
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  impactLevel?: 'Minor' | 'Moderate' | 'Major' | 'Severe';
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'status_change' | 'assignment' | 'priority_change';
  attachments?: string[];
}

interface AlertFilters {
  priority: string[];
  status: string[];
  category: string[];
  assignedTo: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  tags: string[];
  overdue: boolean;
}

interface CreateAlertForm {
  title: string;
  description: string;
  priority: Alert['priority'];
  category: Alert['category'];
  assignedTo: string;
  dueDate: string;
  location: string;
  tags: string;
  estimatedResolutionTime: string;
  impactLevel: Alert['impactLevel'];
}

interface AlertStats {
  total: number;
  critical: number;
  high: number;
  open: number;
  overdue: number;
  inProgress: number;
  resolved: number;
  byCategory: { [key: string]: number };
  byAssignee: { [key: string]: number };
}

// Component Props Interface
interface AlertsManagerProps {
  projectId?: string;
  showCreateButton?: boolean;
  compactView?: boolean;
  maxHeight?: string;
}

const AlertsManager: React.FC<AlertsManagerProps> = ({
  projectId = 'PROJ-001',
  showCreateButton = true,
  compactView = false,
  maxHeight = 'none'
}) => {

  // State Management
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'status' | 'category'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');

  const [filters, setFilters] = useState<AlertFilters>({
    priority: [],
    status: [],
    category: [],
    assignedTo: [],
    dateRange: { start: null, end: null },
    tags: [],
    overdue: false
  });

  const [createForm, setCreateForm] = useState<CreateAlertForm>({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Quality',
    assignedTo: '',
    dueDate: '',
    location: '',
    tags: '',
    estimatedResolutionTime: '',
    impactLevel: 'Moderate'
  });

  // Mock team members for assignment
  const teamMembers = [
    'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 
    'David Brown', 'Lisa Garcia', 'Tom Anderson', 'Emily Chen',
    'Robert Taylor', 'Maria Rodriguez', 'James Wilson', 'Anna Lee'
  ];

  // Configuration objects for styling and icons
  const priorityConfig = {
    Critical: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertTriangle, 
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
      ringColor: 'ring-red-500'
    },
    High: { 
      color: 'bg-orange-100 text-orange-800 border-orange-200', 
      icon: AlertCircle, 
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-500',
      ringColor: 'ring-orange-500'
    },
    Medium: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Info, 
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-500',
      ringColor: 'ring-yellow-500'
    },
    Low: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: Bell, 
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      ringColor: 'ring-blue-500'
    }
  };

  const statusConfig = {
    Open: { 
      color: 'bg-gray-100 text-gray-800', 
      bgColor: 'bg-gray-500', 
      textColor: 'text-gray-600',
      icon: AlertOctagon
    },
    'In Progress': { 
      color: 'bg-blue-100 text-blue-800', 
      bgColor: 'bg-blue-500', 
      textColor: 'text-blue-600',
      icon: Clock
    },
    Resolved: { 
      color: 'bg-green-100 text-green-800', 
      bgColor: 'bg-green-500', 
      textColor: 'text-green-600',
      icon: CheckCircle
    },
    Closed: { 
      color: 'bg-gray-100 text-gray-600', 
      bgColor: 'bg-gray-400', 
      textColor: 'text-gray-500',
      icon: X
    }
  };

  const categoryConfig = {
    Quality: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    Safety: { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' },
    Schedule: { icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    Budget: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
    Compliance: { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    Technical: { icon: Tag, color: 'text-indigo-600', bgColor: 'bg-indigo-100' }
  };

  // Placeholder for component methods and effects
  // TODO: Add useEffect for data loading
  // TODO: Add handler functions
  // TODO: Add computed values and statistics

  return (
    <div className={`space-y-6 ${compactView ? 'space-y-4' : ''}`} style={{ maxHeight }}>
      {/* Component content will be added in subsequent parts */}
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">AlertsManager Component Structure</h3>
        <p className="text-gray-600">Basic structure created. Content will be added incrementally.</p>
      </div>
    </div>
  );
};

 return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Alerts & Issues</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage project alerts and track issue resolution
            </p>
          </div>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              New Alert
            </button>
          )}
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">High</p>
              <p className="text-2xl font-bold text-orange-900">{stats.high}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Medium</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.medium}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Resolved</p>
              <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search alerts..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityStyle(alert.priority)}`}>
                    {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(alert.status)}`}>
                    {alert.status.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {alert.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {alert.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {alert.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                  {alert.assignedTo && (
                    <span>Assigned to: {alert.assignedTo}</span>
                  )}
                  {alert.dueDate && (
                    <span className={new Date(alert.dueDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                      Due: {new Date(alert.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setShowDetailModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">
            {alerts.length === 0 ? "No alerts have been created yet." : "No alerts match your current filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsManager;