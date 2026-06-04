import React, { useState, useMemo, useEffect} from 'react';
import { toast } from 'react-hot-toast';
import {
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FireIcon,
  XCircleIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  UserGroupIcon,
  SparklesIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuthStore } from "./store/authStore";


// TypeScript Interfaces
interface Task {
  id: number;
  taskId: string;
  projectName: string;
  assignedDate: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  description: string;
}

interface LeaveRequest {
  id: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  emergencyContact: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  managerApproval?: string;
  hrApproval?: string;
  submittedAt: string;
}

interface Attendance {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  status: 'Present' | 'Absent' | 'Leave';
}

interface Performance {
  efficiencyScore: number;
  qualityScore: number;
  tasksCompleted: number;
  productivity: number;
  monthlyTrend: { month: string; score: number }[];
}

interface Notification {
  id: number;
  type: 'announcement' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Employee {
  name: string;
  employeeId: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  manager: string;
  joiningDate: string;
  avatar: string;
}

// Mock Data
const employeeData: Employee = {
  name: "John Smith",
  employeeId: "EMP-2024-001",
  role: "Senior Pre-Editor",
  department: "Pre-Editing",
  email: "john.smith@company.com",
  phone: "+1 (555) 123-4567",
  manager: "Sarah Johnson",
  joiningDate: "2022-03-15",
  avatar: "JS"
};

const tasksData: Task[] = [
  { id: 1, taskId: "TSK-001", projectName: "Website Redesign", assignedDate: "2026-05-20", dueDate: "2026-06-05", priority: "High", status: "In Progress", description: "Content preprocessing and formatting" },
  { id: 2, taskId: "TSK-002", projectName: "Mobile App Launch", assignedDate: "2026-05-22", dueDate: "2026-06-10", priority: "Medium", status: "Pending", description: "Text extraction and cleanup" },
  { id: 3, taskId: "TSK-003", projectName: "Content Strategy", assignedDate: "2026-05-15", dueDate: "2026-05-30", priority: "High", status: "Completed", description: "Document formatting and styling" },
  { id: 4, taskId: "TSK-004", projectName: "SEO Optimization", assignedDate: "2026-05-25", dueDate: "2026-06-15", priority: "Low", status: "Pending", description: "Metadata preparation" },
  { id: 5, taskId: "TSK-005", projectName: "Brand Guidelines", assignedDate: "2026-05-18", dueDate: "2026-06-08", priority: "Medium", status: "On Hold", description: "Style guide preprocessing" },
  { id: 6, taskId: "TSK-006", projectName: "E-commerce Platform", assignedDate: "2026-05-28", dueDate: "2026-06-20", priority: "High", status: "In Progress", description: "Product description editing" },
];

const leaveRequestsData: LeaveRequest[] = [
  { id: 1, leaveType: "Sick Leave", fromDate: "2026-06-04", toDate: "2026-06-06", days: 3, reason: "Medical rest required", emergencyContact: "+1 (555) 987-6543", status: "Pending", submittedAt: "2026-05-28" },
  { id: 2, leaveType: "Casual Leave", fromDate: "2026-06-10", toDate: "2026-06-11", days: 2, reason: "Personal work", emergencyContact: "+1 (555) 987-6543", status: "Approved", managerApproval: "2026-06-01", hrApproval: "2026-06-01", submittedAt: "2026-05-25" },
  { id: 3, leaveType: "Earned Leave", fromDate: "2026-06-15", toDate: "2026-06-20", days: 6, reason: "Family vacation", emergencyContact: "+1 (555) 987-6543", status: "Approved", managerApproval: "2026-05-20", hrApproval: "2026-05-21", submittedAt: "2026-05-15" },
  { id: 4, leaveType: "Sick Leave", fromDate: "2026-05-01", toDate: "2026-05-02", days: 2, reason: "Flu symptoms", emergencyContact: "+1 (555) 987-6543", status: "Rejected", managerApproval: "2026-04-28", submittedAt: "2026-04-28" },
];


const performanceData: Performance = {
  efficiencyScore: 87,
  qualityScore: 92,
  tasksCompleted: 28,
  productivity: 94,
  monthlyTrend: [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 85 },
    { month: "Apr", score: 88 },
    { month: "May", score: 91 },
    { month: "Jun", score: 87 },
  ]
};

