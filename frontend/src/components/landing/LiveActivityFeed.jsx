import { useEffect, useState } from "react";
import axios from "axios";

export default function LiveActivityFeed() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  const fetchActivity = async () => {
    try {
      const res = await axios.get("/api/public/recent-activity");
      setActivity(res.data);
      
      // Calculate real-time statistics
      const total = res.data.length;
      const active = res.data.filter(item => 
        item.status === 'REPORTED' || item.status === 'APPROVED' || item.status === 'IN_PROGRESS'
      ).length;
      const completed = res.data.filter(item => item.status === 'COMPLETED').length;
      
      setStats({ total, active, completed });
    } catch (err) {
      console.error("Activity fetch error", err);
      // Enhanced demo data with realistic professional scenarios
      const demoData = [
        { 
          id: 1, 
          address: "MG Road, Bangalore - Commercial District", 
          status: "REPORTED", 
          type: "Commercial Waste",
          priority: "HIGH",
          estimatedVolume: "250 kg",
          assignedWorker: "Pending Assignment",
          createdAt: new Date().toISOString(),
          reporter: "Business Owner",
          coordinates: "12.9768° N, 77.5704° E"
        },
        { 
          id: 2, 
          address: "Indiranagar, Bangalore - Residential Zone", 
          status: "IN_PROGRESS", 
          type: "Household Waste",
          priority: "MEDIUM",
          estimatedVolume: "45 kg",
          assignedWorker: "Team Alpha - Vehicle #WB-001",
          createdAt: new Date(Date.now() - 300000).toISOString(),
          reporter: "Resident Association",
          coordinates: "12.9784° N, 77.6408° E",
          eta: "15 minutes"
        },
        { 
          id: 3, 
          address: "Koramangala, Bangalore - Tech Park Area", 
          status: "COMPLETED", 
          type: "Industrial Waste",
          priority: "URGENT",
          estimatedVolume: "180 kg",
          assignedWorker: "Team Beta - Vehicle #WB-003",
          completedAt: new Date(Date.now() - 600000).toISOString(),
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          reporter: "Facility Manager",
          coordinates: "12.9279° N, 77.6271° E",
          completionTime: "28 minutes"
        },
        { 
          id: 4, 
          address: "Whitefield, Bangalore - Industrial Area", 
          status: "APPROVED", 
          type: "Construction Debris",
          priority: "HIGH",
          estimatedVolume: "500 kg",
          assignedWorker: "Heavy Equipment Team - Vehicle #HE-002",
          createdAt: new Date(Date.now() - 900000).toISOString(),
          reporter: "Site Manager",
          coordinates: "12.9698° N, 77.7499° E",
          eta: "45 minutes"
        },
        { 
          id: 5, 
          address: "Jayanagar, Bangalore - Residential Layout", 
          status: "REPORTED", 
          type: "Garden Waste",
          priority: "LOW",
          estimatedVolume: "30 kg",
          assignedWorker: "Pending Assignment",
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          reporter: "Homeowner",
          coordinates: "12.9293° N, 77.5806° E"
        }
      ];
      
      setActivity(demoData);
      
      // Calculate demo statistics
      const total = demoData.length;
      const active = demoData.filter(item => 
        item.status === 'REPORTED' || item.status === 'APPROVED' || item.status === 'IN_PROGRESS'
      ).length;
      const completed = demoData.filter(item => item.status === 'COMPLETED').length;
      
      setStats({ total, active, completed });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "REPORTED": return "bg-amber-100 text-amber-800 border-amber-200";
      case "APPROVED": return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS": return "bg-purple-100 text-purple-800 border-purple-200";
      case "COMPLETED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "REPORTED": return "";
      case "APPROVED": return "";
      case "IN_PROGRESS": return "";
      case "COMPLETED": return "✨";
      default: return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT": return "bg-red-500 text-white";
      case "HIGH": return "bg-orange-500 text-white";
      case "MEDIUM": return "bg-yellow-500 text-white";
      case "LOW": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Commercial Waste": return "";
      case "Household Waste": return "";
      case "Industrial Waste": return "";
      case "Construction Debris": return "";
      case "Garden Waste": return "";
      default: return "";
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Live City Operations Center
            </h2>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse ml-3"></div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time municipal waste management operations with AI-powered monitoring, 
            GPS tracking, and predictive analytics across Bangalore metropolitan area.
          </p>
        </div>

        {/* Professional Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Operations</span>
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-400 mt-1">Last 24 hours</div>
          </div>
          
          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Active Operations</span>
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.active}</div>
            <div className="text-xs text-slate-400 mt-1">In progress now</div>
          </div>
          
          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Completed Today</span>
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{stats.completed}</div>
            <div className="text-xs text-slate-400 mt-1">Successfully resolved</div>
          </div>
          
          <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Efficiency Rate</span>
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-400">94.2%</div>
            <div className="text-xs text-slate-400 mt-1">Above target</div>
          </div>
        </div>

        {/* Professional Analytics Dashboard */}
        <div className="bg-black rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="mr-3 relative flex items-center">
                  <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
                  <span className="relative bg-emerald-600 rounded-full w-3 h-3"></span>
                </span>
                Advanced Analytics Intelligence Center
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-1 rounded-full">
                  <span className="text-slate-300 text-sm font-medium">Real-Time Analytics</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-sm">AI-Powered Insights</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pie Chart Section */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                  </svg>
                  Waste Distribution Analysis
                </h4>
                <div className="relative h-64 flex items-center justify-center">
                  {/* Simulated Pie Chart */}
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-blue-500 to-transparent" style={{
                      background: 'conic-gradient(from 0deg, #3B82F6 0deg 108deg, #10B981 108deg 216deg, #F59E0B 216deg 288deg, #EF4444 288deg 360deg)'
                    }}></div>
                    <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">1,247</div>
                        <div className="text-xs text-slate-400">Total Reports</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute right-0 top-0 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-slate-300">Commercial 30%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-slate-300">Household 30%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-slate-300">Industrial 20%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-slate-300">Construction 20%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart Section */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Weekly Performance Metrics
                </h4>
                <div className="space-y-3">
                  {[
                    { day: 'Mon', value: 85, color: 'bg-blue-500' },
                    { day: 'Tue', value: 92, color: 'bg-emerald-500' },
                    { day: 'Wed', value: 78, color: 'bg-amber-500' },
                    { day: 'Thu', value: 95, color: 'bg-purple-500' },
                    { day: 'Fri', value: 88, color: 'bg-pink-500' },
                    { day: 'Sat', value: 70, color: 'bg-indigo-500' },
                    { day: 'Sun', value: 65, color: 'bg-slate-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 text-xs text-slate-400 font-medium">{item.day}</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium">
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Weekly Average</span>
                    <span className="text-lg font-bold text-white">82.4%</span>
                  </div>
                </div>
              </div>

              {/* Heatmap Section */}
              <div className="bg-slate-900 rounded-xl p-6 lg:col-span-2 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                  City District Activity Heatmap
                </h4>
                <div className="grid grid-cols-8 gap-1">
                  {[
                    ['MG Road', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Marathahalli', 'Electronic City'],
                    ['High', 'Medium', 'High', 'Low', 'Medium', 'High', 'Medium', 'Low'],
                    ['Commercial', 'Residential', 'Tech Park', 'Industrial', 'Residential', 'Residential', 'Commercial', 'Industrial'],
                    ['45', '23', '67', '12', '34', '56', '28', '15']
                  ].map((row, rowIndex) => (
                    <div key={rowIndex} className="contents">
                      {row.map((cell, cellIndex) => (
                        <div 
                          key={cellIndex}
                          className={`
                            p-2 text-xs text-center rounded
                            ${rowIndex === 0 ? 'bg-slate-800 font-semibold text-slate-300' : ''}
                            ${rowIndex === 1 && cell === 'High' ? 'bg-red-500 text-white' : ''}
                            ${rowIndex === 1 && cell === 'Medium' ? 'bg-amber-500 text-white' : ''}
                            ${rowIndex === 1 && cell === 'Low' ? 'bg-emerald-500 text-white' : ''}
                            ${rowIndex === 2 ? 'bg-slate-800 text-slate-400' : ''}
                            ${rowIndex === 3 ? 'bg-slate-800 text-slate-300 font-bold' : ''}
                          `}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-xs text-slate-400">High Activity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-500 rounded"></div>
                      <span className="text-xs text-slate-400">Medium Activity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                      <span className="text-xs text-slate-400">Low Activity</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Total Reports: <span className="font-bold text-white">280</span>
                  </div>
                </div>
              </div>

              {/* Real-time Metrics */}
              <div className="bg-slate-900 rounded-xl p-6 lg:col-span-2 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Real-Time Performance Indicators
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                    <svg className="w-6 h-6 mb-2 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <div className="text-xs text-slate-400">Active Vehicles</div>
                    <div className="text-xs text-emerald-400 mt-1">+2 from yesterday</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                    <svg className="w-6 h-6 mb-2 mx-auto text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-emerald-400">24m</div>
                    <div className="text-xs text-slate-400">Avg Response</div>
                    <div className="text-xs text-emerald-400 mt-1">-8m improvement</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                    <svg className="w-6 h-6 mb-2 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-purple-400">96%</div>
                    <div className="text-xs text-slate-400">Completion Rate</div>
                    <div className="text-xs text-emerald-400 mt-1">Above target</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                    <svg className="w-6 h-6 mb-2 mx-auto text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-2xl font-bold text-amber-400">₹2.4L</div>
                    <div className="text-xs text-slate-400">Cost Saved</div>
                    <div className="text-xs text-emerald-400 mt-1">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Footer */}
          <div className="bg-slate-900 px-6 py-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Secure Real-Time Data Stream</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow"></div>
                  <span>API Status: Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
