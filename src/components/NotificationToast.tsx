import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, dismissNotification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-stone-900 text-stone-100 shadow-xl border border-stone-700 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="mt-0.5">
        {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {notification.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
        {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
      </div>

      <div className="flex-1 text-xs leading-relaxed font-light text-stone-200">
        {notification.message}
      </div>

      <button
        onClick={dismissNotification}
        className="text-stone-400 hover:text-white p-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
