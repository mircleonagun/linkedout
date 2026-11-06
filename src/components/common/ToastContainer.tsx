import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-18 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#211F1D] dark:bg-[#2C2926] text-[#F7F4EF] rounded-xl shadow-xl border border-[#3E3A35] text-xs sm:text-sm animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#78917C] shrink-0" />
              ) : toast.type === 'warm' ? (
                <Sparkles className="w-4 h-4 text-[#F47736] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#B3ABA0] shrink-0" />
              )}
              <span className="font-medium tracking-tight leading-snug">{toast.text}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#9E958B] hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
