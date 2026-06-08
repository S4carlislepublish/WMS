import React, { useState } from "react";
import {
  CurrencyRupeeIcon,
  UserGroupIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const AllPagesDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: HomeIcon },
    { id: "employees", name: "Employees", icon: UsersIcon },
    { id: "payroll", name: "Payroll", icon: CurrencyRupeeIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "reports", name: "Reports", icon: DocumentTextIcon },
    { id: "settings", name: "Settings", icon: CogIcon },
  ];

  const stats = [
    { label: "Total Employees", value: "1,248", change: "+42", icon: UserGroupIcon, color: "blue" },
    { label: "Monthly Payroll", value: "₹4.87 Cr", change: "+12%", icon: CurrencyRupeeIcon, color: "green" },
    { label: "Pending Approvals", value: "7", change: "Action Required", icon: ClockIcon, color: "orange" },
    { label: "Payslips Generated", value: "1,248", change: "100%", icon: DocumentTextIcon, color: "purple" },
  ];

  const departments = [
    { name: "Development", employees: 420, payroll: "₹1.45 Cr", avgSalary: "₹34,523" },
    { name: "Pre-Editing", employees: 285, payroll: "₹82 L", avgSalary: "₹28,772" },
    { name: "QA", employees: 198, payroll: "₹64 L", avgSalary: "₹32,323" },
    { name: "Copywriting", employees: 156, payroll: "₹58 L", avgSalary: "₹37,179" },
    { name: "HR", employees: 89, payroll: "₹32 L", avgSalary: "₹35,955" },
    { name: "Finance", employees: 54, payroll: "₹28 L", avgSalary: "₹51,851" },
  ];

  const employees = [
    { id: 1, name: "Murugan S", email: "murugan@company.com", dept: "Pre-Editing", salary: "₹45,000", status: "Active", joined: "2024-03-15", phone: "+91 9876543210" },
    { id: 2, name: "John David", email: "john@company.com", dept: "QA", salary: "₹55,000", status: "Active", joined: "2023-11-20", phone: "+91 9876543211" },
    { id: 3, name: "Arun Kumar", email: "arun@company.com", dept: "Development", salary: "₹75,000", status: "Active", joined: "2023-06-10", phone: "+91 9876543212" },
    { id: 4, name: "Rajesh Kumar", email: "rajesh@company.com", dept: "Copywriting", salary: "₹40,000", status: "Active", joined: "2024-01-05", phone: "+91 9876543213" },
    { id: 5, name: "Priya Sharma", email: "priya@company.com", dept: "HR", salary: "₹52,000", status: "On Leave", joined: "2023-09-18", phone: "+91 9876543214" },
    { id: 6, name: "Suresh Patel", email: "suresh@company.com", dept: "Finance", salary: "₹58,000", status: "Active", joined: "2023-07-22", phone: "+91 9876543215" },
  ];

  const payrollHistory = [
    { month: "June 2026", amount: "₹4.87 Cr", employees: 1248, status: "Completed", date: "30 Jun 2026" },
    { month: "May 2026", amount: "₹4.72 Cr", employees: 1206, status: "Completed", date: "31 May 2026" },
    { month: "April 2026", amount: "₹4.58 Cr", employees: 1189, status: "Completed", date: "30 Apr 2026" },
    { month: "March 2026", amount: "₹4.45 Cr", employees: 1165, status: "Completed", date: "31 Mar 2026" },
    { month: "February 2026", amount: "₹4.32 Cr", employees: 1142, status: "Completed", date: "28 Feb 2026" },
  ];

  const activityLog = [
    { action: "Payroll Processed", user: "Admin", time: "2 hours ago", type: "success" },
    { action: "New Employee Added", user: "HR Manager", time: "4 hours ago", type: "info" },
    { action: "Salary Revision Approved", user: "Finance Head", time: "6 hours ago", type: "success" },
    { action: "Pending Approval #2047", user: "System", time: "8 hours ago", type: "warning" },
    { action: "Payslip Generated", user: "Admin", time: "10 hours ago", type: "info" },
  ];

  const reports = [
    { name: "Salary Register", description: "Monthly salary breakdown", icon: DocumentTextIcon },
    { name: "PF Report", description: "Provident Fund contributions", icon: BanknotesIcon },
    { name: "Tax Report", description: "Tax deductions summary", icon: CurrencyRupeeIcon },
    { name: "Payroll Summary", description: "Overall payroll overview", icon: ChartBarIcon },
    { name: "Employee List", description: "Complete employee directory", icon: UsersIcon },
    { name: "Attendance Report", description: "Monthly attendance data", icon: CalendarDaysIcon },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1985A1] to-[#4CAF50] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-sm text-white/80 mt-1">Welcome back! Here's your payroll summary for June 2026</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" />
              June 2026
            </button>
            <button className="bg-white text-[#1985A1] px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Employee
            </button>
            <button className="bg-white text-[#1985A1] px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition-all flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            orange: "bg-orange-50 text-orange-600",
            purple: "bg-purple-50 text-purple-600",
          };
          return (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold ${stat.change.includes('+') || stat.change === '100%' ? 'text-green-600' : 'text-orange-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Departments & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Department Overview</h2>
              <button className="text-xs text-[#1985A1] hover:text-[#146a80] font-medium">View All</button>
            </div>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Department</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Employees</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Payroll</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Avg Salary</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-xs font-medium text-gray-900">{dept.name}</td>
                    <td className="py-3 px-3 text-xs text-gray-600">{dept.employees}</td>
                    <td className="py-3 px-3 text-xs font-semibold text-gray-900">{dept.payroll}</td>
                    <td className="py-3 px-3 text-xs text-gray-600">{dept.avgSalary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-[#1985A1] hover:text-[#146a80] font-medium py-2">View All Activity</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Total Payroll (YTD)</p>
              <h3 className="text-2xl font-bold mt-1">₹58.47 Cr</h3>
              <p className="text-xs text-blue-100 mt-1">↑ 11.4% from last year</p>
            </div>
            <BanknotesIcon className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">PF Contributions</p>
              <h3 className="text-2xl font-bold mt-1">₹38.20 L</h3>
              <p className="text-xs text-green-100 mt-1">↑ 4.1% this month</p>
            </div>
            <CurrencyRupeeIcon className="w-10 h-10 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Tax Deductions</p>
              <h3 className="text-2xl font-bold mt-1">₹54.19 L</h3>
              <p className="text-xs text-purple-100 mt-1">↑ 5.7% this month</p>
            </div>
            <DocumentTextIcon className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all employee records and details</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#1985A1] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Employee
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#1985A1]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Department</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Salary</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Joined</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1985A1] to-[#4CAF50] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-[10px] text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-xs text-gray-600">{emp.dept}</span></td>
                  <td className="py-3 px-4"><span className="text-xs font-semibold text-gray-900">{emp.salary}</span></td>
                  <td className="py-3 px-4"><span className="text-xs text-gray-600">{emp.joined}</span></td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-600 hover:text-[#1985A1] hover:bg-[#1985A1] hover:bg-opacity-10 rounded-lg"><EyeIcon className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-600 hover:text-[#1985A1] hover:bg-[#1985A1] hover:bg-opacity-10 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
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

  const renderPayroll = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-sm text-gray-500 mt-1">Process and manage employee payroll</p>
          </div>
          <button className="bg-[#1985A1] text-white px-4 py-2 rounded-lg text-xs font-medium">Process Payroll</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Month</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Employees</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollHistory.map((payroll, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs font-medium text-gray-900">{payroll.month}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-gray-900">{payroll.amount}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{payroll.employees}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{payroll.date}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{payroll.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-[#1985A1] hover:text-[#146a80] font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-sm text-gray-500 mb-6">Comprehensive payroll analytics and insights</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#1985A1] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1985A1]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{report.name}</h3>
                </div>
                <p className="text-xs text-gray-500">{report.description}</p>
                <button className="mt-3 text-xs text-[#1985A1] hover:text-[#146a80] font-medium">Download Report →</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-sm text-gray-500 mb-6">Access all payroll and employee reports</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#1985A1] bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1985A1]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{report.name}</h3>
                </div>
                <p className="text-xs text-gray-500">{report.description}</p>
                <button className="mt-3 text-xs text-[#1985A1] hover:text-[#146a80] font-medium flex items-center gap-1">
                  <ArrowDownTrayIcon className="w-3 h-3" />
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your application settings and preferences</p>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Company Name</label>
                <input type="text" defaultValue="Your Company" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1985A1]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Email</label>
                <input type="email" defaultValue="admin@company.com" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1985A1]" />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payroll Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Payroll Date</label>
                <input type="date" defaultValue="2026-06-30" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1985A1]" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Currency</label>
                <select defaultValue="INR" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1985A1]">
                  <option value="INR">₹ Indian Rupee</option>
                  <option value="USD">$ US Dollar</option>
                  <option value="EUR">€ Euro</option>
                </select>
              </div>
            </div>
          </div>

          <button className="bg-[#1985A1] text-white px-4 py-2 rounded-lg text-xs font-medium">Save Settings</button>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return renderDashboard();
      case "employees": return renderEmployees();
      case "payroll": return renderPayroll();
      case "analytics": return renderAnalytics();
      case "reports": return renderReports();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 fixed h-full z-40 transition-all`}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1985A1] to-[#4CAF50] rounded-lg flex items-center justify-center">
            <CurrencyRupeeIcon className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-sm font-bold text-gray-900">PayrollHub</h1>
              <p className="text-[10px] text-gray-500">Company Management</p>
            </div>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activePage === item.id
                    ? "bg-[#1985A1] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1`}>
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between h-14 px-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ChevronDownIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#1985A1]"
                />
              </div>

              <button className="relative p-2 text-gray-600 hover:text-[#1985A1]">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1985A1] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">AD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-gray-900">Admin User</p>
                  <p className="text-[10px] text-gray-500">HR Manager</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">{renderPage()}</main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2026 PayrollHub. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#1985A1]">Privacy</a>
              <a href="#" className="hover:text-[#1985A1]">Terms</a>
              <a href="#" className="hover:text-[#1985A1]">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AllPagesDashboard;