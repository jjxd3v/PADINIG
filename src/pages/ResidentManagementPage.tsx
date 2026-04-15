import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  UserPlus,
  AlertTriangle,
  X,
  Phone,
  User,
  MapPin,
  Smartphone,
  Info } from
'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { getResidents, saveResidents, puroks, Resident } from '../data/mockData';
import { Badge } from '../components/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
export function ResidentManagementPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<Resident[]>(() => getResidents());
  const [deleteTarget, setDeleteTarget] = useState<Resident | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    contactNumber: '',
    purok: ''
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const filteredResidents = residents.filter((r) => {
    const matchesTab = activeTab === 'All' || r.purok === activeTab;
    const matchesSearch =
    searchQuery === '' ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.purok.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = residents.filter((r) => r.id !== deleteTarget.id);
    setResidents(updated);
    saveResidents(updated);
    toast.success(`"${deleteTarget.name}" has been removed.`);
    setDeleteTarget(null);
  };
  const validateAddForm = () => {
    const errors: Record<string, string> = {};
    if (!addFormData.name.trim()) errors.name = 'Full name is required';
    if (!addFormData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else {
      const digits = addFormData.contactNumber.replace(/\s/g, '');
      if (!/^\d+$/.test(digits)) {
        errors.contactNumber = 'Contact number must contain only numbers';
      } else if (digits.length !== 11) {
        errors.contactNumber = 'Contact number must be exactly 11 digits';
      } else if (!digits.startsWith('09')) {
        errors.contactNumber = 'Contact number must start with 09';
      }
    }
    if (!addFormData.purok) errors.purok = 'Please select a Purok/Zone';
    // Check for duplicate contact number
    if (
    residents.some(
      (r) => r.contactNumber === addFormData.contactNumber.replace(/\s/g, '')
    ))
    {
      errors.contactNumber = 'This contact number is already registered';
    }
    setAddErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    const newResident: Resident = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: addFormData.name.trim(),
      contactNumber: addFormData.contactNumber.replace(/\s/g, ''),
      purok: addFormData.purok,
      registrationDate: new Date().toISOString(),
      status: 'Active'
    };
    const newResidents = [newResident, ...residents];
    setResidents(newResidents);
    saveResidents(newResidents);
    toast.success(`${newResident.name} has been added as an SMS resident.`);
    setAddModalOpen(false);
    setAddFormData({
      name: '',
      contactNumber: '',
      purok: ''
    });
    setAddErrors({});
  };
  return (
    <AdminLayout title="Resident Management">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
        {/* Header & Actions */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or contact number..."
                className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white dark:placeholder-slate-400" />
              
              {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                
                  <X size={16} />
                </button>
              }
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm whitespace-nowrap">
              
              <UserPlus size={18} /> Add Resident
            </button>
          </div>

          {/* Purok Tabs */}
          <div className="flex overflow-x-auto pb-2 -mb-2 hide-scrollbar gap-2">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'All' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              
              All Residents
            </button>
            {puroks.map((purok) =>
            <button
              key={purok}
              onClick={() => setActiveTab(purok)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === purok ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
              
                {purok}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/50 z-10">
              <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold shadow-sm">
                <th className="p-4">Name</th>
                <th className="p-4">Contact Number</th>
                <th className="p-4">Zone/Purok</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredResidents.map((resident, index) =>
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
                key={resident.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {resident.name}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {resident.contactNumber}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {resident.purok}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(resident.registrationDate).toLocaleDateString(
                    'en-PH',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }
                  )}
                  </td>
                  <td className="p-4">
                    <Badge type="status" value={resident.status} />
                  </td>
                  <td className="p-4 text-right">
                    <button
                    onClick={() => setDeleteTarget(resident)}
                    className="p-2 text-emergency hover:bg-emergency/10 rounded-lg transition-colors"
                    title="Delete resident">
                    
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              )}
              {filteredResidents.length === 0 &&
              <tr>
                  <td
                  colSpan={6}
                  className="p-8 text-center text-slate-500 dark:text-slate-400">
                  
                    No residents found in this category.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-600 dark:text-slate-400 flex justify-between items-center">
          <span>
            Total shown:{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredResidents.length}
            </strong>
          </span>
          <span className="text-xs">
            Data is for demonstration purposes only.
          </span>
        </div>
      </div>

      {/* Add Resident Modal */}
      <AnimatePresence>
        {addModalOpen &&
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
          onClick={() => setAddModalOpen(false)}>
          
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
            
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <UserPlus
                  size={20}
                  className="text-primary dark:text-primary-light" />
                
                  Add Resident
                </h3>
                <button
                onClick={() => {
                  setAddModalOpen(false);
                  setAddErrors({});
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors -mr-2">
                
                  <X size={20} />
                </button>
              </div>

              {/* Info Banner */}
              <div className="mx-5 mt-5 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-start gap-2.5 border border-blue-100 dark:border-blue-800/30">
                <Smartphone
                size={18}
                className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">
                    SMS-Only Resident
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
                    For residents using keypad phones who can't register via the
                    web app. They will receive announcements via SMS to their
                    registered number.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAddResident} className="p-5 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) => {
                      setAddFormData({
                        ...addFormData,
                        name: e.target.value
                      });
                      if (addErrors.name)
                      setAddErrors({
                        ...addErrors,
                        name: ''
                      });
                    }}
                    placeholder="e.g., Maria Santos"
                    className={`w-full pl-10 pr-4 py-3 min-h-[44px] border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 text-sm ${addErrors.name ? 'border-emergency' : 'border-slate-200 dark:border-slate-600'}`} />
                  
                  </div>
                  {addErrors.name &&
                <p className="text-xs text-emergency mt-1">
                      {addErrors.name}
                    </p>
                }
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-slate-400" />
                    </div>
                    <input
                    type="tel"
                    required
                    maxLength={11}
                    value={addFormData.contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.
                      replace(/[^\d]/g, '').
                      slice(0, 11);
                      setAddFormData({
                        ...addFormData,
                        contactNumber: val
                      });
                      if (addErrors.contactNumber)
                      setAddErrors({
                        ...addErrors,
                        contactNumber: ''
                      });
                    }}
                    placeholder="09XX XXX XXXX"
                    className={`w-full pl-10 pr-4 py-3 min-h-[44px] border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 text-sm font-mono ${addErrors.contactNumber ? 'border-emergency' : 'border-slate-200 dark:border-slate-600'}`} />
                  
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {addFormData.contactNumber.length}/11 digits — This number
                    will receive SMS announcements.
                  </p>
                  {addErrors.contactNumber &&
                <p className="text-xs text-emergency mt-1">
                      {addErrors.contactNumber}
                    </p>
                }
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    This number will receive SMS announcements.
                  </p>
                </div>

                {/* Purok/Zone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Purok / Zone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-slate-400" />
                    </div>
                    <select
                    required
                    value={addFormData.purok}
                    onChange={(e) => {
                      setAddFormData({
                        ...addFormData,
                        purok: e.target.value
                      });
                      if (addErrors.purok)
                      setAddErrors({
                        ...addErrors,
                        purok: ''
                      });
                    }}
                    className={`w-full pl-10 pr-4 py-3 min-h-[44px] border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white text-sm appearance-none ${addErrors.purok ? 'border-emergency' : 'border-slate-200 dark:border-slate-600'} ${!addFormData.purok ? 'text-slate-400' : ''}`}>
                    
                      <option value="" disabled>
                        Select Purok
                      </option>
                      {puroks.map((p) =>
                    <option key={p} value={p}>
                          {p}
                        </option>
                    )}
                    </select>
                  </div>
                  {addErrors.purok &&
                <p className="text-xs text-emergency mt-1">
                      {addErrors.purok}
                    </p>
                }
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    setAddErrors({});
                  }}
                  className="w-full sm:flex-1 min-h-[44px] py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
                  
                    Cancel
                  </button>
                  <button
                  type="submit"
                  className="w-full sm:flex-1 min-h-[44px] py-3 px-4 bg-primary hover:bg-primary-light text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                  
                    <UserPlus size={16} /> Add Resident
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

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
                  Delete Resident?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Are you sure you want to remove this resident?
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg mt-3 border border-slate-100 dark:border-slate-600">
                  "{deleteTarget.name}"
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