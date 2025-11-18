import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextId, setNextId] = useState(1);

  const addToast = (type: ToastType, message: string) => {
    const id = nextId;
    setNextId(nextId + 1);
    setToasts([...toasts, { id, type, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const toastStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
    warning: 'bg-orange-600 border-orange-500',
  };

  const toastIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Notification Toast</h1>
        <p className="text-gray-300 mb-8">
          Test toast notifications with different types and auto-dismiss functionality.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Trigger Toasts</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => addToast('success', 'Operation completed successfully!')}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={() => addToast('error', 'An error occurred. Please try again.')}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Error Toast
            </button>
            <button
              onClick={() => addToast('info', 'Here is some helpful information.')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Info Toast
            </button>
            <button
              onClick={() => addToast('warning', 'Warning: Please review your input.')}
              className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Warning Toast
            </button>
          </div>

          <button
            onClick={() => {
              addToast('success', 'First toast');
              setTimeout(() => addToast('info', 'Second toast'), 500);
              setTimeout(() => addToast('warning', 'Third toast'), 1000);
            }}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Queue Multiple Toasts
          </button>
        </div>

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2" data-testid="toast-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              data-testid={`toast-${toast.type}`}
              className={`${toastStyles[toast.type]} border-l-4 text-white p-4 rounded-md shadow-lg flex items-center justify-between min-w-[300px] animate-slide-in`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{toastIcons[toast.type]}</span>
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
