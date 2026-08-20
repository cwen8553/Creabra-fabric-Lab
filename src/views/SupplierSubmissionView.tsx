import React, { useState } from 'react';
import {
  Send,
  Building2,
  Phone,
  User,
  Tag,
  Layers,
  Palette,
  Check,
  ArrowRight,
  Shield,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FabricMaster } from '../types';

interface SupplierSubmissionViewProps {
  onAddNewFabric: (newFabric: FabricMaster) => void;
  onNavigateToInbox: () => void;
}

export const SupplierSubmissionView: React.FC<SupplierSubmissionViewProps> = ({
  onAddNewFabric,
  onNavigateToInbox,
}) => {
  const [supplierName, setSupplierName] = useState('柯桥恒茂纺织科技有限公司');
  const [contactName, setContactName] = useState('陈经理');
  const [contactPhone, setContactPhone] = useState('138-5758-9921');
  const [fabricName, setFabricName] = useState('75D 莫代尔速干透气高弹平纹布');
  const [itemCode, setItemCode] = useState('HM-2025-MOD88');
  const [composition, setComposition] = useState('78% 兰精莫代尔 16% 涤纶 6% 氨纶');
  const [weight, setWeight] = useState('185');
  const [width, setWidth] = useState('165');
  const [marketFabricType, setMarketFabricType] = useState('莫代尔');
  const [selectedSpecialCrafts, setSelectedSpecialCrafts] = useState<string[]>(['磨毛/拉绒']);
  const [weaveCategory, setWeaveCategory] = useState<'梭织' | '针织' | '非织造'>('针织');
  const [weaveStructure, setWeaveStructure] = useState('单面平纹');
  const [elasticity, setElasticity] = useState<'无弹' | '微弹' | '二面弹' | '四面弹'>('四面弹');
  const [opacity, setOpacity] = useState<'不透明' | '半透明' | '透明'>('不透明');
  const [bulkPrice, setBulkPrice] = useState('29.5');
  const [priceUnit, setPriceUnit] = useState('元/米');
  const [priceType, setPriceType] = useState('大货含税出厂价');
  const [moq, setMoq] = useState('500');
  const [leadTime, setLeadTime] = useState('15-20天');
  const [functions, setFunctions] = useState('吸湿排汗, 亲肤透气, 四面高弹, 抗菌防臭');

  const toggleSpecialCraft = (craft: string) => {
    setSelectedSpecialCrafts((prev) =>
      prev.includes(craft) ? prev.filter((c) => c !== craft) : [...prev, craft]
    );
  };

  // Color variants list
  const [colorVariants, setColorVariants] = useState([
    { name: '冷雾蓝', code: '08-Cloud', hex: '#63829b' },
    { name: '极光黑', code: '01-Black', hex: '#181b20' },
    { name: '奶油杏', code: '03-Almond', hex: '#eae2cf' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const handleAddColor = () => {
    setColorVariants([
      ...colorVariants,
      { name: '新颜色', code: `C-0${colorVariants.length + 1}`, hex: '#778899' },
    ]);
  };

  const handleRemoveColor = (idx: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomId = `FAB-${String(Math.floor(Math.random() * 800) + 100)}`;
    const submissionToken = `SUB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 8999 + 1000)}`;

    const newFabric: FabricMaster = {
      id: randomId,
      name: { value: fabricName, status: 'pending_review', confidence: 0.98 },
      supplierItemCode: { value: itemCode, status: 'confirmed', confidence: 1.0 },
      supplierName,
      supplierContact: contactName,
      supplierPhone: contactPhone,
      category: { value: '运动休闲/贴身内搭', status: 'confirmed', confidence: 0.95 },
      marketFabricType: { value: marketFabricType, status: 'confirmed', confidence: 0.98 },
      specialCrafts: selectedSpecialCrafts,
      composition: { value: composition, status: 'confirmed', confidence: 0.98 },
      compositionBreakdown: [
        { fiber: '兰精莫代尔', percentage: 78 },
        { fiber: '涤纶', percentage: 16 },
        { fiber: '氨纶', percentage: 6 },
      ],
      weight: { value: Number(weight) || 185, unit: 'gsm', status: 'confirmed', confidence: 0.95 },
      width: { value: Number(width) || 165, unit: 'cm', status: 'confirmed', confidence: 0.95 },
      yarnCount: { value: '50S/1 莫代尔 + 75D/36F DTY', status: 'pending_review', confidence: 0.9 },
      weaveCategory: { value: weaveCategory, status: 'confirmed', confidence: 0.99 },
      weaveStructure: { value: weaveStructure, status: 'confirmed', confidence: 0.95 },
      elasticity: { value: elasticity, status: 'confirmed', confidence: 0.98 },
      opacity: { value: opacity, status: 'confirmed', confidence: 0.95 },
      drape: { value: '垂顺', status: 'confirmed', confidence: 0.95 },
      pattern: '素色纯色',
      sheen: '微光泽',
      mainColorFamily: '蓝色系',
      mainImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      detailImages: [
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      ],
      colorVariants: colorVariants.map((c, i) => ({
        id: `v-${i}`,
        supplierColorName: c.name,
        standardColorName: c.name,
        standardFamily: '蓝色系',
        supplierColorCode: c.code,
        hex: c.hex,
        temp: '冷色' as const,
        brightness: '中明度' as const,
        saturation: '中饱和' as const,
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
        status: 'confirmed' as const,
        confidence: 0.98,
      })),
      bulkPrice: { value: Number(bulkPrice) || 29.5, status: 'confirmed', confidence: 1.0 },
      basePrice: { value: Number(bulkPrice) || 29.5, status: 'confirmed', confidence: 1.0 },
      currency: 'CNY',
      priceUnit,
      priceType: '大货价',
      moq: { value: Number(moq) || 500, unit: '米', status: 'confirmed', confidence: 1.0 },
      leadTime: { value: leadTime, status: 'confirmed', confidence: 1.0 },
      functions: functions.split(/[,，]/).map((f) => ({
        name: f.trim(),
        evidenceLevel: 'supplier_declared' as const,
        status: 'confirmed' as const,
      })),
      recommendedGarments: ['高弹运动T恤', '瑜伽服/骑行短裤', '防晒内搭', '无痕文胸罩杯'],
      unsuitableGarments: ['硬挺风衣', '厚重西装'],
      usageRisks: ['莫代尔纤维吸湿后强力稍有下降，建议洗水轻柔机洗'],
      completeness: { basic: 100, matching: 95, commercial: 95, overall: 96 },
      reviewStatus: 'pending_review',
      sources: [
        {
          id: 'src-sub-1',
          sourceId: 'SUBMISSION-PORTAL',
          type: 'pdf',
          title: `供应商在线填报录入 (${supplierName})`,
          thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
          extractedAt: new Date().toISOString().split('T')[0],
          ocrSnippets: [
            {
              field: '面料规格与成分',
              text: `${fabricName} - ${composition} - ${weight}gsm`,
              confidence: 0.99,
            },
          ],
        },
      ],
      conflictFields: [],
      missingFields: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      onAddNewFabric(newFabric);
      setIsSubmitting(false);
      setSubmittedToken(submissionToken);
    }, 800);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="os26-glass rounded-3xl border border-zinc-200/90 p-7 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-zinc-950">
          <Send className="w-5 h-5 text-zinc-900" />
          <span className="font-bold text-xs uppercase tracking-widest text-zinc-400 font-mono">Creabra 供应链标准化对接</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-950">
          供应商面料资料在线填报单
        </h1>
        <p className="text-xs text-zinc-500 leading-relaxed font-sans">
          尊敬的供应商合作伙伴：请您完整填报面料物理参数与商务条件。提交后系统将通过 AI 自动解析并建立面料数字主档。
        </p>
      </div>

      {/* Success Modal if Submitted */}
      {submittedToken && (
        <div className="p-6 bg-zinc-950 text-white rounded-3xl space-y-4 animate-in zoom-in-95 border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-zinc-950 rounded-full">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                面料资料已成功提交！
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                收录凭证编码：<span className="font-mono font-bold text-white">{submittedToken}</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            该面料已自动流转至 Creabra 内部审核工作台（状态：待确认审核），并同步建立多模态数字化档案。
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedToken(null);
                setFabricName('');
                setItemCode('');
              }}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              继续提交下一款面料
            </button>
            <button
              onClick={onNavigateToInbox}
              className="px-4 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>查看导入收件箱与审核工作台</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Form Card */}
      {!submittedToken && (
        <form onSubmit={handleSubmit} className="os26-card rounded-3xl p-8 shadow-xs space-y-6">
          {/* Section 1: Supplier Info */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-900" />
              1. 供应商主体与联系人信息
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  供应商企业名称 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  对接业务联系人 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  联系电话 / 微信 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-mono font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fabric Specs */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-900" />
              2. 面料品名与物理规格参数
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  供应商面料品名 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fabricName}
                  onChange={(e) => setFabricName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  供应商货号 / 条码 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-mono font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="text-zinc-700 font-bold block mb-1">
                  成分配比 (例: 78%莫代尔 16%涤纶 6%氨纶) <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  实测克重 (gsm) <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-mono font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-zinc-700 font-bold block mb-1">实用门幅 (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 font-mono focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">通用面料名称分类</label>
                <select
                  value={marketFabricType}
                  onChange={(e) => setMarketFabricType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 cursor-pointer focus:outline-hidden shadow-2xs font-medium"
                >
                  <option value="莫代尔">莫代尔</option>
                  <option value="牛仔">牛仔布</option>
                  <option value="雪纺">雪纺</option>
                  <option value="丝绸">丝绸 / 绸缎</option>
                  <option value="卫衣布">卫衣布 / 毛圈</option>
                  <option value="罗马布">罗马布 (高密)</option>
                  <option value="灯芯绒">灯芯绒</option>
                  <option value="欧根纱">欧根纱</option>
                  <option value="粗花呢">粗花呢</option>
                  <option value="华夫格">华夫格</option>
                  <option value="缎面">缎面</option>
                  <option value="府绸">府绸</option>
                  <option value="斜纹布">斜纹布</option>
                  <option value="针织罗纹">针织罗纹</option>
                  <option value="速干网眼">速干网眼</option>
                  <option value="双层棉纱">双层棉纱</option>
                  <option value="纯棉平纹">纯棉平纹</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">弹性等级</label>
                <select
                  value={elasticity}
                  onChange={(e: any) => setElasticity(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 cursor-pointer focus:outline-hidden shadow-2xs font-medium"
                >
                  <option value="四面弹">四面弹 (高弹)</option>
                  <option value="二面弹">二面弹 (单向)</option>
                  <option value="微弹">微弹</option>
                  <option value="无弹">无弹</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">透光透明度</label>
                <select
                  value={opacity}
                  onChange={(e: any) => setOpacity(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 cursor-pointer focus:outline-hidden shadow-2xs font-medium"
                >
                  <option value="不透明">不透明</option>
                  <option value="半透明">半透明</option>
                  <option value="透明">透明</option>
                </select>
              </div>
            </div>

            {/* Special Crafts Selection */}
            <div className="pt-2">
              <label className="text-zinc-700 font-bold block mb-1.5 text-xs">
                特殊工艺打标 (多选：绣花、蕾丝、烧花、织锦等)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '绣花',
                  '蕾丝',
                  '烧花',
                  '织锦',
                  '压褶',
                  '烫金',
                  '植绒',
                  '拔印',
                  '提花',
                  '磨毛/拉绒',
                  '水洗石磨',
                  '复合涂层',
                ].map((craft) => {
                  const isChecked = selectedSpecialCrafts.includes(craft);
                  return (
                    <button
                      key={craft}
                      type="button"
                      onClick={() => toggleSpecialCraft(craft)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-zinc-950 text-white shadow-2xs'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200/80'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                      <span>{craft}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Color Variants */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-900" />
                3. 可供颜色款式清单 ({colorVariants.length} 色)
              </h2>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-xs text-zinc-950 hover:text-zinc-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> 添加颜色款式
              </button>
            </div>

            <div className="space-y-2">
              {colorVariants.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs"
                >
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[idx].hex = e.target.value;
                      setColorVariants(updated);
                    }}
                    className="w-8 h-8 rounded-full border border-zinc-300 cursor-pointer bg-transparent shadow-2xs"
                  />
                  <input
                    type="text"
                    placeholder="颜色名称 (如 雾霾蓝)"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[idx].name = e.target.value;
                      setColorVariants(updated);
                    }}
                    className="flex-1 bg-white border border-zinc-200 rounded-xl p-2 text-zinc-900 font-bold focus:outline-hidden shadow-2xs"
                  />
                  <input
                    type="text"
                    placeholder="色号代码 (如 08-Cloud)"
                    value={c.code}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[idx].code = e.target.value;
                      setColorVariants(updated);
                    }}
                    className="w-36 bg-white border border-zinc-200 rounded-xl p-2 font-mono text-zinc-900 focus:outline-hidden shadow-2xs"
                  />
                  {colorVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Commercial Pricing & Terms */}
          <div className="space-y-4 pb-6 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-900" />
              4. 商务价格与交付条款 (仅对采购方保密显示)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  大货单价 (CNY) <span className="text-zinc-400 font-mono">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 font-mono font-bold focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">
                  计价单位 <span className="text-zinc-400 font-mono">*</span>
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 cursor-pointer focus:outline-hidden shadow-2xs font-bold"
                >
                  <option value="元/米">元 / 米</option>
                  <option value="元/公斤">元 / 公斤</option>
                  <option value="元/码">元 / 码</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">价格条件类型</label>
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 cursor-pointer focus:outline-hidden shadow-2xs font-medium"
                >
                  <option value="大货含税出厂价">大货含税出厂价</option>
                  <option value="大货未税自提价">大货未税自提价</option>
                  <option value="含运费到厂价">含运费到厂价</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 font-bold block mb-1">起订量 (MOQ)</label>
                <input
                  type="number"
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 font-mono focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 font-bold block mb-1">
                功能声明与质检背书 (逗号分隔)
              </label>
              <input
                type="text"
                value={functions}
                onChange={(e) => setFunctions(e.target.value)}
                placeholder="如: 吸湿排汗, 亲肤透气, 四面高弹, 抗菌防臭"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-zinc-900 focus:outline-hidden shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-4">
            <span className="text-xs text-zinc-400 font-sans">
              数据提交后由 Creabra 进行 AI 验真与多维归档
            </span>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>正在加密上传并生成主档...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>提交面料资料并生成建档记录</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
};
