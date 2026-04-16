import React, { useEffect, useMemo, useState } from 'react';
import { Save, User } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../components/AdminLayout';
import { apiFetch } from '../lib/api';
import { getAuthUser, updateAuthUser } from '../lib/auth';

type ProfileForm = {
  name: string;
  username: string;
  email: string;
  contactNumber: string;
  purok: string;
};

export function AdminProfilePage() {
  const user = useMemo(() => getAuthUser(), []);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    purok: user?.purok || '',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in again.');
    }
  }, [user]);

  const onChange = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const updated = await apiFetch<{
        id: string;
        username: string;
        email?: string | null;
        name: string;
        role: string;
        purok?: string | null;
        contactNumber?: string | null;
        isActive: boolean;
      }>(`/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email || null,
          contactNumber: form.contactNumber || null,
          purok: form.purok || null,
        }),
      });

      updateAuthUser({
        name: updated.name,
        username: updated.username,
        email: updated.email ?? null,
        contactNumber: updated.contactNumber ?? null,
        purok: updated.purok ?? null,
      });

      toast.success('Profile updated successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="My Profile">
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <User size={18} className="text-primary dark:text-primary-light" />
              Profile Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update your admin profile information.
            </p>
          </div>

          <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  value={form.username}
                  onChange={(e) => onChange('username', e.target.value)}
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Number (optional)
                </label>
                <input
                  value={form.contactNumber}
                  onChange={(e) => onChange('contactNumber', e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mono"
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Purok / Zone (optional)
              </label>
              <input
                value={form.purok}
                onChange={(e) => onChange('purok', e.target.value)}
                className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="e.g., Purok 1"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving || !user}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

