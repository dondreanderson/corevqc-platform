// src/components/QualityControlDashboard.tsx
import React, { useState } from 'react';
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
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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
  name: string;
  phase: string;
  inspector: string;
  location: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  inspectionType: 'visual' | 'dimensional' | 'material_test' | 'performance' | 'safety';
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
  
  const [metrics, setMetrics] = useState<QualityMetrics>({
    totalInspections: 45,
    passedInspections: 38,
    failedInspections: 7,
    activeNCRs: 12,
    resolvedNCRs: 28,
    qualityScore: 84.4,
    defectRate: 15.6,
    overdueItems: 3,
    pendingITPs: 8,
    completedITPs: 32
  });

  const [ncrs, setNCRs] = useState<NCR[]>([
    {
      id: '1',
      ncrNumber: 'NCR-2024-001',
      title: 'Concrete surface finish non-conformance',
      description: 'Surface finish does not meet specification requirements in Grid A-3 to A-5. Visible honeycombing and surface irregularities exceed tolerance limits.',
      severity: 'high',
      status: 'open',
      category: 'Material Quality',
      location: 'Level 2, Grid A-3 to A-5',
      reportedBy: 'John Smith',
      assignedTo: 'Mike Chen',
      createdDate: '2024-01-15',
      dueDate: '2024-01-25',
      rootCause: 'Inadequate concrete compaction during pour',
      images: ['img1.jpg', 'img2.jpg']
    },
    {
      id: '2',
      ncrNumber: 'NCR-2024-002',
      title: 'Steel beam alignment issue',
      description: 'Steel beam misalignment exceeds tolerance by 15mm. Beam B-12 is out of plumb and requires correction.',
      severity: 'critical',
      status: 'in_progress',
      category: 'Installation',
      location: 'Level 3, Beam B-12',
      reportedBy: 'Lisa Johnson',
      assignedTo: 'Tom Wilson',
      createdDate: '2024-01-18',
      dueDate: '2024-01-22',
      correctiveAction: 'Realign beam using hydraulic jacks and verify with surveyor measurements. Re-torque all bolted connections.',
      rootCause: 'Incorrect initial positioning during erection'
    },
    {
      id: '3',
      ncrNumber: 'NCR-2024-003',
      title: 'Electrical conduit routing violation',
      description: 'EMT conduit installed through structural beam web without proper sleeve installation.',
      severity: 'medium',
      status: 'resolved',
      category: 'Installation',
      location: 'Level 1, Grid C-4',
      reportedBy: 'David Wilson',
      assignedTo: 'Sarah Brown',
      createdDate: '2024-01-10',
      dueDate: '2024-01-20',
      resolvedDate: '2024-01-19',
      correctiveAction: 'Installed proper sleeve and fire-stopping material around conduit penetration.',
      rootCause: 'Lack of coordination between electrical and structural trades'
    }
  ]);

  const [itps, setITPs] = useState<ITP[]>([
    {
      id: '1',
      itpNumber: 'ITP-2024-001',
      name: 'Foundation Concrete Pour Inspection',
      phase: 'Foundation',
      inspector: 'David Wilson',
      location: 'Building A Foundation',
      scheduledDate: '2024-01-20',
      status: 'completed',
      inspectionType: 'visual',
      requirements: [
        'Verify rebar placement and spacing per drawings',
        'Check formwork alignment and stability',
        'Confirm concrete mix design approval',
        'Validate weather conditions suitable for pour',
        'Ensure proper curing method preparation'
      ],
      checkpoints: [
        {
          id: '1',
          description: 'Rebar inspection completed',
          status: 'passed',
          checkedBy: 'David Wilson',
          checkedDate: '2024-01-19',
          requirement: 'Rebar spacing ±25mm',
          acceptanceCriteria: 'All bars within tolerance'
        },
        {
          id: '2',
          description: 'Formwork inspection',
          status: 'passed',
          checkedBy: 'David Wilson',
          checkedDate: '2024-01-19',
          requirement: 'Formwork level and plumb',
          acceptanceCriteria: 'Max deviation 6mm in 3m'
        },
        {
          id: '3',
          description: 'Concrete mix approval',
          status: 'passed',
          checkedBy: 'Quality Manager',
          checkedDate: '2024-01-20',
          requirement: 'Mix design approved by engineer',
          acceptanceCriteria: 'Approved mix design certificate'
        }
      ],
      completedDate: '2024-01-20',
      notes: 'All checkpoints passed. Concrete pour completed successfully with proper curing initiated.'
    },
    {
      id: '2',
      itpNumber: 'ITP-2024-002',
      name: 'Structural Steel Erection Inspection',
      phase: 'Structure',
      inspector: 'Lisa Johnson',
      location: 'Level 2 Steel Frame',
      scheduledDate: '2024-01-25',
      status: 'pending',
      inspectionType: 'dimensional',
      requirements: [
        'Verify beam placement per erection drawings',
        'Check bolt torque values per specification',
        'Confirm weld quality and documentation',
        'Validate column plumbness and alignment'
      ],
      checkpoints: [
        {
          id: '4',
          description: 'Beam placement verification',
          status: 'pending',
          requirement: 'Beams positioned per drawings',
          acceptanceCriteria: 'Max deviation 6mm horizontal, 3mm vertical'
        },
        {
          id: '5',
          description: 'Bolt torque inspection',
          status: 'pending',
          requirement: 'Bolts torqued to specified values',
          acceptanceCriteria: 'All bolts within ±10% of specified torque'
        }
      ],
      holdPoints: ['Structural engineer approval required before proceeding']
    },
    {
      id: '3',
      itpNumber: 'ITP-2024-003',
      name: 'MEP Rough-in Inspection',
      phase: 'MEP',
      inspector: 'Robert Taylor',
      location: 'Level 1 Mechanical Room',
      scheduledDate: '2024-01-30',
      status: 'in_progress',
      inspectionType: 'performance',
      requirements: [
        'Verify HVAC ductwork installation and support',
        'Check electrical conduit routing and support',
        'Confirm plumbing rough-in per drawings',
        'Validate fire stopping at penetrations'
      ],
      checkpoints: [
        {
          id: '6',
          description: 'HVAC ductwork inspection',
          status: 'passed',
          checkedBy: 'Robert Taylor',
          checkedDate: '2024-01-28',
          requirement: 'Ductwork installed per SMACNA standards',
          acceptanceCriteria: 'Proper support spacing and sealing'
        },
        {
          id: '7',
          description: 'Electrical rough-in',
          status: 'pending',
          requirement: 'Conduits installed per NEC requirements',
          acceptanceCriteria: 'Proper bending radius and support'
        }
      ]
    }
  ]);

  const [selectedNCR, setSelectedNCR] = useState<NCR | null>(null);
  const [selectedITP, setSelectedITP] = useState<ITP | null>(null);
  const [showCreateNCR, setShowCreateNCR] = useState(false);
  const [showCreateITP, setShowCreateITP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [ncrForm, setNCRForm] = useState<Partial<NCR>>({});
  const [itpForm, setITPForm] = useState<Partial<ITP>>({});

  // Utility Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateMetrics = () => {
    const activeNCRCount = ncrs.filter(ncr => ncr.status !== 'closed' && ncr.status !== 'resolved').length;
    const resolvedNCRCount = ncrs.filter(ncr => ncr.status === 'resolved' || ncr.status === 'closed').length;
    const completedITPCount = itps.filter(itp => itp.status === 'completed' || itp.status === 'approved').length;
    const pendingITPCount = itps.filter(itp => itp.status === 'pending').length;
    
    const overdueTasks = [
      ...ncrs.filter(ncr => new Date(ncr.dueDate) < new Date() && ncr.status !== 'closed'),
      ...itps.filter(itp => new Date(itp.scheduledDate) < new Date() && itp.status === 'pending')
    ].length;

    return {
      ...metrics,
      activeNCRs: activeNCRCount,
      resolvedNCRs: resolvedNCRCount,
      completedITPs: completedITPCount,
      pendingITPs: pendingITPCount,
      overdueItems: overdueTasks
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'resolved':
      case 'closed':
      case 'passed':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'in_progress':
      case 'in-progress':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'failed':
      case 'rejected':
      case 'open':
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
    const matchesSearch = itp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itp.itpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itp.phase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || itp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Event handlers
  const handleCreateNCR = async (formData: Partial<NCR>) => {
    try {
      setLoading(true);
      const newNCR: NCR = {
        id: Date.now().toString(),
        ncrNumber: `NCR-2024-${String(ncrs.length + 1).padStart(3, '0')}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'open',
        ...formData
      } as NCR;
      
      setNCRs([...ncrs, newNCR]);
      setShowCreateNCR(false);
      setNCRForm({});
      
      if (onNCRCreate) {
        onNCRCreate(newNCR);
      }
    } catch (err) {
      setError('Failed to create NCR');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateITP = async (formData: Partial<ITP>) => {
    try {
      setLoading(true);
      const newITP: ITP = {
        id: Date.now().toString(),
        itpNumber: `ITP-2024-${String(itps.length + 1).padStart(3, '0')}`,
        status: 'pending',
        checkpoints: [],
        requirements: [],
        inspectionType: 'visual',
        ...formData
      } as ITP;
      
      setITPs([...itps, newITP]);
      setShowCreateITP(false);
      setITPForm({});
      
      if (onITPCreate) {
        onITPCreate(newITP);
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
      setNCRs(ncrs.map(ncr => ncr.id === id ? { ...ncr, ...updates } : ncr));
      
      if (onNCRUpdate) {
        onNCRUpdate(id, updates);
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
      setITPs(itps.map(itp => itp.id === id ? { ...itp, ...updates } : itp));
      
      if (onITPUpdate) {
        onITPUpdate(id, updates);
      }
    } catch (err) {
      setError('Failed to update ITP');
    } finally {
      setLoading(false);
    }
  };

  // Calculate updated metrics
  const currentMetrics = calculateMetrics();

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
                  <p className="text-3xl font-bold text-green-600">{currentMetrics.qualityScore}%</p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${currentMetrics.qualityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Active NCRs */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active NCRs</p>
                  <p className="text-3xl font-bold text-red-600">{currentMetrics.activeNCRs}</p>
                </div>
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {currentMetrics.resolvedNCRs} resolved this month
              </p>
            </div>

            {/* Inspections */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ITPs</p>
                  <p className="text-3xl font-bold text-blue-600">{currentMetrics.completedITPs + currentMetrics.pendingITPs}</p>
                </div>
                <ClockIcon className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {currentMetrics.completedITPs} completed, {currentMetrics.pendingITPs} pending
              </p>
            </div>

            {/* Overdue Items */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                  <p className="text-3xl font-bold text-orange-600">{currentMetrics.overdueItems}</p>
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
                  {itps.filter(itp => itp.status === 'pending').slice(0, 3).map((itp) => (
                    <div key={itp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{itp.itpNumber}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(itp.status)}`}>
                              {itp.status}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">{itp.name}</h3>
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
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
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

            {/* Search and Filters */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search ITPs..."
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
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{itp.name}</h3>
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

      {/* NCR Detail Modal */}
      {selectedNCR && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">NCR Details - {selectedNCR.ncrNumber}</h3>
              <button
                onClick={() => setSelectedNCR(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Issue Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-1">{selectedNCR.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{selectedNCR.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Severity:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedNCR.severity)}`}>
                        {selectedNCR.severity}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedNCR.status)}`}>
                        {selectedNCR.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{selectedNCR.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-600">{selectedNCR.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Reported By</h4>
                  <p className="text-sm text-gray-600">{selectedNCR.reportedBy}</p>
                  <p className="text-xs text-gray-500">Created: {formatDate(selectedNCR.createdDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Assigned To</h4>
                  <p className="text-sm text-gray-600">{selectedNCR.assignedTo}</p>
                  <p className="text-xs text-gray-500">Due: {formatDate(selectedNCR.dueDate)}</p>
                </div>
              </div>

              {selectedNCR.rootCause && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Root Cause</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-3">{selectedNCR.rootCause}</p>
                </div>
              )}

              {selectedNCR.correctiveAction && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Corrective Action</h4>
                  <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{selectedNCR.correctiveAction}</p>
                </div>
              )}

              {selectedNCR.images && selectedNCR.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNCR.images.map((image, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-3 text-center">
                        <DocumentTextIcon className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                        <p className="text-xs text-gray-600">{image}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedNCR(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle edit functionality
                  console.log('Edit NCR:', selectedNCR.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
              >
                Edit NCR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITP Detail Modal */}
      {selectedITP && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">ITP Details - {selectedITP.itpNumber}</h3>
              <button
                onClick={() => setSelectedITP(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Inspection Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{selectedITP.name}</h5>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Phase:</span>
                      <span className="ml-2 text-gray-600">{selectedITP.phase}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Inspector:</span>
                      <span className="ml-2 text-gray-600">{selectedITP.inspector}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-600">{selectedITP.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Scheduled:</span>
                      <span className="ml-2 text-gray-600">{formatDate(selectedITP.scheduledDate)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-600">{selectedITP.inspectionType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedITP.status)}`}>
                        {selectedITP.status}
                      </span>
                    </div>
                  </div>

                  {selectedITP.completedDate && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Completed:</span>
                      <span className="ml-2 text-gray-600">{formatDate(selectedITP.completedDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedITP.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Checkpoints</h4>
                <div className="space-y-3">
                  {selectedITP.checkpoints.map((checkpoint) => (
                    <div key={checkpoint.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        checkpoint.status === 'passed' ? 'bg-green-500' :
                        checkpoint.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{checkpoint.description}</p>
                        {checkpoint.requirement && (
                          <p className="text-xs text-gray-600 mt-1">Requirement: {checkpoint.requirement}</p>
                        )}
                        {checkpoint.acceptanceCriteria && (
                          <p className="text-xs text-gray-600 mt-1">Criteria: {checkpoint.acceptanceCriteria}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(checkpoint.status)}`}>
                            {checkpoint.status}
                          </span>
                          {checkpoint.checkedBy && (
                            <span className="text-xs text-gray-500">
                              by {checkpoint.checkedBy} on {checkpoint.checkedDate ? formatDate(checkpoint.checkedDate) : 'N/A'}
                            </span>
                          )}
                        </div>
                        {checkpoint.notes && (
                          <p className="text-xs text-gray-600 mt-1 bg-white rounded p-2">{checkpoint.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedITP.holdPoints && selectedITP.holdPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Hold Points</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    {selectedITP.holdPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedITP.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
                  <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{selectedITP.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedITP(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle edit functionality
                  console.log('Edit ITP:', selectedITP.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit ITP
              </button>
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
                onClick={() => {
                  setShowCreateNCR(false);
                  setNCRForm({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateNCR(ncrForm);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={ncrForm.title || ''}
                  onChange={(e) => setNCRForm({...ncrForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter NCR title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={ncrForm.description || ''}
                  onChange={(e) => setNCRForm({...ncrForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe the non-conformance in detail"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                  <select 
                    required
                    value={ncrForm.severity || ''}
                    onChange={(e) => setNCRForm({...ncrForm, severity: e.target.value as NCR['severity']})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    required
                    value={ncrForm.category || ''}
                    onChange={(e) => setNCRForm({...ncrForm, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select category</option>
                    <option value="Material Quality">Material Quality</option>
                    <option value="Workmanship">Workmanship</option>
                    <option value="Installation">Installation</option>
                    <option value="Dimensional Control">Dimensional Control</option>
                    <option value="Safety">Safety</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={ncrForm.location || ''}
                    onChange={(e) => setNCRForm({...ncrForm, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Specify location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                  <select 
                    required
                    value={ncrForm.assignedTo || ''}
                    onChange={(e) => setNCRForm({...ncrForm, assignedTo: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select assignee</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Mike Chen">Mike Chen</option>
                    <option value="Lisa Johnson">Lisa Johnson</option>
                    <option value="Tom Wilson">Tom Wilson</option>
                    <option value="Sarah Brown">Sarah Brown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported By *</label>
                  <select 
                    required
                    value={ncrForm.reportedBy || ''}
                    onChange={(e) => setNCRForm({...ncrForm, reportedBy: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select reporter</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Mike Chen">Mike Chen</option>
                    <option value="Lisa Johnson">Lisa Johnson</option>
                    <option value="David Wilson">David Wilson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={ncrForm.dueDate || ''}
                    onChange={(e) => setNCRForm({...ncrForm, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Root Cause (Optional)</label>
                <textarea
                  rows={2}
                  value={ncrForm.rootCause || ''}
                  onChange={(e) => setNCRForm({...ncrForm, rootCause: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Identify the root cause if known"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateNCR(false);
                    setNCRForm({});
                  }}
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
                onClick={() => {
                  setShowCreateITP(false);
                  setITPForm({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateITP(itpForm);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ITP Name *</label>
                <input
                  type="text"
                  required
                  value={itpForm.name || ''}
                  onChange={(e) => setITPForm({...itpForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ITP name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phase *</label>
                  <select 
                    required
                    value={itpForm.phase || ''}
                    onChange={(e) => setITPForm({...itpForm, phase: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select phase</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Structure">Structure</option>
                    <option value="MEP">MEP</option>
                    <option value="Envelope">Envelope</option>
                    <option value="Finishes">Finishes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspector *</label>
                  <select 
                    required
                    value={itpForm.inspector || ''}
                    onChange={(e) => setITPForm({...itpForm, inspector: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select inspector</option>
                    <option value="David Wilson">David Wilson</option>
                    <option value="Lisa Brown">Lisa Brown</option>
                    <option value="Robert Taylor">Robert Taylor</option>
                    <option value="Emma Clark">Emma Clark</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={itpForm.location || ''}
                    onChange={(e) => setITPForm({...itpForm, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specify location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={itpForm.scheduledDate || ''}
                    onChange={(e) => setITPForm({...itpForm, scheduledDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Type *</label>
                <select 
                  required
                  value={itpForm.inspectionType || ''}
                  onChange={(e) => setITPForm({...itpForm, inspectionType: e.target.value as ITP['inspectionType']})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select inspection type</option>
                  <option value="visual">Visual</option>
                  <option value="dimensional">Dimensional</option>
                  <option value="material_test">Material Test</option>
                  <option value="performance">Performance</option>
                  <option value="safety">Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  rows={3}
                  value={itpForm.requirements?.join('\n') || ''}
                  onChange={(e) => setITPForm({
                    ...itpForm, 
                    requirements: e.target.value.split('\n').filter(req => req.trim())
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List inspection requirements (one per line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hold Points</label>
                <textarea
                  rows={2}
                  value={itpForm.holdPoints?.join('\n') || ''}
                  onChange={(e) => setITPForm({
                    ...itpForm, 
                    holdPoints: e.target.value.split('\n').filter(point => point.trim())
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List hold points if any (one per line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={itpForm.notes || ''}
                  onChange={(e) => setITPForm({...itpForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateITP(false);
                    setITPForm({});
                  }}
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