const notificationsData: Notification[] = [
  { id: 1, type: "announcement", title: "New Project Assigned", message: "You've been assigned to Website Redesign project", time: "2 hours ago", read: false },
  { id: 2, type: "reminder", title: "Task Deadline Tomorrow", message: "TSK-001 is due tomorrow", time: "4 hours ago", read: false },
  { id: 3, type: "info", title: "Team Meeting", message: "Weekly team meeting at 3 PM today", time: "6 hours ago", read: true },
  { id: 4, type: "alert", title: "Leave Request Approved", message: "Your casual leave has been approved", time: "1 day ago", read: true },
];

const activityData = [
  { id: 1, action: "Completed task", details: "TSK-003 - Content Strategy", time: "2 hours ago", icon: CheckCircleIcon },
  { id: 2, action: "Started task", details: "TSK-001 - Website Redesign", time: "5 hours ago", icon: ClockIcon },
  { id: 3, action: "Submitted leave request", details: "Sick Leave (3 days)", time: "1 day ago", icon: CalendarDaysIcon },
  { id: 4, action: "Updated profile", details: "Changed phone number", time: "2 days ago", icon: UserCircleIcon },
];

const upcomingDeadlines = [
  { id: 1, taskId: "TSK-001", projectName: "Website Redesign", dueDate: "2026-06-05", priority: "High" },
  { id: 2, taskId: "TSK-002", projectName: "Mobile App Launch", dueDate: "2026-06-10", priority: "Medium" },
  { id: 3, taskId: "TSK-005", projectName: "Brand Guidelines", dueDate: "2026-06-08", priority: "Medium" },
];

const teamRanking = [
  { rank: 1, name: "David Miller", department: "QA", score: 96, avatar: "DM" },
  { rank: 2, name: "Emma Wilson", department: "Copywriting", score: 93, avatar: "EW" },
  { rank: 3, name: "John Smith", department: "Pre-Editing", score: 87, avatar: "JS" },
  { rank: 4, name: "Lisa Anderson", department: "QA", score: 85, avatar: "LA" },
];

// Main Component
const EmployeeDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    emergencyContact: '',
  });

  
const [attendanceData, setAttendanceData] =
  useState<Attendance[]>([]);

  useEffect(() => {

  const userId =
    localStorage.getItem("user_id");

  if (!userId) return;

  fetch(
    `http://localhost:5000/api/attendance/history/${userId}`
  )
    .then(res => res.json())
    .then(data => {

      console.log("Attendance Data:", data);

      setAttendanceData(data);

    })
    .catch(err => {
      console.error(err);
    });

}, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'tasks', label: 'My Tasks', icon: CheckCircleIcon },
    { id: 'leave', label: 'Leave Requests', icon: CalendarDaysIcon },
    { id: 'attendance', label: 'Attendance', icon: ClockIcon },
    { id: 'performance', label: 'Performance', icon: ChartBarIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  ];

const [isCheckedIn, setIsCheckedIn] = useState(false);
const [checkInTime, setCheckInTime] = useState<Date | null>(null);
const [timer, setTimer] = useState("00:00:00");

