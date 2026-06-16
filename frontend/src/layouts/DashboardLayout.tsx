import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  FolderIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  SparklesIcon,
  ClockIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BellIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import logo from "../images/s.png";

import { socket } from "../services/socket";

import Lottie from "lottie-react";
import aiAnimation from "../assests/astronot.json";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const reportMenuRef = useRef<HTMLDivElement | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showCommunication, setShowCommunication] =
  useState(false);

const [notifications, setNotifications] = useState<any[]>([]);

const [showNotifications, setShowNotifications] = useState(false);

const shownNotifications = useRef(
  new Set<number>()
);

useEffect(() => {

  notifications.forEach((item: any) => {

    if (
      !shownNotifications.current.has(
        item.id
      )
    ) {

      shownNotifications.current.add(
        item.id
      );

      toast.error(
        item.message,
        {
          duration: 10000
        }
      );
    }

  });

}, [notifications]);

const employee = JSON.parse(
  localStorage.getItem("employee") || "{}"
);

const managerName =
  `${employee.first_name} ${employee.last_name}`;

useEffect(() => {

  const managerName =
    user?.full_name;

  if (!managerName) return;

  const fetchNotifications =
    async () => {

      try {

        const res =
          await fetch(
            `http://10.1.8.103:5000/api/notifications/${managerName}`
          );

        const data =
          await res.json();

        setNotifications(data);

      } catch (err) {

        console.error(err);

      }
    };

  fetchNotifications();

  const interval =
    setInterval(
      fetchNotifications,
      5000
    );

  return () =>
    clearInterval(interval);

}, [user]);




  const [activeTab, setActiveTab] = useState<
  "office" | "employee"
>("employee");
const [officeText, setOfficeText] =
  useState("");

const canSendOfficeMessage =
  user?.role === "HR" ||
  user?.role === "Admin" ||
  user?.role === "Super Admin";

  const [birthdayModal, setBirthdayModal] = useState(false);

  const [
  attendanceSummaryModal,
  setAttendanceSummaryModal
] = useState(false);

const [birthdayEmployees, setBirthdayEmployees] =
  useState<any[]>([]);
  




const [officeMessages, setOfficeMessages] =
  useState([]);

const [employeeMessages, setEmployeeMessages] = useState<any[]>([]);



  

  const [employees, setEmployees] = useState<any[]>([]);

  const [realtimeMessages,setRealtimeMessages] = useState<any[]>([]);

const [showMentionDropdown, setShowMentionDropdown] =
  useState(false);

const [mentionResults, setMentionResults] =
  useState<any[]>([]);


  const fetchTodayBirthdays = async () => {
  try {
    const res = await fetch(
      "http://10.1.8.103:5000/api/employees/birthdays/today"
    );

    const data = await res.json();

    setBirthdayEmployees(
      Array.isArray(data) ? data : []
    );

  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchTodayBirthdays();
}, []);

useEffect(() => {

  if (
    birthdayEmployees.length > 0 &&
    !sessionStorage.getItem(
      "birthday_popup_shown"
    )
  ) {

    setBirthdayModal(true);

    sessionStorage.setItem(
      "birthday_popup_shown",
      "true"
    );

    setTimeout(() => {

      setBirthdayModal(false);

      setAttendanceSummaryModal(true);

    }, 5000);

  } else {

    setAttendanceSummaryModal(true);

  }

}, [birthdayEmployees]);

  
  // Real conversational state starts here
const [
  selectedUser,
  setSelectedUser
] = useState<any>(null);

const [
  messageText,
  setMessageText
] = useState("");

