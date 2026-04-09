import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    warning: <AlertCircle className="text-yellow-500" size={24} />
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700'
  };

  return (
    <div className={`fixed top-24 right-6 z-[100] ${bgColors[type]} border-2 rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-slide-in max-w-md`}>
      {icons[type]}
      <p className="font-medium dark:text-white">{message}</p>
      <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">×</button>
    </div>
  );
};

export default Toast;
