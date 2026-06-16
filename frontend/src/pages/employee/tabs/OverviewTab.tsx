import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon, ClockIcon, CalendarDaysIcon, ChartBarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../components/StatCard';
import AttendanceCard from '../components/AttendanceCard';
import { tasksData, notificationsData, activityData, upcomingDeadlines } from '../data/employeeMockData';
import { getPriorityColor } from '../utils/employeeHelpers';

interface OverviewTabProps {
  isCheckedIn: boolean;
  checkInTime: Date | null;
  timer: string;
  totalLunchSeconds: number;
  totalTeaSeconds: number;
  isLunchBreak: boolean;
  isTeaBreak: boolean;
  currentEmployee: any;
  user: any;
  onCheckInOut: () => void;
  onLunchBreak: () => void;
  onTeaBreak: () => void;
  itemVariants: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  isCheckedIn, checkInTime, timer, totalLunchSeconds, totalTeaSeconds,
  isLunchBreak, isTeaBreak, currentEmployee, user,
  onCheckInOut, onLunchBreak, onTeaBreak, itemVariants,
}) => {
  return (
    <>
      <motion.div variants={itemVariants}>
        <AttendanceCard
          isCheckedIn={isCheckedIn}
          checkInTime={checkInTime}
          timer={timer}
          totalLunchSeconds={totalLunchSeconds}
          totalTeaSeconds={totalTeaSeconds}
          isLunchBreak={isLunchBreak}
          isTeaBreak={isTeaBreak}
          currentEmployee={currentEmployee}
          user={user}
          onCheckInOut={onCheckInOut}
          onLunchBreak={onLunchBreak}
          onTeaBreak={onTeaBreak}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircleIcon} title="Assigned Tasks" value={tasksData.length} subtitle="This month" trend="+12%" color="blue" />
        <StatCard icon={CheckBadgeIcon} title="Completed Tasks" value={tasksData.filter(t => t.status === 'Completed').length} subtitle="This month" trend="+8%" color="green" />
        <StatCard icon={ClockIcon} title="Pending Tasks" value={tasksData.filter(t => t.status === 'Pending' || t.status === 'In Progress').length} subtitle="Needs attention" trend="urgent" color="yellow" />
        <StatCard icon={CalendarDaysIcon} title="Leave Balance" value="12" subtitle="Days remaining" trend="normal" color="purple" />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityData.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-blue-600" />
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
                <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'announcement' ? 'bg-blue-50 border-blue-500' :
                  notification.type === 'reminder' ? 'bg-yellow-50 border-yellow-500' :
                  notification.type === 'alert' ? 'bg-red-50 border-red-500' :
                  'bg-gray-50 border-gray-500'
                }`}>
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
  );
};

export default OverviewTab;