import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  TeamMember, 
  Project,
  Task,
  TaskStatus 
} from '../types/enhanced-project-types';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CogIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

interface TeamDashboardProps {
  projectId: string;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Mock team data
  const mockTeamMembers: TeamMember[] = [
    {
      id: 'member-1',
      user: {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'project_manager'
      },
      projectRole: 'project_manager',
      joinedAt: new Date('2024-01-01'),
      permissions: ['read', 'write', 'admin'],
      isActive: true,
      lastActive: new Date('2024-01-24T10:30:00'),
      tasksAssigned: 12,
      tasksCompleted: 8,
      hoursLogged: 156,
      skills: ['Project Management', 'Agile', 'Risk Management', 'Team Leadership'],
      department: 'Management',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      timezone: 'PST',
      workload: 85,
      performance: 4.8,
      certifications: ['PMP', 'Scrum Master'],
      languages: ['English', 'Mandarin']
    },
    {
      id: 'member-2',
      user: {
        id: 'user-2',
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'developer'
      },
      projectRole: 'developer',
      joinedAt: new Date('2024-01-03'),
      permissions: ['read', 'write'],
      isActive: true,
      lastActive: new Date('2024-01-24T09:15:00'),
      tasksAssigned: 18,
      tasksCompleted: 15,
      hoursLogged: 142,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
      department: 'Engineering',
      location: 'Austin, TX',
      phone: '+1 (555) 234-5678',
      timezone: 'CST',
      workload: 92,
      performance: 4.6,
      certifications: ['AWS Solutions Architect', 'React Developer'],
      languages: ['English', 'Spanish']
    },
    {
      id: 'member-3',
      user: {
        id: 'user-3',
        name: 'Emily Johnson',
        email: 'emily.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'qa_engineer'
      },
      projectRole: 'qa_engineer',
      joinedAt: new Date('2024-01-05'),
      permissions: ['read', 'write'],
      isActive: true,
      lastActive: new Date('2024-01-24T11:45:00'),
      tasksAssigned: 14,
      tasksCompleted: 12,
      hoursLogged: 128,
      skills: ['Test Automation', 'Selenium', 'Jest', 'Quality Assurance', 'Bug Tracking'],
      department: 'Quality Assurance',
      location: 'Seattle, WA',
      phone: '+1 (555) 345-6789',
      timezone: 'PST',
      workload: 78,
      performance: 4.7,
      certifications: ['ISTQB', 'Selenium WebDriver'],
      languages: ['English']
    }
  ];
  useEffect(() => {
    const loadTeamMembers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTeamMembers(mockTeamMembers);
      setLoading(false);
    };

    loadTeamMembers();
  }, [projectId]);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || member.user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'project_manager': return 'bg-purple-100 text-purple-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'designer': return 'bg-pink-100 text-pink-800';
      case 'qa_engineer': return 'bg-green-100 text-green-800';
      case 'stakeholder': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'project_manager': return <BriefcaseIcon className="w-4 h-4" />;
      case 'developer': return <CogIcon className="w-4 h-4" />;
      case 'designer': return <AcademicCapIcon className="w-4 h-4" />;
      case 'qa_engineer': return <CheckCircleIcon className="w-4 h-4" />;
      case 'stakeholder': return <UserGroupIcon className="w-4 h-4" />;
      default: return <UserGroupIcon className="w-4 h-4" />;
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-red-600 bg-red-50';
    if (workload >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  const renderMemberCard = (member: TeamMember) => (
    <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="relative">
              <img
                className="h-12 w-12 rounded-full"
                src={member.user.avatar}
                alt={member.user.name}
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                member.isActive ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{member.user.name}</h3>
              <p className="text-sm text-gray-500">{member.user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.user.role)}`}>
              {getRoleIcon(member.user.role)}
              <span className="ml-1 capitalize">{member.user.role.replace('_', ' ')}</span>
            </span>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tasks</p>
            <p className="mt-1 text-sm text-gray-900">
              {member.tasksCompleted}/{member.tasksAssigned} completed
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hours</p>
            <p className="mt-1 text-sm text-gray-900">{member.hoursLogged}h logged</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Workload</span>
            <span className={`font-medium px-2 py-1 rounded ${getWorkloadColor(member.workload)}`}>
              {member.workload}%
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                member.workload >= 90 ? 'bg-red-500' : 
                member.workload >= 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${member.workload}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(member.performance) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">{member.performance}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatLastActive(member.lastActive)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
            >
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              +{member.skills.length - 3}
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedMember(member);
                setShowMemberDetails(true);
              }}
              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Details
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage team members, track performance, and collaborate effectively
          </p>
        </div>
        <button
          onClick={() => setShowAddMemberModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                  <dd className="text-lg font-medium text-gray-900">{teamMembers.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIconSolid className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.filter(m => m.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.reduce((sum, m) => sum + m.hoursLogged, 0)}h
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIconSolid className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Performance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="project_manager">Project Manager</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="qa_engineer">QA Engineer</option>
              <option value="stakeholder">Stakeholder</option>
            </select>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'list'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(renderMemberCard)}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No team members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or add new team members.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;