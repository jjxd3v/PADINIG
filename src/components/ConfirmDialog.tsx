import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
              {description ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 min-h-[44px] py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors"
              >
                {cancelText}
              </button>
              <button
                ref={confirmButtonRef}
                onClick={onConfirm}
                className={`flex-1 min-h-[44px] py-3 px-4 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm ${
                  danger ? 'bg-emergency hover:bg-emergency-dark' : 'bg-primary hover:bg-primary-light'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

