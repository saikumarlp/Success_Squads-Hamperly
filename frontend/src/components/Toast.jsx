import React, { useEffect } from 'react';

/**
 * Individual luxury Toast notification
 */
export const Toast = ({ id, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className="premium-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="premium-toast-content">
        <span className="premium-toast-icon" aria-hidden="true">✨</span>
        <span className="premium-toast-message">{message}</span>
      </div>
      <button 
        type="button" 
        className="premium-toast-close" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

/**
 * Container to manage and stack Toast notifications
 */
export const ToastContainer = ({ toasts, onCloseToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="premium-toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          duration={toast.duration}
          onClose={onCloseToast}
        />
      ))}
    </div>
  );
};
