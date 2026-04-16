import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

export function AccountSettingsPage() {
  return (
    <AdminLayout title="Account Settings">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-primary dark:text-primary-light" />
              Security
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your account security settings.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <Lock size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-white">Change Password</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Password change UI can be connected once the backend endpoint is confirmed.
                </p>
              </div>
              <button
                type="button"
                className="min-h-[44px] px-5 py-3 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold text-sm hover:bg-primary/15 dark:hover:bg-primary/25 transition-colors"
                disabled
                title="Coming soon"
              >
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

