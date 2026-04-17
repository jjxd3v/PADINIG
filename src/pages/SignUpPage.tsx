import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Megaphone,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle } from
'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { puroks } from '../data/mockData';
import { apiFetch } from '../lib/api';
export function SignUpPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    purok: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = {
          ...prev
        };
        delete next[field];
        return next;
      });
    }
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    const username = formData.username.trim();
    if (!username) newErrors.username = 'Username is required';
    if (formData.username.toLowerCase() === 'admin')
    newErrors.username = 'This username is reserved';
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (username && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (formData.password.length < 8)
    newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else {
      const digits = formData.contactNumber.replace(/\s/g, '');
      if (!/^\d+$/.test(digits)) {
        newErrors.contactNumber = 'Contact number must contain only numbers';
      } else if (digits.length !== 11) {
        newErrors.contactNumber = 'Contact number must be exactly 11 digits';
      } else if (!digits.startsWith('09')) {
        newErrors.contactNumber = 'Contact number must start with 09';
      }
    }
    if (!formData.purok) newErrors.purok = 'Please select your Purok/Zone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          name: formData.fullName,
          purok: formData.purok,
          contactNumber: formData.contactNumber,
        }),
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.message || 'Sign up failed');
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col items-center justify-start sm:justify-center px-4 py-6 sm:py-8 relative overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-4 sm:mb-6">
          <Link to="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent text-white mb-2 sm:mb-3 shadow-lg shadow-accent/20">
              <Megaphone size={22} className="sm:w-7 sm:h-7 text-primary-dark" />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-slate-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">
            Register as a barangay resident
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-8 border border-slate-100">
          <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                  
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base ${errors.fullName ? 'border-emergency' : 'border-slate-200'}`}
                  placeholder="Juan Dela Cruz" />
                
              </div>
              {errors.fullName &&
              <p className="text-[10px] sm:text-xs text-emergency mt-1">
                  {errors.fullName}
                </p>
              }
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                  
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base ${errors.username ? 'border-emergency' : 'border-slate-200'}`}
                  placeholder="Choose a username" />
                
              </div>
              {errors.username &&
              <p className="text-[10px] sm:text-xs text-emergency mt-1">
                  {errors.username}
                </p>
              }
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                    
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`block w-full pl-8 sm:pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base ${errors.password ? 'border-emergency' : 'border-slate-200'}`}
                    placeholder="Min. 6 chars" />
                  
                </div>
                {errors.password &&
                <p className="text-[10px] sm:text-xs text-emergency mt-1">
                    {errors.password}
                  </p>
                }
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock
                      size={16}
                      className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                    
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                    updateField('confirmPassword', e.target.value)
                    }
                    className={`block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base ${errors.confirmPassword ? 'border-emergency' : 'border-slate-200'}`}
                    placeholder="Repeat" />
                  
                </div>
                {errors.confirmPassword &&
                <p className="text-[10px] sm:text-xs text-emergency mt-1">
                    {errors.confirmPassword}
                  </p>
                }
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                  
                </div>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={formData.contactNumber}
                  onChange={(e) => {
                    const val = e.target.value.
                    replace(/[^\d]/g, '').
                    slice(0, 11);
                    updateField('contactNumber', val);
                  }}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base ${errors.contactNumber ? 'border-emergency' : 'border-slate-200'}`}
                  placeholder="09XX XXX XXXX" />
                
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                {formData.contactNumber.length}/11 digits
              </p>
              {errors.contactNumber &&
              <p className="text-[10px] sm:text-xs text-emergency mt-1">
                  {errors.contactNumber}
                </p>
              }
            </div>

            {/* Purok/Zone */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-1.5">
                Purok / Zone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-slate-400" />
                  
                </div>
                <select
                  required
                  value={formData.purok}
                  onChange={(e) => updateField('purok', e.target.value)}
                  className={`block w-full pl-9 sm:pl-10 pr-8 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base appearance-none ${errors.purok ? 'border-emergency' : 'border-slate-200'} ${!formData.purok ? 'text-slate-400' : 'text-slate-900'}`}>
                  
                  <option value="" disabled>
                    Select your Purok
                  </option>
                  {puroks.map((p) =>
                  <option key={p} value={p}>
                      {p}
                    </option>
                  )}
                </select>
              </div>
              {errors.purok &&
              <p className="text-[10px] sm:text-xs text-emergency mt-1">
                  {errors.purok}
                </p>
              }
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-1 sm:mt-2">
              
              {isLoading ?
              'Creating account...' :

              <>
                  <CheckCircle size={18} />
                  Create Account
                </>
              }
            </button>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary-light transition-colors">
                
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-xs sm:text-sm text-slate-500 hover:text-primary transition-colors">
            
            <ArrowLeft size={14} className="mr-1 sm:w-4 sm:h-4" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>);

}