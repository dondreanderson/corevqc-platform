// src/components/QualityControlDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// TypeScript Interfaces
interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location: string;
  reportedBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  resolvedDate?: string;
  correctiveAction?: string;
  rootCause?: string;
  images?: string[];
  comments?: Comment[];
}

interface ITP {
  id: string;
  itpNumber: string;
  title: string;
  description: string;
  phase: string;
  activity: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  inspectionType: 'VISUAL' | 'DIMENSIONAL' | 'MATERIAL_TEST' | 'PERFORMANCE' | 'SAFETY';
  inspector: string;
  location: string;
  scheduledDate: string;
  completedDate?: string;
  requirements: string[];
  checkpoints: CheckPoint[];
  notes?: string;
  holdPoints?: string[];
}

interface CheckPoint {
  id: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  checkedBy?: string;
  checkedDate?: string;
  notes?: string;
  requirement?: string;
  acceptanceCriteria?: string;
}

interface QualityMetrics {
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  activeNCRs: number;
  resolvedNCRs: number;
  qualityScore: number;
  defectRate: number;
  overdueItems: number;
  pendingITPs: number;
  completedITPs: number;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface QualityControlDashboardProps {
  projectId: string;
  onNCRCreate?: (ncr: Partial<NCR>) => void;
  onITPCreate?: (itp: Partial<ITP>) => void;
  onNCRUpdate?: (id: string, ncr: Partial<NCR>) => void;
  onITPUpdate?: (id: string, itp: Partial<ITP>) => void;
}

const QualityControlDashboard: React.FC<QualityControlDashboardProps> = ({ 
  projectId,
  onNCRCreate,
  onITPCreate,
  onNCRUpdate,
  onITPUpdate
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'ncrs' | 'itps'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<QualityMetrics>({
    totalInspections: 0,
    passedInspections: 0,
    failedInspections: 0,
    activeNCRs: 0,
    resolvedNCRs: 0,
    qualityScore: 0,
    defectRate: 0,
    overdueItems: 0,
    pendingITPs: 0,
    completedITPs: 0
  });

  const [ncrs, setNCRs] = useState<NCR[]>([]);
  const [itps, setITPs] = useState<ITP[]>([]);
  const [selectedNCR, setSelectedNCR] = useState<NCR | null>(null);
  const [selectedITP, setSelectedITP] = useState<ITP | null>(null);
  const [showCreateNCR, setShowCreateNCR] = useState(false);
  const [showCreateITP, setShowCreateITP] = useState(false);

  // Form states
  const [ncrForm, setNCRForm] = useState<Partial<NCR>>({});
  const [itpForm, setITPForm] = useState<Partial<ITP>>({});

  // API Base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Fetch data from API
  useEffect(() => {
    if (projectId) {
      fetchQualityData();
    }
  }, [projectId]);

  const fetchQualityData = async () => {
    setLoading(true);
    try {
      const [metricsRes, ncrsRes, itpsRes] = await Promise.all([
        fetch(`${API_BASE}/projects/${projectId}/quality-metrics`),
        fetch(`${API_BASE}/projects/${projectId}/ncrs`),
        fetch(`${API_BASE}/projects/${projectId}/itps`)
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data);
      }

      if (ncrsRes.ok) {
        const ncrsData = await ncrsRes.json();
        setNCRs(ncrsData.data);
      }

      if (itpsRes.ok) {
        const itpsData = await itpsRes.json();
        setITPs(itpsData.data);
      }
    } catch (err) {
      console.error('Error fetching quality data:', err);
      setError('Failed to load quality data');
    } finally {
      setLoading(false);
    }
  };

  // Utility Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-800 bg-red-100 border-red-200';
      case 'HIGH': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'MEDIUM': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'RESOLVED':
      case 'CLOSED':
      case 'passed':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'IN_PROGRESS':
      case 'in_progress':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      case 'PENDING':
      case 'pending':
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'failed':
      case 'REJECTED':
      case 'OPEN':
        return 'text-red-800 bg-red-100 border-red-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  // Filter functions
  const filteredNCRs = ncrs.filter(ncr => {
    const matchesSearch = ncr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ncr.ncrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ncr.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ncr.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || ncr.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const filteredITPs = itps.filter(itp => {
    const matchesSearch = itp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itp.itpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itp.phase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || itp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Event handlers
  const handleCreateNCR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncrForm.title || !ncrForm.description) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects/${projectId}/ncrs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ncrForm,
          projectId
        })
      });

      if (response.ok) {
        const result = await response.json();
        setNCRs([...ncrs, result.data]);
        setShowCreateNCR(false);
        setNCRForm({});
        if (onNCRCreate) onNCRCreate(result.data);
        await fetchQualityData(); // Refresh metrics
      } else {
        throw new Error('Failed to create NCR');
      }
    } catch (err) {
      setError('Failed to create NCR');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateITP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itpForm.title || !itpForm.description) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/projects/${projectId}/itps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itpForm,
          projectId
        })
      });

      if (response.ok) {
        const result = await response.json();
        setITPs([...itps, result.data]);
        setShowCreateITP(false);
        setITPForm({});
        if (onITPCreate) onITPCreate(result.data);
        await fetchQualityData(); // Refresh metrics
      } else {
        throw new Error('Failed to create ITP');
      }
    } catch (err) {
      setError('Failed to create ITP');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNCR = async (id: string, updates: Partial<NCR>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/ncrs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const result = await response.json();
        setNCRs(ncrs.map(ncr => ncr.id === id ? result.data : ncr));
        if (onNCRUpdate) onNCRUpdate(id, updates);
        await fetchQualityData(); // Refresh metrics
      } else {
        throw new Error('Failed to update NCR');
      }
    } catch (err) {
      setError('Failed to update NCR');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateITP = async (id: string, updates: Partial<ITP>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/itps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const result = await response.json();
        setITPs(itps.map(itp => itp.id === id ? result.data : itp));
        if (onITPUpdate) onITPUpdate(id, updates);
        await fetchQualityData(); // Refresh metrics
      } else {
        throw new Error('Failed to update ITP');
      }
    } catch (err) {
      setError('Failed to update ITP');
    } finally {
      setLoading(false);
    }
  };

  if (loading && ncrs.length === 0 && itps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading quality data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quality Control Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor project quality metrics, NCRs, and inspection schedules</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto pl-3"
            >
              <XMarkIcon className="h-5 w-5 text-red-400 hover:text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: CheckCircleIcon },
            { id: 'ncrs', name: 'NCRs', icon: ExclamationTriangleIcon },
            { id: 'itps', name: 'ITPs', icon: ClockIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quality Score */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quality Score</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.qualityScore.toFixed(1)}%</p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${metrics.qualityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active NCRs */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active NCRs</p>
                  <p className="text-3xl font-bold text-red-600">{metrics.activeNCRs}</p>
                </div>
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {metrics.resolvedNCRs} resolved this month
              </p>
            </div>

            {/* ITPs */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ITPs</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.completedITPs + metrics.pendingITPs}</p>
                </div>
                <ClockIcon className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {metrics.completedITPs} completed, {metrics.pendingITPs} pending
              </p>
            </div>

            {/* Overdue Items */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                  <p className="text-3xl font-bold text-orange-600">{metrics.overdueItems}</p>
                </div>
                <XCircleIcon className="h-12 w-12 text-orange-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Require immediate attention
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent NCRs */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent NCRs</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {ncrs.slice(0, 3).map((ncr) => (
                    <div key={ncr.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{ncr.ncrNumber}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(ncr.severity)}`}>
                              {ncr.severity}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{ncr.title}</h3>
                          <p className="text-xs text-gray-500">📍 {ncr.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent ITPs */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming ITPs</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {itps.filter(itp => itp.status === 'PENDING').slice(0, 3).map((itp) => (
                    <div key={itp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{itp.itpNumber}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(itp.status)}`}>
                              {itp.status}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{itp.title}</h3>
                          <p className="text-xs text-gray-500">📅 {formatDate(itp.scheduledDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NCRs Tab */}
      {activeTab === 'ncrs' && (
        <div>
          {/* NCR Controls */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Non-Conformance Reports</h2>
                <button
                  onClick={() => setShowCreateNCR(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create NCR
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search NCRs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Severity</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* NCR List */}
            <div className="p-6">
              <div className="space-y-4">
                {filteredNCRs.map((ncr) => (
                  <div key={ncr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">{ncr.ncrNumber}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(ncr.severity)}`}>
                            {ncr.severity}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ncr.status)}`}>
                            {ncr.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{ncr.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{ncr.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Location:</span>
                            <span>{ncr.location}</span>
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            <span>{ncr.assignedTo}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(ncr.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedNCR(ncr)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredNCRs.length === 0 && (
                  <div className="text-center py-12">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No NCRs found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'all' || severityFilter !== 'all' 
                        ? 'Try adjusting your search or filters.' 
                        : 'Create your first NCR to get started.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ITPs Tab */}
      {activeTab === 'itps' && (
        <div>
          {/* ITP Controls */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Inspection & Test Plans</h2>
                <button
                  onClick={() => setShowCreateITP(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Schedule ITP
                </button>
              </div>
            </div>

            {/* ITP List */}
            <div className="p-6">
              <div className="space-y-4">
                {filteredITPs.map((itp) => (
                  <div key={itp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">{itp.itpNumber}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(itp.status)}`}>
                            {itp.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{itp.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Phase:</span>
                            <span>{itp.phase}</span>
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            <span>{itp.inspector}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Location:</span>
                            <span>{itp.location}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{formatDate(itp.scheduledDate)}</span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>
                              {itp.checkpoints.filter(cp => cp.status === 'passed').length}/{itp.checkpoints.length} checkpoints
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ 
                                width: `${itp.checkpoints.length > 0 
                                  ? (itp.checkpoints.filter(cp => cp.status === 'passed').length / itp.checkpoints.length) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedITP(itp)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredITPs.length === 0 && (
                  <div className="text-center py-12">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No ITPs found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters.' 
                        : 'Schedule your first ITP to get started.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create NCR Modal */}
      {showCreateNCR && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New NCR</h3>
              <button
                onClick={() => setShowCreateNCR(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateNCR} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={ncrForm.title || ''}
                  onChange={(e) => setNCRForm({...ncrForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter NCR title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={ncrForm.description || ''}
                  onChange={(e) => setNCRForm({...ncrForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the non-conformance in detail"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select 
                    value={ncrForm.severity || 'MEDIUM'}
                    onChange={(e) => setNCRForm({...ncrForm, severity: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={ncrForm.category || ''}
                    onChange={(e) => setNCRForm({...ncrForm, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Material Quality"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={ncrForm.location || ''}
                    onChange={(e) => setNCRForm({...ncrForm, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specify location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={ncrForm.dueDate || ''}
                    onChange={(e) => setNCRForm({...ncrForm, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateNCR(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create NCR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create ITP Modal */}
      {showCreateITP && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule New ITP</h3>
              <button
                onClick={() => setShowCreateITP(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateITP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ITP Title</label>
                <input
                  type="text"
                  value={itpForm.title || ''}
                  onChange={(e) => setITPForm({...itpForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ITP title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={itpForm.description || ''}
                  onChange={(e) => setITPForm({...itpForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the inspection requirements"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                  <input
                    type="text"
                    value={itpForm.phase || ''}
                    onChange={(e) => setITPForm({...itpForm, phase: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Foundation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspector</label>
                  <input
                    type="text"
                    value={itpForm.inspector || ''}
                    onChange={(e) => setITPForm({...itpForm, inspector: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Inspector name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={itpForm.location || ''}
                    onChange={(e) => setITPForm({...itpForm, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specify location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={itpForm.scheduledDate || ''}
                    onChange={(e) => setITPForm({...itpForm, scheduledDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type</label>
                <select 
                  value={itpForm.inspectionType || 'VISUAL'}
                  onChange={(e) => setITPForm({...itpForm, inspectionType: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="VISUAL">Visual</option>
                  <option value="DIMENSIONAL">Dimensional</option>
                  <option value="MATERIAL_TEST">Material Test</option>
                  <option value="PERFORMANCE">Performance</option>
                  <option value="SAFETY">Safety</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateITP(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Schedule ITP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityControlDashboard;