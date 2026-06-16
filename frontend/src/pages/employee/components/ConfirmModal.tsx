import React from 'react';

interface ConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[999999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[450px] shadow-2xl">
        <div className="bg-red-600 text-white p-4 text-lg font-semibold">Confirm Check Out</div>
        <div className="p-6">
          <div className="text-center text-5xl mb-4">⚠️</div>
          <p className="text-center text-gray-700">Are you sure you want to Check Out?</p>
          <p className="text-center text-sm text-gray-500 mt-2">After checkout, you cannot check in again today.</p>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={onCancel} className="px-5 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white rounded-lg">Yes, Check Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;