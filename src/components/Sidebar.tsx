import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Building2,
  FileCheck,
  Grid,
  Sparkles,
  Database,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  reviewPendingCount: number;
  groupingPendingCount: number;
  missingCount: number;
  conflictCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  reviewPendingCount,
  groupingPendingCount,
  missingCount,
  conflictCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: '工作台',
      subtext: '总览与任务监控',
      icon: LayoutDashboard,
    },
    {
      id: 'inbox',
      label: '面料资料收集',
      subtext: '批量收件箱与快速录入',
      icon: UploadCloud,
      badge: 4,
    },
    {
      id: 'suppliers',
      label: '供应商管理',
      subtext: '名录档案与同款归组',
      icon: Building2,
      badge: groupingPendingCount,
    },
    {
      id: 'review',
      label: '审核工作台',
      subtext: '字段确认与待补充中心',
      icon: FileCheck,
      badge: reviewPendingCount + conflictCount + missingCount,
    },
    {
      id: 'matching',
      label: '智能匹配',
      subtext: '服装找面料 / 面料找服装',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'fabric_wall',
      label: '面料墙',
      subtext: '全量主档检索与筛选',
      icon: Grid,
    },
  ];

  return (
    <aside className="w-64 bg-zinc-100/70 backdrop-blur-2xl text-zinc-700 flex flex-col shrink-0 h-full overflow-y-auto border-r border-zinc-200/80 select-none sticky top-0 z-20">
      {/* Navigation List */}
      <div className="p-3 space-y-1.5 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 tracking-wider uppercase font-mono">
          面料资产全链路管理
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'suppliers' && activeTab === 'grouping') ||
            (item.id === 'review' && activeTab === 'missing_center') ||
            (item.id === 'inbox' && activeTab === 'supplier_submit');

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab(item.id)}
              className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group cursor-pointer text-left ${
                isActive
                  ? 'bg-white text-zinc-950 font-bold shadow-xs border border-zinc-200/90'
                  : 'hover:bg-white/60 text-zinc-600 hover:text-zinc-950 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'bg-white/80 text-zinc-600 group-hover:bg-white group-hover:text-zinc-950 border border-zinc-200/60 shadow-2xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate flex items-center gap-1.5">
                    <span className={isActive ? 'text-zinc-950 font-bold' : 'text-zinc-800'}>
                      {item.label}
                    </span>
                    {item.highlight && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse"></span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-zinc-500 font-normal' : 'text-zinc-400'
                    }`}
                  >
                    {item.subtext}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'bg-white/90 text-zinc-700 border border-zinc-200/80 shadow-2xs'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Status Widget */}
      <div className="p-3 border-t border-zinc-200/60 bg-white/20 backdrop-blur-md">
        <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-zinc-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-900 font-bold">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-zinc-700" />
              面料知识库引擎
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              运行中
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
            支持多模态资料解析、编码体系归集与跨渠道查重
          </p>
        </div>
      </div>
    </aside>
  );
};

