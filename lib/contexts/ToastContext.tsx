"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  isClosing: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, isClosing: false }]);

    // Start exit animation after 3.2 seconds
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t)),
      );
    }, 3200);

    // Final removal after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container*/}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
        {/* Real Toasts */}
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ type, message, isClosing }: ToastMessage) {
  const styles = {
    success:
      "bg-[#DCFCE7] border-[#8BF7D0] text-[#166534] dark:bg-[#22C55E]/20 dark:border-[#22C55E]/50 dark:text-[#4ADE80]",
    error:
      "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] dark:bg-[#F20D33]/20 dark:border-[#F20D33]/50 dark:text-[#F87171]",
    info: "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E] dark:bg-[#FBBF24]/20 dark:border-[#FBBF24]/50 dark:text-[#FBBF24]",
  };

  return (
    <div
      className={`
        pointer-events-auto
        px-6 py-4 rounded-2xl border-2 shadow-xl backdrop-blur-md
        flex items-center gap-3 min-w-[280px] max-w-[400px]
        ${isClosing ? "animate-toast-out" : "animate-toast-in"}
        ${styles[type]}
      `}
    >
      <span className="text-sm font-bold font-lexend tracking-wide leading-tight">
        {message}
      </span>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
