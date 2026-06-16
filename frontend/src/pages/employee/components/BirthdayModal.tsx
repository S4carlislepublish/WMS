import React from 'react';

interface BirthdayModalProps {
  birthdayEmployees: any[];
  isMyBirthday: boolean;
  currentEmployee: any;
  user: any;
  onClose: () => void;
  onSendWish: (emp: any) => void;
}

const BirthdayModal: React.FC<BirthdayModalProps> = ({
  birthdayEmployees,
  isMyBirthday,
  currentEmployee,
  user,
  onClose,
  onSendWish,
}) => {
  if (isMyBirthday) {
    return (
      <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-pink-500 via-purple-600 to-orange-400 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-pulse opacity-20">
          <div className="absolute top-10 left-20 text-8xl">🎉</div>
          <div className="absolute top-32 right-32 text-7xl">🎂</div>
          <div className="absolute bottom-20 left-40 text-8xl">🎈</div>
          <div className="absolute bottom-32 right-20 text-7xl">🎊</div>
        </div>
        <div className="relative bg-white rounded-[40px] shadow-2xl w-[900px] max-w-[95%] p-10 text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-red-500 text-white text-2xl hover:bg-red-600"
          >✕</button>
          <h1 className="text-6xl font-extrabold text-pink-600 mb-4">🎂 HAPPY BIRTHDAY 🎂</h1>
          <p className="text-gray-600 text-xl mb-8">Wishing you a day filled with happiness, success and wonderful memories.</p>
          <img
            src={`http://10.1.8.103:5000/api/employees/image/${currentEmployee?.id}`}
            alt="Birthday"
            className="w-52 h-52 rounded-full object-cover border-[8px] border-pink-300 mx-auto shadow-2xl"
            onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
          />
          <h2 className="mt-8 text-4xl font-bold text-gray-800">{user?.full_name}</h2>
          <div className="mt-6 bg-pink-50 border border-pink-200 rounded-2xl p-6">
            <p className="text-lg text-gray-700 leading-8">
              May your special day bring you happiness, prosperity, good health, and great success in both your personal and professional life.
            </p>
          </div>
          <div className="mt-8 text-2xl font-semibold text-pink-600">🎉 Have a Wonderful Year Ahead 🎉</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-5 right-5 z-[9999] w-[380px]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-5 py-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-base">🎉 Today's Birthdays</h2>
          <button onClick={onClose} className="text-white text-xl leading-none hover:opacity-80 transition-opacity">✕</button>
        </div>
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
          {birthdayEmployees.map((emp: any) => (
            <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              <img
                src={`http://10.1.8.103:5000/api/employees/image/${emp.id}`}
                alt={emp.first_name}
                className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
                onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{emp.first_name} {emp.last_name}</h3>
                <p className="text-xs text-gray-500 truncate">{emp.designation}</p>
                <p className="text-xs text-gray-700 font-medium mt-0.5">🎂 Birthday Today</p>
              </div>
              <button
                onClick={() => onSendWish(emp)}
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
    </div>
  );
};

export default BirthdayModal;