import React, { useState, useMemo } from 'react';
import {
  Building2,
  GitMerge,
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Check,
  Copy,
  Plus,
  Filter,
  Layers,
  ArrowUpRight,
  Clock,
  X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster, GroupingCandidate } from '../types';
import { INITIAL_SUPPLIERS, INITIAL_GROUPING_CANDIDATES, SupplierProfile } from '../mockData';
import { StatusBadge } from '../components/StatusBadge';

interface SuppliersViewProps {
  fabrics: FabricMaster[];
  onNavigate: (tab: string, filter?: string) => void;
  onUpdateFabric: (fabric: FabricMaster) => void;
  suppliersList?: SupplierProfile[];
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  fabrics,
  onNavigate,
  onUpdateFabric,
  suppliersList,
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'grouping' | 'export_missing'>('directory');
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(suppliersList || INITIAL_SUPPLIERS);

  // Sync when suppliersList prop changes
  React.useEffect(() => {
    if (suppliersList) {
      setSuppliers(suppliersList);
    }
  }, [suppliersList]);
  const [groupingCandidates, setGroupingCandidates] = useState<GroupingCandidate[]>(INITIAL_GROUPING_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierForExport, setSelectedSupplierForExport] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSupplierId, setCopiedSupplierId] = useState<string | null>(null);
  const [collapsedSuppliers, setCollapsedSuppliers] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Missing items per supplier
  const missingBySupplier = useMemo(() => {
    const map = new Map<string, FabricMaster[]>();
    fabrics.forEach((f) => {
      if ((f.missingFields?.length || 0) > 0 || f.weight?.value === null || !f.bulkPrice?.value) {
        const list = map.get(f.supplierName) || [];
        list.push(f);
        map.set(f.supplierName, list);
      }
    });
    return map;
  }, [fabrics]);

  // Grouping candidates grouped by supplier
  const groupedCandidates = useMemo(() => {
    const map = new Map<string, GroupingCandidate[]>();
    groupingCandidates.forEach((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.suggestedName.toLowerCase().includes(q);
        const matchCode = item.supplierItemCode.toLowerCase().includes(q);
        const matchSupp = item.supplierName.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSupp) return;
      }
      const list = map.get(item.supplierName) || [];
      list.push(item);
      map.set(item.supplierName, list);
    });
    return Array.from(map.entries());
  }, [groupingCandidates, searchQuery]);

  // Handle grouping actions
  const handleGroupingAction = (id: string, action: 'confirmed' | 'split' | 'deferred') => {
    setGroupingCandidates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );

    const msg =
      action === 'confirmed'
        ? '已确认合并为同款面料主档，并提取对应颜色款式'
        : action === 'split'
        ? '已拆分为独立的面料草稿候选'
        : '已标记稍后处理';

    showToast(msg);
  };

  // Batch confirm grouping for a supplier
  const handleBatchConfirmSupplier = (supplierName: string) => {
    setGroupingCandidates((prev) =>
      prev.map((item) =>
        item.supplierName === supplierName && item.ruleTier === 'auto_group'
          ? { ...item, status: 'confirmed' }
          : item
      )
    );
    showToast(`已确认【${supplierName}】旗下所有建议同款记录！`);
  };

  // Copy inquiry text for a specific supplier
  const handleCopyInquiryForSupplier = (supplier: SupplierProfile, missingList: FabricMaster[]) => {
    const itemsText = missingList
      .map(
        (f, idx) =>
          `${idx + 1}. 款号/货号【${f.supplierItemCode.value}】(${f.name.value})：缺失【${f.missingFields.join('、') || '大货克重、大货价格'}】`
      )
      .join('\n');

    const script = `【${supplier.name} ${supplier.contactPerson}您好】\n我们正在整理贵司最新一季面料的主档建档资料，以下 ${missingList.length} 款面料尚需补充关键参数，请协助提供：\n\n${itemsText}\n\n期待您的回复，感谢配合！`;

    navigator.clipboard?.writeText(script);
    setCopiedSupplierId(supplier.id);
    setTimeout(() => setCopiedSupplierId(null), 2500);
    showToast(`已复制发给【${supplier.shortName}】的催交通知文案！`);
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.codePrefix.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.categorySpecialty.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [suppliers, searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-zinc-900" />
            供应商管理
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            供应商档案名录、按厂同款归组确认与专属待补充数据催交
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            供应商名录与档案 ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('grouping')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grouping'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span>同款归组确认</span>
            <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
          </button>
          <button
            onClick={() => setActiveTab('export_missing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'export_missing'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            专属数据催交与导出
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-zinc-900 text-white text-xs rounded-xl flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索供应商名称、简称、编码前缀、联系人或主营品类..."
            className="w-full text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden"
          />
        </div>
        <span className="text-xs text-zinc-400 font-mono">共检索到 {filteredSuppliers.length} 家合作供应商</span>
      </div>

      {/* Tab 1: Supplier Directory */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => {
            const supplierMissingList = missingBySupplier.get(supplier.name) || [];
            const missingCount = supplierMissingList.length;

            return (
              <motion.div
                key={supplier.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                          {supplier.codePrefix}
                        </span>
                        <span className="text-xs font-bold text-zinc-700 bg-zinc-50 px-2 py-0.5 rounded-lg border border-zinc-200">
                          {supplier.shortName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            supplier.cooperationTier === '战略合作'
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {supplier.cooperationTier}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-950 mt-2">{supplier.name}</h3>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{supplier.contactPerson}</span>
                      <span className="text-zinc-300">•</span>
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-mono text-zinc-800 font-medium">{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{supplier.city}</span>
                    </div>
                  </div>

                  {/* Category Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(supplier.categorySpecialty || []).map((cat, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-md font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">在库面料</span>
                      <span className="font-bold text-zinc-950 font-mono">{supplier.totalFabricsCount} 款</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">待补数据</span>
                      <span
                        className={`font-bold font-mono ${
                          missingCount > 0 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {missingCount} 款
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {missingCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedSupplierForExport(supplier.name);
                          setActiveTab('export_missing');
                        }}
                        className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        催交清单
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('fabric_wall', supplier.name)}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      查看面料
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Grouping by Supplier */}
      {activeTab === 'grouping' && (
        <div className="space-y-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
            <p className="font-bold text-zinc-900 mb-1">同款候选确认：</p>
            • 同一供应商下的相关色卡、报价和详情页会集中展示。<br />
            • 请对照货号和规格，确认合并或分开保留。
          </div>

          {groupedCandidates.map(([supplierName, items]) => {
            const isCollapsed = collapsedSuppliers[supplierName];
            const autoGroupCount = items.filter((i) => i.ruleTier === 'auto_group').length;

            return (
              <div
                key={supplierName}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs"
              >
                {/* Supplier Header */}
                <div className="px-6 py-4 bg-zinc-50/80 border-b border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-zinc-700" />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-950">{supplierName}</h3>
                      <span className="text-xs text-zinc-500 font-mono">共 {items.length} 组归组候选</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {autoGroupCount > 0 && (
                      <button
                        onClick={() => handleBatchConfirmSupplier(supplierName)}
                        className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs transition-all"
                      >
                        一键确认该厂 ({autoGroupCount} 组)
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate List */}
                <div className="p-6 divide-y divide-zinc-100">
                  {items.map((candidate) => (
                    <div key={candidate.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                          <img
                            src={candidate.primaryImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-950">
                              原厂货号: {candidate.supplierItemCode}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {candidate.ruleTier === 'auto_group' ? '建议同款' : '待人工确认'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-950">{candidate.suggestedName}</h4>
                          <p className="text-xs text-zinc-500 font-sans">{candidate.composition} • {candidate.weightGsm ? `${candidate.weightGsm} gsm` : '缺克重'}</p>
                          <div className="flex items-center gap-1.5 pt-1">
                            {(candidate.colorVariantsDetected ?? []).length > 0 ? (
                              candidate.colorVariantsDetected.map((color, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
                                >
                                  {color}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-zinc-400">暂未识别颜色</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {candidate.status === 'confirmed' ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            已确认归组
                          </span>
                        ) : candidate.status === 'split' ? (
                          <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-xl text-xs font-medium">
                            已拆分为独立款
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleGroupingAction(candidate.id, 'split')}
                              className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                            >
                              拆分独立
                            </button>
                            <button
                              onClick={() => handleGroupingAction(candidate.id, 'confirmed')}
                              className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs"
                            >
                              确认同款归组
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Dedicated Excel Export & Follow-up per Supplier */}
      {activeTab === 'export_missing' && (
        <div className="space-y-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
            <div>
              <p className="font-bold text-zinc-950">专属供应商 Excel 导出逻辑：</p>
              <p className="mt-0.5 text-zinc-500">每个供应商生成单独专属的待补充清单表格，绝不将不同供应商的数据混合在同一张表内。</p>
            </div>
            <button
              onClick={() => showToast('已成功一键批量打包导出所有供应商的独立 Excel 清单压缩包！')}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>一键批量打包导出各厂独立表</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {suppliers.map((supplier) => {
              const missingList = missingBySupplier.get(supplier.name) || [];
              if (missingList.length === 0) return null;

              return (
                <div
                  key={supplier.id}
                  className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4"
                >
                  {/* Supplier Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-950 text-white">
                          {supplier.codePrefix}
                        </span>
                        <h3 className="text-base font-bold text-zinc-950">{supplier.name}</h3>
                        <span className="text-xs text-zinc-500">
                          (对接人: {supplier.contactPerson} • {supplier.phone})
                        </span>
                      </div>
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        当前共有 {missingList.length} 款面料缺少核心参数需要该供应商补充
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyInquiryForSupplier(supplier, missingList)}
                        className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        {copiedSupplierId === supplier.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-zinc-900" />
                            <span>已复制催交通知</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-500" />
                            <span>复制微信/邮件通知</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          showToast(`已生成并下载【${supplier.shortName}_待补充清单_20260816.xlsx】`)
                        }
                        className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs flex items-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-zinc-300" />
                        <span>下载该厂专属 Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Missing Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[11px]">
                        <tr>
                          <th className="p-3">系统统一编号</th>
                          <th className="p-3">原厂货号</th>
                          <th className="p-3">面料名称</th>
                          <th className="p-3">缺失待补充参数</th>
                          <th className="p-3">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {missingList.map((f) => (
                          <tr key={f.id} className="hover:bg-zinc-50/50">
                            <td className="p-3 font-mono font-bold text-zinc-950">
                              {f.systemCode || `${supplier.codePrefix}-${f.id}`}
                            </td>
                            <td className="p-3 font-mono text-zinc-800">{f.supplierItemCode.value}</td>
                            <td className="p-3 font-medium text-zinc-950">{f.name.value}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium">
                                {f.missingFields.join('、') || '大货克重、大货价格'}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-400 font-mono">待回函</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
