import React from 'react';
import { Category, Status } from '../data/mockData';
interface BadgeProps {
  type: 'category' | 'status' | 'tag';
  value: Category | Status | string;
  className?: string;
}
export function Badge({ type, value, className = '' }: BadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800';
  if (type === 'category') {
    switch (value) {
      case 'Emergency':
      case 'Disaster':
        colorClass = 'bg-emergency/10 text-emergency';
        break;
      case 'Health':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'Event':
        colorClass = 'bg-purple-100 text-purple-800';
        break;
      case 'Government':
        colorClass = 'bg-primary/10 text-primary';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
  } else if (type === 'status') {
    switch (value) {
      case 'Sent':
        colorClass = 'bg-secondary/10 text-secondary';
        break;
      case 'Pending':
        colorClass = 'bg-accent/10 text-accent-dark';
        break;
      case 'Cancelled':
        colorClass = 'bg-gray-100 text-gray-600';
        break;
      case 'Draft':
        colorClass = 'bg-slate-100 text-slate-600';
        break;
      case 'Active':
        colorClass = 'bg-secondary/10 text-secondary';
        break;
      case 'Inactive':
        colorClass = 'bg-gray-100 text-gray-500';
        break;
    }
  } else if (type === 'tag') {
    switch (value) {
      case 'Urgent':
        colorClass = 'bg-emergency/10 text-emergency border border-emergency/20';
        break;
      case 'Info':
        colorClass = 'bg-blue-100 text-blue-800 border border-blue-200';
        break;
      case 'Event':
        colorClass = 'bg-purple-100 text-purple-800 border border-purple-200';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${colorClass} ${className}`}>
      
      {value}
    </span>);

}