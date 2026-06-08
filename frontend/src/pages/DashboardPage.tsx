// Dashboard Page
import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BellIcon,
  ArrowDownTrayIcon ,
  PlusIcon,
  MagnifyingGlassIcon ,
  ArrowTrendingUpIcon ,
  LightBulbIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';


interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  activeUsers: number;
  totalClients: number;
  stageStats: any[];
  timelineData: any[];
}


interface RecentActivity {
  id: string;
  type: 'project' | 'completion' | 'overdue' | 'user';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}


interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}


interface SmartInsight {
  id: string;
  type: 'warning' | 'success' | 'suggestion' | 'info';
  title: string;
  message: string;
  icon: React.ReactNode;
}


// Default mock data for testing
const DEFAULT_STATS: DashboardStats = {
  totalProjects: 47,
  activeProjects: 23,
  completedProjects: 18,
  overdueProjects: 6,
  activeUsers: 12,
  totalClients: 8,
  stageStats: [
    { stage: 'Login', count: 5 },
    { stage: 'Started', count: 8 },
    { stage: 'Copy Editing', count: 12 },
    { stage: 'XML', count: 9 },
    { stage: 'Proof Reading', count: 7 },
    { stage: 'Final Pages', count: 4 },
    { stage: 'Printer', count: 2 },
  ],
  timelineData: [
    { date: 'Mon', completed: 3, active: 5 },
    { date: 'Tue', completed: 5, active: 7 },
    { date: 'Wed', completed: 4, active: 6 },
    { date: 'Thu', completed: 6, active: 8 },
    { date: 'Fri', completed: 8, active: 5 },
    { date: 'Sat', completed: 4, active: 3 },
    { date: 'Sun', completed: 2, active: 2 },
  ],
};


const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];


