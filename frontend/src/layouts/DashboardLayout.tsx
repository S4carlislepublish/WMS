import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HomeIcon,
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
  SparklesIcon,
  ClockIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
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
  
  // Real conversational state starts here
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hello! I'm your WMS AI Assistant. I can help you dig into your live metrics, evaluate current workloads, or figure out what's lagging behind.\n\nTry checking out your workspace updates:\n• **Show overdue projects**\n• **Check employee workload**\n• **Generate SLA reports**\n\nWhat can I look into for you today?",
      timestamp: new Date(),
    },
  ]);
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

  const getSidebarItems = () => {
  // Admin & Super Admin
  if (user?.role === "Admin" || user?.role === "Super Admin") {
    return [
      { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
      { name: "Projects", icon: FolderIcon, path: "/projects" },
      { name: "Clients", icon: UserGroupIcon, path: "/clients" },
      { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
      { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // Project Manager
  if (user?.role === "Project Manager") {
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

  // Pre-Editing
  if (user?.role === "Pre-Editing") {
    return [
          { name: "Dashboard", icon: HomeIcon, path: "/employee-dashboard" },

      { name: "Assigned Projects", icon: FolderIcon, path: "/pre-editing" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // Copywriting
  if (user?.role === "Copywriting") {
    return [
          { name: "Dashboard", icon: HomeIcon, path: "/employee-dashboard" },

      { name: "Copywriting", icon: FolderIcon, path: "/copywriting" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // QA
  if (user?.role === "Quality Analyst (QA)") {
    return [
          { name: "Dashboard", icon: HomeIcon, path: "/employee-dashboard" },

      { name: "QA Review", icon: FolderIcon, path: "/qa" },
      { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    ];
  }

  // HR
if (user?.role === "HR") {
  return [

    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },

    {
      name: "HR Management",
      icon: UserGroupIcon,
      path: "/hrms",
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

  // Default
  return [
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "Projects", icon: FolderIcon, path: "/projects" },
    { name: "Reports", icon: ChartBarIcon, path: "/reports" },
  ];
};

  const sidebarItems = getSidebarItems();

  const reportLinks = [
    { name: "Schedule Report", icon: DocumentChartBarIcon, path: "/reports/schedule", state: { tab: "schedule" } },
    { name: "Team Schedule", icon: ClockIcon, path: "/reports/today-schedule", state: { tab: "today" } },
    { name: "Project Info", icon: PresentationChartLineIcon, path: "/reports/project-schedule", state: { tab: "project" } },
  ];

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const employeeId = localStorage.getItem("employee_id");

const profileImageUrl =
  `http://10.1.8.103:5000/api/employees/image/${employeeId}`;

  return (
    <div className="min-h-screen bg-gray-900">
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
      
    </div>
  );
};

export default DashboardLayout;