// Break states
const [isLunchActive, setIsLunchActive] = useState(false);
const [isTeaActive, setIsTeaActive] = useState(false);
const [lunchTime, setLunchTime] = useState(0);
const [teaTime, setTeaTime] = useState(0);
 const [isLunchTaken, setIsLunchTaken] = useState(false);
  const [isTeaTaken, setIsTeaTaken] = useState(false);

    const BREAK_DURATION = 30 * 60 * 1000; // 30 minutes in ms


  // Working timer - automatically subtracts break time
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (isCheckedIn && checkInTime) {
  //     interval = setInterval(() => {
  //       const now = Date.now();
  //       const totalTime = now - checkInTime.getTime();
        
  //       // Subtract break time instantly
  //       let breakTime = 0;
  //       if (isLunchTaken) breakTime += BREAK_DURATION;
  //       if (isTeaTaken) breakTime += BREAK_DURATION;
        
  //       const workingTime = totalTime - breakTime;
  //       setTimer(formatTime(workingTime));
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [isCheckedIn, checkInTime, isLunchTaken, isTeaTaken]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCheckIn = async () => {
  try {

    const userId =
      localStorage.getItem("user_id");

    const response = await fetch(
      "http://localhost:5000/api/attendance/checkin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {

      const now = new Date();

      setIsCheckedIn(true);

      setCheckInTime(now);

      localStorage.setItem(
  `checkInTime_${userId}`,
  now.toISOString()
);

    }

  } catch (error) {

    console.error(error);

  }
};

const handleCheckOut = async () => {
  try {

    const userId =
      localStorage.getItem("user_id");

    const response = await fetch(
      "http://localhost:5000/api/attendance/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      const userId =
  localStorage.getItem("user_id");

const attendanceResponse =
  await fetch(
    `http://localhost:5000/api/attendance/history/${userId}`
  );

const attendanceHistory =
  await attendanceResponse.json();

setAttendanceData(
  attendanceHistory
);

      setIsCheckedIn(false);

      setCheckInTime(null);

      setTimer("00:00:00");

      localStorage.removeItem(
  `checkInTime_${userId}`
);
    }

  } catch (error) {

    console.error(error);

  }
};

  const handleLunchBreak = async () => {

  const userId =
    localStorage.getItem("user_id");

  await fetch(
    "http://localhost:5000/api/attendance/lunch-break",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: Number(userId)
      })
    }
  );

  setIsLunchTaken(true);
};

