// hooks/useToast.ts

import { toast, ToastOptions } from 'react-toastify';

export const useToast = () => {
  const defaultOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 2000,
  };

  return {
    success: (message: string | React.ReactNode, options?: ToastOptions) =>
      toast.success(message, { ...defaultOptions, ...options }),
    error: (message: string | React.ReactNode, options?: ToastOptions) =>
      toast.error(message, { ...defaultOptions, ...options }),
    info: (message: string | React.ReactNode, options?: ToastOptions) =>
      toast.info(message, { ...defaultOptions, ...options }),
    warning: (message: string | React.ReactNode, options?: ToastOptions) =>
      toast.warning(message, { ...defaultOptions, ...options }),
    show: (message: string | React.ReactNode, options?: ToastOptions) =>
      toast(message, { ...defaultOptions, ...options }),
  };
};