import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { getStatusBadge, formatDate } from '../utils/statusHelpers.jsx';
import ProofUploadModal from '../components/ProofUploadModal';
import WorkerPerformanceMetrics from '../components/WorkerPerformanceMetrics';
import WorkerAnalytics from '../components/WorkerAnalytics';

const WorkerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUnableModal, setShowUnableModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [unableReason, setUnableReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchWorkerInfo();
  }, []);

  const fetchWorkerInfo = async () => {
    try {
      const response = await api.getWorkerStats();
      const currentWorker = response.data.find(w => w.user.email === localStorage.getItem('userEmail'));
      if (currentWorker) {
        setWorker(currentWorker);
      }
    } catch (error) {
      console.error('Failed to fetch worker info:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const markTaskCollected = async (id, action) => {
    try {
      if (action === 'unable') {
        if (!unableReason.trim()) {
          toast.error('Please provide a reason for being unable to complete the task');
          return;
        }
        await api.markTaskCollected(id, action, unableReason);
        setShowUnableModal(false);
        setUnableReason('');
        setSelectedTask(null);
      } else {
        await api.markTaskCollected(id, action);
      }
      
      const actionText = action === 'accept' ? 'accepted' : 
                         action === 'start' ? 'started' : 
                         action === 'complete' ? 'completed' : 'marked unable';
      toast.success(`Task ${actionText} successfully`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const openUnableModal = (task) => {
    setSelectedTask(task);
    setShowUnableModal(true);
  };

  const closeUnableModal = () => {
    setShowUnableModal(false);
    setSelectedTask(null);
    setUnableReason('');
  };

  const openProofModal = (task) => {
    setSelectedTask(task);
    setShowProofModal(true);
  };

  const closeProofModal = () => {
    setShowProofModal(false);
    setSelectedTask(null);
  };

  const handleProofUpload = async (taskId, formData) => {
    try {
      await api.uploadProof(taskId, formData);
      fetchTasks(); // Refresh tasks to show proof status
    } catch (error) {
      throw error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'text-blue-500';
      case 'ACCEPTED': return 'text-green-500';
      case 'IN_PROGRESS': return 'text-yellow-500';
      case 'COMPLETED': return 'text-green-600';
      case 'UNABLE': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Worker Dashboard</h1>
      </div>

      {/* Analytics Dashboard */}
      <WorkerAnalytics tasks={tasks} worker={worker} />

      {/* My Assigned Tasks */}
      <div className="bg-darker rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">My Assigned Tasks</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{tasks.filter(t => t.status === 'ASSIGNED').length} pending</span>
            <span>•</span>
            <span>{tasks.filter(t => t.status === 'IN_PROGRESS').length} in progress</span>
            <span>•</span>
            <span>{tasks.filter(t => t.status === 'COMPLETED').length} completed</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusBadge(task.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={`http://localhost:5001${task.garbageReport?.imagePath}`} 
                      alt="Garbage" 
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="font-mono text-gray-300">
                          {task.latitude?.toFixed(4)}, {task.longitude?.toFixed(4)}
                        </span>
                      </div>
                      
                      {task.garbageReport?.address && (
                        <div className="flex items-center space-x-2">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                          </svg>
                          <span className="text-xs text-gray-400 max-w-xs truncate" title={task.garbageReport.address}>
                            {task.garbageReport.address}
                          </span>
                        </div>
                      )}
                      
                      <a
                        href={`https://www.google.com/maps?q=${task.latitude},${task.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        <span>View on Map</span>
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {task.status === 'ASSIGNED' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markTaskCollected(task.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Accept Task</span>
                        </button>
                        <button
                          onClick={() => openUnableModal(task)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200"
                        >
                          Unable
                        </button>
                      </div>
                    )}
                    {task.status === 'ACCEPTED' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markTaskCollected(task.id, 'start')}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          <span>Start Collection</span>
                        </button>
                        <button
                          onClick={() => openUnableModal(task)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200"
                        >
                          Unable
                        </button>
                      </div>
                    )}
                    {task.status === 'IN_PROGRESS' && (
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markTaskCollected(task.id, 'complete')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Mark Completed</span>
                          </button>
                          <button
                            onClick={() => openProofModal(task)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-200 flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>Upload Proof</span>
                          </button>
                        </div>
                        <button
                          onClick={() => openUnableModal(task)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200 w-full"
                        >
                          Unable to Complete
                        </button>
                      </div>
                    )}
                    {task.status === 'COMPLETED' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-medium text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Completed
                        </span>
                        {task.proofImage && (
                          <div className="flex items-center text-blue-400 text-xs">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Proof uploaded
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400">
              No tasks assigned yet
            </div>
          )}
        </div>
      </div>

      {/* Unable to Complete Modal */}
      {showUnableModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">Unable to Complete Task</h3>
            <p className="text-gray-300 mb-4">
              Please provide a reason why you are unable to complete this task. This will help the admin reassign it appropriately.
            </p>
            <textarea
              value={unableReason}
              onChange={(e) => setUnableReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white"
              rows={4}
              required
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={closeUnableModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => markTaskCollected(selectedTask.id, 'unable')}
                disabled={!unableReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Worker Performance Metrics */}
      {worker && (
        <WorkerPerformanceMetrics workerId={worker.id} />
      )}

      {/* Proof Upload Modal */}
      {showProofModal && selectedTask && (
        <ProofUploadModal
          task={selectedTask}
          isOpen={showProofModal}
          onClose={closeProofModal}
          onUploadSuccess={handleProofUpload}
        />
      )}
    </div>
  );
};

export default WorkerDashboard;