

import React, { useEffect } from 'react';
import { SuccessIcon, ErrorIcon, InfoIcon, CloseIcon } from './icons/Icon';
import { ToastMessage } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const icons = {
  success: <SuccessIcon className="w-5 h-5" />,
  error: <ErrorIcon className="w-5 h-5" />,
  info: <InfoIcon className="w-5 h-5" />,
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const Toast: React.FC<ToastProps> = React.memo(({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`relative flex items-center p-4 mb-3 text-white rounded-md shadow-lg w-full max-w-sm transform transition-all duration-300 ease-in-out animate-fade-in-right ${colors[toast.type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex items-center justify-center hover:bg-white/20 focus:outline-none"
        aria-label="Close"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
});

export default Toast;