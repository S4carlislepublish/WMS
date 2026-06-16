import React from 'react';

interface PopupState {
  show: boolean;
  type: string;
  title: string;
  message: string;
}

interface PopupModalProps {
  popup: PopupState;
  onClose: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ popup, onClose }) => {
  if (!popup.show) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl overflow-hidden">
        <div className={`px-6 py-4 text-white font-semibold ${
          popup.type === "success" ? "bg-green-600" :
          popup.type === "error" ? "bg-red-600" :
          popup.type === "warning" ? "bg-yellow-500" : "bg-blue-600"
        }`}>
          {popup.title}
        </div>
        <div className="p-6 text-center">
          <div className="text-5xl mb-4">
            {popup.type === "success" ? "✅" :
             popup.type === "error" ? "❌" :
             popup.type === "warning" ? "⚠️" : "ℹ️"}
          </div>
          <p className="text-gray-700">{popup.message}</p>
          <button onClick={onClose} className="mt-5 bg-gray-800 text-white px-5 py-2 rounded-lg">OK</button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;