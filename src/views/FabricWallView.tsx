import React, { useState, useMemo } from 'react';
import {
  Grid,
  List,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Shield,
  Tag,
  Share2,
  ExternalLink,
  Code2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { FabricDetailModal } from './FabricDetailModal';

interface FabricWallViewProps {
  fabrics: FabricMaster[];
  searchTerm: string;
  isDesensitizedMode: boolean;
  onToggleDesensitizedMode?: () => void;
  onNavigateToMatch: (fabricId: string) => void;
  onEditFabric: (fabric: FabricMaster) => void;
  onUpdateFabric?: (fabric: FabricMaster) => void;
}

export const FabricWallView: React.FC<FabricWallViewProps> = ({
  fabrics,
  searchTerm,
  isDesensitizedMode,
  onToggleDesensitizedMode,
  onNavigateToMatch,
  onEditFabric,
  onUpdateFabric,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedFabric, setSelectedFabric] = useState<FabricMaster | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Multi-dimensional filter states
  const [selectedMarketType, setSelectedMarketType] = useState<string>('all');
  const [selectedSpecialCraft, setSelectedSpecialCraft] = useState<string>('all');
  const [selectedFiber, setSelectedFiber] = useState<string>('all');
  const [selectedWeave, setSelectedWeave] = useState<string>('all');
  const [selectedOpacity, setSelectedOpacity] = useState<string>('all');
  const [selectedElasticity, setSelectedElasticity] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedWeightRange, setSelectedWeightRange] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'weight_asc' | 'weight_desc' | 'price_asc' | 'completeness'>('id');

  // Filter logic
  const filteredFabrics = useMemo(() => {
    return (fabrics || []).filter((fabric) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = fabric.name?.value?.toLowerCase().includes(query);
        const matchId = fabric.id?.toLowerCase().includes(query);
        const matchCode = fabric.supplierItemCode?.value?.toLowerCase().includes(query);
        const matchComp = fabric.composition?.value?.toLowerCase().includes(query);
        const matchGarment = fabric.recommendedGarments?.some((g) => g.toLowerCase().includes(query));
        const matchSupplier = !isDesensitizedMode && fabric.supplierName?.toLowerCase().includes(query);
        const matchMarketType = fabric.marketFabricType?.value?.toLowerCase().includes(query);
        const matchCraft = fabric.specialCrafts?.some((c) => c.toLowerCase().includes(query));

        if (!matchName && !matchId && !matchCode && !matchComp && !matchGarment && !matchSupplier && !matchMarketType && !matchCraft) {
          return false;
        }
      }

      // Market Fabric Type (通用款式分类)
      if (selectedMarketType !== 'all') {
        if (!fabric.marketFabricType?.value?.includes(selectedMarketType)) {
          return false;
        }
      }

      // Special Crafts (特殊工艺)
      if (selectedSpecialCraft !== 'all') {
        if (!fabric.specialCrafts?.includes(selectedSpecialCraft)) {
          return false;
        }
      }

      // Fiber
      if (selectedFiber !== 'all') {
        if (selectedFiber === '含氨纶' && !fabric.composition?.value?.includes('氨纶')) return false;
        if (selectedFiber !== '含氨纶' && !fabric.composition?.value?.includes(selectedFiber)) return false;
      }

      // Weave
      if (selectedWeave !== 'all') {
        const matchCategory = fabric.weaveCategory?.value === selectedWeave;
        const matchStructure = fabric.weaveStructure?.value === selectedWeave;
        if (!matchCategory && !matchStructure) return false;
      }

      // Opacity
      if (selectedOpacity !== 'all' && fabric.opacity?.value !== selectedOpacity) {
        return false;
      }

      // Elasticity
      if (selectedElasticity !== 'all' && fabric.elasticity?.value !== selectedElasticity) {
        return false;
      }

      // Color
      if (selectedColor !== 'all' && fabric.mainColorFamily !== selectedColor) {
        return false;
      }

      // Weight
      if (selectedWeightRange !== 'all') {
        const w = fabric.weight?.value;
        if (selectedWeightRange === 'missing' && (w !== null && w !== undefined)) return false;
        if (selectedWeightRange === 'light' && (w === null || w === undefined || w > 150)) return false;
        if (selectedWeightRange === 'medium' && (w === null || w === undefined || w < 150 || w > 240)) return false;
        if (selectedWeightRange === 'heavy' && (w === null || w === undefined || w <= 240)) return false;
      }

      // Review Status
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'ready' && fabric.reviewStatus !== 'ready_to_match') return false;
        if (selectedStatus === 'missing' && (fabric.missingFields?.length || 0) === 0) return false;
        if (selectedStatus === 'conflict' && (fabric.conflictFields?.length || 0) === 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'weight_asc') return (a.weight?.value || 0) - (b.weight?.value || 0);
      if (sortBy === 'weight_desc') return (b.weight?.value || 0) - (a.weight?.value || 0);
      if (sortBy === 'price_asc') return (a.bulkPrice?.value || 0) - (b.bulkPrice?.value || 0);
      if (sortBy === 'completeness') return (b.completeness?.overall || 0) - (a.completeness?.overall || 0);
      return (a.id || '').localeCompare(b.id || '');
    });
  }, [
    fabrics,
    searchTerm,
    selectedMarketType,
    selectedSpecialCraft,
    selectedFiber,
    selectedWeave,
    selectedOpacity,
    selectedElasticity,
    selectedColor,
    selectedWeightRange,
    selectedStatus,
    sortBy,
    isDesensitizedMode,
  ]);

  const resetFilters = () => {
    setSelectedMarketType('all');
    setSelectedSpecialCraft('all');
    setSelectedFiber('all');
    setSelectedWeave('all');
    setSelectedOpacity('all');
    setSelectedElasticity('all');
    setSelectedColor('all');
    setSelectedWeightRange('all');
    setSelectedStatus('all');
  };

  const handleCardClick = (fabric: FabricMaster) => {
    setSelectedFabric(fabric);
    setDetailModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              <Grid className="w-5 h-5 text-zinc-900" />
              面料墙
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
              {isDesensitizedMode ? '客户选样模式 (已脱敏)' : '内部商务模式 (底价/大货/样品)'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            收录 {fabrics.length} 款样例面料。可按成分、克重、织法、透明度、弹性与适用品类查找。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Internal Business View vs Desensitized View Toggle inside Fabric Wall */}
          {onToggleDesensitizedMode && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onToggleDesensitizedMode}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                isDesensitizedMode
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100'
              }`}
              title={
                isDesensitizedMode
                  ? '当前为【外部脱敏视图】：仅展示样品指导价，隐藏底价与大货价及供应商敏感信息'
                  : '当前为【内部商务视图】：完整展示底价、大货价、样品价及供应商全称'
              }
            >
              {isDesensitizedMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-zinc-300" />
                  <span>外部展示视图</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-zinc-700" />
                  <span>内部商务视图</span>
                </>
              )}
            </motion.button>
          )}

          {/* Standalone Embed / Share for Main Site */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowEmbedModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer shadow-2xs"
            title="将面料墙独立嵌入主站或生成对外客户选样看板"
          >
            <Share2 className="w-3.5 h-3.5 text-zinc-600" />
            <span>主站独立嵌入</span>
          </motion.button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-hidden font-bold text-zinc-900 cursor-pointer text-xs"
            >
              <option value="id">按编号排序</option>
              <option value="completeness">按资料完整度</option>
              <option value="weight_asc">克重：轻 → 重</option>
              <option value="weight_desc">克重：重 → 轻</option>
              <option value="price_asc">大货价：低 → 高</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-400 hover:text-zinc-900'
              }`}
              title="卡片网格视图"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-400 hover:text-zinc-900'
              }`}
              title="列表清单视图"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar (Apple OS26 Glass Filter) */}
      <div className="os26-glass rounded-3xl border border-zinc-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs">
          <div className="flex items-center gap-2 font-bold text-zinc-900">
            <SlidersHorizontal className="w-4 h-4 text-zinc-900" />
            <span>多维属性筛选</span>
            <span className="text-zinc-400 font-mono font-normal">
              ({filteredFabrics.length} / {fabrics.length} 款)
            </span>
          </div>
          <button
            onClick={resetFilters}
            className="text-zinc-500 hover:text-zinc-950 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> 重置筛选
          </button>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 text-xs">
          {/* Market Fabric Type (通用面料分类) */}
          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">通用面料分类</label>
            <select
              value={selectedMarketType}
              onChange={(e) => setSelectedMarketType(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs font-medium"
            >
              <option value="all">全部通用分类</option>
              <option value="牛仔">牛仔面料</option>
              <option value="雪纺">雪纺面料</option>
              <option value="丝绸">丝绸 / 缎面</option>
              <option value="卫衣布">卫衣布 / 毛圈</option>
              <option value="罗马布">罗马布 (高密)</option>
              <option value="灯芯绒">灯芯绒</option>
              <option value="欧根纱">欧根纱</option>
              <option value="粗花呢">小香风粗花呢</option>
              <option value="华夫格">华夫格</option>
              <option value="针织罗纹">针织罗纹</option>
              <option value="速干网眼">运动速干网眼</option>
              <option value="双层棉纱">双层棉纱</option>
              <option value="羊毛呢绒">羊毛呢绒</option>
            </select>
          </div>

          {/* Special Crafts (特殊工艺) */}
          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">特殊工艺打标</label>
            <select
              value={selectedSpecialCraft}
              onChange={(e) => setSelectedSpecialCraft(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs font-medium"
            >
              <option value="all">全部特殊工艺</option>
              <option value="绣花">绣花工艺</option>
              <option value="蕾丝">蕾丝面料</option>
              <option value="烧花">烧花 / 烂花</option>
              <option value="织锦">织锦工艺</option>
              <option value="压褶">压褶工艺</option>
              <option value="烫金">烫金工艺</option>
              <option value="植绒">植绒工艺</option>
              <option value="拔印">拔印 / 活性印</option>
              <option value="提花">色织大提花</option>
              <option value="磨毛/拉绒">磨毛 / 拉绒</option>
              <option value="水洗石磨">水洗石磨</option>
              <option value="复合涂层">复合涂层</option>
            </select>
          </div>

          {/* Fiber */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">纤维成分</label>
            <select
              value={selectedFiber}
              onChange={(e) => setSelectedFiber(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部成分</option>
              <option value="棉">纯棉 / 精梳棉</option>
              <option value="莱赛尔">莱赛尔 (天丝)</option>
              <option value="锦纶">锦纶 (尼龙)</option>
              <option value="涤纶">涤纶 (速干)</option>
              <option value="羊毛">羊毛 / 精纺</option>
              <option value="含氨纶">含氨纶混纺高弹</option>
            </select>
          </div>

          {/* Weave Structure */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">织法结构</label>
            <select
              value={selectedWeave}
              onChange={(e) => setSelectedWeave(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部织法</option>
              <option value="梭织">梭织面料</option>
              <option value="针织">针织面料</option>
              <option value="平纹">平纹</option>
              <option value="斜纹">斜纹</option>
              <option value="罗纹">罗纹</option>
              <option value="提花">提花</option>
              <option value="网眼">网眼 / 鸟眼</option>
            </select>
          </div>

          {/* Opacity */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">透光透明度</label>
            <select
              value={selectedOpacity}
              onChange={(e) => setSelectedOpacity(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部透明度</option>
              <option value="不透明">不透明</option>
              <option value="半透明">半透明</option>
              <option value="未知">未知</option>
            </select>
          </div>

          {/* Elasticity */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">弹性等级</label>
            <select
              value={selectedElasticity}
              onChange={(e) => setSelectedElasticity(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部弹性</option>
              <option value="无弹">无弹 (机织)</option>
              <option value="二面弹">二面弹</option>
              <option value="四面弹">四面弹 (高弹)</option>
            </select>
          </div>

          {/* Weight Range */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">克重区间</label>
            <select
              value={selectedWeightRange}
              onChange={(e) => setSelectedWeightRange(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部克重</option>
              <option value="light">轻薄 (≤ 150 gsm)</option>
              <option value="medium">中等 (150-240 gsm)</option>
              <option value="heavy">厚重 (&gt; 240 gsm)</option>
              <option value="missing">缺失待补充</option>
            </select>
          </div>

          {/* Color & Status */}
          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">主色系</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="all">全部主色系</option>
              <option value="黑色系">黑色系</option>
              <option value="白色系">白色系</option>
              <option value="灰色系">灰色系</option>
              <option value="蓝色系">蓝色系</option>
              <option value="绿色系">绿色系</option>
              <option value="黄色系">黄色系</option>
              <option value="棕色系">棕色系</option>
              <option value="卡其色系">卡其色系</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFabrics.map((fabric) => (
            <motion.div
              key={fabric.id}
              whileHover={{ y: -3 }}
              onClick={() => handleCardClick(fabric)}
              className="os26-card rounded-3xl overflow-hidden flex flex-col cursor-pointer group transition-all"
            >
              {/* Photo Area */}
              <div className="relative h-44 bg-zinc-100 overflow-hidden">
                <img
                  src={fabric.mainImage}
                  alt={fabric.name.value || ''}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-950/85 text-white backdrop-blur-md border border-white/10 shadow-xs">
                    {fabric.supplierShortName ? `${fabric.supplierShortName} · ` : ''}{fabric.systemCode || fabric.id}
                  </span>
                  <StatusBadge status={fabric.reviewStatus} size="sm" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {fabric.colorVariants.map((v, vIdx) => (
                      <span
                        key={v.id ? `cv-${fabric.id}-${v.id}` : `cv-${fabric.id}-${vIdx}`}
                        className="w-3.5 h-3.5 rounded-full border border-white/90 shadow-2xs"
                        style={{ backgroundColor: v.hex }}
                        title={v.supplierColorName}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] bg-white/95 text-zinc-900 px-2 py-0.5 rounded-full font-mono font-bold shadow-xs">
                    {fabric.weight.value !== null ? `${fabric.weight.value} gsm` : '缺克重'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-950 text-xs truncate group-hover:text-zinc-600 transition-colors">
                    {fabric.name.value}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {fabric.composition.value || '成分待供应商补充'}
                  </p>
                </div>

                {/* Specs Pills */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {fabric.marketFabricType?.value && (
                    <span className="px-2 py-0.5 bg-zinc-950 text-white rounded-full font-bold shadow-2xs">
                      {fabric.marketFabricType.value}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full font-medium border border-zinc-200">
                    {fabric.weaveCategory.value} • {fabric.weaveStructure.value}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full font-medium border border-zinc-200">
                    {fabric.elasticity.value}
                  </span>
                </div>

                {/* Special Crafts Tags */}
                {fabric.specialCrafts && fabric.specialCrafts.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {fabric.specialCrafts.map((craft, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-1.5 py-0.2 bg-zinc-200/80 text-zinc-800 rounded-md text-[9px] font-bold font-mono"
                      >
                        #{craft}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recommended Apparel */}
                <div className="space-y-1 pt-1.5 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400">适配品类：</p>
                  <p className="text-[11px] text-zinc-800 truncate font-bold">
                    {(fabric.recommendedGarments || []).slice(0, 2).join(' / ') || '通用全品类'}
                  </p>
                </div>

                {/* Footer Completeness & Price */}
                <div className="pt-2.5 border-t border-zinc-100 flex items-end justify-between text-xs">
                  {isDesensitizedMode ? (
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-400 font-medium">样品指导价</span>
                        <span className="text-[9px] px-1 py-0.2 bg-zinc-100 text-zinc-600 rounded font-mono">散剪</span>
                      </div>
                      <span className="font-bold text-zinc-950 font-mono text-xs block mt-0.5">
                        {fabric.samplePrice?.value
                          ? `¥${fabric.samplePrice.value} ${fabric.priceUnit}`
                          : fabric.bulkPrice.value
                          ? `¥${Math.round(fabric.bulkPrice.value * 1.45)} ${fabric.priceUnit}`
                          : '暂无报价'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-400 font-medium block">三维价格体系 (元/米)</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600" title="采购成本底价">
                          底 <strong className="text-zinc-950 font-bold">¥{fabric.basePrice?.value || '--'}</strong>
                        </span>
                        <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600" title="批量大货采购价">
                          大货 <strong className="text-zinc-950 font-bold">¥{fabric.bulkPrice?.value || '--'}</strong>
                        </span>
                        <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600" title="样品散剪价">
                          样品 <strong className="text-zinc-950 font-bold">¥{fabric.samplePrice?.value || '--'}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToMatch(fabric.id);
                    }}
                    className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs shrink-0 ml-2"
                  >
                    <Sparkles className="w-3 h-3 text-zinc-200" />
                    <span>匹配</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="os26-card rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 text-zinc-400 border-b border-zinc-200 text-[11px] font-mono">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">编号 / 名称</th>
                  <th className="px-5 py-3.5 font-semibold">成分配比</th>
                  <th className="px-5 py-3.5 font-semibold">克重/门幅</th>
                  <th className="px-5 py-3.5 font-semibold">织法/弹性</th>
                  <th className="px-5 py-3.5 font-semibold">
                    {isDesensitizedMode ? '样品指导价' : '三维价格体系 (底/大货/样品)'}
                  </th>
                  <th className="px-5 py-3.5 font-semibold">推荐服装</th>
                  <th className="px-5 py-3.5 font-semibold">审核状态</th>
                  <th className="px-5 py-3.5 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {filteredFabrics.map((fabric) => (
                  <tr
                    key={fabric.id}
                    onClick={() => handleCardClick(fabric)}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-zinc-200 overflow-hidden shrink-0">
                          <img src={fabric.mainImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-zinc-900">
                            {fabric.supplierShortName ? `${fabric.supplierShortName} · ` : ''}{fabric.systemCode || fabric.id}
                          </p>
                          <p className="font-bold text-zinc-950 truncate max-w-xs">{fabric.name.value}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate">{fabric.composition.value || '待补充'}</td>
                    <td className="px-5 py-3.5 font-mono">
                      {fabric.weight.value !== null ? `${fabric.weight.value}gsm` : '缺克重'} • {fabric.width.value || '待补'}cm
                    </td>
                    <td className="px-5 py-3.5">
                      {fabric.weaveCategory.value}({fabric.weaveStructure.value}) • {fabric.elasticity.value}
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      {isDesensitizedMode ? (
                        <span className="font-bold text-zinc-950">
                          ¥{fabric.samplePrice?.value || '--'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-700">
                          底¥{fabric.basePrice?.value || '--'} / 大¥{fabric.bulkPrice?.value || '--'} / 样¥{fabric.samplePrice?.value || '--'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 truncate max-w-xs font-medium text-zinc-900">{fabric.recommendedGarments.slice(0, 2).join(' / ')}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={fabric.reviewStatus} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToMatch(fabric.id);
                        }}
                        className="px-3 py-1 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                      >
                        匹配
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Standalone Embed / Integration Modal */}
      <AnimatePresence>
        {showEmbedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4 font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-zinc-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950">面料墙主站独立集成与分享</h3>
                    <p className="text-[11px] text-zinc-500">支持作为独立看板嵌入官方主站或分发给下游品牌方选样</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                    1. 嵌入主站 IFrame 代码 (支持脱敏选样展示)
                  </label>
                  <div className="p-3 bg-zinc-900 text-zinc-100 font-mono text-[11px] rounded-xl relative">
                    <code>{`<iframe src="https://fabric-hub.company.com/wall?mode=public" width="100%" height="800px" frameborder="0"></iframe>`}</code>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                    2. 独立客户选样直达链接
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value="https://fabric-hub.company.com/wall?view=client_portal"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-800 font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('https://fabric-hub.company.com/wall?view=client_portal');
                        setCopiedEmbed(true);
                        setTimeout(() => setCopiedEmbed(false), 2000);
                      }}
                      className="px-3.5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                      <span>{copiedEmbed ? '已复制' : '复制链接'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-600 text-[11px] space-y-1">
                  <p className="font-bold text-zinc-900">外部浏览入口视觉样例</p>
                  <p>• 本原型仅使用虚构数据展示浏览体验</p>
                  <p>• 正式开发后，外部客户只能查看获授权的面料信息</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold text-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fabric Detail Modal */}
      <FabricDetailModal
        fabric={selectedFabric}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isDesensitizedMode={isDesensitizedMode}
        onNavigateToMatch={onNavigateToMatch}
        onEdit={onEditFabric}
        onUpdateFabric={(updated) => {
          onUpdateFabric?.(updated);
          setSelectedFabric(updated);
        }}
      />
    </div>
  );
};
