.reduce((sum, milestone) => sum + milestone.progress, 0) / milestones.length;

    const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const totalActualHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
    const hoursVariance = totalActualHours - totalEstimatedHours;

    return {
      overallProgress,
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      overdueMilestones,
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalEstimatedHours,
      totalActualHours,
      hoursVariance,
      milestonesOnTrack: totalMilestones - overdueMilestones,
      tasksOnTrack: totalTasks - overdueTasks
    };
  }, [project]);

  // Get milestone status styling
  const getMilestoneStatusStyles = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get task status styling
  const getTaskStatusStyles = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority styling
  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if milestone/task is overdue
  const isOverdue = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && status !== 'completed';
  };

  // Filter milestones and tasks
  const filteredMilestones = useMemo(() => {
    const milestones = project?.milestones || mockMilestones;
    return selectedMilestone === 'all' 
      ? milestones 
      : milestones.filter(m => m.id === selectedMilestone);
  }, [project, selectedMilestone]);

  const filteredTasks = useMemo(() => {
    const tasks = project?.tasks || mockTasks;
    return selectedMilestone === 'all' 
      ? tasks 
      : tasks.filter(t => t.milestoneId === selectedMilestone);
  }, [project, selectedMilestone]);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Progress Dashboard</h2>
              <p className="text-sm text-gray-600 mt-1">Project milestones and task tracking</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as 'timeline' | 'milestones' | 'tasks')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="timeline">Timeline View</option>
              <option value="milestones">Milestones</option>
              <option value="tasks">Tasks</option>
            </select>

            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Milestones</option>
              {(project?.milestones || mockMilestones).map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {projectProgress.overallProgress.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Overall</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projectProgress.completedMilestones}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {projectProgress.inProgressMilestones}
            </div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {projectProgress.overdueMilestones}
            </div>
            <div className="text-xs text-gray-500">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {projectProgress.totalTasks}
            </div>
            <div className="text-xs text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {projectProgress.completedTasks}
            </div>
            <div className="text-xs text-gray-500">Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {projectProgress.totalActualHours}
            </div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              projectProgress.hoursVariance > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {projectProgress.hoursVariance > 0 ? '+' : ''}{projectProgress.hoursVariance}
            </div>
            <div className="text-xs text-gray-500">Variance</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Timeline View */}
        {selectedView === 'timeline' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              <div className="space-y-8">
                {filteredMilestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex items-start">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 border-green-500' 
                        : milestone.status === 'in-progress'
                        ? 'bg-blue-100 border-blue-500'
                        : isOverdue(milestone.dueDate, milestone.status)
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      ) : milestone.status === 'in-progress' ? (
                        <PlayIcon className="h-8 w-8 text-blue-600" />
                      ) : isOverdue(milestone.dueDate, milestone.status) ? (
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                      ) : (
                        <ClockIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* Milestone Content */}
                    <div className="ml-6 flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {milestone.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMilestoneStatusStyles(milestone.status)}`}>
                                {milestone.status.replace('-', ' ').toUpperCase()}
                              </span>
                              {isOverdue(milestone.dueDate, milestone.status) && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                  OVERDUE
                                </span>
                              )}
                            </div>

                            <p className="text-gray-600 mb-3">{milestone.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Due: {formatDate(milestone.dueDate)}
                              </span>
                              <span className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                {milestone.assignedTo.length} assigned
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      milestone.progress === 100 
                                        ? 'bg-green-500' 
                                        : milestone.progress >= 75
                                        ? 'bg-blue-500'
                                        : milestone.progress >= 50
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${milestone.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-600">
                                {milestone.progress}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Milestones View */}
        {selectedView === 'milestones' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Milestones Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMilestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FlagIcon className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMilestoneStatusStyles(milestone.status)}`}>
                      {milestone.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Due Date:</span>
                      <span className={isOverdue(milestone.dueDate, milestone.status) ? 'text-red-600 font-medium' : ''}>
                        {formatDate(milestone.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assigned:</span>
                      <span>{milestone.assignedTo.length} members</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          milestone.progress === 100 
                            ? 'bg-green-500' 
                            : milestone.progress >= 75
                            ? 'bg-blue-500'
                            : milestone.progress >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks View */}
        {selectedView === 'tasks' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Tasks Overview</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusStyles(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.assignedTo.split('@')[0]}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}>
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{task.actualHours}h / {task.estimatedHours}h</div>
                          <div className={`text-xs ${
                            task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {task.actualHours > task.estimatedHours ? '+' : ''}{task.actualHours - task.estimatedHours}h
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
