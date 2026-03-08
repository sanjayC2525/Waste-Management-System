import React from 'react';

const WorkerAnalytics = ({ tasks, worker }) => {
  // Calculate metrics safely
  const calculateMetrics = () => {
    try {
      const totalTasks = tasks?.length || 0;
      const pendingTasks = tasks?.filter(t => t.status === 'ASSIGNED')?.length || 0;
      const inProgressTasks = tasks?.filter(t => t.status === 'IN_PROGRESS')?.length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'COMPLETED')?.length || 0;
      
      const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
      const activeTasks = pendingTasks + inProgressTasks;

      return {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        activeTasks,
        completionRate
      };
    } catch (error) {
      console.error('Error calculating worker metrics:', error);
      return {
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        activeTasks: 0,
        completionRate: 0
      };
    }
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Tasks</p>
            <p className="text-2xl font-bold text-white">{metrics.totalTasks}</p>
          </div>
          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Active Tasks Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Active Tasks</p>
            <p className="text-2xl font-bold text-yellow-400">{metrics.activeTasks}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Completed Tasks Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-400">{metrics.completedTasks}</p>
          </div>
          <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Completion Rate Card */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-2xl font-bold text-purple-400">{metrics.completionRate}%</p>
          </div>
          <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="col-span-full">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Today's Progress</p>
            <p className="text-sm font-bold text-white">{metrics.completionRate}%</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.completionRate, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{metrics.completedTasks} completed</span>
            <span>{metrics.activeTasks} active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerAnalytics;
