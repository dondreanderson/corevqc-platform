import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  ActivityType, 
  User, 
  Project,
  Task,
  Document 
} from '../types/enhanced-project-types';
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  CodeBracketIcon,
  BugAntIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  BellIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

interface ActivityFeedProps {
  projectId: string;
  userId?: string;
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  projectId, 
  userId, 
  maxItems = 50,
  autoRefresh = true,
  refreshInterval = 30000 
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isRealTime, setIsRealTime] = useState(autoRefresh);
  const [showFilters, setShowFilters] = useState(false);
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [bookmarkedActivities, setBookmarkedActivities] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  // Mock activity data with comprehensive examples
  const mockActivities: Activity[] = [
    {
      id: 'activity-1',
      type: 'task_completed',
      title: 'Task Completed',
      description: 'Completed "Implement user authentication system"',
      user: {
        id: 'user-2',
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'developer'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      metadata: {
        taskId: 'task-123',
        taskTitle: 'Implement user authentication system',
        priority: 'high',
        estimatedHours: 8,
        actualHours: 6.5
      },
      projectId,
      isRead: false,
      reactions: { likes: 3, comments: 1 },
      tags: ['development', 'authentication', 'backend']
    },
    {
      id: 'activity-2',
      type: 'document_uploaded',
      title: 'Document Uploaded',
      description: 'Uploaded "API Documentation v2.1"',
      user: {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'project_manager'
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      metadata: {
        documentId: 'doc-456',
        documentTitle: 'API Documentation v2.1',
        fileSize: 2048576,
        version: '2.1',
        category: 'technical'
      },
      projectId,
      isRead: true,
      reactions: { likes: 5, comments: 2 },
      tags: ['documentation', 'api', 'technical']
    },
    {
      id: 'activity-3',
      type: 'comment_added',
      title: 'Comment Added',
      description: 'Commented on "Database schema design"',
      user: {
        id: 'user-3',
        name: 'Emily Johnson',
        email: 'emily.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'qa_engineer'
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      metadata: {
        commentText: 'We should consider adding indexes for better query performance',
        targetType: 'task',
        targetId: 'task-789',
        targetTitle: 'Database schema design'
      },
      projectId,
      isRead: true,
      reactions: { likes: 2, comments: 0 },
      tags: ['database', 'performance', 'review']
    },
    {
      id: 'activity-4',
      type: 'bug_reported',
      title: 'Bug Reported',
      description: 'Reported critical bug in user registration flow',
      user: {
        id: 'user-3',
        name: 'Emily Johnson',
        email: 'emily.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'qa_engineer'
      },
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      metadata: {
        bugId: 'bug-202',
        severity: 'critical',
        component: 'user-registration',
        description: 'Users cannot complete registration when using special characters in password'
      },
      projectId,
      isRead: true,
      reactions: { likes: 0, comments: 5 },
      tags: ['bug', 'critical', 'registration']
    },
    {
      id: 'activity-5',
      type: 'milestone_reached',
      title: 'Milestone Reached',
      description: 'Reached milestone "Alpha Release"',
      user: {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'project_manager'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: {
        milestoneId: 'milestone-1',
        milestoneName: 'Alpha Release',
        completionPercentage: 100,
        tasksCompleted: 25,
        totalTasks: 25
      },
      projectId,
      isRead: true,
      reactions: { likes: 12, comments: 8 },
      tags: ['milestone', 'alpha', 'release']
    }
  ];
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setActivities(mockActivities);
      setLoading(false);
    };

    loadActivities();
  }, [projectId]);

  useEffect(() => {
    if (isRealTime && autoRefresh) {
      intervalRef.current = setInterval(() => {
        const newActivity: Activity = {
          id: `activity-${Date.now()}`,
          type: 'task_updated',
          title: 'Task Updated',
          description: 'Updated task status to "In Progress"',
          user: mockActivities[Math.floor(Math.random() * mockActivities.length)].user,
          timestamp: new Date(),
          metadata: {
            taskId: 'task-' + Math.random().toString(36).substr(2, 9),
            taskTitle: 'Sample Task Update',
            oldStatus: 'todo',
            newStatus: 'in_progress'
          },
          projectId,
          isRead: false,
          reactions: { likes: 0, comments: 0 },
          tags: ['task', 'update', 'progress']
        };

        setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, autoRefresh, refreshInterval, maxItems, projectId]);

  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(activity => selectedTypes.includes(activity.type));
    }

    if (selectedUsers.length > 0) {
      filtered = filtered.filter(activity => selectedUsers.includes(activity.user.id));
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();

      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(activity => activity.timestamp >= cutoff);
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedTypes, selectedUsers, timeFilter]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'document_uploaded':
      case 'document_updated':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'comment_added':
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
      case 'bug_reported':
        return <BugAntIcon className="w-5 h-5" />;
      case 'milestone_reached':
        return <CheckCircleIconSolid className="w-5 h-5" />;
      case 'user_joined':
        return <UserIcon className="w-5 h-5" />;
      case 'meeting_scheduled':
        return <CalendarDaysIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'task_completed':
      case 'milestone_reached':
        return 'text-green-600 bg-green-100';
      case 'bug_reported':
        return 'text-red-600 bg-red-100';
      case 'task_created':
      case 'task_updated':
        return 'text-blue-600 bg-blue-100';
      case 'document_uploaded':
      case 'document_updated':
        return 'text-purple-600 bg-purple-100';
      case 'comment_added':
        return 'text-yellow-600 bg-yellow-100';
      case 'user_joined':
        return 'text-indigo-600 bg-indigo-100';
      case 'meeting_scheduled':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return timestamp.toLocaleDateString();
  };

  const toggleActivityType = (type: ActivityType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleLike = (activityId: string) => {
    setLikedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (activityId: string) => {
    setBookmarkedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedUsers([]);
    setTimeFilter('all');
  };

  const uniqueUsers = Array.from(new Set(activities.map(a => a.user.id)))
    .map(id => activities.find(a => a.user.id === id)?.user)
    .filter(Boolean) as User[];

  const activityTypes: { type: ActivityType; label: string }[] = [
    { type: 'task_created', label: 'Task Created' },
    { type: 'task_updated', label: 'Task Updated' },
    { type: 'task_completed', label: 'Task Completed' },
    { type: 'document_uploaded', label: 'Document Uploaded' },
    { type: 'comment_added', label: 'Comment Added' },
    { type: 'bug_reported', label: 'Bug Reported' },
    { type: 'milestone_reached', label: 'Milestone Reached' },
    { type: 'user_joined', label: 'User Joined' },
    { type: 'meeting_scheduled', label: 'Meeting Scheduled' }
  ];
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
          <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time project activity timeline with {filteredActivities.length} activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
              isRealTime
                ? 'text-green-700 bg-green-50 border-green-300'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isRealTime ? (
              <>
                <PauseIcon className="w-4 h-4 mr-2" />
                Live
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 mr-2" />
                Paused
              </>
            )}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Types</label>
              <div className="flex flex-wrap gap-2">
                {activityTypes.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => toggleActivityType(type)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedTypes.includes(type)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
              <div className="flex flex-wrap gap-2">
                {uniqueUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUsers.includes(user.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <img
                      className="w-4 h-4 rounded-full mr-1"
                      src={user.avatar}
                      alt={user.name}
                    />
                    {user.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div ref={feedRef} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !activity.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <img
                          className="w-6 h-6 rounded-full"
                          src={activity.user.avatar}
                          alt={activity.user.name}
                        />
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user.name}
                        </p>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        {!activity.isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.description}
                      </p>

                      {activity.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {activity.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {activity.metadata && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <div className="text-xs text-gray-600">
                            {activity.type === 'task_completed' && activity.metadata.taskTitle && (
                              <div className="space-y-1">
                                <p><span className="font-medium">Task:</span> {activity.metadata.taskTitle}</p>
                                {activity.metadata.actualHours && (
                                  <p><span className="font-medium">Time:</span> {activity.metadata.actualHours}h</p>
                                )}
                              </div>
                            )}
                            {activity.type === 'bug_reported' && activity.metadata.severity && (
                              <div className="space-y-1">
                                <p><span className="font-medium">Severity:</span> 
                                  <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    activity.metadata.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                    activity.metadata.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {activity.metadata.severity}
                                  </span>
                                </p>
                                {activity.metadata.component && (
                                  <p><span className="font-medium">Component:</span> {activity.metadata.component}</p>
                                )}
                              </div>
                            )}
                            {activity.type === 'milestone_reached' && activity.metadata.completionPercentage && (
                              <div className="space-y-1">
                                <p><span className="font-medium">Progress:</span> {activity.metadata.completionPercentage}%</p>
                                <p><span className="font-medium">Tasks:</span> {activity.metadata.tasksCompleted}/{activity.metadata.totalTasks}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center space-x-4">
                        <button
                          onClick={() => toggleLike(activity.id)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600"
                        >
                          {likedActivities.has(activity.id) ? (
                            <HeartIconSolid className="w-4 h-4 text-red-600" />
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                          <span>{activity.reactions.likes + (likedActivities.has(activity.id) ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{activity.reactions.comments}</span>
                        </button>
                        <button
                          onClick={() => toggleBookmark(activity.id)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-yellow-600"
                        >
                          {bookmarkedActivities.has(activity.id) ? (
                            <BookmarkIconSolid className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <BookmarkIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later for new activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;