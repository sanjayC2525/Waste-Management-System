import React from 'react';

const AdminAnalytics = ({ reports, workers }) => {
  // Calculate metrics safely
  const calculateMetrics = () => {
    try {
      const totalReports = reports?.length || 0;
      const pendingReports = reports?.filter(r => r.status === 'REPORTED')?.length || 0;
      const inProgressReports = reports?.filter(r => r.status === 'IN_PROGRESS')?.length || 0;
      const completedReports = reports?.filter(r => r.status === 'COMPLETED')?.length || 0;
      
      const totalWorkers = workers?.length || 0;
      const activeWorkers = workers?.filter(w => w.activeAssignments > 0)?.length || 0;
      
      const completionRate = totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : 0;
      const workerUtilization = totalWorkers > 0 ? ((activeWorkers / totalWorkers) * 100).toFixed(1) : 0;

      return {
        totalReports,
        pendingReports,
        inProgressReports,
        completedReports,
        totalWorkers,
        activeWorkers,
        completionRate,
        workerUtilization
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return {
        totalReports: 0,
        pendingReports: 0,
        inProgressReports: 0,
        completedReports: 0,
        totalWorkers: 0,
        activeWorkers: 0,
        completionRate: 0,
        workerUtilization: 0
      };
    }
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Reports Card */}
      <div className="bg-surfaceLight rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Total Reports</p>
            <p className="text-2xl font-bold text-text-primary">{metrics.totalReports}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Pending Reports Card */}
      <div className="bg-surfaceLight rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{metrics.pendingReports}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Completed Reports Card */}
      <div className="bg-surfaceLight rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Completed</p>
            <p className="text-2xl font-bold text-green-600">{metrics.completedReports}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Worker Utilization Card */}
      <div className="bg-surfaceLight rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Worker Utilization</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.workerUtilization}%</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Rate */}
        <div className="bg-surfaceLight rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-text-muted">Completion Rate</p>
            <p className="text-sm font-bold text-text-primary">{metrics.completionRate}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.completionRate, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surfaceLight rounded-lg p-4 border border-border">
          <p className="text-sm text-text-muted mb-2">Status Distribution</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-xs text-text-muted">Pending: {metrics.pendingReports}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-text-muted">In Progress: {metrics.inProgressReports}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-text-muted">Completed: {metrics.completedReports}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
