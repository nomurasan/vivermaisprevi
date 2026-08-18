import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, HeartHandshake, X, MessageSquare } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#12B8AE] shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F7F6] text-[#0A988F] flex items-center justify-center shrink-0 border border-[#B4EBE6]">
              {toastMessage.type === 'connection' ? (
                <HeartHandshake className="w-5 h-5 text-[#0A988F]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-[#163A63] leading-snug">
                {toastMessage.title}
              </h4>
              <p className="text-xs text-[#5A6F82] leading-relaxed">
                {toastMessage.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setToastMessage(null)}
            className="text-[#8FA3B8] hover:text-[#163A63] p-1 rounded-lg hover:bg-[#F4F7FA] transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {toastMessage.actionLabel && toastMessage.onAction && (
          <div className="pt-2 border-t border-[#EEF3F7] flex items-center justify-end gap-2">
            <button
              onClick={() => {
                toastMessage.onAction?.();
                setToastMessage(null);
              }}
              className="px-4 py-2 bg-[#12B8AE] hover:bg-[#0A988F] text-[#163A63] hover:text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{toastMessage.actionLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
