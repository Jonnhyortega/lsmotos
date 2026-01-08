"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, X, Info } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success": return <Check size={18} className="text-green-400" />;
      case "error": return <AlertCircle size={18} className="text-red-400" />;
      default: return <Info size={18} className="text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success": return "bg-[#111] border-green-500/20";
      case "error": return "bg-[#111] border-red-500/20";
      default: return "bg-[#111] border-blue-500/20";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`pointer-events-auto min-w-[300px] p-4 rounded-lg border shadow-xl flex items-center gap-3 ${getStyles()}`}
    >
      <div className="shrink-0">{getIcon()}</div>
      <p className="text-sm font-medium text-white flex-1">{toast.message}</p>
      <button 
        onClick={() => onRemove(toast.id)}
        className="text-white/30 hover:text-white transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
