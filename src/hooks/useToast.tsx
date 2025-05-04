import { createContext, useContext, ReactNode } from 'react';
import { toast as hotToast, Toaster } from 'react-hot-toast';

// Define the context shape
interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Toast implementation using theme colors
  const success = (message: string) => {
    hotToast.success(message, {
      style: {
        background: 'var(--color-success)',
        color: 'var(--color-success-content)',
        fontWeight: 'bold',
      },
      duration: 3000,
    });
  };

  const error = (message: string) => {
    hotToast.error(message, {
      style: {
        background: 'var(--color-error)',
        color: 'var(--color-error-content)',
        fontWeight: 'bold',
      },
      duration: 4000,
    });
  };

  const info = (message: string) => {
    hotToast(message, {
      style: {
        background: 'var(--color-info)',
        color: 'var(--color-info-content)',
        fontWeight: 'bold',
      },
      duration: 3000,
    });
  };

  const warning = (message: string) => {
    hotToast(message, {
      style: {
        background: 'var(--color-warning)',
        color: 'var(--color-warning-content)',
        fontWeight: 'bold',
      },
      duration: 3500,
      icon: '⚠️',
    });
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <Toaster position="top-center" />
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 