const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Project Overdue', message: 'Medical Science batch B001 is overdue', time: '5 min ago', type: 'warning' },
    { id: '2', title: 'Project Completed', message: 'Physics Guide completed successfully', time: '1 hour ago', type: 'success' },
    { id: '3', title: 'New Project', message: 'Biology Atlas assigned to team', time: '2 hours ago', type: 'info' },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);


  // Recent activity data
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'completion',
      title: 'Project Completed',
      description: 'Physics Guide (B004) moved to Final Pages',
      time: '10 min ago',
      icon: <CheckCircleIcon className="w-4 h-4" />,
      color: 'bg-green-500',
    },
    {
      id: '2',
      type: 'overdue',
      title: 'Project Overdue',
      description: 'Medical Science (B001) past deadline',
      time: '25 min ago',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
      color: 'bg-red-500',
    },
    {
      id: '3',
      type: 'project',
      title: 'New Project Started',
      description: 'Neuroscience Rev (B007) login completed',
      time: '1 hour ago',
      icon: <FolderIcon className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      id: '4',
      type: 'user',
      title: 'Team Member Active',
      description: 'Selva Bharath logged in',
      time: '2 hours ago',
      icon: <UserGroupIcon className="w-4 h-4" />,
      color: 'bg-amber-500',
    },
  ];


  // Smart insights
  const smartInsights: SmartInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: '6 Projects Overdue',
      message: 'Take immediate action on overdue projects to avoid delays',
      icon: <ExclamationTriangleIcon className="w-4 h-4" />,
    },
    {
      id: '2',
      type: 'success',
      title: '85% Completion Rate',
      message: 'Great progress! You\'re above target this week',
      icon: <ArrowTrendingUpIcon  className="w-4 h-4" />,
    },
    {
      id: '3',
      type: 'suggestion',
      title: ' optimize Workflow',
      message: 'Copy Editing stage has highest queue. Consider adding resources',
      icon: <LightBulbIcon className="w-4 h-4" />,
    },
  ];


  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'New Project',
      icon: <PlusIcon className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => console.log('Create new project'),
    },
    {
      id: '2',
      label: 'View Calendar',
      icon: <CalendarIcon className="w-4 h-4" />,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => console.log('Open calendar'),
    },
    {
      id: '3',
      label: 'Export Report',
      icon: <ArrowDownTrayIcon  className="w-4 h-4" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => console.log('Export dashboard'),
    },
    {
      id: '4',
      label: 'Add Team Member',
      icon: <UserGroupIcon className="w-4 h-4" />,
      color: 'bg-amber-600 hover:bg-amber-700',
      onClick: () => console.log('Add team member'),
    },
  ];


  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing) {
        fetchDashboardData(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);


  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const fetchDashboardData = async (isAutoRefresh = false) => {
    if (isAutoRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const [statsRes, workflowRes] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getWorkflowStats(),
      ]);
      setStats({
        ...DEFAULT_STATS,
        ...statsRes.data,
        ...workflowRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const handleExport = () => {
    // Export dashboard data as CSV
    const csvData = `Metric,Value
Total Projects,${stats?.totalProjects || 0}
Active Projects,${stats?.activeProjects || 0}
Completed Projects,${stats?.completedProjects || 0}
Overdue Projects,${stats?.overdueProjects || 0}
Active Users,${stats?.activeUsers || 0}
Total Clients,${stats?.totalClients || 0}`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };


  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderIcon,
      color: 'bg-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: ChartBarIcon,
      color: 'bg-green-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Completed Projects',
      value: stats?.completedProjects || 0,
      icon: CheckCircleIcon,
      color: 'bg-purple-600',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Overdue Projects',
      value: stats?.overdueProjects || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-600',
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserGroupIcon,
      color: 'bg-amber-600',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: UserGroupIcon,
      color: 'bg-indigo-600',
      trend: '+2',
      trendUp: true,
    },
  ];


  const ActivityBadge = ({ type }: { type: string }) => {
    const colors: Record<string, string> = {
      project: 'bg-blue-100 text-blue-700',
      completion: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      user: 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
        {type}
      </span>
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.full_name || 'User'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <BellIcon className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notif.type === 'warning' ? 'bg-red-100' :
                            notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <BellIcon className={`w-4 h-4 ${
                              notif.type === 'warning' ? 'text-red-600' :
                              notif.type === 'success' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                            <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon  className="w-5 h-5" />
            <span className="font-semibold">Export</span>
          </button>
        </div>
      </div>


      {/* Smart Insights */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="w-5 h-5 text-white" />
          <h2 className="text-lg font-bold text-white">Smart Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {smartInsights.map((insight) => (
            <motion.div
              key={insight.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-lg p-4 ${
                insight.type === 'warning' ? 'bg-red-50 border border-red-200' :
                insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'warning' ? 'bg-red-500' :
                  insight.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {React.cloneElement(insight.icon as React.ReactElement, { className: 'text-white w-4 h-4' })}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`${action.color} text-white rounded-xl p-4 shadow-md transition-colors`}
          >
            <div className="flex flex-col items-center gap-2">
              {action.icon}
              <span className="text-sm font-semibold">{action.label}</span>
            </div>
          </motion.button>
        ))}
      </div>


      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.color} p-3 rounded-lg shadow-sm`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              {card.trend && (
                <span className={`text-xs font-semibold ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Stage Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Workflow Stage Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.stageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                itemStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Projects" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Timeline Analytics */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                itemStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Area type="monotone" dataKey="completed" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Completed" />
              <Area type="monotone" dataKey="active" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Active" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Bottom Row: Recent Activity + Team Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`${activity.color} p-2 rounded-lg text-white`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-gray-600 text-xs mt-1">{activity.description}</p>
                  <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* Team Productivity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Team Productivity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Team</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Members</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Completed</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">In Progress</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">Pre-Editing</td>
                  <td className="py-3 px-4 text-gray-700">3</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">45</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">12</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-gray-900 font-semibold">85%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">Copywriting</td>
                  <td className="py-3 px-4 text-gray-700">4</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">38</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">15</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-gray-900 font-semibold">78%</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">QA</td>
                  <td className="py-3 px-4 text-gray-700">2</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">52</td>
                  <td className="py-3 px-4 text-blue-600 font-semibold">8</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-gray-900 font-semibold">92%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;