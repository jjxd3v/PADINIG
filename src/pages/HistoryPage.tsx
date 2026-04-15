import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  X,
  AlertTriangle,
  ChevronDown } from
'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import type { ApiAnnouncement, UiAnnouncement } from '../lib/announcements';
import { toUiAnnouncement } from '../lib/announcements';
import { apiFetch } from '../lib/api';
import { Badge } from '../components/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
export function HistoryPage() {
  const [announcements, setAnnouncements] = useState<UiAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');
  const [deleteTarget, setDeleteTarget] = useState<UiAnnouncement | null>(null);
  const categories: (string | 'All')[] = [
  'All',
  'General',
  'Health',
  'Disaster',
  'Event',
  'Government',
  'Emergency'];

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch<{ items: ApiAnnouncement[] }>('/announcements?page=1&pageSize=200');
        setAnnouncements(data.items.map(toUiAnnouncement).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Apply filters
  const filtered = announcements.filter((item) => {
    const matchesSearch =
    searchQuery === '' ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
    categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleDelete = () => {
    if (!deleteTarget) return;
    (async () => {
      try {
        await apiFetch(`/announcements/${deleteTarget.id}`, { method: 'DELETE' });
        const newAnnouncements = announcements.filter((a) => a.id !== deleteTarget.id);
        setAnnouncements(newAnnouncements);
        toast.success(`"${deleteTarget.title}" has been deleted.`);
      } catch (e: any) {
        toast.error(e?.message || 'Delete failed');
      } finally {
        setDeleteTarget(null);
      }
    })();
  };
  const activeFilterCount = categoryFilter !== 'All' ? 1 : 0;
  return (
    <AdminLayout title="Announcement History">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18} />
              
              <input
                type="text"
                placeholder="Search by title or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white dark:placeholder-slate-400" />
              
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${activeFilterCount > 0 ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  
                  <Filter size={16} /> Filter
                  {activeFilterCount > 0 &&
                  <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  }
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  
                </button>

                <AnimatePresence>
                  {filterOpen &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      y: 8,
                      scale: 0.95
                    }}
                    transition={{
                      duration: 0.15
                    }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                          Filter Announcements
                        </h4>
                        {activeFilterCount > 0 &&
                      <button
                        onClick={() => {
                          setCategoryFilter('All');
                        }}
                        className="text-xs font-medium text-primary dark:text-primary-light hover:underline">
                        
                            Clear all
                          </button>
                      }
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Category
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((cat) =>
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                            
                                {cat}
                              </button>
                          )}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <button
                        onClick={() => setFilterOpen(false)}
                        className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors">
                        
                          Apply Filters
                        </button>
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilterCount > 0 &&
          <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active filters:
              </span>
              {categoryFilter !== 'All' &&
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-medium rounded-full">
                  Category: {categoryFilter}
                  <button
                onClick={() => setCategoryFilter('All')}
                className="hover:bg-primary/20 dark:hover:bg-primary/30 rounded-full p-0.5 transition-colors">
                
                    <X size={12} />
                  </button>
                </span>
            }
            </div>
          }
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4">Title & Details</th>
                <th className="p-4">Date Sent</th>
                <th className="p-4">Category</th>
                <th className="p-4">Recipients</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((item, index) =>
              <motion.tr
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  delay: index * 0.03
                }}
                key={item.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                
                  <td className="p-4">
                    <div
                    className={`font-medium ${item.isEmergency ? 'text-emergency' : 'text-slate-800 dark:text-slate-200'}`}>
                    
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Via: {item.deliveryMethod} &middot;{' '}
                      {item.targetAudience.join(', ')}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-PH', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  </td>
                  <td className="p-4">
                    <Badge type="category" value={item.category} />
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {item.recipientsCount ?
                  item.recipientsCount.toLocaleString() :
                  '-'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 text-emergency hover:bg-emergency/10 rounded-lg transition-colors"
                    title="Delete announcement">
                    
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              )}
              {filtered.length === 0 &&
              <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search
                      size={32}
                      className="text-slate-300 dark:text-slate-600" />
                    
                      <p className="font-medium text-slate-600 dark:text-slate-400">
                        No announcements found
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div>
            Showing {filtered.length} of {announcements.length} entries
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}>
          
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-emergency/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={28} className="text-emergency" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  Delete Announcement?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Are you sure you want to delete this announcement?
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg mt-3 border border-slate-100 dark:border-slate-600">
                  "{deleteTarget.title}"
                </p>
                <p className="text-xs text-emergency mt-3 font-medium">
                  This action cannot be undone.
                </p>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 min-h-[44px] py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
                
                  No, Cancel
                </button>
                <button
                onClick={handleDelete}
                className="flex-1 min-h-[44px] py-3 px-4 bg-emergency hover:bg-emergency-dark text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                
                  <Trash2 size={16} /> Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </AdminLayout>);

}