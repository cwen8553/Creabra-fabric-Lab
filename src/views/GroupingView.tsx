import React, { useState, useMemo } from 'react';
import {
  GitMerge,
  CheckCircle2,
  HelpCircle,
  Split,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Building2,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GroupingCandidate } from '../types';
import { INITIAL_GROUPING_CANDIDATES } from '../mockData';

interface GroupingViewProps {
  onNavigate: (tab: string) => void;
}

export const GroupingView: React.FC<GroupingViewProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<GroupingCandidate[]>(INITIAL_GROUPING_CANDIDATES);
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [collapsedSuppliers, setCollapsedSuppliers] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (id: string, action: 'confirmed' | 'split' | 'deferred') => {
    setCandidates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );

    const msg =
      action === 'confirmed'
        ? '已确认合并为同款面料主档，并提取对应颜色款式！'
        : action === 'split'
        ? '已拆分为独立的面料草稿候选！'
        : '已标记稍后处理。';

    showToast(msg);
  };

  // Batch confirm all auto-group for a supplier
  const handleBatchConfirmSupplier = (supplier: string) => {
    setCandidates((prev) =>
      prev.map((item) =>
        item.supplierName === supplier && item.ruleTier === 'auto_group'
          ? { ...item, status: 'confirmed' }
          : item
      )
    );
    showToast(`已批量确认【${supplier}】旗下所有高置信度同款归组！`);
  };

  const toggleSupplierCollapse = (supplier: string) => {
    setCollapsedSuppliers((prev) => ({
      ...prev,
      [supplier]: !prev[supplier],
    }));
  };

  // Extract all unique suppliers
  const suppliersList = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => set.add(c.supplierName));
    return Array.from(set);
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      if (selectedSupplierFilter !== 'all' && item.supplierName !== selectedSupplierFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.suggestedName.toLowerCase().includes(q);
        const matchCode = item.supplierItemCode.toLowerCase().includes(q);
        const matchSupp = item.supplierName.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSupp && !matchId) return false;
      }
      return true;
    });
  }, [candidates, selectedSupplierFilter, searchQuery]);

  // Group filtered candidates by supplier
  const groupedCandidates = useMemo(() => {
    const map = new Map<string, GroupingCandidate[]>();
    filteredCandidates.forEach((item) => {
      const list = map.get(item.supplierName) || [];
      list.push(item);
      map.set(item.supplierName, list);
    });
    return Array.from(map.entries());
  }, [filteredCandidates]);

  // Stats
  const confirmedCount = candidates.filter((c) => c.status === 'confirmed').length;
  const pendingCount = candidates.filter((c) => c.status === 'pending').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2 font-sans">
              <div className="p-2 bg-zinc-900 text-white rounded-xl">
                <GitMerge className="w-4 h-4 text-zinc-100" />
              </div>
              按供应商分组的同款归组中心
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 font-mono font-bold text-zinc-800 border border-zinc-200">
              共 {suppliersList.length} 家供应商 / {candidates.length} 组候选
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            同一供应商旗下的多来源截屏、多色卡与详情页已按供应商归类分层，避免跨厂混杂与重复录入。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('review')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span>进入审核工作台</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Business Rules Legend (PRD 4.4) - Apple OS26 Pure Monochrome */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="os26-glass rounded-2xl p-4 border border-zinc-200 space-y-1.5 bg-white/70">
          <div className="flex items-center gap-2 font-bold text-zinc-950 text-xs">
            <CheckCircle2 className="w-4 h-4 text-zinc-900" />
            <span>自动归组 (≥ 85%)</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">
            同供应商＋同货号完全吻合，或规格与视觉特征高度重合。系统自动组成同一款面料草稿与多颜色款式。
          </p>
        </div>

        <div className="os26-glass rounded-2xl p-4 border border-zinc-300 space-y-1.5 bg-zinc-100/60">
          <div className="flex items-center gap-2 font-bold text-zinc-950 text-xs">
            <HelpCircle className="w-4 h-4 text-zinc-900" />
            <span>人工确认 (60% — 84%)</span>
          </div>
          <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
            疑似同款（如同供应商但支数不同，或同系列不同克重）。必须人工核实是否合并，禁止静默合并。
          </p>
        </div>

        <div className="os26-glass rounded-2xl p-4 border border-zinc-200 space-y-1.5 bg-white/70">
          <div className="flex items-center gap-2 font-bold text-zinc-700 text-xs">
            <Split className="w-4 h-4 text-zinc-600" />
            <span>独立候选 (&lt; 60%)</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">
            综合相似度低或属于未知跨供应商散碎截屏。系统拒绝跨厂合并，分别独立保留为独立草稿。
          </p>
        </div>
      </div>

      {/* Supplier Tabs & Search Bar */}
      <div className="os26-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Supplier Horizontal Scrollable Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedSupplierFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSupplierFilter === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              全部供应商 ({candidates.length})
            </button>
            {suppliersList.map((sup) => {
              const count = candidates.filter((c) => c.supplierName === sup).length;
              const isSelected = selectedSupplierFilter === sup;
              return (
                <button
                  key={sup}
                  onClick={() => setSelectedSupplierFilter(sup)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200/60'
                  }`}
                >
                  <Building2 className="w-3 h-3 text-zinc-500" />
                  <span>{sup}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索货号、面料名称或供应商..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 bg-zinc-950 text-white text-xs rounded-2xl flex items-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4 text-zinc-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grouped Supplier Sections */}
      {groupedCandidates.length === 0 ? (
        <div className="os26-card rounded-3xl p-12 text-center space-y-3">
          <GitMerge className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-sm font-bold text-zinc-700">未找到符合条件的同款归组候选</p>
          <p className="text-xs text-zinc-400">请尝试清除筛选关键词或切换全部供应商查看</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedCandidates.map(([supplierName, supplierCandidates]) => {
            const isCollapsed = !!collapsedSuppliers[supplierName];
            const autoCount = supplierCandidates.filter((c) => c.ruleTier === 'auto_group').length;

            return (
              <div key={supplierName} className="space-y-4">
                {/* Supplier Header Bar */}
                <div className="os26-glass p-4 rounded-3xl border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-100/50">
                  <div
                    onClick={() => toggleSupplierCollapse(supplierName)}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <div className="p-2 bg-zinc-900 text-white rounded-xl">
                      <Building2 className="w-4 h-4 text-zinc-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-zinc-950">{supplierName}</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-bold font-mono">
                          {supplierCandidates.length} 组归组候选
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-sans">
                        该供应商旗下所有色卡、网页截图与样衣打样已独立隔离归并
                      </p>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-zinc-400 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 ml-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {autoCount > 0 && (
                      <button
                        onClick={() => handleBatchConfirmSupplier(supplierName)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>一键确认该供应商全部自动归组 ({autoCount})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate Cards List Under This Supplier */}
                {!isCollapsed && (
                  <div className="space-y-4 pl-2">
                    {supplierCandidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        whileHover={{ y: -1 }}
                        className={`os26-card rounded-3xl p-5.5 transition-all ${
                          candidate.status === 'confirmed'
                            ? 'border-zinc-400 bg-zinc-50/70'
                            : candidate.status === 'split'
                            ? 'border-zinc-200 bg-zinc-100/40'
                            : 'border-zinc-200'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-zinc-100 gap-3">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-zinc-400">{candidate.id}</span>
                              <h3 className="font-bold text-zinc-950 text-sm font-sans">{candidate.suggestedName}</h3>
                              <span
                                className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                                  candidate.ruleTier === 'auto_group'
                                    ? 'bg-zinc-950 text-white border-zinc-950'
                                    : candidate.ruleTier === 'manual_confirm'
                                    ? 'bg-zinc-100 text-zinc-900 border-zinc-300'
                                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                }`}
                              >
                                AI 相似度: {candidate.similarityScore}%
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1 font-sans">
                              <span>货号标识: <strong className="text-zinc-800 font-mono">{candidate.supplierItemCode}</strong></span>
                              {candidate.suggestedFabricId && (
                                <>
                                  <span>•</span>
                                  <span>关联主档: <strong className="text-zinc-800 font-mono">{candidate.suggestedFabricId}</strong></span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="flex items-center gap-2">
                            {candidate.status === 'confirmed' && (
                              <span className="text-xs px-3 py-1 bg-zinc-900 text-white rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" /> 已确认合并
                              </span>
                            )}
                            {candidate.status === 'split' && (
                              <span className="text-xs px-3 py-1 bg-zinc-200 text-zinc-800 rounded-full font-bold flex items-center gap-1.5">
                                <Split className="w-3.5 h-3.5 text-zinc-700" /> 已拆分为独立草稿
                              </span>
                            )}
                            {candidate.status === 'deferred' && (
                              <span className="text-xs px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full font-medium flex items-center gap-1.5 border border-zinc-200">
                                <Clock className="w-3.5 h-3.5 text-zinc-600" /> 稍后处理
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3-Column Content Layout: Left Sources, Middle Basis, Right Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3.5 items-center">
                          {/* Left 5 Cols: Source Thumbnails */}
                          <div className="lg:col-span-5 space-y-2">
                            <p className="text-xs font-bold text-zinc-800 font-sans">该供应商关联的原始来源证据：</p>
                            <div className="grid grid-cols-3 gap-2">
                              {candidate.sources.map((src, idx) => (
                                <div
                                  key={src.id || idx}
                                  className="border border-zinc-200 rounded-2xl overflow-hidden bg-zinc-50 text-[11px] p-2 space-y-1.5"
                                >
                                  <div className="h-16 rounded-xl bg-zinc-200 overflow-hidden">
                                    <img
                                      src={src.thumbnail}
                                      alt={src.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="font-mono text-[10px] text-zinc-400 font-bold">{src.sourceId}</p>
                                  <p className="text-zinc-800 truncate font-medium">{src.title}</p>
                                </div>
                              ))}
                            </div>
                            {candidate.colorVariantsDetected.length > 0 && (
                              <div className="text-xs text-zinc-600 flex items-center gap-2 pt-1 font-sans">
                                <span className="text-zinc-400 text-[11px]">提取颜色款式:</span>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.colorVariantsDetected.map((clr, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded-full text-[10px] font-medium text-zinc-800 font-mono">
                                      {clr}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Middle 4 Cols: AI Grouping Rationale */}
                          <div className="lg:col-span-4 bg-zinc-50/80 rounded-2xl p-3.5 border border-zinc-200 space-y-2 text-xs">
                            <p className="font-bold text-zinc-900 flex items-center gap-1.5 font-sans text-xs">
                              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                              归组比对依据：
                            </p>
                            <div className="space-y-1 text-zinc-600 text-[11px] font-sans">
                              {candidate.basis.reasons.map((r, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <span className="text-zinc-900 font-bold">•</span>
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                              <span>规格重合度: {candidate.basis.specSimilarity}%</span>
                              <span>视觉特征: {candidate.basis.visualSimilarity}%</span>
                            </div>
                          </div>

                          {/* Right 3 Cols: Actions */}
                          <div className="lg:col-span-3 flex flex-col gap-2">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAction(candidate.id, 'confirmed')}
                              className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>确认同款合并</span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAction(candidate.id, 'split')}
                              className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Split className="w-3.5 h-3.5" />
                              <span>拆分为独立草稿</span>
                            </motion.button>
                            <button
                              onClick={() => handleAction(candidate.id, 'deferred')}
                              className="w-full py-1 text-zinc-400 hover:text-zinc-900 text-xs font-medium cursor-pointer transition-colors"
                            >
                              稍后处理
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
