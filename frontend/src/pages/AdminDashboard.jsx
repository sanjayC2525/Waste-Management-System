import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { getStatusBadge, formatDate } from '../utils/statusHelpers.jsx';
import ReportDetailModal from '../components/ReportDetailModal';
import FeedbackManagement from '../components/FeedbackManagement';
import Skeleton from '../components/Skeleton';
import NotificationCenter from '../components/NotificationCenter';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [activeSection, setActiveSection] = useState('pendingRequests');
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [unableTasks, setUnableTasks] = useState([]);
  const [stuckTasksLoading, setStuckTasksLoading] = useState(false);
  const [reassignModal, setReassignModal] = useState({ isOpen: false, task: null, selectedWorker: '' });

  useEffect(() => {
    loadData();
    getUserInfo();
  }, []);

  useEffect(() => {
    if (activeSection === 'stuckTasks') {
      fetchUnableTasks();
    }
  }, [activeSection]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await api.getUserProfile();
      setUserId(response.data.id);
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const openReportModal = async (report) => {
    setModalLoading(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));
      setSelectedReport(report);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to open modal:', error);
      toast.error('Failed to open report details');
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
    setModalLoading(false);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reportsRes, workersRes] = await Promise.all([
        api.getGarbageReports(),
        api.getWorkerStats(),
      ]);

      console.log('Workers loaded:', workersRes.data);
      setReports(reportsRes.data);
      setWorkers(workersRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('Failed to load admin data. Please try again.');
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const createWorker = async (e) => {
    e.preventDefault();
    try {
      await api.createUser({ ...workerForm, role: 'Worker' });
      toast.success('Worker added');
      setActiveSection('workers');
      setWorkerForm({ name: '', email: '', password: '' });
      loadData();
    } catch {
      toast.error('Failed to create worker');
    }
  };

  const updateReportStatus = async (id, action, workerId, adminNotes) => {
    try {
      await api.updateGarbageReportStatus(id, action, workerId, adminNotes);
      loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Failed to update report status:', error);
      toast.error('Failed to update report status');
    }
  };

  const fetchUnableTasks = async () => {
    try {
      setStuckTasksLoading(true);
      const response = await api.getUnableTasks();
      setUnableTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch unable tasks:', error);
      toast.error('Failed to fetch stuck tasks');
    } finally {
      setStuckTasksLoading(false);
    }
  };

  const handleReassignTask = async (taskId, workerId) => {
    try {
      console.log('Reassigning task:', taskId, 'to worker ID:', workerId);
      console.log('Available workers:', workers.map(w => ({ id: w.id, name: w.name })));
      
      await api.reassignTask(taskId, workerId);
      toast.success('Task reassigned successfully');
      setReassignModal({ isOpen: false, task: null, selectedWorker: '' });
      fetchUnableTasks(); // Refresh the stuck tasks list
    } catch (error) {
      console.error('Failed to reassign task:', error);
      toast.error('Failed to reassign task');
    }
  };

  const openReassignModal = (task) => {
    setReassignModal({ isOpen: true, task, selectedWorker: '' });
  };

  const closeReassignModal = () => {
    setReassignModal({ isOpen: false, task: null, selectedWorker: '' });
  };

  const handleWorkerClick = (worker) => {
    // For now, just show a toast - this prevents blank page
    // In future, could navigate to worker detail page
    toast.info(`Worker: ${worker.name} - Click delete to remove`);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex space-x-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error Loading Dashboard</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        {userId && <NotificationCenter userId={userId} />}
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('addWorker')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            activeSection === 'addWorker' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-surface hover:bg-surfaceLight text-text-primary'
          }`}
        >
          Add New Worker
        </button>
        <button
          onClick={() => setActiveSection('pendingRequests')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            activeSection === 'pendingRequests' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-surface hover:bg-surfaceLight text-text-primary'
          }`}
        >
          Pending Garbage Requests
        </button>
        <button
          onClick={() => setActiveSection('workers')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            activeSection === 'workers' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-surface hover:bg-surfaceLight text-text-primary'
          }`}
        >
          Workers
        </button>
        <button
          onClick={() => setActiveSection('feedback')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            activeSection === 'feedback' 
              ? 'bg-gray-600 text-gray-300 shadow-md' 
              : 'bg-surface hover:bg-surfaceLight text-text-primary'
          }`}
        >
          Feedback & Issues
        </button>
        <button
          onClick={() => setActiveSection('stuckTasks')}
          className={`px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md ${
            activeSection === 'stuckTasks' 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-surface hover:bg-surfaceLight text-text-primary'
          }`}
        >
          Stuck Tasks
        </button>
      </div>

      {activeSection === 'addWorker' && (
        <div className="bg-surface rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-200">
          <h2 className="text-xl font-bold mb-6 text-text-primary">Add New Worker</h2>
          <form onSubmit={createWorker} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
              <input
                placeholder="Enter worker name"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                value={workerForm.name}
                onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                placeholder="worker@example.com"
                type="email"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                value={workerForm.email}
                onChange={e => setWorkerForm({ ...workerForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <input
                placeholder="Enter secure password"
                type="password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                value={workerForm.password}
                onChange={e => setWorkerForm({ ...workerForm, password: e.target.value })}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              Create Worker
            </button>
          </form>
        </div>
      )}

      {activeSection === 'pendingRequests' && (
        <div className="bg-surface rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Pending Garbage Reports</h2>
            <p className="text-text-muted text-sm mt-1">Review and process incoming reports</p>
          </div>
          
          {reports.filter(r => r.status === 'REPORTED').length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Pending Requests</h3>
              <p className="text-text-muted">All reports have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surfaceLight">
                  <tr>
                    <th className="p-4 text-left text-text-secondary font-medium">ID</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Citizen</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Photo</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Location</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Status</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports
                    .filter(r => r.status === 'REPORTED')
                    .map(r => (
                      <tr key={r.id} className="border-b border-border hover:bg-surfaceLight transition-colors">
                        <td className="p-4 font-mono text-xs text-text-muted">{r.id}</td>
                        <td className="p-4 text-text-primary">{r.citizen?.name}</td>
                        <td className="p-4">
                          <img
                            src={`http://localhost:5001${r.imagePath}`}
                            className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedImage(`http://localhost:5001${r.imagePath}`)}
                          />
                        </td>
                        <td className="p-4">
                          <a
                            href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors text-sm"
                          >
                            📍 View Map
                          </a>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(r.status)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => openReportModal(r)}
                            disabled={modalLoading}
                            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {modalLoading ? (
                              <div className="flex items-center space-x-1">
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                <span>Loading...</span>
                              </div>
                            ) : (
                              'View'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSection === 'workers' && (
        <div className="bg-surface rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-200">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Workers</h2>
            <p className="text-text-muted text-sm mt-1">Manage your team and view performance</p>
          </div>

          {workers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">👷</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Workers Yet</h3>
              <p className="text-text-muted mb-4">Add your first worker to get started</p>
              <button
                onClick={() => setActiveSection('addWorker')}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Worker
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {workers.map(w => {
                const active = w.activeAssignments || 0;
                const completed = w.completedAssignments || 0;
                const efficiency = w.efficiency || 0;
                const workloadPercentage = w.maxTasks ? (active / w.maxTasks) * 100 : 0;
                return (
                  <div 
                    key={w.id} 
                    className="bg-background rounded-xl p-6 border border-border hover:shadow-medium hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleWorkerClick(w)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{w.name}</h3>
                          <p className="text-sm text-text-muted">{w.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{efficiency}%</div>
                        <div className="text-xs text-text-muted">Efficiency</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-surfaceLight rounded-lg p-3 text-center hover:bg-surface transition-colors">
                        <div className="text-lg font-bold text-status-info">{active}</div>
                        <div className="text-xs text-text-muted">Active</div>
                      </div>
                      <div className="bg-surfaceLight rounded-lg p-3 text-center hover:bg-surface transition-colors">
                        <div className="text-lg font-bold text-status-success">{completed}</div>
                        <div className="text-xs text-text-muted">Completed</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-text-muted">Workload</span>
                        <span className="text-text-primary font-medium">{Math.min(workloadPercentage, 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-surfaceLight rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorker(w.id);
                      }}
                      className="w-full bg-status-error hover:bg-status-error/90 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                    >
                      Delete Worker
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSection === 'feedback' && (
        <FeedbackManagement />
      )}

      {activeSection === 'stuckTasks' && (
        <div className="bg-surface rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Stuck Tasks</h2>
            <p className="text-text-muted text-sm mt-1">Tasks that workers were unable to complete - needs reassignment</p>
          </div>
          
          {stuckTasksLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-muted">Loading stuck tasks...</p>
            </div>
          ) : unableTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Stuck Tasks</h3>
              <p className="text-text-muted">All tasks are proceeding normally</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surfaceLight">
                  <tr>
                    <th className="p-4 text-left text-text-secondary font-medium">Task ID</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Citizen</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Original Worker</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Unable Reason</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Date</th>
                    <th className="p-4 text-left text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {unableTasks.map((task) => (
                    <tr key={task.id} className="border-b border-border hover:bg-surfaceLight transition-colors">
                      <td className="p-4 font-mono text-xs text-text-muted">#{task.id}</td>
                      <td className="p-4 text-text-primary">{task.garbageReport?.citizen?.name}</td>
                      <td className="p-4 text-text-primary">{task.worker?.user?.name}</td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-text-secondary text-sm truncate" title={task.unableReason}>
                            {task.unableReason}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-text-muted">
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openReassignModal(task)}
                          className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                        >
                          Reassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img 
              src={selectedImage} 
              className="max-h-full max-w-full rounded-xl shadow-large object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-surface hover:bg-surfaceLight text-text-primary rounded-full p-2 shadow-soft transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        report={selectedReport}
        workers={workers}
        onUpdateStatus={updateReportStatus}
      />

      {/* Reassign Task Modal */}
      {reassignModal.isOpen && reassignModal.task && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-large">
            <h3 className="text-xl font-bold mb-4 text-text-primary">Reassign Task</h3>
            <div className="mb-4">
              <p className="text-text-secondary mb-2">
                <strong>Task #{reassignModal.task.id}</strong> - {reassignModal.task.garbageReport?.citizen?.name}
              </p>
              <p className="text-sm text-text-muted">
                Original worker: {reassignModal.task.worker?.user?.name}
              </p>
              <p className="text-sm text-status-error">
                Reason: {reassignModal.task.unableReason}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">Select New Worker</label>
              <select
                value={reassignModal.selectedWorker}
                onChange={(e) => setReassignModal(prev => ({ ...prev, selectedWorker: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                required
              >
                <option value="">Choose a worker...</option>
                {workers
                  .filter(w => w.id !== reassignModal.task.worker?.id)
                  .map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} ({worker.email}) - Efficiency: {worker.efficiency}%
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeReassignModal}
                className="px-4 py-2 bg-surface hover:bg-surfaceLight text-text-primary font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReassignTask(reassignModal.task.id, reassignModal.selectedWorker)}
                disabled={!reassignModal.selectedWorker}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reassign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
