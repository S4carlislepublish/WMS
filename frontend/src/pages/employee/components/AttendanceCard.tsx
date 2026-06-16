import React from 'react';

interface AttendanceCardProps {
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
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  isCheckedIn,
  checkInTime,
  timer,
  totalLunchSeconds,
  totalTeaSeconds,
  isLunchBreak,
  isTeaBreak,
  currentEmployee,
  user,
  onCheckInOut,
  onLunchBreak,
  onTeaBreak,
}) => {
  return (
    <div className="w-full max-w-10xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Employee Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4 h-[10px]">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={
                currentEmployee?.id
                  ? `http://10.1.8.103:5000/api/employees/image/${currentEmployee.id}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {user?.full_name || "Employee Name"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {user?.role || "Employee"}
              </span>
              <span className="text-gray-300 text-xs">|</span>
              <span className="text-xs text-gray-500">{user?.team || "Pre-Editing"}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
          isCheckedIn
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-gray-50 border-gray-200 text-gray-500"
        }`}>
          <div className={`w-2 h-2 rounded-full ${isCheckedIn ? "bg-green-500" : "bg-gray-400"}`} />
          {isCheckedIn ? "On Shift" : "Off Shift"}
        </div>
      </div>

      {/* Three Column Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Working Hours</p>
          <p className="text-2xl font-bold font-mono text-gray-900 leading-none tracking-tight">{timer}</p>
          {checkInTime && (
            <p className="text-xs text-gray-400 mt-2">
              Since <span className="text-gray-700 font-medium">
                {checkInTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          )}
        </div>

        <div className="px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Lunch Break</p>
          <p className="text-2xl font-bold font-mono text-gray-900 leading-none">
            {Math.floor(totalLunchSeconds / 60)}
            <span className="text-lg font-medium text-gray-400 ml-1">min</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {isLunchBreak
              ? <span className="text-orange-600 font-medium">● Break running</span>
              : "Lunch break duration"}
          </p>
        </div>

        <div className="px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Tea Break</p>
          <p className="text-2xl font-bold font-mono text-gray-900 leading-none">
            {Math.floor(totalTeaSeconds / 60)}
            <span className="text-lg font-medium text-gray-400 ml-1">min</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {isTeaBreak
              ? <span className="text-green-600 font-medium">● Break running</span>
              : "Tea break duration"}
          </p>
        </div>
      </div>

      {/* Total Break Row */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Break Time</p>
        <p className="text-sm font-bold text-gray-900">
          {Math.floor((totalLunchSeconds + totalTeaSeconds) / 60)} min
        </p>
      </div>

      {/* Active Break Alerts */}
      {(isLunchBreak || isTeaBreak) && (
        <div className="px-6 py-3 border-b border-gray-100 flex flex-col gap-2">
          {isLunchBreak && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <span className="text-sm">🍱</span>
              <p className="text-xs text-orange-700 flex-1">
                Lunch break is active — click <strong>Stop Lunch</strong> before resuming work.
              </p>
            </div>
          )}
          {isTeaBreak && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
              <span className="text-sm">☕</span>
              <p className="text-xs text-yellow-700 flex-1">
                Tea break is active — click <strong>Stop Tea</strong> before resuming work.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-4 grid grid-cols-3 gap-3">
        <button
          onClick={onCheckInOut}
          className={`py-3 rounded-xl text-sm font-bold text-white transition-all ${
            isCheckedIn ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>

        <button
          onClick={onLunchBreak}
          disabled={!isCheckedIn}
          className={`py-3 rounded-xl text-sm font-bold border transition-all ${
            !isCheckedIn
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              : isLunchBreak
              ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
              : "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
          }`}
        >
          {!isCheckedIn ? "🔒 Check In Required" : isLunchBreak ? "⏹ Stop Lunch" : "🍱 Lunch Break"}
        </button>

        <button
          onClick={onTeaBreak}
          disabled={!isCheckedIn}
          className={`py-3 rounded-xl text-sm font-bold border transition-all ${
            !isCheckedIn
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
              : isTeaBreak
              ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
              : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
          }`}
        >
          {!isCheckedIn ? "🔒 Check In Required" : isTeaBreak ? "⏹ Stop Tea" : "☕ Tea Break"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceCard;