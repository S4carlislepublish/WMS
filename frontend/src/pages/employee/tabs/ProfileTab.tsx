import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { employeeData, tasksData, performanceData } from '../data/employeeMockData';

const ProfileTab: React.FC = () => {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500">Manage your personal information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
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
                <PencilIcon className="w-4 h-4" />Edit Profile
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Employee ID", value: employeeData.employeeId },
              { label: "Department", value: employeeData.department },
              { label: "Email", value: employeeData.email },
              { label: "Phone", value: employeeData.phone },
              { label: "Manager", value: employeeData.manager },
              { label: "Joining Date", value: employeeData.joiningDate },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                <p className="text-sm font-medium text-gray-900">{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { label: "Tasks This Month", value: tasksData.length, color: "text-gray-900" },
              { label: "Completion Rate", value: "87%", color: "text-green-600" },
              { label: "Avg. Efficiency", value: `${performanceData.efficiencyScore}%`, color: "text-blue-600" },
              { label: "Attendance", value: "96%", color: "text-purple-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {["Current Password", "New Password", "Confirm Password"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Update Password
        </button>
      </div>

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
  );
};

export default ProfileTab;