import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, FileText, 
  CheckCircle, AlertTriangle, TrendingUp,
  Clock, DollarSign, Settings
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget?: number;
  location?: string;
  client?: string;
  projectManager?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface QualityItem {
  id: string;
  type: string;
  title: string;
  status: string;
  date: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with your API calls
  const mockProject: Project = {
    id: id || '1',
    name: 'Downtown Construction Project',
    description: 'Modern office building construction with quality control management',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    budget: 2500000,
    location: '123 Main St, Downtown',
    client: 'ABC Development Corp',
    projectManager: 'John Smith'
  };

  const mockTeam: TeamMember[] = [
    { id: '1', name: 'John Smith', role: 'Project Manager', email: 'john@example.com' },
    { id: '2', name: 'Sarah Johnson', role: 'Quality Inspector', email: 'sarah@example.com' },
    { id: '3', name: 'Mike Davis', role: 'Site Engineer', email: 'mike@example.com' }
  ];

  const mockQuality: QualityItem[] = [
    { id: '1', type: 'Inspection', title: 'Foundation Inspection', status: 'completed', date: '2024-06-20' },
    { id: '2', type: 'NCR', title: 'Concrete Quality Issue', status: 'in-progress', date: '2024-06-19' },
    { id: '3', type: 'ITP', title: 'Steel Structure Test', status: 'pending', date: '2024-06-21' }
  ];

  useEffect(() => {
    // Replace with actual API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-600">Project not found</h2>
        <Link to="/projects" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status.toUpperCase()}
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Edit Project
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {project.progress}%</span>
              <span>{project.startDate} - {project.endDate}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'team', name: 'Team', icon: Users },
              { id: 'quality', name: 'Quality Control', icon: CheckCircle },
              { id: 'documents', name: 'Documents', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Info Cards */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${project.budget?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{project.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Project Team</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {mockTeam.map((member) => (
                <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quality Control Items</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {mockQuality.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : item.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-orange-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.type} - {item.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Project Documents</h3>
            </div>
            <div className="p-6 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Document management coming soon</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Upload Documents
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;