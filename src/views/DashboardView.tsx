import React from 'react';
import {
  UploadCloud,
  FileCheck,
  Grid,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers,
  Cpu,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ImportJob, FabricMaster } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  importJobs?: ImportJob[];
  fabrics?: FabricMaster[];
  onOpenTour?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  importJobs = [],
  fabrics = [],
  onOpenTour = () => {},
}) => {
  const readyCount = fabrics.filter((f) => f.reviewStatus === 'ready_to_match').length;
  const pendingCount = fabrics.filter((f) => f.reviewStatus === 'pending_review' || f.reviewStatus === 'draft').length;
  const missingCount = fabrics.filter((f) => (f.missingFields?.length || 0) > 0 || f.reviewStatus === 'missing_info').length;
  const conflictCount = fabrics.filter((f) => (f.conflictFields?.length || 0) > 0).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Top Welcome & Quick Actions Banner - Soft Light Glass */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl p-7 text-zinc-900 border border-zinc-200 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 text-[11px] font-mono font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
              面料档案工作台
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">
            面料数据库与服装双向匹配系统
          </h1>
        </div>

        {/* 3 Main Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('inbox')}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-zinc-700" />
            <span>导入资料</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('review')}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium shadow-2xs transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-zinc-200" />
            <span>审核核验 ({pendingCount + conflictCount})</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('fabric_wall')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-2xs"
          >
            <Grid className="w-4 h-4 text-zinc-700" />
            <span>面料墙检索</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Fabrics */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('fabric_wall')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 cursor-pointer group transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium text-zinc-600">面料主档总数</span>
            <Layers className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">{fabrics.length || 312}</span>
            <span className="text-xs text-zinc-400">款主档</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span>涵盖 12 类典型织造体系</span>
          </p>
        </motion.div>

        {/* Pending Review */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('review')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 cursor-pointer group transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between text-zinc-600 mb-2">
            <span className="text-xs font-medium">待审核核对</span>
            <Clock className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">{pendingCount || 48}</span>
            <span className="text-xs text-zinc-500">款待确认</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span>已提取完成，等待核对</span>
          </p>
        </motion.div>

        {/* Missing Info */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('missing_center')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 cursor-pointer group transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between text-zinc-600 mb-2">
            <span className="text-xs font-medium">待补充资料</span>
            <HelpCircle className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">{missingCount || 26}</span>
            <span className="text-xs text-zinc-500">款缺少关键项</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span>支持列表直接填报补录</span>
          </p>
        </motion.div>

        {/* Conflicts */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('review')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 cursor-pointer group transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between text-zinc-700 mb-2">
            <span className="text-xs font-medium">存在参数冲突</span>
            <AlertCircle className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">{conflictCount || 9}</span>
            <span className="text-xs text-zinc-500">款冲突</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span>多来源数据需人工仲裁</span>
          </p>
        </motion.div>

        {/* Ready to Match */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onNavigate('fabric_wall')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 cursor-pointer group transition-all shadow-2xs"
        >
          <div className="flex items-center justify-between text-zinc-600 mb-2">
            <span className="text-xs font-medium">正式入库面料</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">{readyCount || 229}</span>
            <span className="text-xs text-zinc-500">款已核验</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span>可参与款式企划与匹配</span>
          </p>
        </motion.div>
      </div>

      {/* Main Content Grid: Recent Jobs + Risk Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Monitor & Recent Import Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Job Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-zinc-700" />
                  资料整理进度
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  查看网页、色卡和 Excel 等样例资料的当前状态
                </p>
              </div>
              <button
                onClick={() => onNavigate('inbox')}
                className="text-xs text-zinc-700 hover:text-zinc-950 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                查看收件箱 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Stage Pills */}
            <div className="grid grid-cols-5 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 mb-4">
              {[
                { label: '1. 文件上传', status: 'done', count: '86 份' },
                { label: '2. 资料整理', status: 'done', count: '82 完成' },
                { label: '3. 同款候选', status: 'done', count: '54 待看 / 14 已确认' },
                { label: '4. 人工核对', status: 'active', count: '进行中' },
                { label: '5. 正式入库', status: 'waiting', count: '229 款' },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-center transition-all ${
                    stage.status === 'done'
                      ? 'bg-white border border-zinc-200 text-zinc-800 font-medium shadow-2xs'
                      : stage.status === 'active'
                      ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                      : 'bg-zinc-100 text-zinc-400 border border-transparent'
                  }`}
                >
                  <p className="text-[11px] leading-tight">{stage.label}</p>
                  <p className={`text-[10px] mt-1 font-mono ${stage.status === 'active' ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {stage.count}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Batch Tasks Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-zinc-600">最近批次导入任务：</h4>
              {importJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-400 font-medium">{job.id}</span>
                      <span className="text-xs font-medium text-zinc-900">{job.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span>来源总数：{job.totalSources}</span>
                      <span>•</span>
                      <span className="text-zinc-800">成功：{job.successCount}</span>
                      <span>•</span>
                      <span className="text-zinc-500">失败：{job.failedCount}</span>
                      <span>•</span>
                      <span>草稿面料：{job.draftFabricsCount} 款</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('grouping')}
                      className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 transition-all cursor-pointer shadow-2xs"
                    >
                      同款归组
                    </button>
                    <button
                      onClick={() => onNavigate('review')}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-all cursor-pointer shadow-2xs"
                    >
                      审核核对
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Right 1 Col: Priority Risks & Action Required */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-zinc-700" />
                待处理数据提醒
              </h3>
              <span className="text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded-full font-mono font-medium">
                重点关注
              </span>
            </div>

            <div className="space-y-3">
              {/* Risk 1 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => onNavigate('review')}
                className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-950">FAB-005 成分与克重冲突</span>
                  <span className="text-[10px] text-zinc-700 bg-zinc-200/80 px-1.5 py-0.5 rounded-md font-mono">
                    多来源冲突
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                  网页标 100%棉 160gsm，实物色卡标 95%棉/5%氨纶 210gsm，需在审核页进行仲裁。
                </p>
                <div className="mt-2.5 text-[11px] font-medium text-zinc-900 flex items-center gap-1">
                  前往仲裁核验 <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>

              {/* Risk 2 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => onNavigate('missing_center')}
                className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">FAB-003 精梳棉罗纹缺失克重</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-200/80 px-1.5 py-0.5 rounded-md font-mono">
                    待补资料
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                  色卡区域未包含克重数值，可直接在待补充中心快捷补录，或复制微信话术向供应商索要。
                </p>
                <div className="mt-2.5 text-[11px] font-medium text-zinc-800 flex items-center gap-1">
                  前往快捷补录 <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>

              {/* Risk 3 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => onNavigate('missing_center')}
                className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">FAB-007 价格计价单位未注明</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-200/80 px-1.5 py-0.5 rounded-md font-mono">
                    商务缺口
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                  仅有单价数字未标明单位，可前往待补充中心进行补填。
                </p>
                <div className="mt-2.5 text-[11px] font-medium text-zinc-800 flex items-center gap-1">
                  查看待补充中心 <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-500 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <span>
                资料不全的面料仍可建档，在服装匹配时会提示相应注意事项并支持一键补全。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
