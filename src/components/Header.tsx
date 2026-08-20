import React, { useState } from 'react';
import {
  Search,
  Shield,
  EyeOff,
  Bell,
  Sparkles,
  AlertCircle,
  FileCheck2,
  X,
  Command,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreabraLogo } from './CreabraLogo';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isDesensitizedMode: boolean;
  onToggleDesensitizedMode: () => void;
  onOpenTour: () => void;
  onNavigate: (tab: string) => void;
  totalFabricsCount: number;
  missingCount: number;
  conflictCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  isDesensitizedMode,
  onToggleDesensitizedMode,
  onOpenTour,
  onNavigate,
  totalFabricsCount,
  missingCount,
  conflictCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 os26-glass border-b border-zinc-200/80 px-6 flex items-center justify-between sticky top-0 z-40 transition-all">
      {/* Left: Brand Identity & Active Context */}
      <div className="flex items-center gap-6">
        <motion.div
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer"
        >
          <CreabraLogo size="md" />
        </motion.div>

        {/* Current Active Pipeline Task */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('inbox')}
          className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-100/80 hover:bg-zinc-200/60 border border-zinc-200/70 rounded-full text-xs text-zinc-700 cursor-pointer transition-all"
          title="点击查看任务详情"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse"></span>
          <span className="font-medium text-zinc-800">当前任务：</span>
          <span className="text-zinc-500">2026春夏面料导入 (86条来源)</span>
          <span className="text-zinc-900 bg-zinc-200/90 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
            100%
          </span>
        </motion.div>
      </div>

      {/* Center: Global Search with Apple Spotlight-inspired look */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative group">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-zinc-900" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索面料名称、货号、成分、克重、供应商..."
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-zinc-100/70 hover:bg-zinc-100 focus:bg-white border border-zinc-200/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400 text-zinc-900"
          />
          {searchTerm ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none opacity-40">
              <span className="text-[10px] bg-zinc-200/80 px-1 py-0.5 rounded text-zinc-700 font-mono">⌘K</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Privacy Mode & Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Guided Tour Helper */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenTour}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
          <span>业务导览</span>
        </motion.button>

        {/* Notifications & Risk Alerts */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
            title="风险预警与通知"
          >
            <Bell className="w-4 h-4" />
            {(conflictCount > 0 || missingCount > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-950 rounded-full ring-2 ring-white"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="absolute right-0 mt-2 w-80 os26-glass rounded-2xl shadow-xl border border-zinc-200/90 p-4 z-50"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                  <span className="text-xs font-semibold text-zinc-950">系统风险与处理提醒</span>
                  <span className="text-[10px] text-zinc-400 font-mono">P0 实时规则</span>
                </div>
                <div className="py-2.5 space-y-2 text-xs">
                  {conflictCount > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('review');
                      }}
                      className="p-2.5 bg-zinc-100/90 border border-zinc-300 rounded-xl cursor-pointer hover:bg-zinc-200/80 transition-all"
                    >
                      <div className="flex items-center gap-1.5 text-zinc-950 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                        <span>{conflictCount} 款面料存在来源冲突待决断</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        例如 FAB-005 成分与克重数据冲突，需人工仲裁。
                      </p>
                    </motion.div>
                  )}
                  {missingCount > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('missing_center');
                      }}
                      className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-all"
                    >
                      <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
                        <FileCheck2 className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span>{missingCount} 项关键资料待供应商补充</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        包含 FAB-003 缺失克重、FAB-007 价格条件不完整。
                      </p>
                    </motion.div>
                  )}
                  <div className="p-2 text-[11px] text-zinc-500 bg-zinc-100/50 rounded-xl border border-zinc-200/50 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span>提示：资料不全的面料仍可建档，但会在服装款式匹配时给出适配提醒。</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono font-bold">
            CW
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-zinc-900 leading-tight">企划与审核组</p>
            <p className="text-[10px] text-zinc-400 font-mono leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
