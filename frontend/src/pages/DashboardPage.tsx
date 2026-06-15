import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  FolderIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BellIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from 'recharts';

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

const CARD_COLOR = '#4C5C68';
const BTN_COLOR = '#1985A1';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: '1', title: 'Project Overdue', message: 'Medical Science batch B001 is overdue', time: '5 min ago' },
    { id: '2', title: 'Project Completed', message: 'Physics Guide completed successfully', time: '1 hour ago' },
    { id: '3', title: 'New Project', message: 'Biology Atlas assigned to team', time: '2 hours ago' },
  ];

  const smartInsights = [
    { id: '1', title: '6 Projects Overdue', message: 'Take immediate action on overdue projects to avoid delays', icon: <ExclamationTriangleIcon className="w-4 h-4" /> },
    { id: '2', title: '85% Completion Rate', message: "Great progress. You're above target this week", icon: <ArrowTrendingUpIcon className="w-4 h-4" /> },
    { id: '3', title: 'Optimize Workflow', message: 'Copy Editing stage has highest queue. Consider adding resources', icon: <LightBulbIcon className="w-4 h-4" /> },
  ];

  const recentActivities = [
    { id: '1', title: 'Project Completed', description: 'Physics Guide (B004) moved to Final Pages', time: '10 min ago', icon: <CheckCircleIcon className="w-4 h-4" /> },
    { id: '2', title: 'Project Overdue', description: 'Medical Science (B001) past deadline', time: '25 min ago', icon: <ExclamationTriangleIcon className="w-4 h-4" /> },
    { id: '3', title: 'New Project Started', description: 'Neuroscience Rev (B007) login completed', time: '1 hour ago', icon: <FolderIcon className="w-4 h-4" /> },
    { id: '4', title: 'Team Member Active', description: 'Selva Bharath logged in', time: '2 hours ago', icon: <UserGroupIcon className="w-4 h-4" /> },
  ];

  const workflowStages = [
    { label: 'Login', count: 5 },
    { label: 'Started', count: 8 },
    { label: 'Copy Editing', count: 12 },
    { label: 'XML', count: 9 },
    { label: 'Proof Reading', count: 7 },
    { label: 'Final Pages', count: 4 },
    { label: 'Printer', count: 2 },
  ];
  const maxCount = Math.max(...workflowStages.map(s => s.count));

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => { if (!refreshing) fetchDashboardData(true); }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node))
        setShowNotifications(false);
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
      setStats({ ...DEFAULT_STATS, ...statsRes.data, ...workflowRes.data });
    } catch {
      setStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = () => {
    const csv = `Metric,Value\nTotal Projects,${stats?.totalProjects}\nActive,${stats?.activeProjects}\nCompleted,${stats?.completedProjects}\nOverdue,${stats?.overdueProjects}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statCards = [
    { title: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderIcon, trend: '+12%', up: true },
    { title: 'Active Projects', value: stats?.activeProjects ?? 0, icon: ChartBarIcon, trend: '+8%', up: true },
    { title: 'Completed', value: stats?.completedProjects ?? 0, icon: CheckCircleIcon, trend: '+15%', up: true },
    { title: 'Overdue', value: stats?.overdueProjects ?? 0, icon: ExclamationTriangleIcon, trend: '-3%', up: false },
    { title: 'Active Users', value: stats?.activeUsers ?? 0, icon: UserGroupIcon, trend: '+5%', up: true },
    { title: 'Total Clients', value: stats?.totalClients ?? 0, icon: UserGroupIcon, trend: '+2', up: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: BTN_COLOR }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.full_name || 'User'}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-30 bg-white w-56"
              style={{ focusBorderColor: BTN_COLOR } as any}
            />
          </div>

          <button
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <BellIcon className="w-4 h-4 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[10px] rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: BTN_COLOR }}>
                {notifications.length}
              </span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: BTN_COLOR }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* ── SMART INSIGHTS ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="w-4 h-4" style={{ color: BTN_COLOR }} />
          <h2 className="text-sm font-semibold text-gray-900">Smart Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {smartInsights.map((insight) => (
            <div key={insight.id} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: CARD_COLOR }}>
                {insight.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Project', icon: <PlusIcon className="w-5 h-5" /> },
          { label: 'View Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
          { label: 'Export Report', icon: <ArrowDownTrayIcon className="w-5 h-5" /> },
          { label: 'Add Team Member', icon: <UserGroupIcon className="w-5 h-5" /> },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 py-3.5 text-sm font-medium text-white rounded-xl transition-colors shadow-sm"
            style={{ backgroundColor: BTN_COLOR }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg text-white" style={{ backgroundColor: CARD_COLOR }}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${card.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Workflow Stage Statistics</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats?.stageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="stage" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill={BTN_COLOR} name="Projects" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Timeline Analytics</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="completed" stroke={BTN_COLOR} fill={BTN_COLOR} fillOpacity={0.08} name="Completed" />
              <Area type="monotone" dataKey="active" stroke={CARD_COLOR} fill={CARD_COLOR} fillOpacity={0.08} name="Active" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── WORKFLOW PIPELINE + ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Workflow Pipeline Visual */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Workflow Pipeline</h2>
          <div className="flex items-end gap-2 h-40 mb-3">
            {workflowStages.map((stage, i) => {
              const heightPct = Math.round((stage.count / maxCount) * 100);
              return (
                <div key={stage.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-700">{stage.count}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
                    className="w-full rounded-t-md"
                    style={{ backgroundColor: i === 2 ? BTN_COLOR : CARD_COLOR, opacity: i === 2 ? 1 : 0.7 + i * 0.04 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            {workflowStages.map((stage) => (
              <div key={stage.label} className="flex-1 text-center">
                <span className="text-[10px] text-gray-400 leading-tight block">{stage.label}</span>
              </div>
            ))}
          </div>

          {/* Stage flow arrows */}
          <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-1">
            {workflowStages.map((stage, i) => (
              <React.Fragment key={stage.label}>
                <div
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-white text-[11px] font-medium whitespace-nowrap"
                  style={{ backgroundColor: i === 2 ? BTN_COLOR : CARD_COLOR }}
                >
                  {stage.label}
                </div>
                {i < workflowStages.length - 1 && (
                  <svg className="flex-shrink-0 w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {recentActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: CARD_COLOR }}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{activity.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM PRODUCTIVITY ── */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Team Productivity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Team', 'Members', 'Completed', 'In Progress', 'Efficiency'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { team: 'Pre-Editing', members: 3, completed: 45, inProgress: 12, efficiency: 85 },
                { team: 'Copywriting', members: 4, completed: 38, inProgress: 15, efficiency: 78 },
                { team: 'QA', members: 2, completed: 52, inProgress: 8, efficiency: 92 },
              ].map((row) => (
                <tr key={row.team} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.team}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{row.members}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold" style={{ color: BTN_COLOR }}>{row.completed}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold" style={{ color: CARD_COLOR }}>{row.inProgress}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-28 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${row.efficiency}%`, backgroundColor: BTN_COLOR }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{row.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;