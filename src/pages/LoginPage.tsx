import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Megaphone, Lock, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      // Admin credentials check
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        toast.success('Welcome back, Admin!');
        navigate('/dashboard');
        return;
      }
      // Check registered users from localStorage
      const registeredUsers = JSON.parse(
        localStorage.getItem('padinig_users') || '[]'
      );
      const foundUser = registeredUsers.find(
        (u: {username: string;password: string;}) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
      );
      if (foundUser) {
        localStorage.setItem('padinig_current_user', foundUser.username);
        toast.success(`Welcome, ${foundUser.fullName || username}!`);
        navigate('/announcements');
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center items-center px-4 py-8 sm:py-4 relative overflow-hidden">
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
        
        <div className="text-center mb-5 sm:mb-8">
          <Link to="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary text-white mb-3 sm:mb-4 shadow-lg shadow-primary/20">
              <Megaphone size={24} className="sm:w-8 sm:h-8 text-accent" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Project Padinig
          </h1>
          <p className="text-slate-500 mt-1 sm:mt-2 text-sm">
            Barangay Announcement System
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-5 sm:p-8 border border-slate-100">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {error &&
          <motion.div
            initial={{
              opacity: 0,
              y: -10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="mb-4 p-3 bg-emergency/10 border border-emergency/20 rounded-xl flex items-start gap-2">
            
              <AlertCircle
              size={16}
              className="text-emergency mt-0.5 shrink-0" />
            
              <p className="text-xs sm:text-sm text-emergency">{error}</p>
            </motion.div>
          }

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base"
                  placeholder="Enter your username" />
                
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white text-base"
                  placeholder="Enter your password" />
                
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs sm:text-sm text-slate-600">
                  
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-xs sm:text-sm font-medium text-primary hover:text-primary-light">
                
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:text-primary-light transition-colors">
                
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-4 sm:mt-6">
          Authorized barangay personnel and registered residents only.
        </p>
      </motion.div>
    </div>);

}