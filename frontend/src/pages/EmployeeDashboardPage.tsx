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
  ChatBubbleLeftRightIcon,
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
import { useAuthStore } from "../store/authStore";


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
  const [editingLeave, setEditingLeave] =
  useState<any>(null);

const [showEditModal, setShowEditModal] =
  useState(false);
  const [leaveTab, setLeaveTab] =
  useState("myRequests");

const [leaveRequests, setLeaveRequests] =
  useState([]);
  const [feedback, setFeedback] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  useEffect(() => {
  fetch("http://10.1.8.103:5000/api/employees/")
    .then((res) => res.json())
    .then((data) => {
      console.log("Employees:", data);
      setEmployees(data);
      console.log("Employees:", employees);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);
  const [leaveForm, setLeaveForm] = useState({
  leaveType: "",
  leaveDuration: "Full Day",
  fromDate: "",
  toDate: "",
  totalDays: 0,
  reason: "",
  emergencyContact: "",
  reportingManager: "",
  handoverTo: "",
  attachment: null,
});

useEffect(() => {
  loadLeaves();
}, []);

const loadLeaves = async () => {
  try {

    const res = await fetch(
      "http://10.1.8.103:5000/api/leaves/"
    );

    const data = await res.json();

    setLeaveRequests(data);

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (
    leaveForm.fromDate &&
    leaveForm.toDate
  ) {
    const start = new Date(
      leaveForm.fromDate
    );

    const end = new Date(
      leaveForm.toDate
    );

    let days =
      Math.ceil(
        (end - start) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (
      leaveForm.leaveDuration ===
        "First Half" ||
      leaveForm.leaveDuration ===
        "Second Half"
    ) {
      days = 0.5;
    }

    setLeaveForm((prev) => ({
      ...prev,
      totalDays: days,
    }));
  }
}, [
  leaveForm.fromDate,
  leaveForm.toDate,
  leaveForm.leaveDuration,
]);

  
const [attendanceData, setAttendanceData] =
  useState<Attendance[]>([]);

  useEffect(() => {

  const userId =
    localStorage.getItem("user_id");

  if (!userId) return;

  fetch(
    `http://10.1.8.103:5000/api/attendance/history/${userId}`
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
  { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon },
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
      "http://10.1.8.103:5000/api/attendance/checkin",
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
      "http://10.1.8.103:5000/api/attendance/checkout",
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
    `http://10.1.8.103:5000/api/attendance/history/${userId}`
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
    "http://10.1.8.103:5000/api/attendance/lunch-break",
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
    "http://10.1.8.103:5000/api/attendance/tea-break",
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

  const handleLeaveSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    let response;

    // EDIT LEAVE
    if (editingLeave) {

      response = await fetch(
        `http://10.1.8.103:5000/api/leaves/update/${editingLeave.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leave_type: leaveForm.leaveType,
            from_date: leaveForm.fromDate,
            to_date: leaveForm.toDate,
            total_days: leaveForm.totalDays,
            handover_to: leaveForm.handoverTo,
            emergency_contact:
              leaveForm.emergencyContact,
            reason: leaveForm.reason,
          }),
        }
      );

    } else {

      // NEW LEAVE
      response = await fetch(
        "http://10.1.8.103:5000/api/leaves/",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            employee_id:
              currentEmployee?.id,

            employee_name:
              `${currentEmployee?.first_name} ${currentEmployee?.last_name}`,

            leave_type:
              leaveForm.leaveType,

            from_date:
              leaveForm.fromDate,

            to_date:
              leaveForm.toDate,

            total_days:
              leaveForm.totalDays,

            reporting_manager:
              currentEmployee?.reporting_manager,

            handover_to:
              leaveForm.handoverTo,

            emergency_contact:
              leaveForm.emergencyContact,

            reason:
              leaveForm.reason,
          }),
        }
      );
    }

    const data =
      await response.json();

    if (data.success) {

      toast.success(
        editingLeave
          ? "Leave Updated Successfully"
          : "Leave Applied Successfully"
      );

      loadLeaves();

      setShowLeaveForm(false);

      setEditingLeave(null);

      setLeaveForm({
        leaveType: "",
        leaveDuration: "Full Day",
        fromDate: "",
        toDate: "",
        totalDays: 0,
        reason: "",
        emergencyContact: "",
        reportingManager: "",
        handoverTo: "",
        attachment: null,
      });

    } else {

      toast.error(
        data.message ||
        "Operation Failed"
      );

    }

  } catch (error) {

    console.log(error);

    toast.error(
      "Server Error"
    );

  }
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
    // console.log("Logged In User:", user);
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
    `http://10.1.8.103:5000/api/attendance/status/${userId}`
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

const currentEmployee = employees.find(
  (emp) => Number(emp.user_id) === Number(user?.id)
);

// console.log("User ID:", user?.id);
// console.log("Employees:", employees);
// console.log("Current Employee:", currentEmployee);

const approveLeave = async (
  id: number
) => {

  try {

    const res = await fetch(
      `http://10.1.8.103:5000/api/leaves/approve/${id}`,
      {
        method: "PUT",
      }
    );

    const data =
      await res.json();

    if (data.success) {

      toast.success(
        "Leave Approved"
      );

      loadLeaves();

    }

  } catch (err) {

    console.log(err);

  }
};

const rejectLeave = async (
  id: number
) => {

  try {

    const res = await fetch(
      `http://10.1.8.103:5000/api/leaves/reject/${id}`,
      {
        method: "PUT",
      }
    );

    const data =
      await res.json();

    if (data.success) {

      toast.success(
        "Leave Rejected"
      );

      loadLeaves();

    }

  } catch (err) {

    console.log(err);

  }
};

const cancelLeave = async (
  id: number
) => {

  try {

    const res = await fetch(
      `http://10.1.8.103:5000/api/leaves/cancel/${id}`,
      {
        method: "PUT",
      }
    );

    const data =
      await res.json();

    if (data.success) {

      toast.success(
        "Leave Cancelled"
      );

      loadLeaves();
    }

  } catch (err) {

    console.log(err);

  }
};

const managerName =
  `${currentEmployee?.first_name} ${currentEmployee?.last_name}`
    .trim()
    .toLowerCase();

const approvalLeaves =
  leaveRequests.filter(
    (leave: any) =>
      leave.reporting_manager
        ?.trim()
        .toLowerCase() === managerName
  );



const totalBalance =
  (currentEmployee?.sick_leave || 0) +
  (currentEmployee?.casual_leave || 0) +
  (currentEmployee?.earned_leave || 0);

  const leaveReasons = {
  "Sick Leave": [
    "Fever",
    "Headache",
    "Cold",
    "Food Poisoning",
    "Medical Checkup",
    "Hospital Visit",
  ],

  "Casual Leave": [
    "Personal Work",
    "Family Function",
    "Marriage",
    "Bank Work",
    "Travel",
  ],

  "Earned Leave": [
    "Vacation",
    "Family Trip",
    "Festival",
    "Personal Time",
  ],

  "Unpaid Leave": [
    "Emergency",
    "Personal Reasons",
    "Extended Vacation",
  ],
};

const editLeave = (leave: any) => {

  setLeaveForm({
    leaveType: leave.leave_type || "",
    leaveDuration: leave.leave_duration || "Full Day",
    fromDate: leave.from_date || "",
    toDate: leave.to_date || "",
    totalDays: leave.total_days || 0,
    reason: leave.reason || "",
    emergencyContact: leave.emergency_contact || "",
    reportingManager: leave.reporting_manager || "",
    handoverTo: leave.handover_to || "",
    attachment: null,
  });

  setEditingLeave(leave);

  setShowLeaveForm(true);
};
const updateLeave = async () => {

  try {

    const res = await fetch(
      `http://10.1.8.103:5000/api/leaves/update/${editingLeave.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify(
          editingLeave
        )
      }
    )

    const data =
      await res.json()

    if (data.success) {

      toast.success(
        "Leave Updated"
      )

      loadLeaves()

      setShowEditModal(false)
    }

  } catch (err) {

    console.log(err)

  }
}

const initials =
  `${currentEmployee?.first_name?.charAt(0) || ""}
   ${currentEmployee?.last_name?.charAt(0) || ""}`
    .replace(/\s/g, "")
    .toUpperCase();

    const pendingLeaveCount =
  leaveRequests.filter(
    (leave: any) =>
      leave.status === "Pending"
  ).length;



  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#022B3A] rounded-lg flex items-center justify-center">
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
                  <div className="relative flex items-center">
  <span>{tab.label}</span>

  {tab.id === "leave" && pendingLeaveCount > 0 && (
    <span
      className="
        absolute
        -top-3
        -right-6
        bg-red-500
        text-white
        text-[10px]
        font-bold
        min-w-[18px]
        h-[18px]
        flex
        items-center
        justify-center
        rounded-full
      "
    >
      {pendingLeaveCount}
    </span>
  )}
</div>
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
  <div className="relative">

  {/* Floating Profile */}
  <div className="absolute -top-5 left-[-10px] z-20">
  <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
    <img
      src={
        currentEmployee?.id
          ? `http://10.1.8.103:5000/api/employees/image/${currentEmployee.id}`
          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt="Employee Profile"
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.src =
          "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }}
    />
  </div>
</div>

  {/* Main Card */}
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4 pt-8">

    {/* Header */}
    <div className="flex justify-between items-start">

      <div className="ml-24">
        <h2 className="text-3xl font-bold text-gray-800">
          Hi, {user?.full_name || "Employee"}!
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {user?.role || "Employee"} • {user?.team || "Pre-Editing"}
        </p>
      </div>

      <div className="w-12 h-12 rounded-full bg-[#1985A1] flex items-center justify-center shadow-sm">
        <span className="text-white text-base font-semibold">
          {initials}
        </span>
      </div>

    </div>

    {/* Attendance Box */}
    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Working Hours
          </p>

          <h3 className="text-4xl font-bold font-mono text-gray-800 mt-1">
            {timer}
          </h3>

          {checkInTime && (
            <p className="text-sm text-gray-500 mt-1">
              Since{" "}
              <span className="font-medium text-gray-700">
                {checkInTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all ${
            isCheckedIn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#1985A1] hover:bg-[#146c85]"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>

      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mt-3">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isCheckedIn
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        />
        <span className="text-sm text-gray-600">
          {isCheckedIn
            ? "Checked In"
            : "Not Checked In"}
        </span>
      </div>

      {/* Break Buttons */}
      {isCheckedIn && (
        <div className="mt-4 pt-4 border-t border-gray-200">

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={handleLunchBreak}
              disabled={isLunchTaken}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLunchTaken
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isLunchTaken
                ? "✓ Lunch Taken"
                : "Lunch Break (30m)"}
            </button>

            <button
              onClick={handleTeaBreak}
              disabled={isTeaTaken}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                isTeaTaken
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isTeaTaken
                ? "✓ Tea Taken"
                : "Tea Break (30m)"}
            </button>

          </div>

          {(isLunchTaken || isTeaTaken) && (
            <div className="mt-3 flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">
                Total Break
              </span>

              <span className="font-semibold text-gray-800">
                {(isLunchTaken ? 30 : 0) +
                  (isTeaTaken ? 30 : 0)} min
              </span>
            </div>
          )}

        </div>
      )}

    </div>

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
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1>Leave Request</h1>
<p className="text-sm text-gray-500 mt-1">Manage your leave applications</p>
      </div>
      <button
        onClick={() => setShowLeaveForm(true)}
        className="flex items-center gap-2 bg-[#4C5C68] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        <PlusIcon className="w-4 h-4" />
        Apply Leave
      </button>
    </div>

    {/* Tab Buttons */}
    <div className="flex gap-3 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
      <button
        onClick={() => setLeaveTab("myRequests")}
        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
          leaveTab === "myRequests"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        My Requests
      </button>
      <button
        onClick={() => setLeaveTab("approvalRequests")}
        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
          leaveTab === "approvalRequests"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Approval Requests
      </button>
    </div>

    {/* Leave Balance Card */}
    <motion.div variants={itemVariants} className="mb-6">
      <div className="bg-[#1985A1] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Leave Balance</h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-purple-200 text-xs mb-1 font-medium">Sick Leave</p>
<p className="text-3xl font-bold">
  {currentEmployee?.sick_leave || 0}
</p>            <p className="text-purple-200 text-xs mt-1">days remaining</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-purple-200 text-xs mb-1 font-medium">Casual Leave</p>
<p className="text-3xl font-bold">
  {currentEmployee?.casual_leave || 0}
</p>            <p className="text-purple-200 text-xs mt-1">days remaining</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-purple-200 text-xs mb-1 font-medium">Earned Leave</p>
<p className="text-3xl font-bold">
  {currentEmployee?.earned_leave || 0}
</p>            <p className="text-purple-200 text-xs mt-1">days remaining</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <p className="text-purple-100 text-xs mb-1 font-medium">Total Balance</p>
<p className="text-3xl font-bold">
  {totalBalance}
</p>            <p className="text-purple-100 text-xs mt-1">days remaining</p>
          </div>
        </div>
      </div>
    </motion.div>

    {leaveTab === "myRequests" && (
      <>
        {/* Leave Form Modal */}
        {showLeaveForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
  {editingLeave ? "Edit Leave" : "Apply Leave"}
</h2>
                  <p className="text-sm text-gray-500 mt-1">Fill in the details to request leave</p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={handleLeaveSubmit}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6"
              >
                {/* LEFT SIDE - Form Fields */}
                <div className="lg:col-span-3 space-y-5">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={leaveForm.leaveType}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          leaveType: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Earned Leave">Earned Leave</option>
                      <option value="Unpaid Leave">Unpaid Leave</option>
                    </select>
                  </div>

                  <div>
  <label className="block text-sm font-semibold mb-2">
    Leave Duration
  </label>

  <select
    value={leaveForm.leaveDuration}
    onChange={(e) =>
      setLeaveForm({
        ...leaveForm,
        leaveDuration: e.target.value,
      })
    }
    className="w-full border rounded-lg px-4 py-2"
  >
    <option value="Full Day">
      Full Day
    </option>

    <option value="First Half">
      First Half
    </option>

    <option value="Second Half">
      Second Half
    </option>
  </select>
</div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        From Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveForm.fromDate}
                        onChange={(e) =>
                          setLeaveForm({
                            ...leaveForm,
                            fromDate: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveForm.toDate}
                        onChange={(e) =>
                          setLeaveForm({
                            ...leaveForm,
                            toDate: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Total Days
                      </label>
                      <input
                        readOnly
                        value={leaveForm.totalDays || 0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-600 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Reporting Manager */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Reporting Manager
                    </label>
                    <input
                      type="text"
                      value={currentEmployee?.reporting_manager || ""}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  {/* Work Handover */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Work Handover To
                    </label>
                    <select
  value={leaveForm.handoverTo}
  onChange={(e) =>
    setLeaveForm({
      ...leaveForm,
      handoverTo: e.target.value,
    })
  }
  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
>
  <option value="">Select Employee</option>

  {employees?.map((emp) => (
    <option
      key={emp.id}
      value={`${emp.first_name} ${emp.last_name}`}
    >
      {emp.first_name} {emp.last_name}
    </option>
  ))}
</select>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Emergency Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={leaveForm.emergencyContact}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          emergencyContact: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter emergency contact number"
                    />
                  </div>

                  {/* Reason */}
                  <div>
  <label className="block text-sm font-semibold mb-2">
    Reason
  </label>

  <select
    required
    value={leaveForm.reason}
    onChange={(e) =>
      setLeaveForm({
        ...leaveForm,
        reason: e.target.value,
      })
    }
    className="w-full border rounded-lg px-4 py-2"
  >
    <option value="">
      Select Reason
    </option>

    {leaveForm.leaveType &&
      leaveReasons[
        leaveForm.leaveType
      ]?.map((reason) => (
        <option
          key={reason}
          value={reason}
        >
          {reason}
        </option>
      ))}
  </select>
</div>

                  {/* Attachment */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Attachment
                    </label>
                    <input
                      type="file"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports: PDF, JPG, PNG (Max 5MB)</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowLeaveForm(false)}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
  type="submit"
  className="px-6 py-2.5 bg-[#4C5C68] text-white rounded-lg"
>
  {editingLeave ? "Update Leave" : "Submit Leave"}
</button>
                  </div>
                </div>

                {/* RIGHT SIDE - Info Panel */}
                <div className="space-y-4">
                  {/* Leave Balance */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      Leave Balance
                    </h3>
                    <div className="space-y-3">
  <div className="flex justify-between items-center py-2 border-b border-blue-100">
    <span className="text-gray-700">
      Earned Leave
    </span>
    <span className="font-bold text-blue-700 text-lg">
      {currentEmployee?.earned_leave || 0}
    </span>
  </div>

  <div className="flex justify-between items-center py-2 border-b border-blue-100">
    <span className="text-gray-700">
      Casual Leave
    </span>
    <span className="font-bold text-blue-700 text-lg">
      {currentEmployee?.casual_leave || 0}
    </span>
  </div>

  <div className="flex justify-between items-center py-2 border-b border-blue-100">
    <span className="text-gray-700">
      Sick Leave
    </span>
    <span className="font-bold text-blue-700 text-lg">
      {currentEmployee?.sick_leave || 0}
    </span>
  </div>

  <div className="flex justify-between items-center pt-3">
    <span className="font-bold text-blue-900">
      Total Balance
    </span>
    <span className="font-bold text-blue-700 text-xl">
      {totalBalance}
    </span>
  </div>
</div>
                  </div>

                  {/* Leave Information */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-semibold mb-3 text-green-900 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      Leave Information
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Earned Leave:</strong> Planned leave for vacations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Casual Leave:</strong> Personal work or short absence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Sick Leave:</strong> Medical leave when unwell</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Approval required by Reporting Manager</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h4 className="font-semibold mb-3 text-amber-900 flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Quick Tips
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Apply at least 2 days in advance</li>
                      <li>• Provide emergency contact details</li>
                      <li>• Arrange work handover before leaving</li>
                    </ul>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Leave Approval Tracker */}
        {leaveRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              Leave Request Tracking
            </h3>

            {leaveRequests
  .filter(
    (leave: any) =>
      leave.employee_id === currentEmployee?.id
  )
  .slice(0, 1)
  .map((leave: any) => (
              <div key={leave.id}>
                <div className="flex items-center justify-between">
                  {/* Applied */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold mt-3 text-gray-900">Applied</p>
                    <p className="text-xs text-gray-500 mt-1">{leave.fromDate}</p>
                  </div>

                  <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-yellow-500 mx-3 rounded-full"></div>

                  {/* Reporting Manager */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg
                      ${
                        leave.status === "Approved"
                          ? "bg-green-500"
                          : leave.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {leave.status === "Approved"
                        ? (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>)
                        : leave.status === "Rejected"
                        ? (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>)
                        : (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>)
                      }
                    </div>
                    <p className="text-sm font-semibold mt-3 text-gray-900">Reporting Manager</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {leave.status === "Pending" ? "Awaiting" : leave.status}
                    </p>
                  </div>

                  <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-green-500 mx-3 rounded-full"></div>

                  {/* Final Status */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg
                      ${
                        leave.status === "Approved"
                          ? "bg-green-500"
                          : leave.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {leave.status === "Approved"
                        ? (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>)
                        : leave.status === "Rejected"
                        ? (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>)
                        : (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>)
                      }
                    </div>
                    <p className="text-sm font-semibold mt-3 text-gray-900">Final Status</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span
                    className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold border shadow-sm
                    ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : leave.status === "Rejected"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}
                  >
                    {leave.status === "Approved" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                    {leave.status === "Rejected" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    {leave.status === "Pending" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                    )}
                    Current Status: {leave.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
              Leave History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Leave Type</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date Range</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Days</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Manager</th>
                  <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
               {leaveRequests
  .filter(
    (request: any) =>
      request.employee_id === currentEmployee?.id
  )
  .map((request: any) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-900">{request.leave_type}</td>
                    <td className="p-4 text-sm">
                      <p className="text-gray-900 font-medium">{request.from_date}</p>
                      <p className="text-xs text-gray-500">to {request.to_date}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {request.total_days} days
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                        {request.status === "Approved" && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {request.status === "Rejected" && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
      request.status === "Approved"
        ? "bg-green-100 text-green-700"
        : request.status === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {request.status}
  </span>
</td>
<td className="p-4">
  <div className="flex gap-2">

    {request.status === "Pending" && (
      <>
        <button
  onClick={() => editLeave(request)}
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Edit
</button>

        <button
          onClick={() =>
            cancelLeave(request.id)
          }
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </>
    )}

    {request.status === "Approved" && (
      <button
        onClick={() =>
          cancelLeave(request.id)
        }
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Cancel Leave
      </button>
    )}

    {request.status === "Rejected" && (
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Edit
      </button>
    )}

  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {leaveRequestsData.length === 0 && (
            <div className="text-center py-12">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-gray-300 mb-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-gray-500 font-medium">No leave requests found</p>
              <p className="text-gray-400 text-sm mt-1">Apply for leave to see it here</p>
            </div>
          )}
        </div>
      </>
    )}

    {leaveTab === "approvalRequests" && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Leave Approval Requests
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Employee</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Leave Type</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">From</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">To</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests && leaveRequests.length > 0 ? (
                approvalLeaves
  .filter(
    (leave) => leave.status !== "Cancelled"
  )
  .map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{leave.employee_name}</td>
                    <td className="p-4 text-sm text-gray-700">{leave.leave_type}</td>
                    <td className="p-4 text-sm text-gray-700">{leave.from_date}</td>
                    <td className="p-4 text-sm text-gray-700">{leave.to_date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                        {leave.status === "Approved" && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {leave.status === "Rejected" && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
  onClick={() =>
    approveLeave(leave.id)
  }
  className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
  Approve
</button>
                        <button
  onClick={() =>
    rejectLeave(leave.id)
  }
  className="bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Reject
</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-gray-300 mb-4">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No approval requests found</p>
                    <p className="text-gray-400 text-sm mt-1">Leave requests will appear here for approval</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
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

          {activeTab === "feedback" && (
  <>
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Manager Feedback
      </h2>

      <p className="text-sm text-gray-500">
        Feedback received from your Reporting Manager
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Feedback History
      </h3>

      <div className="space-y-4">

        {/* Feedback Card 1 */}
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              Performance Feedback
            </h4>

            <span className="text-xs text-gray-500">
              05-Jun-2026
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-3">
            Good progress in project execution.
            Please improve communication updates and
            complete assigned tasks before the deadline.
          </p>

          <div className="mt-3 text-xs text-blue-600 font-medium">
            By: Reporting Manager
          </div>
        </div>

        {/* Feedback Card 2 */}
        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              Attendance Appreciation
            </h4>

            <span className="text-xs text-gray-500">
              28-May-2026
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-3">
            Excellent attendance record throughout
            this month. Keep maintaining the same
            consistency and punctuality.
          </p>

          <div className="mt-3 text-xs text-green-600 font-medium">
            By: Reporting Manager
          </div>
        </div>

        {/* Feedback Card 3 */}
        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              Quality Improvement Suggestion
            </h4>

            <span className="text-xs text-gray-500">
              15-May-2026
            </span>
          </div>

          <p className="text-sm text-gray-700 mt-3">
            Work quality is good. Please perform
            additional proofreading before submitting
            files to reduce minor formatting issues.
          </p>

          <div className="mt-3 text-xs text-yellow-600 font-medium">
            By: Reporting Manager
          </div>
        </div>

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