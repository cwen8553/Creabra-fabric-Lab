import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Download,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  MessageSquare,
  FileSpreadsheet,
  X,
  Edit3,
  Save,
  ChevronRight,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster } from '../types';

interface MissingCenterViewProps {
  fabrics: FabricMaster[];
  onUpdateFabric: (fabric: FabricMaster) => void;
  onNavigateToReview: (fabricId: string) => void;
}

export const MissingCenterView: React.FC<MissingCenterViewProps> = ({
  fabrics = [],
  onUpdateFabric,
  onNavigateToReview,
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedFieldType, setSelectedFieldType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick inline replenishment state per fabric ID
  const [replenishInputs, setReplenishInputs] = useState<{
    [fabricId: string]: {
      weight?: string;
      bulkPrice?: string;
      width?: string;
      composition?: string;
    };
  }>({});

  // Extract fabrics that have missing items
  const missingItems = useMemo(() => {
    return (fabrics || []).filter(
      (f) =>
        (f.missingFields?.length || 0) > 0 ||
        f.reviewStatus === 'missing_info' ||
        f.weight?.value === null ||
        !f.bulkPrice?.value
    );
  }, [fabrics]);

  // Unique suppliers from missing items
  const suppliers = useMemo(() => {
    return Array.from(new Set(missingItems.map((f) => f.supplierName || '未知供应商')));
  }, [missingItems]);

  const filteredItems = useMemo(() => {
    return missingItems.filter((item) => {
      if (selectedSupplier !== 'all' && item.supplierName !== selectedSupplier) {
        return false;
      }
      if (selectedFieldType !== 'all') {
        const hasField = item.missingFields?.some((mf) => mf.includes(selectedFieldType));
        if (!hasField) return false;
      }
      return true;
    });
  }, [missingItems, selectedSupplier, selectedFieldType]);

  const handleCopyInquiry = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleInputChange = (fabricId: string, field: string, value: string) => {
    setReplenishInputs((prev) => ({
      ...prev,
      [fabricId]: {
        ...prev[fabricId],
        [field]: value,
      },
    }));
  };

  // Direct manual replenishment submit
  const handleSaveReplenishment = (fabric: FabricMaster) => {
    const inputs = replenishInputs[fabric.id] || {};
    let updated: FabricMaster = { ...fabric };
    let filledCount = 0;

    if (inputs.weight !== undefined && inputs.weight.trim() !== '') {
      const num = parseFloat(inputs.weight);
      if (!isNaN(num)) {
        updated.weight = { value: num, unit: 'gsm', status: 'confirmed', confidence: 1.0 };
        updated.missingFields = updated.missingFields.filter((f) => !f.includes('克重'));
        filledCount++;
      }
    }

    if (inputs.bulkPrice !== undefined && inputs.bulkPrice.trim() !== '') {
      const num = parseFloat(inputs.bulkPrice);
      if (!isNaN(num)) {
        updated.bulkPrice = { value: num, unit: 'm', status: 'confirmed', confidence: 1.0 };
        updated.priceUnit = '元/米';
        updated.priceType = '大货价';
        updated.missingFields = updated.missingFields.filter((f) => !f.includes('价格'));
        filledCount++;
      }
    }

    if (inputs.width !== undefined && inputs.width.trim() !== '') {
      const num = parseFloat(inputs.width);
      if (!isNaN(num)) {
        updated.width = { value: num, unit: 'cm', status: 'confirmed', confidence: 1.0 };
        updated.missingFields = updated.missingFields.filter((f) => !f.includes('门幅'));
        filledCount++;
      }
    }

    if (inputs.composition !== undefined && inputs.composition.trim() !== '') {
      updated.composition = { value: inputs.composition.trim(), status: 'confirmed', confidence: 1.0 };
      updated.missingFields = updated.missingFields.filter((f) => !f.includes('成分'));
      filledCount++;
    }

    if (filledCount === 0) {
      setToastMessage('请先在输入框中填入需要补录的数据数值');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    if (updated.missingFields.length === 0) {
      updated.reviewStatus = 'pending_review';
    }

    onUpdateFabric(updated);
    setToastMessage(`已成功补录【${fabric.id}】的数据字段，资料已实时更新！`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-zinc-800" />
            待补充中心
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            集中管理资料不全的面料档案，支持在列表直接填写补录数值，或一键导出向供应商索要
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium shadow-2xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-zinc-200" />
          <span>导出待补充清单 (Excel)</span>
        </motion.button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-zinc-900 text-white text-xs rounded-xl flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Supplier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 font-medium">按供应商筛选:</span>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-zinc-900 focus:outline-hidden cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">全部供应商 ({suppliers.length} 家)</option>
              {suppliers.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Missing Field Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 font-medium">缺失类型:</span>
            <select
              value={selectedFieldType}
              onChange={(e) => setSelectedFieldType(e.target.value)}
              className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-zinc-900 focus:outline-hidden cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">全部缺失类型</option>
              <option value="克重">缺失克重 (影响厚薄与季节分类)</option>
              <option value="价格">价格不完整 (影响成本核算)</option>
              <option value="门幅">缺失门幅 (影响用量计算)</option>
              <option value="成分">成分待明确</option>
            </select>
          </div>
        </div>

        <span className="text-zinc-500 font-mono text-xs">
          当前待补条目: {filteredItems.length} 款
        </span>
      </div>

      {/* Missing Items List Cards */}
      <div className="space-y-4">
        {filteredItems.map((fabric) => {
          const currentInputs = replenishInputs[fabric.id] || {};
          const inquiryScript = `您好，请教一下贵司【${fabric.supplierItemCode.value} - ${fabric.name.value}】的${
            fabric.weight.value === null ? '实测克重(gsm)范围' : ''
          }${!fabric.bulkPrice.value || fabric.priceUnit === '暂缺' ? '大货单价与计价单位' : ''}？我们正在打样选版，期待您的确认！`;

          return (
            <div
              key={fabric.id}
              className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-zinc-100 gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                    <img src={fabric.mainImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full">
                        {fabric.id}
                      </span>
                      <h3 className="font-bold text-zinc-950 text-sm">{fabric.name.value}</h3>
                      <span className="text-xs bg-zinc-50 text-zinc-700 border border-zinc-200 px-2.5 py-0.5 rounded-full font-medium">
                        货号: {fabric.supplierItemCode.value}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      供应商: <span className="font-medium text-zinc-800">{fabric.supplierName}</span> ({fabric.supplierContact} • {fabric.supplierPhone})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToReview(fabric.id)}
                    className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>进入完整审核</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Grid: Missing Fields & Quick Replenish Form + Inquiry Script */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                {/* Left 6 Cols: Direct Quick Replenishment Form */}
                <div className="lg:col-span-6 bg-zinc-50/80 rounded-xl p-4 border border-zinc-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-zinc-700" />
                      快捷补录输入框：
                    </span>
                    <span className="text-[11px] text-zinc-500">填写后点击右下角保存</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Weight Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-600 block">
                        克重 (gsm) {fabric.weight.value === null && <span className="text-zinc-500 font-bold">*缺失</span>}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder={fabric.weight.value !== null ? `${fabric.weight.value}` : '如 180'}
                          value={currentInputs.weight ?? ''}
                          onChange={(e) => handleInputChange(fabric.id, 'weight', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                        />
                        <span className="text-zinc-400 text-[10px]">gsm</span>
                      </div>
                    </div>

                    {/* Bulk Price Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-600 block">
                        大货价 (元/米) {!fabric.bulkPrice.value && <span className="text-zinc-500 font-bold">*缺失</span>}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder={fabric.bulkPrice.value ? `${fabric.bulkPrice.value}` : '如 35.5'}
                          value={currentInputs.bulkPrice ?? ''}
                          onChange={(e) => handleInputChange(fabric.id, 'bulkPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                        />
                        <span className="text-zinc-400 text-[10px]">¥</span>
                      </div>
                    </div>

                    {/* Width Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-600 block">门幅 (cm)</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder={fabric.width.value ? `${fabric.width.value}` : '如 150'}
                          value={currentInputs.width ?? ''}
                          onChange={(e) => handleInputChange(fabric.id, 'width', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                        />
                        <span className="text-zinc-400 text-[10px]">cm</span>
                      </div>
                    </div>

                    {/* Composition Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-600 block">成分配比</label>
                      <input
                        type="text"
                        placeholder={fabric.composition.value || '如 100% 纯棉'}
                        value={currentInputs.composition ?? ''}
                        onChange={(e) => handleInputChange(fabric.id, 'composition', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSaveReplenishment(fabric)}
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存补录数据</span>
                    </button>
                  </div>
                </div>

                {/* Right 6 Cols: Suggested Inquiry Script */}
                <div className="lg:col-span-6 bg-zinc-50/80 rounded-xl p-4 border border-zinc-200/80 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2">
                      <span className="font-medium text-zinc-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                        跟进话术模板：
                      </span>
                      <button
                        onClick={() => handleCopyInquiry(fabric.id, inquiryScript)}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[11px] font-medium text-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === fabric.id ? (
                          <>
                            <Check className="w-3 h-3 text-zinc-900" />
                            <span>已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-500" />
                            <span>一键复制</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-zinc-600 text-[11px] leading-relaxed bg-white p-3 rounded-lg border border-zinc-200">
                      {inquiryScript}
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    可直接复制发送给供应商微信群或邮件沟通，收到反馈后在左侧直接录入即可。
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Checklist Modal */}
      <AnimatePresence>
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-zinc-900" />
                  <h3 className="font-bold text-zinc-950 text-sm">
                    导出供应商待补充资料清单
                  </h3>
                </div>
                <button
                  onClick={() => setExportModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-600">
                <p className="text-zinc-500 leading-relaxed">
                  系统已汇总待补充项目，包含面料编号、供应商货号、缺失字段及跟进状态：
                </p>

                <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] text-zinc-500 font-mono">
                      <tr>
                        <th className="p-2.5 font-medium">内部编号</th>
                        <th className="p-2.5 font-medium">供应商</th>
                        <th className="p-2.5 font-medium">货号</th>
                        <th className="p-2.5 font-medium">待补充字段</th>
                        <th className="p-2.5 font-medium">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredItems.map((f) => (
                        <tr key={f.id} className="hover:bg-zinc-50/50">
                          <td className="p-2.5 font-mono font-medium text-zinc-950">{f.id}</td>
                          <td className="p-2.5 truncate max-w-xs font-medium text-zinc-900">{f.supplierName}</td>
                          <td className="p-2.5 font-mono">{f.supplierItemCode.value}</td>
                          <td className="p-2.5 text-zinc-700">{f.missingFields.join(', ') || '克重/价格'}</td>
                          <td className="p-2.5 text-zinc-400 font-mono">待回函</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">按供应商分别生成独立表格，不混杂多供应商数据</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExportModalOpen(false);
                      setToastMessage('已按各供应商单独打包生成对应的专属 Excel 清单！');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-2xs"
                  >
                    按供应商分别导出专属 .xlsx
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
