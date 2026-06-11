import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {socket} from "../services/socket";
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

  const [activeTab, setActiveTab] = useState<
  "office" | "employee"
>("employee");
const [officeText, setOfficeText] =
  useState("");

const canSendOfficeMessage =
  user?.role === "HR" ||
  user?.role === "Admin" ||
  user?.role === "Super Admin";




const [officeMessages, setOfficeMessages] =
  useState([]);

const [employeeMessages, setEmployeeMessages] = useState<any[]>([]);



  

  const [employees, setEmployees] = useState<any[]>([]);

  const [realtimeMessages,setRealtimeMessages] = useState<any[]>([]);

const [showMentionDropdown, setShowMentionDropdown] =
  useState(false);

const [mentionResults, setMentionResults] =
  useState<any[]>([]);


  
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
    toast.success("Logged out successfully");
    navigate("/login");
  };


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
  useState(true);

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





  return (
    <div className="min-h-screen bg-gray-900">
      {showPopup &&
reportingEmployees.length > 0 && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-[800px] max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            Yesterday Attendance Summary
          </h2>
        </div>
        
        <button
          onClick={() => setShowPopup(false)}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
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
            {reportingEmployees.map(
              (emp: any, idx: number) => (
                <tr
                  key={emp.employee_id}
                  className={`
                    border-b border-gray-50 hover:bg-gray-50 transition-colors
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
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
      className="w-10 h-10 rounded-full object-cover border"
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
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          emp.status === 'Present'
                            ? 'bg-green-100 text-green-700'
                            : emp.status === 'Absent'
                            ? 'bg-red-100 text-red-700'
                            : emp.status === 'Late'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {emp.status === 'Present' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      )}
                      {emp.status === 'Absent' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                      {emp.status === 'Late' && (
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                      {emp.check_in}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
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
    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
    onClick={() => viewAttendance(emp)}
  >
    View
  </button>
</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Footer Stats */}
        <div className="mt-6 flex gap-4">
          <div className="bg-green-50 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            <span className="text-sm font-semibold text-green-700">
              {reportingEmployees.filter(e => e.status === 'Present').length} Present
            </span>
          </div>
          <div className="bg-red-50 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="text-sm font-semibold text-red-700">
              {reportingEmployees.filter(e => e.status === 'Absent').length} Absent
            </span>
          </div>
          <div className="bg-blue-50 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4362EE" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
            <span className="text-sm font-semibold text-blue-700">
              Total: {reportingEmployees.length} Employees
            </span>
          </div>
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
  <div
    className="
      fixed
      bottom-6
      right-6
      w-[480px]
      h-[650px]
      bg-gradient-to-br
      from-gray-50
      to-white
      rounded-3xl
      shadow-2xl
      z-50
      overflow-hidden
      flex
      flex-col
      border
      border-gray-200
    "
  >
    {/* Header */}
    <div className="flex border-b">

  <button
    onClick={() =>
      setActiveTab("office")
    }
    className={`flex-1 p-3 font-semibold ${
      activeTab === "office"
        ? "bg-red-100 text-red-700"
        : "bg-white"
    }`}
  >
    📢 Announcement
  </button>

  <button
    onClick={() =>
      setActiveTab("employee")
    }
    className={`flex-1 p-3 font-semibold ${
      activeTab === "employee"
        ? "bg-blue-100 text-blue-700"
        : "bg-white"
    }`}
  >
    💬 Employee Messages
  </button>

</div>

{activeTab === "office" && (

<div className="flex flex-col flex-1">

  {/* Messages */}

  <div className="flex-1 p-4 overflow-y-auto">

    {
  officeMessages.map(
    (msg: any) => (

      <div
        key={msg.id}
        className="p-3 border-b"
      >

        <div className="font-semibold">
          {msg.created_by}
        </div>

        <div>
          {msg.message}
        </div>

      </div>

    )
  )
}

  </div>

  {/* Only HR/Admin Can Send */}

  {canSendOfficeMessage && (

    <div className="border-t p-4">

      <input
        type="text"
        value={officeText}
        onChange={(e) =>
          setOfficeText(
            e.target.value
          )
        }
        placeholder="Type office announcement..."
        className="
          w-full
          border
          rounded-xl
          px-4
          py-3
        "
      />

      <button
        onClick={sendOfficeMessage}
        className="
          mt-2
          w-full
          bg-red-600
          hover:bg-red-700
          text-white
          rounded-xl
          py-3
        "
      >
        Send Announcement
      </button>

    </div>

  )}

</div>

)}

    

    {/* Employee Messages - Chat Area */}
    {activeTab === "employee" && (

<div className="flex-1 p-4 overflow-y-auto">
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftIcon className="w-5 h-5 text-blue-600" />
        <h4 className="font-bold text-blue-700 text-sm">Employee Messages</h4>
      </div>

      <div className="space-y-4">
        {Array.isArray(employeeMessages) &&
employeeMessages.map((msg: any) => {
          const myEmployeeId = Number(localStorage.getItem("employee_id"));
          const isMyMessage = Number(msg.employee_id) === myEmployeeId;

          return (
            <div
              key={msg.id}
              className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                {!isMyMessage && (
                  <div className="text-xs text-gray-500 mb-1 ml-1">
                    {msg.employee_name}
                  </div>
                )}
                <div
                  className={`
                    px-4 py-3 rounded-2xl shadow-sm
                    ${
                      isMyMessage
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                    }
                  `}
                >
                  <div className="text-sm">{msg.message}</div>
                </div>
                {isMyMessage && (
                  <div className="text-xs text-gray-400 mt-1 text-right mr-1">
                    You
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Input Section */}
    <div className="border-t bg-white p-4">
      {showMentionDropdown && (
        <div
          className="
            absolute
            bottom-20
            left-4
            right-4
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-xl
            max-h-40
            overflow-y-auto
            z-50
          "
        >
          {mentionResults.length > 0
            ? mentionResults.map((emp: any) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedUser(emp);
                    setMessageText(
                      messageText.replace(/@\w*$/, `@${emp.first_name} `)
                    );
                    setShowMentionDropdown(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {emp.first_name} {emp.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {emp.employee_id}
                    </div>
                  </div>
                </div>
              ))
            : (
              <div className="p-3 text-gray-500 text-sm">No user found</div>
            )}
        </div>
      )}

      <div className="flex gap-3">
        <div
          style={{
            position: "relative",
            width: "100%"
          }}
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => {
              const value = e.target.value;
              setMessageText(value);
              const match = value.match(/@(\w*)$/);

              if (match) {
                const keyword = match[1].toLowerCase();
                const filtered = employees.filter(
                  (emp: any) =>
                    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(
                      keyword
                    )
                );
                setMentionResults(filtered);
                setShowMentionDropdown(true);
              } else {
                setShowMentionDropdown(false);
              }
            }}
            placeholder="Type @name to mention someone..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
          />

          {selectedUser && (
            <div
              className="
                absolute
                bottom-full
                left-0
                mb-2
                px-3
                py-1.5
                bg-blue-50
                border
                border-blue-200
                rounded-lg
                text-xs
                font-semibold
                text-blue-700
              "
            >
              📤 Sending to: {selectedUser.first_name} {selectedUser.last_name}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (!selectedUser) {
              alert("Please select user using @mention");
              return;
            }
            sendMessage();
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        💡 Tip: Type <span className="font-semibold text-blue-600">@</span> to mention an employee
      </div>
    </div>
  </div>
)}

</div>

)}
      
    </div>
  );
};

export default DashboardLayout;