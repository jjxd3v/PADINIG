import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass?: string;
  borderColorClass?: string;
}
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-primary bg-primary/10',
  borderColorClass = 'border-t-primary'
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02
      }}
      transition={{
        type: 'spring',
        stiffness: 300
      }}
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft border border-slate-100 dark:border-slate-700 border-t-4 ${borderColorClass} relative overflow-hidden h-full flex flex-col transition-colors duration-300`}>
      
      <div className="flex items-start justify-between flex-1">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm min-h-[20px]">
        {trend ?
        <>
            <span
            className={`font-medium flex items-center ${trend.isPositive ? 'text-secondary' : 'text-emergency'}`}>
            
              {trend.isPositive ? '+' : '-'}
              {trend.value}
            </span>
            <span className="text-slate-400 dark:text-slate-500 ml-2 text-xs">
              from last month
            </span>
          </> :

        <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
        }
      </div>
    </motion.div>);

}