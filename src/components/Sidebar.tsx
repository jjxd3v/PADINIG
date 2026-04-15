import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  History,
  Users,
  AlertTriangle,
  LogOut,
  X } from
'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const navItems = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    path: '/create',
    icon: Megaphone,
    label: 'Create Announcement'
  },
  {
    path: '/schedule',
    icon: CalendarDays,
    label: 'Schedule'
  },
  {
    path: '/history',
    icon: History,
    label: 'History'
  },
  {
    path: '/residents',
    icon: Users,
    label: 'Residents'
  }];

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        onClick={closeSidebar} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-primary text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl shadow-inner">
              <Megaphone size={24} className="text-accent" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">
                Project Padinig
              </h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                Barangay System
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1">
            
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive ? 'bg-white/15 text-white font-semibold shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                  
                  {isActive &&
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
                  }
                  <item.icon
                    size={20}
                    className={`transition-colors ${isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  
                  <span className="tracking-wide">{item.label}</span>
                </NavLink>);

            })}
          </nav>

          <div className="mt-10">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Urgent
            </p>
            <NavLink
              to="/emergency"
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${location.pathname === '/emergency' ? 'bg-emergency text-white font-semibold shadow-inner' : 'text-emergency-light hover:bg-emergency/15'}`}>
              
              {location.pathname === '/emergency' &&
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              }
              <AlertTriangle
                size={20}
                className={
                location.pathname === '/emergency' ?
                'text-white' :
                'text-emergency-light'
                } />
              
              <span className="tracking-wide">Emergency Broadcast</span>
            </NavLink>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 w-full group">
            
            <LogOut
              size={20}
              className="text-slate-400 group-hover:text-slate-300 transition-colors" />
            
            <span className="tracking-wide font-medium">Logout</span>
          </NavLink>
        </div>
      </aside>
    </>);

}