const [
  messages,
  setMessages
] = useState<any[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {

  await logout();

  sessionStorage.clear();

  localStorage.clear();

  toast.success("Logged out successfully");

  navigate("/login");
};

const [selectedEmployee, setSelectedEmployee] =
  useState<any>(null);

const [showAttendanceModal, setShowAttendanceModal] =
  useState(false);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reportMenuRef.current &&
        !reportMenuRef.current.contains(event.target as Node)
      ) {
        setShowReportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom of chat smoothly
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /**
   * INTERCEPTS FETCH REQUESTS AND SIMULATES A REALTIME LLM STREAM
   */
  const executeAiStreamQuery = async (userMessage: string, history: Message[]) => {
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    const cleanQuery = userMessage.toLowerCase();

    // Mock responses mapping with full Markdown layouts
    let responseText = `Hello **${user?.full_name || "Super Admin"}**! I processed your query: *"${userMessage}"*.\n\nAs a local mock environment, I'm ready to present full system layouts. Try clicking the quick actions below like **Overdue Projects** or **Workload** to see simulated live metrics!`;

    if (cleanQuery.includes("overdue")) {
      responseText = `### 📊 Overdue Projects Summary\nHere are the high-priority projects currently lagging behind schedule:\n\n| Project Name | Lead Editor | Days Overdue | Risk Level |\n| :--- | :--- | :---: | :---: |\n| **Medical Journal Vol.4** | Sarah Jenkins | \`5 Days\` | 🔴 High |\n| **Corporate Brochure Copy** | David Miller | \`3 Days\` | 🟡 Medium |\n| **Annual Fiscal Report** | Elena Rostova | \`2 Days\` | 🟡 Medium |\n\n*Action Suggested: Re-assign pending copy tasks or bump priority queues.*`;
    } else if (cleanQuery.includes("workload") || cleanQuery.includes("employee")) {
      responseText = `### 👨‍💼 Current Team Workload Analysis\nHere is the capacity report for active departments:\n\n* **Pre-Editing Unit:** 📈 **88% Capacity** (High volume incoming)\n* **Copywriting Unit:** 🟢 **65% Capacity** (Balanced, available for tasks)\n* **Quality Analyst (QA) Team:** 🚨 **95% Capacity** (Bottleneck detected at proofing stage)\n\n**Top Loaded Resource:** Sarah Jenkins (4 Active Projects, 1 Overdue).`;
    } else if (cleanQuery.includes("sla")) {
      responseText = `### ⏳ Service Level Agreement (SLA) Health\nYour operational compliance is holding steady at **91.4%** this week.\n\n* **Met Targets:** 41 Projects\n* **Breached Targets:** 4 Projects\n* **In Jeopardy:** 2 Projects\n\n> 💡 **AI Insight:** The majority of SLA warnings stem from late file transfers during the initial *Pre-Editing* hand-off pipeline phase.`;
    } else if (cleanQuery.includes("risk")) {
      responseText = `### 🚨 Critical Risk Evaluation\nI found **2 Projects** displaying high-risk failure patterns:\n\n1. **Project #9982 (BioTech Assessment):** Unassigned QA reviewer with milestone expiring in **18 hours**.\n2. **Project #1042 (Legal Indexing):** Client feedback cycle has stalled by over 4 days.`;
    }

    // Set a short processing delay to feel like genuine processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsTyping(false);

    // Insert an empty entry for the assistant stream to occupy
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: "assistant", content: "", timestamp: new Date() }
    ]);

    // Simulate word-by-word data chunk stream mechanics
    const tokens = responseText.split(" ");
    let currentText = "";
    
    for (let i = 0; i < tokens.length; i++) {
      currentText += (i === 0 ? "" : " ") + tokens[i];
      
      // Update state progressively matching streaming behavior
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: currentText } : msg
        )
      );
      
      // Variable delay between words for realistic text drop cadence
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const activeInput = textToSend || userInput;
    if (!activeInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: activeInput,
      timestamp: new Date(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setUserInput("");

    await executeAiStreamQuery(activeInput, updatedHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [showPopup, setShowPopup] =
  useState(false);

const [reportingEmployees, setReportingEmployees] =
  useState([]);

  useEffect(() => {

  const loadEmployees = async () => {

    const userId =
      localStorage.getItem("user_id");

    const response =
      await fetch(
        `http://10.1.8.103:5000/api/employees/reporting-employees/${userId}`
      );

    const data =
      await response.json();
      console.log("User ID:", userId);
      console.log("Reporting Employees:", data);

    setReportingEmployees(data);

  };

  loadEmployees();

}, []);


  // Admin & Super Admin
  const getNavigationItems = () => {

  // Admin
  if (user?.access_level === "admin") {
    return [
      { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
      { name: "Projects", icon: FolderIcon, path: "/projects" },
      { name: "Clients", icon: UserGroupIcon, path: "/clients" },
      { name: "Payroll", icon: BanknotesIcon, path: "/payroll" },
      { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
      { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // Manager
  if (user?.access_level === "manager") {
    return [
      { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
      { name: "Projects", icon: FolderIcon, path: "/projects" },
      {
        name: "Team Management",
        icon: UserGroupIcon,
        path: "/manager-dashboard",
      },
      { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // HR
  if (user?.access_level === "hr") {
    return [
      { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
      {
        name: "HR Management",
        icon: UserGroupIcon,
        path: "/hrms",
      },
      {
        name: "Payroll",
        icon: BanknotesIcon,
        path: "/payroll",
      },
      {
        name: "Calendar",
        icon: CalendarIcon,
        path: "/calendar",
      },
      {
        name: "Reports",
        icon: ChartBarIcon,
        path: "/reports",
      },
    ];
  }

  // Employee / User
  return [
    {
      name: "Dashboard",
      icon: HomeIcon,
      path: "/employee-dashboard",
    },
    {
      name: "Reports",
      icon: ChartBarIcon,
      path: "/reports",
    },
  ];
};

const sidebarItems = getNavigationItems();


  const reportLinks = [
    { name: "Schedule Report", icon: DocumentChartBarIcon, path: "/reports/schedule", state: { tab: "schedule" } },
    { name: "Team Schedule", icon: ClockIcon, path: "/reports/today-schedule", state: { tab: "today" } },
    { name: "Project Info", icon: PresentationChartLineIcon, path: "/reports/project-schedule", state: { tab: "project" } },
  ];

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const employeeId = localStorage.getItem("employee_id");

const profileImageUrl =
  `http://10.1.8.103:5000/api/employees/image/${employeeId}`;

  useEffect(() => {
  fetchMessages();
}, []);

// ======================================
// FETCH PRIVATE MESSAGES
// ======================================

const fetchMessages = async () => {

  try {

    const employeeId =
      localStorage.getItem(
        "employee_id"
      );

    console.log(
      "Employee ID:",
      employeeId
    );

    if (
      !employeeId ||
      employeeId === "null"
    ) {

      console.log(
        "No employee id found"
      );

      return;

    }

    const response =
      await fetch(
        `http://10.1.8.103:5000/api/communications/employee/${employeeId}`
      );

    if (!response.ok) {

      console.error(
        "Failed:",
        response.status
      );

      return;

    }

    const data =
      await response.json();

    console.log(
      "Messages:",
      data
    );

    setEmployeeMessages(
      Array.isArray(data)
        ? data
        : []
    );

  } catch (error) {

    console.error(
      "Fetch Messages Error:",
      error
    );

    setEmployeeMessages([]);

  }

};


// ======================================
// LOAD ANNOUNCEMENTS
// ======================================

const loadAnnouncements =
  async () => {

    try {

      const response =
        await fetch(
          "http://10.1.8.103:5000/api/communications/announcements"
        );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setOfficeMessages(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Announcement Error:",
        error
      );

    }

};

useEffect(() => {

  loadAnnouncements();

}, []);


// ======================================
// SEND ANNOUNCEMENT
// ======================================

const sendAnnouncement =
  async () => {

    if (
      !officeText.trim()
    ) {
      return;
    }

    try {

      const employeeId =
        localStorage.getItem(
          "employee_id"
        );

      const response =
        await fetch(
          "http://10.1.8.103:5000/api/communications/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              employee_id:
                employeeId
                  ? Number(employeeId)
                  : null,

              receiver_id:
                null,

              employee_name:
                user?.full_name ||
                "HR Admin",

              message_type:
                "announcement",

              message:
                officeText,

              created_by:
                user?.full_name ||
                "HR Admin"

            })

          }
        );

      const data =
        await response.json();

      console.log(
        "Announcement:",
        data
      );

      setOfficeText("");

      loadAnnouncements();

    } catch (error) {

      console.error(
        "Send Announcement Error:",
        error
      );

    }

};


// ======================================
// SEND PRIVATE MESSAGE
// ======================================

const sendMessage =
  async () => {

    if (!selectedUser) {

      alert(
        "Please select a user"
      );

      return;

    }

    if (
      !messageText.trim()
    ) {
      return;
    }

    try {

      const employeeId =
        localStorage.getItem(
          "employee_id"
        );

      const response =
        await fetch(
          "http://10.1.8.103:5000/api/communications/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              employee_id:
                employeeId
                  ? Number(employeeId)
                  : null,

              receiver_id:
                selectedUser.id,

              employee_name:
                user?.full_name,

              message_type:
                "employee",

              message:
                messageText,

              created_by:
                user?.full_name

            })

          }
        );

      const data =
        await response.json();

      console.log(
        "Private Message:",
        data
      );

      setMessageText("");

      fetchMessages();

    } catch (error) {

      console.error(
        "Send Message Error:",
        error
      );

    }

};




// ======================================
// INITIAL LOAD
// ======================================

useEffect(() => {

  fetchMessages();

}, []);


// const handleSendRealtimeMessage = () => {

//   if (!selectedUser) {

//     alert(
//       "Please select a user using @mention"
//     );

//     return;
//   }

//   if (!messageText.trim()) {
//     return;
//   }

//   socket.emit(
//     "send_message",
//     {
//       sender_id:
//         Number(employeeId),

//       sender_name:
//         user?.full_name,

//       receiver_id:
//         selectedUser.id,

//       message:
//         messageText,

//       created_at:
//         new Date()
//     }
//   );

//   setRealtimeMessages(
//     (prev) => [
//       ...prev,
//       {
//         sender_id:
//           Number(employeeId),

//         sender_name:
//           user?.full_name,

//         receiver_id:
//           selectedUser.id,

//         message:
//           messageText,

//         created_at:
//           new Date()
//       }
//     ]
//   );

//   setMessageText("");
// };

// const [employees, setEmployees] = useState<any[]>([]);
// const [messages, setMessages] = useState<any[]>([]);
// const [officeMessages, setOfficeMessages] = useState<any[]>([]);
// const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);
// const [officeText, setOfficeText] = useState("");


// ======================================
// LOAD EMPLOYEES
// ======================================

const fetchEmployees = async () => {
  try {

    const res = await fetch(
      "http://10.1.8.103:5000/api/employees"
    );

    const data = await res.json();

    setEmployees(
      Array.isArray(data)
        ? data
        : []
    );

  } catch (error) {

    console.error(
      "Employees Error:",
      error
    );

  }
};


// ======================================
// LOAD PRIVATE MESSAGES
// ======================================

const loadMessages = async (
  employeeId: string
) => {

  try {

    const response =
      await fetch(
        `http://10.1.8.103:5000/api/communications/employee/${employeeId}`
      );

    const data =
      await response.json();

    setMessages(
      Array.isArray(data)
        ? data
        : []
    );

  } catch (error) {

    console.error(
      "Messages Error:",
      error
    );

  }

};


// ======================================
// INITIAL LOAD
// ======================================

useEffect(() => {

  const employeeId =
    localStorage.getItem(
      "employee_id"
    );

  console.log(
    "Employee ID:",
    employeeId
  );

  if (
    employeeId &&
    employeeId !== "null"
  ) {

    loadMessages(
      employeeId
    );

  }

  fetchEmployees();

}, []);


// ======================================
// SOCKET MESSAGE
// ======================================

useEffect(() => {

  socket.on(
    "receive_message",
    (message) => {

      setRealtimeMessages(
        (prev) => [
          ...prev,
          message
        ]
      );

    }
  );

  return () => {

    socket.off(
      "receive_message"
    );

  };

}, []);


// ======================================
// LOAD ANNOUNCEMENTS
// ======================================

const loadOfficeMessages =
  async () => {

    try {

      const res =
        await fetch(
          "http://10.1.8.103:5000/api/communications/announcements"
        );

      const data =
        await res.json();

      setOfficeMessages(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Office Messages Error:",
        error
      );

    }

};

useEffect(() => {

  loadOfficeMessages();

}, []);


// ======================================
// SEND ANNOUNCEMENT
// ======================================

const sendOfficeMessage =
  async () => {

    if (
      !officeText.trim()
    ) {
      return;
    }

    try {

      const employeeId =
        localStorage.getItem(
          "employee_id"
        );

      await fetch(
        "http://10.1.8.103:5000/api/communications/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            employee_id:
              employeeId
                ? Number(employeeId)
                : null,

            receiver_id:
              null,

            employee_name:
              user?.full_name ||
              "HR",

            message_type:
              "announcement",

            message:
              officeText,

            created_by:
              user?.full_name ||
              "HR"

          })

        }
      );

      setOfficeText("");

      loadOfficeMessages();

    } catch (error) {

      console.error(
        "Send Office Message Error:",
        error
      );

    }

};

const [hasNewMessage, setHasNewMessage] =
  useState(false);

const [lastMessageCount, setLastMessageCount] =
  useState(0);

  useEffect(() => {

  if (
    employeeMessages.length >
    lastMessageCount
  ) {

    setHasNewMessage(true);

  }

  setLastMessageCount(
    employeeMessages.length
  );

}, [employeeMessages]);

const isMyBirthday =
  birthdayEmployees.some(
    (emp: any) =>
      Number(emp.user_id) ===
      Number(user?.id)
  );

  const sendBirthdayWish = async (emp: any) => {

  const senderName =
    localStorage.getItem("full_name");

  await fetch(
    "http://10.1.8.103:5000/api/communications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        employee_id: emp.id,

        employee_name:
          `${emp.first_name} ${emp.last_name}`,

        receiver_id: emp.user_id,

        message_type: "employee",

        created_by: senderName,

        message:
          `🎂 Happy Birthday ${emp.first_name}! Wishing you happiness, success and prosperity. 🎉`
      })
    }
    
  );
};

const currentEmployee = employees.find(
  (emp: any) =>
    Number(emp.user_id) === Number(user?.id)
);




const [attendanceModal, setAttendanceModal] = useState(false); // ← never used properly

const userId = localStorage.getItem("user_id");

const popupKey =
  `attendance_popup_${userId}`;

useEffect(() => {

  if (
    reportingEmployees.length > 0 &&
    !sessionStorage.getItem(popupKey)
  ) {

    setShowPopup(true);

    sessionStorage.setItem(
      popupKey,
      "true"
    );

  }

}, [reportingEmployees]);


const viewAttendance = async (employeeId) => {
  try {
    const response = await fetch(
      `http://10.1.8.103:5000/api/attendance/details/${employeeId}`
    );

    const data = await response.json();

    setSelectedEmployee(data);
    setShowAttendanceModal(true);

  } catch (error) {
    console.error(error);
  }
};




  return (
    <div className="min-h-screen bg-gray-900">

      {
showAttendanceModal &&
selectedEmployee && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
  <div className="bg-white rounded-xl w-[600px] shadow-2xl overflow-hidden">
    
    {/* Header */}
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Attendance Details</h2>
      <button
        onClick={() => setShowAttendanceModal(false)}
        className="text-white hover:bg-gray-700 rounded-lg p-1 transition"
      >
        ✕
      </button>
    </div>

    {/* Content */}
    <div className="p-5 space-y-4">
      
      {/* Employee Info */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-semibold text-base text-gray-800">
          {selectedEmployee.employee_name}
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          {selectedEmployee.designation}
        </p>
      </div>

      {/* Attendance Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Check In
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.check_in}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Check Out
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.check_out}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Lunch Break
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.lunch_minutes} min
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Tea Break
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.tea_minutes} min
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Total Break
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.total_break_minutes} min
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-gray-500 text-xs font-semibold uppercase">
            Working Hours
          </label>
          <p className="text-gray-800 font-semibold text-sm mt-1">
            {selectedEmployee.working_hours || "-"}
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-green-600 transition shadow-md"
          onClick={() => approveAttendance(selectedEmployee.employee_id)}
        >
          Approve
        </button>
        <button
          className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-red-700 hover:to-red-600 transition shadow-md"
          onClick={() => rejectAttendance(selectedEmployee.employee_id)}
        >
          Reject
        </button>
      </div>

    </div>

  </div>
</div>

)}

      <div className="fixed top-5 right-5 z-[9998]">
  {/* Notification Button */}
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="
      relative
      bg-white
      rounded-full
      p-3
      shadow-xl
      border
      border-gray-200
      hover:shadow-2xl
      hover:scale-105
      transition-all
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-blue-400
    "
    aria-label="Notifications"
  >
    <span className="text-xl">🔔</span>

    {notifications.length > 0 && (
      <span
        className="
          absolute
          -top-1
          -right-1
          bg-red-500
          text-white
          text-xs
          w-5
          h-5
          rounded-full
          flex
          items-center
          justify-center
          font-semibold
          shadow
        "
      >
        {notifications.length}
      </span>
    )}
  </button>

  {/* Notifications Panel */}
  {showNotifications && (
    <div
      className="
        absolute
        top-14
        right-0
        mt-2
        w-[380px]
        bg-white
        rounded-2xl
        shadow-2xl
        border
        border-gray-200
        max-h-[480px]
        overflow-y-auto
        animate-[fadeInSlide_0.2s_ease-out]
      "
      role="dialog"
      aria-label="Notifications Panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className="
              text-sm
              text-gray-600
              hover:text-red-600
              hover:font-medium
              transition-colors
            "
          >
            Clear all
          </button>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-medium">No Notifications</p>
          <p className="text-sm mt-1">You're all clear for now.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map((item: any) => (
            <li
              key={item.id}
              className="
                p-4
                hover:bg-gray-50
                transition-colors
                flex
                gap-3
                items-start
                rounded-lg
                mx-3
                my-2
                border
                border-gray-200
              "
            >
              {/* Icon based on type (optional: default to info) */}
              <span className="text-lg">
                {item.type === "success" && "🟢"}
                {item.type === "warning" && "🟡"}
                {item.type === "error" && "🔴"}
                {(item.type === "info" || !item.type) && "🔵"}
              </span>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-700 mt-0.5">
                  {item.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : "Just now"}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() =>
                  setNotifications((prev: any[]) =>
                    prev.filter((n: any) => n.id !== item.id)
                  )
                }
                className="
                  text-gray-400
                  hover:text-gray-600
                  hover:font-medium
                  transition-colors
                  p-1
                  rounded
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-300
                "
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}

  {/* Inline keyframes for animation */}
  <style>
    {`
      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
  </style>
</div>

      {birthdayModal && birthdayEmployees.length > 0 && (
  <div className="fixed top-5 right-5 z-[9999] w-[380px]">
    {isMyBirthday ? (<div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[700px] max-w-full">

  {/* Header */}
  <div className="relative bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 min-h-[500px] overflow-hidden">

    {/* Decorations */}
    <div className="absolute top-6 left-8 text-4xl">🎈</div>
    <div className="absolute top-10 right-12 text-5xl">🎉</div>
    <div className="absolute bottom-10 left-10 text-5xl">🎊</div>
    <div className="absolute bottom-16 right-16 text-4xl">🎁</div>
    <div className="absolute top-24 right-32 text-3xl">⭐</div>
    <div className="absolute bottom-32 left-32 text-3xl">✨</div>

    {/* Close Button */}
    <button
      onClick={() => setBirthdayModal(false)}
      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 z-20"
    >
      ✕
    </button>

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-center">

      <img
        src={`http://10.1.8.103:5000/api/employees/image/${currentEmployee?.id}`}
        alt="Birthday"
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
        onError={(e) => {
          e.currentTarget.src =
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }}
      />

      <h3 className="mt-8 text-4xl font-light text-blue-900">
        Happy
      </h3>

      <h1 className="text-7xl font-extrabold text-blue-800 tracking-wide">
        Birthday
      </h1>

      <p className="mt-6 text-2xl font-semibold text-gray-800">
        {user?.full_name}
      </p>

      <p className="mt-4 text-lg text-gray-700">
        You Are The Most Amazing
      </p>

      <p className="mt-3 text-sm text-gray-600 max-w-lg leading-6">
        We hope you always stay happy and all your dreams
        come true. Wishing you success, prosperity,
        good health and happiness throughout the year.
      </p>

      <div className="mt-8 bg-white shadow-lg rounded-full px-8 py-3 border">
        🎂 Have A Wonderful Birthday 🎂
      </div>

    </div>

  </div>

</div>) : (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-5 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-base">
            🎉 Today's Birthdays
          </h2>

          <button
            onClick={() => setBirthdayModal(false)}
            className="text-white text-xl leading-none hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
          {birthdayEmployees.map((emp: any) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <img
                src={`http://10.1.8.103:5000/api/employees/image/${emp.id}`}
                alt={emp.first_name}
                className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {emp.first_name} {emp.last_name}
                </h3>

                <p className="text-xs text-gray-500 truncate">
                  {emp.designation}
                </p>

                <p className="text-xs text-gray-700 font-medium mt-0.5">
                  🎂 Birthday Today
                </p>
              </div>

              <button
                onClick={() => sendBirthdayWish(emp)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
              >
                Wishes
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500 py-3 border-t border-gray-200 bg-gray-50">
          — S4 Carlisle Publishing Services
        </div>
      </div>
    )}
  </div>
)}
      {showPopup && reportingEmployees.length > 0 && (
  <div className="fixed inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-[800px] max-w-full overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Yesterday Attendance Summary
          </h2>
        </div>

        <button
          onClick={() => setShowPopup(false)}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="p-6 bg-gray-50">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Check In
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Check Out
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Hours
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {reportingEmployees.map((emp: any, idx: number) => (
                <tr
                  key={emp.employee_id}
                  className={`
                    border-b border-gray-100
                    hover:bg-gray-50 transition-colors
                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}
                  `}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          emp.profile_image
                            ? `data:image/jpeg;base64,${emp.profile_image}`
                            : "/default-avatar.png"
                        }
                        alt={emp.employee_name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {emp.employee_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {emp.designation}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                        ${
                          emp.status === "Present"
                            ? "bg-gray-100 text-gray-800 border-gray-300"
                            : emp.status === "Absent"
                            ? "bg-gray-200 text-gray-700 border-gray-300"
                            : emp.status === "Late"
                            ? "bg-gray-100 text-gray-700 border-gray-300"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        }
                      `}
                    >
                      {emp.status === "Present" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      )}
                      {emp.status === "Absent" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                      {emp.status === "Late" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                      )}
                      {emp.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {emp.check_in}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {emp.check_out}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">
                      {emp.working_hours}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 transition-colors"
                      onClick={() => {
                          console.log(emp);

                          console.log("Employee Data:", emp);
  setSelectedEmployee(emp);
  setShowAttendanceModal(true);
}}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-2 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {reportingEmployees.filter(e => e.status === "Present").length} Present
            </span>
          </div>

          <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-2 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {reportingEmployees.filter(e => e.status === "Absent").length} Absent
            </span>
          </div>

          <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-2 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Total: {reportingEmployees.length} Employees
            </span>
          </div>
                   <button
    // onClick={approveAllAttendance}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-medium shadow-md transition-all ml-[140px]"
  >
    ✓ Approve All
  </button>
        </div>
 
      </div>
    </div>
  </div>
)}
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-white transition hover:bg-gray-700"
        >
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <h1 className="text-lg font-bold text-white">WMS</h1>
        <div className="w-10" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto border-r border-gray-700 bg-gray-800 lg:sticky"
            >
              {/* LOGO */}
              <div className="flex justify-center items-center mb-10 mt-2">
                <div className="relative w-[180px] h-[95px] bg-gradient-to-br from-[#ffffff] to-[#f8fafc] rounded-3xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-orange-500/5" />
                  <img
                    src={logo}
                    alt="S4 Carlisle"
                    className="relative z-10 w-[150px] h-auto object-contain drop-shadow-sm select-none pointer-events-none"
                    draggable="false"
                    navigator-blur="none"
                  />
                </div>
              </div>

              <nav className="mt-4 px-3 pb-28">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isReportsParent = location.pathname.startsWith("/reports/");

                  if (item.name === "Reports") {
                    return (
                      <div
                        key={item.path}
                        ref={reportMenuRef}
                        className="mb-2"
                        onMouseEnter={() => isDesktop && setShowReportMenu(true)}
                        onMouseLeave={() => isDesktop && setShowReportMenu(false)}
                      >
                        <button
                          onClick={() => setShowReportMenu((prev) => !prev)}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            isReportsParent || showReportMenu
                              ? "bg-gray-700 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-5 w-5" />
                            <span className="font-medium">Reports</span>
                          </div>
                          <motion.div
                            animate={{ rotate: showReportMenu ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDownIcon className="h-4 w-4" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {showReportMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -8, height: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 space-y-1 rounded-2xl border border-gray-700 bg-gray-900/60 p-2 backdrop-blur-sm">
                                {reportLinks.map((report) => {
                                  const isSubActive = location.pathname === report.path;
                                  return (
                                    <Link
                                      key={report.path}
                                      to={report.path}
                                      state={report.state}
                                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                                        isSubActive
                                          ? "bg-white text-gray-900 font-semibold"
                                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                      }`}
                                    >
                                      <report.icon className="h-4 w-4" />
                                      <span>{report.name}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mb-2 flex items-center rounded-xl px-4 py-3 transition-colors ${
                        isActive ? "bg-white font-semibold text-gray-900" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 p-4">
                <div className="mb-4 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <img
  src={profileImageUrl}
  alt="Profile"
  className="w-10 h-10 rounded-full object-cover"
  onError={(e) => {
    e.currentTarget.style.display = "none";

    const fallback =
      e.currentTarget.nextElementSibling as HTMLElement;

    if (fallback) {
      fallback.style.display = "flex";
    }
  }}
/>

<div
  className="w-10 h-10 rounded-full bg-white text-black font-semibold items-center justify-center hidden"
>
  {user?.full_name?.charAt(0)?.toUpperCase()}
</div>
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">{user?.full_name}</p>
                    <p className="text-xs text-gray-400">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-white transition-colors hover:bg-red-700"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* AI Assistant Floating Button */}
      <button
  onClick={() =>
    setShowCommunication(true)
  }
  className="
    fixed
    bottom-6
    right-6
    z-50
    bg-blue-600
    hover:bg-blue-700
    text-white
    rounded-full
    p-4
    shadow-xl
  "
>
  <ChatBubbleLeftRightIcon
    className="w-7 h-7"
  />
</button>

{showCommunication && (
  <div className="fixed bottom-6 right-6 w-[460px] h-[640px] bg-white rounded-[20px] shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">

    {/* Tab Header */}
    <div className="flex items-center border-b border-gray-100">
      <button
        onClick={() => setActiveTab("office")}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-medium border-b-2 transition-all
          ${activeTab === "office"
            ? "border-orange-500 text-orange-700 bg-orange-50"
            : "border-transparent text-gray-500 hover:bg-gray-50"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        Announcements
      </button>

      <button
        onClick={() => setActiveTab("employee")}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-medium border-b-2 transition-all
          ${activeTab === "employee"
            ? "border-blue-500 text-blue-700 bg-blue-50"
            : "border-transparent text-gray-500 hover:bg-gray-50"}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Messages
      </button>

      <button
        onClick={() => setShowCommunication(false)}
        className="w-9 h-9 mr-2 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>

    {/* ── ANNOUNCEMENTS PANE ── */}
    {activeTab === "office" && (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {officeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p className="text-sm">No announcements yet</p>
            </div>
          ) : (
            officeMessages.map((msg: any) => (
              <div key={msg.id} className="p-3 rounded-xl bg-orange-50 border-l-[3px] border-orange-400">
                <div className="text-[11px] font-semibold text-orange-700 mb-1 uppercase tracking-wide">
                  {msg.created_by}
                </div>
                <div className="text-[13px] text-gray-800 leading-relaxed">{msg.message}</div>
              </div>
            ))
          )}
        </div>

        {canSendOfficeMessage && (
          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={officeText}
                onChange={(e) => setOfficeText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOfficeMessage()}
                placeholder="Write an announcement..."
                className="flex-1 text-[13px] px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
              <button
                onClick={sendOfficeMessage}
                className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    )}

    {/* ── MESSAGES PANE ── */}
    {activeTab === "employee" && (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Array.isArray(employeeMessages) && employeeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            Array.isArray(employeeMessages) && employeeMessages.map((msg: any) => {
              const myEmployeeId = Number(localStorage.getItem("employee_id"));
              const isMyMessage = Number(msg.employee_id) === myEmployeeId;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${isMyMessage ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {msg.employee_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className={`flex flex-col gap-1 max-w-[68%] ${isMyMessage ? "items-end" : "items-start"}`}>
                    {!isMyMessage && (
                      <span className="text-[11px] text-gray-400 ml-1">{msg.employee_name}</span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
                      ${isMyMessage
                        ? "bg-blue-500 text-white rounded-br-[4px]"
                        : "bg-gray-100 text-gray-900 rounded-bl-[4px]"}`}>
                      {msg.message}
                    </div>
                    <span className="text-[11px] text-gray-400 mx-1">
                      {isMyMessage ? "You" : ""}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatMessagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3 relative">
          {selectedUser && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[12px] text-blue-700 font-medium">
                <UserIcon className="w-3 h-3" />
                {selectedUser.first_name} {selectedUser.last_name}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="ml-1 hover:text-red-500 font-bold leading-none"
                >×</button>
              </div>
            </div>
          )}

          {showMentionDropdown && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-44 overflow-y-auto">
              {mentionResults.length > 0 ? mentionResults.map((emp: any) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedUser(emp);
                    setMessageText("");
                    setShowMentionDropdown(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                    {emp.first_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-gray-900">{emp.first_name} {emp.last_name}</div>
                    <div className="text-[11px] text-gray-400">{emp.designation || `ID: ${emp.employee_id}`}</div>
                  </div>
                </div>
              )) : (
                <div className="px-4 py-3 text-[13px] text-gray-400">No match found</div>
              )}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={messageText}
              onChange={(e) => {
                const value = e.target.value;
                setMessageText(value);
                const match = value.match(/@(\w*)$/);
                if (match) {
                  const kw = match[1].toLowerCase();
                  setMentionResults(employees.filter((emp: any) =>
                    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(kw)
                  ));
                  setShowMentionDropdown(true);
                } else {
                  setShowMentionDropdown(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!selectedUser) return;
                  sendMessage();
                }
              }}
              placeholder="Type @name to mention someone..."
              className="flex-1 text-[13px] px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <button
              onClick={() => {
                if (!selectedUser) {
                  alert("Please select a user using @mention");
                  return;
                }
                sendMessage();
              }}
              className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Type <span className="text-blue-500 font-medium">@</span> to mention a colleague
          </p>
        </div>
      </div>
    )}
  </div>
)}
      
    </div>
  );
};

export default DashboardLayout;