const handleTeaBreak = async () => {

  const userId =
    localStorage.getItem("user_id");

  await fetch(
    "http://localhost:5000/api/attendance/tea-break",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: Number(userId)
      })
    }
  );

  setIsTeaTaken(true);
};

  const filteredTasks = useMemo(() => {
    return tasksData.filter(task => {
      const matchesSearch = task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.taskId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'All' || task.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
      'Completed': 'bg-green-50 text-green-700 border-green-200',
      'On Hold': 'bg-gray-50 text-gray-700 border-gray-200',
      'Approved': 'bg-green-50 text-green-700 border-green-200',
      'Rejected': 'bg-red-50 text-red-700 border-red-200',
      'Present': 'bg-green-50 text-green-700 border-green-200',
      'Absent': 'bg-red-50 text-red-700 border-red-200',
      'Leave': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'High': 'text-red-600 bg-red-50',
      'Medium': 'text-yellow-600 bg-yellow-50',
      'Low': 'text-green-600 bg-green-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLeaveForm(false);
    setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '', emergencyContact: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

    const { user } = useAuthStore();
useEffect(() => {

  const userId =
    localStorage.getItem("user_id");

  if (!userId) return;

  const savedCheckIn =
    localStorage.getItem(
      `checkInTime_${userId}`
    );

  if (savedCheckIn) {

    setIsCheckedIn(true);

    setCheckInTime(
      new Date(savedCheckIn)
    );
  }

}, []);
useEffect(() => {
  let interval: NodeJS.Timeout;

  if (isCheckedIn && checkInTime) {

    interval = setInterval(() => {

      const now = new Date();

      const diff = Math.floor(
        (now.getTime() - checkInTime.getTime()) / 1000
      );

      const hrs = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;

      setTimer(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`
      );

    }, 1000);
  }

  return () => clearInterval(interval);

}, [isCheckedIn, checkInTime]);


useEffect(() => {

  const userId =
    localStorage.getItem("user_id");

  if (!userId) return;

  fetch(
    `http://localhost:5000/api/attendance/status/${userId}`
  )
    .then(res => res.json())
    .then(data => {

      if (data.checked_in) {

        setIsCheckedIn(true);

        setCheckInTime(
          new Date(data.check_in)
        );
      }
    });

}, []);



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-xs text-gray-500">Workflow Management System</p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Card */}
              <motion.div variants={itemVariants}>
  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold">
          Hi, {user?.full_name || 'Employee'}!
        </h2>
        <p className="text-blue-100 text-xs mt-1">
          {user?.role} • {user?.team}
        </p>
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
        <span className="text-lg font-bold">{employeeData.avatar}</span>
      </div>
    </div>

    {/* Timer Card */}
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-200 mb-1">WORKING HOURS</p>
          <p className="text-3xl font-bold font-mono">{timer}</p>
          {checkInTime && (
            <p className="text-xs text-blue-200 mt-1">
              Since {checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        
        <button
          onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isCheckedIn 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </button>
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center gap-2 text-xs text-blue-200">
        <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        <span>{isCheckedIn ? 'Checked In' : 'Not Checked In'}</span>
      </div>

      {/* Breaks - Only when checked in */}
      {isCheckedIn && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex gap-2">
            
            {/* Lunch */}
            <button
              onClick={handleLunchBreak}
              disabled={isLunchTaken}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                isLunchTaken
                  ? 'bg-green-500/30 text-green-300 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-blue-200'
              }`}
            >
              {isLunchTaken ? '✓ Lunch' : '+ Lunch (-30m)'}
            </button>

            {/* Tea */}
            <button
              onClick={handleTeaBreak}
              disabled={isTeaTaken}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                isTeaTaken
                  ? 'bg-green-500/30 text-green-300 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-blue-200'
              }`}
            >
              {isTeaTaken ? '✓ Tea' : '+ Tea (-30m)'}
            </button>
            
          </div>

          {/* Total Break */}
          {(isLunchTaken || isTeaTaken) && (
            <div className="mt-2 text-xs text-blue-200 flex justify-between">
              <span>Break:</span>
              <span className="font-mono font-bold">
                {(isLunchTaken ? 30 : 0) + (isTeaTaken ? 30 : 0)} min
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</motion.div>

              {/* Statistics Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={CheckCircleIcon}
                  title="Assigned Tasks"
                  value={tasksData.length}
                  subtitle="This month"
                  trend="+12%"
                  color="blue"
                />
                <StatCard
                  icon={CheckBadgeIcon}
                  title="Completed Tasks"
                  value={tasksData.filter(t => t.status === 'Completed').length}
                  subtitle="This month"
                  trend="+8%"
                  color="green"
                />
                <StatCard
                  icon={ClockIcon}
                  title="Pending Tasks"
                  value={tasksData.filter(t => t.status === 'Pending' || t.status === 'In Progress').length}
                  subtitle="Needs attention"
                  trend="urgent"
                  color="yellow"
                />
                <StatCard
                  icon={CalendarDaysIcon}
                  title="Leave Balance"
                  value="12"
                  subtitle="Days remaining"
                  trend="normal"
                  color="purple"
                />
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {activityData.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.details}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Upcoming Deadlines */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-3">
                      {upcomingDeadlines.map((deadline) => (
                        <div key={deadline.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{deadline.taskId}</p>
                            <p className="text-xs text-gray-500">{deadline.projectName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900">{deadline.dueDate}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(deadline.priority)}`}>
                              {deadline.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Manager Announcements & Notifications */}
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Announcements</h3>
                    <div className="space-y-3">
                      {[
                        { title: "New Project Kickoff", message: "Website Redesign project starts next week. All team members should attend the kickoff meeting.", time: "1 hour ago" },
                        { title: "Quality Standards Update", message: "Updated QA guidelines are now available. Please review before your next task.", time: "3 hours ago" },
                      ].map((announcement, index) => (
                        <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                          <p className="text-sm font-semibold text-gray-900">{announcement.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{announcement.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{announcement.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Notifications</h3>
                    <div className="space-y-3">
                      {notificationsData.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            notification.type === 'announcement' ? 'bg-blue-50 border-blue-500' :
                            notification.type === 'reminder' ? 'bg-yellow-50 border-yellow-500' :
                            notification.type === 'alert' ? 'bg-red-50 border-red-500' :
                            'bg-gray-50 border-gray-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* My Tasks Tab */}
          {activeTab === 'tasks' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                  <p className="text-sm text-gray-500">Manage and track your assigned tasks</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-500" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Task ID</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Project</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Assigned</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Due Date</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Priority</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Status</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-sm font-medium text-gray-900">{task.taskId}</td>
                          <td className="p-3 text-sm text-gray-700">
                            <p className="font-medium">{task.projectName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{task.description}</p>
                          </td>
                          <td className="p-3 text-sm text-gray-700">{task.assignedDate}</td>
                          <td className="p-3 text-sm text-gray-700">{task.dueDate}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-blue-50 rounded transition-colors" title="View">
                                <EyeIcon className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                              </button>
                              <button className="p-1 hover:bg-yellow-50 rounded transition-colors" title="Edit">
                                <PencilIcon className="w-4 h-4 text-gray-600 hover:text-yellow-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Leave Requests Tab */}
          {activeTab === 'leave' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
                  <p className="text-sm text-gray-500">Manage your leave applications</p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Apply Leave
                </button>
              </div>

              {/* Leave Balance */}
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 text-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-purple-200 text-xs mb-1">Sick Leave</p>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-purple-200 text-xs">days remaining</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-xs mb-1">Casual Leave</p>
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-purple-200 text-xs">days remaining</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-xs mb-1">Earned Leave</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-purple-200 text-xs">days remaining</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-xs mb-1">Total Balance</p>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-purple-200 text-xs">days remaining</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Leave Form Modal */}
              {showLeaveForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Apply for Leave</h3>
                        <button
                          onClick={() => setShowLeaveForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                        <select
                          required
                          value={leaveForm.leaveType}
                          onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Leave Type</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Earned Leave">Earned Leave</option>
                          <option value="Unpaid Leave">Unpaid Leave</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
                          <input
                            type="date"
                            required
                            value={leaveForm.fromDate}
                            onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
                          <input
                            type="date"
                            required
                            value={leaveForm.toDate}
                            onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                        <textarea
                          required
                          rows={3}
                          value={leaveForm.reason}
                          onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                          placeholder="Enter reason for leave..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact *</label>
                        <input
                          type="tel"
                          required
                          value={leaveForm.emergencyContact}
                          onChange={(e) => setLeaveForm({ ...leaveForm, emergencyContact: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                        <input
                          type="file"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowLeaveForm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Submit Request
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* Leave Approval Tracker */}

{leaveRequestsData.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-5">
      Leave Request Tracking
    </h3>

    {leaveRequestsData.slice(0, 1).map((leave) => (
      <div key={leave.id}>

        <div className="flex items-center justify-between">

          {/* Applied */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
              ✓
            </div>
            <p className="text-sm font-medium mt-2">
              Applied
            </p>
          </div>

          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

          {/* Reporting Manager */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white
              ${
                leave.status === "Approved"
                  ? "bg-green-500"
                  : leave.status === "Rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {leave.status === "Approved"
                ? "✓"
                : leave.status === "Rejected"
                ? "✕"
                : "⏳"}
            </div>

            <p className="text-sm font-medium mt-2">
              Reporting Manager
            </p>
          </div>

          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>

          {/* Final Status */}
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white
              ${
                leave.status === "Approved"
                  ? "bg-green-500"
                  : leave.status === "Rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {leave.status === "Approved"
                ? "✓"
                : leave.status === "Rejected"
                ? "✕"
                : "⏳"}
            </div>

            <p className="text-sm font-medium mt-2">
              Final Status
            </p>
          </div>

        </div>

        <div className="mt-5 text-center">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold
            ${
              leave.status === "Approved"
                ? "bg-green-100 text-green-700"
                : leave.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            Current Status : {leave.status}
          </span>
        </div>

      </div>
    ))}
  </div>
)}

              {/* Leave History Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Leave History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Leave Type</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Date Range</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Days</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Status</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Manager</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">HR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leaveRequestsData.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-sm font-medium text-gray-900">{request.leaveType}</td>
                          <td className="p-3 text-sm text-gray-700">
                            <p>{request.fromDate}</p>
                            <p className="text-xs text-gray-500">to {request.toDate}</p>
                          </td>
                          <td className="p-3 text-sm text-gray-700">{request.days}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {request.managerApproval || <span className="text-gray-400">Pending</span>}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {request.hrApproval || <span className="text-gray-400">Pending</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
                <p className="text-sm text-gray-500">Track your attendance and working hours</p>
              </div>

              {/* Attendance Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={CheckCircleIcon}
                  title="Present Days"
                  value={attendanceData.length}
                  subtitle="This month"
                  trend="normal"
                  color="green"
                />
                <StatCard
                  icon={XMarkIcon}
                  title="Absent Days"
                  value={attendanceData.filter(a => a.status === 'Absent').length}
                  subtitle="This month"
                  trend="negative"
                  color="red"
                />
                <StatCard
                  icon={CalendarDaysIcon}
                  title="Leave Days"
                  value={attendanceData.filter(a => a.status === 'Leave').length}
                  subtitle="This month"
                  trend="normal"
                  color="purple"
                />
                <StatCard
                  icon={ChartBarIcon}
                  title="Attendance %"
                  value="96%"
                  subtitle="This month"
                  trend="positive"
                  color="blue"
                />
              </div>

              {/* Attendance History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Date</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Check In</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Check Out</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Hours</th>
                        <th className="text-left p-3 font-semibold text-gray-700 text-xs uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendanceData.map((attendance) => (
                        <tr key={attendance.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-sm text-gray-900">{attendance.date}</td>
                          <td className="p-3 text-sm text-gray-700">{attendance.checkIn}</td>
                          <td className="p-3 text-sm text-gray-700">{attendance.checkOut}</td>
                          <td className="p-3 text-sm text-gray-700">{attendance.workingHours} hrs</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(attendance.status)}`}>
                              {attendance.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Performance</h2>
                <p className="text-sm text-gray-500">Track your performance metrics</p>
              </div>

              {/* Performance Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={SparklesIcon}
                  title="Efficiency Score"
                  value={`${performanceData.efficiencyScore}%`}
                  subtitle="Your score"
                  trend="positive"
                  color="blue"
                />
                <StatCard
                  icon={CheckBadgeIcon}
                  title="Quality Score"
                  value={`${performanceData.qualityScore}%`}
                  subtitle="Your score"
                  trend="positive"
                  color="green"
                />
                <StatCard
                  icon={CheckCircleIcon}
                  title="Tasks Completed"
                  value={performanceData.tasksCompleted}
                  subtitle="This month"
                  trend="+8%"
                  color="purple"
                />
                <StatCard
                  icon={ChartBarIcon}
                  title="Productivity"
                  value={`${performanceData.productivity}%`}
                  subtitle="Your score"
                  trend="positive"
                  color="yellow"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Efficiency</span>
                        <span className="text-sm font-semibold text-gray-900">{performanceData.efficiencyScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${performanceData.efficiencyScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Quality</span>
                        <span className="text-sm font-semibold text-gray-900">{performanceData.qualityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${performanceData.qualityScore}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Productivity</span>
                        <span className="text-sm font-semibold text-gray-900">{performanceData.productivity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${performanceData.productivity}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Ranking */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Ranking</h3>
                  <div className="space-y-3">
                    {teamRanking.map((member) => (
                      <div key={member.rank} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          member.rank === 1 ? 'bg-yellow-500' :
                          member.rank === 2 ? 'bg-gray-400' :
                          member.rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {member.rank}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{member.score}</p>
                          <p className="text-xs text-gray-500">score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Top Performer", icon: SparklesIcon, color: "yellow" },
                    { name: "Quality Expert", icon: CheckBadgeIcon, color: "green" },
                    { name: "Fast Deliverer", icon: ClockIcon, color: "blue" },
                    { name: "Team Player", icon: UserGroupIcon, color: "purple" },
                  ].map((badge, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-12 h-12 bg-${badge.color}-100 rounded-full flex items-center justify-center mb-2`}>
                        <badge.icon className={`w-6 h-6 text-${badge.color}-600`} />
                      </div>
                      <p className="text-xs font-medium text-gray-900 text-center">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">Manage your personal information</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {employeeData.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{employeeData.name}</h3>
                      <p className="text-sm text-gray-500">{employeeData.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{employeeData.department}</p>
                      <button className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <PencilIcon className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.department}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.phone}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Manager</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.manager}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Joining Date</label>
                      <p className="text-sm font-medium text-gray-900">{employeeData.joiningDate}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Tasks This Month</span>
                      <span className="text-sm font-bold text-gray-900">{tasksData.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-bold text-green-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Avg. Efficiency</span>
                      <span className="text-sm font-bold text-blue-600">{performanceData.efficiencyScore}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <span className="text-sm font-bold text-purple-600">96%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    "Task assignments and updates",
                    "Leave request approvals/rejections",
                    "Performance reports",
                    "Team announcements",
                    "Deadline reminders",
                    "System notifications",
                  ].map((preference) => (
                    <label key={preference} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <span className="text-sm text-gray-700">{preference}</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  trend: string;
  color: string;
}> = ({ icon: Icon, title, value, subtitle, trend, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== 'normal' && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'positive' || trend.includes('+') ? 'bg-green-100 text-green-700' :
            trend === 'negative' || trend === 'urgent' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'urgent' ? '⚠️' : trend}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </motion.div>
  );
};

export default EmployeeDashboardPage;