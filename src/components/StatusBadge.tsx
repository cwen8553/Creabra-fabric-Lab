import React from 'react';
import { FieldStatus, FabricReviewStatus } from '../types';
import { CheckCircle2, AlertCircle, HelpCircle, Check, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: FieldStatus | FabricReviewStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  confidence?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  confidence,
}) => {
  let label = '';
  let colorClasses = '';
  let IconComponent = CheckCircle2;

  switch (status) {
    case 'confirmed':
    case 'ready_to_match':
      label = status === 'ready_to_match' ? '已入库' : '已核验';
      colorClasses = 'bg-zinc-100 text-zinc-800 border-zinc-300/80 font-medium';
      IconComponent = Check;
      break;

    case 'pending_review':
    case 'draft':
      label = status === 'draft' ? '草稿待核' : '待核验';
      colorClasses = 'bg-zinc-50 text-zinc-600 border-zinc-200';
      IconComponent = Clock;
      break;

    case 'missing':
    case 'missing_info':
      label = '待补充';
      colorClasses = 'bg-zinc-50/80 text-zinc-500 border-dashed border-zinc-300';
      IconComponent = HelpCircle;
      break;

    case 'inferred':
      label = '自动提取';
      colorClasses = 'bg-zinc-50 text-zinc-700 border-zinc-200';
      IconComponent = Clock;
      break;

    case 'conflicting':
      label = '待仲裁冲突';
      colorClasses = 'bg-zinc-200/70 text-zinc-900 border-zinc-300 font-medium';
      IconComponent = AlertCircle;
      break;

    case 'suspended':
      label = '暂停使用';
      colorClasses = 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through';
      IconComponent = XCircle;
      break;

    case 'not_applicable':
      label = '不适用';
      colorClasses = 'bg-zinc-50 text-zinc-400 border-zinc-200';
      IconComponent = HelpCircle;
      break;

    default:
      label = String(status);
      colorClasses = 'bg-zinc-50 text-zinc-700 border-zinc-200';
      IconComponent = CheckCircle2;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 tracking-tight',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium tracking-tight',
    lg: 'text-xs px-3 py-1 gap-2 font-medium tracking-tight',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shrink-0 whitespace-nowrap transition-all duration-200 ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />}
      <span>{label}</span>
    </span>
  );
};

