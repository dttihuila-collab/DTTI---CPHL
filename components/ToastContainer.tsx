
import React, { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
