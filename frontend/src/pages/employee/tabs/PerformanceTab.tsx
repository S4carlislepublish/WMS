import React from 'react';
import {
  SparklesIcon, CheckBadgeIcon, CheckCircleIcon, ChartBarIcon,
  ClockIcon, UserGroupIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../components/StatCard';
import { performanceData, teamRanking } from '../data/employeeMockData';

const PerformanceTab: React.FC = () => {
  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Performance</h2>
        <p className="text-sm text-gray-500">Track your performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={SparklesIcon} title="Efficiency Score" value={`${performanceData.efficiencyScore}%`} subtitle="Your score" trend="positive" color="blue" />
        <StatCard icon={CheckBadgeIcon} title="Quality Score" value={`${performanceData.qualityScore}%`} subtitle="Your score" trend="positive" color="green" />
        <StatCard icon={CheckCircleIcon} title="Tasks Completed" value={performanceData.tasksCompleted} subtitle="This month" trend="+8%" color="purple" />
        <StatCard icon={ChartBarIcon} title="Productivity" value={`${performanceData.productivity}%`} subtitle="Your score" trend="positive" color="yellow" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {[
              { label: "Efficiency", value: performanceData.efficiencyScore, color: "bg-blue-600" },
              { label: "Quality", value: performanceData.qualityScore, color: "bg-green-600" },
              { label: "Productivity", value: performanceData.productivity, color: "bg-purple-600" },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`${metric.color} h-2 rounded-full transition-all`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Ranking</h3>
          <div className="space-y-3">
            {teamRanking.map((member) => (
              <div key={member.rank} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  member.rank === 1 ? 'bg-yellow-500' : member.rank === 2 ? 'bg-gray-400' :
                  member.rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                }`}>{member.rank}</div>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Top Performer", icon: SparklesIcon, color: "yellow" },
            { name: "Quality Expert", icon: CheckBadgeIcon, color: "green" },
            { name: "Fast Deliverer", icon: ClockIcon, color: "blue" },
            { name: "Team Player", icon: UserGroupIcon, color: "purple" },
          ].map((badge) => (
            <div key={badge.name} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 bg-${badge.color}-100 rounded-full flex items-center justify-center mb-2`}>
                <badge.icon className={`w-6 h-6 text-${badge.color}-600`} />
              </div>
              <p className="text-xs font-medium text-gray-900 text-center">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PerformanceTab;