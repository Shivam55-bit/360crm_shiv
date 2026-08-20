import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Plus, Sparkles } from 'lucide-react';

// ==========================================
// 1. PAGE HEADER COMPONENT
// ==========================================
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionIcon?: React.ElementType;
  actionPermission?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
  extraActions?: React.ReactNode;
  badge?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionIcon: ActionIcon = Plus,
  actionPermission,
  onAction,
  secondaryAction,
  extraActions,
  badge,
}) => {
  const { hasPermission } = useAuth();
  const canPerformAction = !actionPermission || hasPermission(actionPermission);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {secondaryAction}
        {extraActions}
        {actionText && onAction && canPerformAction && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. STATUS BADGE COMPONENT
// ==========================================
export interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'ACTIVE', className = '' }) => {
  const s = String(status).toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['ACTIVE', 'PAID', 'WON', 'COMPLETED', 'PRESENT', 'APPROVED', 'RECEIVED', 'DELIVERED', 'CONNECTED', 'ACCEPTED', 'CONVERTED', 'SUCCESS', 'IN_STOCK'].includes(s)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  } else if (['PENDING', 'CONTACTED', 'IN_PROGRESS', 'DRAFT', 'ORDERED', 'HALF_DAY', 'PROPOSAL', 'NEGOTIATION', 'PARTIAL', 'CONFIGURED', 'LOW_STOCK'].includes(s)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
  } else if (['NEW', 'QUALIFIED', 'OUT_OF_STOCK', 'PROCESSED', 'SENT', 'PLANNING'].includes(s)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200/80';
  } else if (['INACTIVE', 'SUSPENDED', 'CANCELLED', 'LOST', 'OVERDUE', 'UNPAID', 'ABSENT', 'REJECTED', 'FAILED', 'WRONG_NUMBER', 'TERMINATED'].includes(s)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
  } else if (['ON_LEAVE', 'LEAVE', 'PAUSED'].includes(s)) {
    colorClasses = 'bg-purple-50 text-purple-700 border-purple-200/80';
  }

  const formattedText = s.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colorClasses} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {formattedText}
    </span>
  );
};

// ==========================================
// 3. MODAL COMPONENT
// ==========================================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-10 my-8 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// ==========================================
// 4. EMPTY STATE COMPONENT
// ==========================================
export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// ==========================================
// 5. EXPORT TO CSV UTILITY
// ==========================================
export function exportToCSV(fileName: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headerSet = new Set<string>();
  rows.forEach(r => {
    if (r && typeof r === 'object') {
      Object.keys(r).forEach(k => headerSet.add(k));
    }
  });
  const headers = Array.from(headerSet);

  const escapeCSVValue = (val: any) => {
    if (val === null || val === undefined) return '""';
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    }
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  rows.forEach(row => {
    const values = headers.map(header => escapeCSVValue(row[header]));
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
