import React, { useState } from 'react';
import {
  UploadCloud,
  Upload,
  Globe,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Trash2,
  Play,
  Check,
  ChevronRight,
  Plus,
  Building2,
  User,
  Phone,
  Tag,
  Palette,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster, ImportJob } from '../types';
import { SingleFabricAiExtractor, ExtractedFabricData, ExtraAttachment } from '../components/SingleFabricAiExtractor';
import { INITIAL_SUPPLIERS, SupplierProfile } from '../mockData';

interface InboxViewProps {
  onNavigate: (tab: string) => void;
  onAddNewFabric?: (newFabric: FabricMaster) => void;
  importJobs?: ImportJob[];
  suppliers?: SupplierProfile[];
}

export const InboxView: React.FC<InboxViewProps> = ({
  onNavigate,
  onAddNewFabric,
  importJobs = [],
  suppliers = INITIAL_SUPPLIERS,
}) => {
  const [activeTab, setActiveTab] = useState<'batch' | 'single'>('batch');
  const [urlInput, setUrlInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateStage, setSimulateStage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentExtraAttachments, setCurrentExtraAttachments] = useState<ExtraAttachment[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mock batch inbox items
  const [inboxItems, setInboxItems] = useState([
    {
      id: 'SRC-0001',
      type: 'color_card',
      name: '盛泰纺织_天丝60S色卡原图.jpg',
      supplier: '绍兴盛泰纺织科技有限公司',
      shortName: '盛泰',
      itemCode: 'CB-LY-2041',
      status: 'ready',
      ocrCount: 3,
      size: '2.4 MB',
      createdAt: '2026-08-16 10:15',
    },
    {
      id: 'SRC-0002',
      type: 'web_page',
      name: 'https://supplier.example.com/p/8830-nylon-spandex',
      supplier: '海宁华宇超纤新材料',
      shortName: '华宇',
      itemCode: 'HY-SP-8830',
      status: 'ready',
      ocrCount: 4,
      size: '网页数据提取',
      createdAt: '2026-08-16 10:16',
    },
    {
      id: 'SRC-0003',
      type: 'screenshot',
      name: '常州福泽_色卡翻拍局部.png',
      supplier: '常州福泽针纺制品厂',
      shortName: '福泽',
      itemCode: 'FZ-CT-901',
      status: 'needs_attention',
      ocrCount: 2,
      size: '1.8 MB',
      errorReason: '克重字段模糊缺失，已标记待补充',
      createdAt: '2026-08-16 10:18',
    },
    {
      id: 'SRC-0005',
      type: 'photo',
      name: '南通联发_多来源实物打样.jpg',
      supplier: '南通联发纺织',
      shortName: '联发',
      itemCode: 'NT-CT-3302',
      status: 'conflict',
      ocrCount: 4,
      size: '3.1 MB',
      errorReason: '网页与色卡成分标注存在差异 (纯棉 vs 棉氨混纺)',
      createdAt: '2026-08-16 10:20',
    },
  ]);

  // Single submission form state
  const [supplierName, setSupplierName] = useState('柯桥恒茂纺织科技有限公司');
  const [supplierShortName, setSupplierShortName] = useState('恒茂');
  const [contactName, setContactName] = useState('陈经理');
  const [contactPhone, setContactPhone] = useState('138-5758-9921');
  const [fabricName, setFabricName] = useState('75D 莫代尔速干透气高弹平纹布');
  const [itemCode, setItemCode] = useState('HM-2025-MOD88');
  const [composition, setComposition] = useState('78% 兰精莫代尔 16% 涤纶 6% 氨纶');
  const [weight, setWeight] = useState('185');
  const [width, setWidth] = useState('165');
  const [marketFabricType, setMarketFabricType] = useState('莫代尔');
  const [selectedSpecialCrafts, setSelectedSpecialCrafts] = useState<string[]>(['磨毛/拉绒', '吸湿速干整理']);
  const [weaveCategory, setWeaveCategory] = useState<'梭织' | '针织' | '非织造'>('针织');
  const [weaveStructure, setWeaveStructure] = useState('单面平纹');
  const [elasticity, setElasticity] = useState<'无弹' | '微弹' | '二面弹' | '四面弹'>('四面弹');
  const [opacity, setOpacity] = useState<'不透明' | '半透明' | '透明'>('不透明');
  const [basePrice, setBasePrice] = useState('25.0');
  const [bulkPrice, setBulkPrice] = useState('29.5');
  const [samplePrice, setSamplePrice] = useState('42.0');
  const [priceUnit, setPriceUnit] = useState('元/米');
  const [priceType, setPriceType] = useState('大货价');
  const [moq, setMoq] = useState('500');
  const [leadTime, setLeadTime] = useState('15-20天');
  const [functions, setFunctions] = useState('吸湿排汗, 亲肤透气, 四面高弹, 抗菌防臭');
  const [mainImage, setMainImage] = useState(
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
  );
  const [aiFilled, setAiFilled] = useState(true);

  const [colorVariants, setColorVariants] = useState([
    { name: '冷雾蓝', code: '08-Cloud', hex: '#63829b' },
    { name: '极光黑', code: '01-Black', hex: '#181b20' },
    { name: '奶油杏', code: '03-Almond', hex: '#eae2cf' },
  ]);

  const handleAiExtracted = (data: ExtractedFabricData) => {
    setSupplierName(data.supplierName);
    setSupplierShortName(data.supplierShortName);
    setContactName(data.contactName);
    setContactPhone(data.contactPhone);
    setFabricName(data.fabricName);
    setItemCode(data.itemCode);
    setMarketFabricType(data.marketFabricType);
    setComposition(data.composition);
    setWeight(data.weight);
    setWidth(data.width);
    setWeaveCategory(data.weaveCategory);
    setWeaveStructure(data.weaveStructure);
    setElasticity(data.elasticity);
    setOpacity(data.opacity);
    setSelectedSpecialCrafts(data.specialCrafts);
    setBasePrice(data.basePrice);
    setBulkPrice(data.bulkPrice);
    setSamplePrice(data.samplePrice);
    setPriceUnit(data.priceUnit);
    setMoq(data.moq);
    setLeadTime(data.leadTime);
    setFunctions(data.functions);
    setMainImage(data.mainImage);
    setColorVariants(data.colorVariants);
    if (data.extraAttachments) {
      setCurrentExtraAttachments(data.extraAttachments);
    }
    setAiFilled(true);
    showToast(`已填入【${data.fabricName}】的样例整理结果，请继续人工核对。`);
  };

  const toggleSpecialCraft = (craft: string) => {
    setSelectedSpecialCrafts((prev) =>
      prev.includes(craft) ? prev.filter((c) => c !== craft) : [...prev, craft]
    );
  };

  const handleAddColor = () => {
    setColorVariants([
      ...colorVariants,
      { name: '新颜色', code: `C-0${colorVariants.length + 1}`, hex: '#778899' },
    ]);
  };

  const handleRemoveColor = (idx: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== idx));
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulateStage(1);

    setTimeout(() => setSimulateStage(2), 1200);
    setTimeout(() => setSimulateStage(3), 2400);
    setTimeout(() => setSimulateStage(4), 3600);
    setTimeout(() => {
      setSimulateStage(5);
      setIsSimulating(false);
      showToast('样例整理已完成，请查看结果并逐项确认。');
    }, 4800);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    const newItem = {
      id: `SRC-${String(inboxItems.length + 1).padStart(4, '0')}`,
      type: 'web_page',
      name: urlInput,
      supplier: '公开网页解析中...',
      shortName: '公开源',
      itemCode: '识别中',
      status: 'ready',
      ocrCount: 3,
      size: '实时抓取',
      createdAt: '刚刚',
      errorReason: undefined,
    };

    setInboxItems([newItem, ...inboxItems]);
    setUrlInput('');
    showToast('已将网页链接加入解析队列！');
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanShort = supplierShortName.trim() || supplierName.slice(0, 2);
    const randomNum = Math.floor(Math.random() * 800) + 100;
    const randomId = `FAB-${randomNum}`;
    const autoSystemCode = `${cleanShort.toUpperCase()}-MOD-${String(randomNum).slice(-2)}`;

    const numBulk = Number(bulkPrice) || 29.5;
    const numBase = Number(basePrice) || Math.round(numBulk * 0.85 * 10) / 10;
    const numSample = Number(samplePrice) || Math.round(numBulk * 1.45 * 10) / 10;

    // Check if matching existing supplier in list
    const matchedSupplier = suppliers.find(
      (s) =>
        s.name.trim().toLowerCase() === supplierName.trim().toLowerCase() ||
        s.shortName.trim().toLowerCase() === cleanShort.toLowerCase()
    );

    const attachmentImages = currentExtraAttachments
      .map((att) => att.previewUrl)
      .filter(Boolean);

    const newFabric: FabricMaster = {
      id: randomId,
      systemCode: autoSystemCode,
      supplierShortName: matchedSupplier ? matchedSupplier.shortName : cleanShort,
      name: { value: fabricName, status: 'pending_review', confidence: 0.98, sourceEvidence: ['单款图片资料录入'] },
      supplierItemCode: { value: itemCode, status: 'confirmed', confidence: 1.0 },
      supplierName: matchedSupplier ? matchedSupplier.name : supplierName,
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
      weaveCategory: { value: weaveCategory, status: 'confirmed', confidence: 0.98 },
      weaveStructure: { value: weaveStructure, status: 'confirmed', confidence: 0.98 },
      elasticity: { value: elasticity, status: 'confirmed', confidence: 0.95 },
      opacity: { value: opacity, status: 'confirmed', confidence: 0.95 },
      drape: { value: '垂顺', status: 'confirmed', confidence: 0.9 },
      basePrice: { value: numBase, unit: priceUnit, status: 'confirmed', confidence: 0.96 },
      bulkPrice: { value: numBulk, unit: priceUnit, status: 'confirmed', confidence: 0.98 },
      samplePrice: { value: numSample, unit: priceUnit, status: 'confirmed', confidence: 0.95 },
      currency: 'CNY',
      priceUnit: priceUnit,
      priceType: '大货价',
      moq: { value: Number(moq) || 500, unit: '米', status: 'confirmed', confidence: 0.95 },
      leadTime: { value: leadTime, status: 'confirmed', confidence: 0.95 },
      yarnCount: { value: '75D', status: 'confirmed', confidence: 0.95 },
      mainColorFamily: '多色系',
      pattern: '纯色',
      sheen: '微光泽',
      detailImages: attachmentImages,
      colorVariants: (colorVariants || []).map((c, idx) => ({
        id: `VAR-${randomId}-${idx + 1}`,
        supplierColorCode: c.code || `#${idx + 1}`,
        supplierColorName: c.name || `色号${idx + 1}`,
        standardFamily: '多色系',
        standardColorName: c.name || `色号${idx + 1}`,
        hex: c.hex || '#333333',
        temp: '中性',
        brightness: '中明度',
        saturation: '中饱和',
        image: mainImage,
        status: 'confirmed' as const,
        confidence: 0.95,
      })),
      functions: (functions ? functions.split(/[,，]/) : ['四面高弹', '亲肤透气']).map((f) => ({
        name: f.trim(),
        evidenceLevel: 'supplier_declared' as const,
        status: 'confirmed' as const,
      })),
      recommendedGarments: ['高弹修身T恤', '瑜伽服/打底裤', '轻运动家居服'],
      unsuitableGarments: ['西服上衣', '硬质风衣'],
      usageRisks: ['剪裁时需注意卷边防护', '高温熨烫需控制在110度以内'],
      alternativeFabrics: [
        {
          name: '高弹天丝双面提花',
          enName: 'Tencel High Stretch Jacquard',
          weight: '190 gsm',
          composition: '65% 莱赛尔 30% 锦纶 5% 氨纶',
          similarityNote: '触感更加丝滑垂顺，适合中高端内衣与家居服',
        },
        {
          name: '精梳棉氨纶双面平纹',
          enName: 'Combed Cotton Spandex Single Jersey',
          weight: '180 gsm',
          composition: '95% 棉 5% 氨纶',
          similarityNote: '纯棉透气亲肤，弹性稍低于莫代尔',
        }
      ],
      mainImage: mainImage,
      reviewStatus: 'pending_review',
      sources: currentExtraAttachments && currentExtraAttachments.length > 0
        ? currentExtraAttachments.map((att, i) => ({
            id: `SRC-ATT-${randomId}-${i + 1}`,
            sourceId: `SRC-${randomId}-${i + 1}`,
            type: (att.type === 'pdf' ? 'pdf' : att.type === 'image' ? 'photo' : 'color_card') as any,
            title: att.name || `附件凭证 #${i + 1}`,
            thumbnail: att.previewUrl || mainImage,
            extractedAt: new Date().toISOString().split('T')[0],
            ocrSnippets: [
              { field: '面料品名', text: fabricName, confidence: 0.95 },
              { field: '纤维成分', text: composition, confidence: 0.96 },
              { field: '克重门幅', text: `${weight} gsm / ${width} cm`, confidence: 0.94 },
            ],
          }))
        : [
            {
              id: `SRC-ATT-${randomId}-1`,
              sourceId: `SRC-${randomId}-1`,
              type: 'photo' as const,
              title: `${fabricName} - 原始主图特写`,
              thumbnail: mainImage,
              extractedAt: new Date().toISOString().split('T')[0],
              ocrSnippets: [
                { field: '品名', text: fabricName, confidence: 0.95 },
                { field: '原厂款号', text: itemCode, confidence: 0.95 },
              ],
            },
          ],
      missingFields: [],
      conflictFields: [],
      completeness: {
        basic: 100,
        matching: 100,
        commercial: 100,
        overall: 100,
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (onAddNewFabric) {
      onAddNewFabric(newFabric);
    }

    if (matchedSupplier) {
      showToast(`面料【${fabricName}】已进入待确认清单，建议关联已有供应商【${matchedSupplier.shortName}】。`);
    } else {
      showToast(`面料【${fabricName}】已进入待确认清单，供应商【${supplierName}】档案需人工确认。`);
    }

    setActiveTab('batch');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-zinc-900" />
            面料资料收集
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            批量收件箱 ({inboxItems.length})
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-white text-zinc-950 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>单款快速录入</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-zinc-900 text-white text-xs rounded-xl flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Batch Inbox */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          {/* Top Import Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  showToast(`已成功接收 ${files.length} 个本地文件，正在启动多重数据解析...`);
                  handleStartSimulation();
                }
              }}
              className="lg:col-span-8 bg-white border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800 mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">
                拖入色卡照片、扫描 PDF、Excel 报价单或实物细节图
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-md font-sans">
                支持 JPG、PNG、WEBP、PDF、XLSX 格式。导入后请检查样例整理结果。
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <label className="px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-zinc-700" />
                  <span>选择本地文件上传</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        showToast(`已选择 ${e.target.files.length} 个文件，开始导入解析...`);
                        handleStartSimulation();
                      }
                    }}
                  />
                </label>
                <button
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>正在整理样例文件...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>查看样例整理过程</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick URL Import Box */}
            <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-2">
                  <Globe className="w-4 h-4 text-zinc-700" />
                  <span>抓取供应商公开网页链接</span>
                </div>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  输入供应商面料的公开链接，作为待整理的资料来源。
                </p>
              </div>

              <form onSubmit={handleAddUrl} className="space-y-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://supplier.com/item/..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
                <button
                  type="submit"
                  disabled={!urlInput}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  加入收件箱队列
                </button>
              </form>
            </div>
          </div>

          {/* Current Queue List */}
          <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-700" />
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  收件箱处理队列 ({inboxItems.length} 项)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('review')}
                className="text-xs text-zinc-950 hover:text-zinc-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>前往审核工作台</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {inboxItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                      {item.type === 'color_card' || item.type === 'screenshot' || item.type === 'photo' ? (
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                      ) : (
                        <Globe className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-950">{item.id}</span>
                        <span className="text-xs font-bold text-zinc-800">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md font-bold border border-zinc-200">
                          {item.shortName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5">
                        供应商: {item.supplier} • 货号: {item.itemCode} • {item.size} • 导入时间: {item.createdAt}
                      </p>
                      {item.errorReason && (
                        <p className="text-xs text-amber-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.errorReason}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onNavigate('review')}
                      className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      校对并建档
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Single Fast Fabric Input Form */}
      {activeTab === 'single' && (
        <form
          onSubmit={handleSingleSubmit}
          className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8"
        >
          {/* Top Multi-modal Image Extractor & Swatch Cropper Module */}
          <SingleFabricAiExtractor
            onExtracted={handleAiExtracted}
            onCroppedImageChange={setMainImage}
            currentMainImage={mainImage}
            existingSuppliers={suppliers}
          />

          {/* Section 1: Supplier & Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-900" />
                <span>1. 供应商与基本信息</span>
              </h3>
              {aiFilled && (
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-zinc-700" />
                  样例结果·待核对
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">供应商全称 *</label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">供应商简称 (用于系统编码) *</label>
                <input
                  type="text"
                  required
                  value={supplierShortName}
                  onChange={(e) => setSupplierShortName(e.target.value)}
                  placeholder="如：恒茂、盛泰、福泽"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">对接联系人</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">联系电话</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fabric Specs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-900" />
                <span>2. 面料规格与物理参数</span>
              </h3>
              {mainImage && (
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span>已绑主图:</span>
                  <img src={mainImage} alt="" className="w-6 h-6 rounded-lg object-cover border border-zinc-200" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-zinc-700 block mb-1">面料名称 / 品名 *</label>
                <input
                  type="text"
                  required
                  value={fabricName}
                  onChange={(e) => setFabricName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">原厂货号 / 款号 *</label>
                <input
                  type="text"
                  required
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">通用面料分类</label>
                <select
                  value={marketFabricType}
                  onChange={(e) => setMarketFabricType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                >
                  <option value="莫代尔">莫代尔</option>
                  <option value="天丝/莱赛尔">天丝 / 莱赛尔</option>
                  <option value="纯棉/精梳棉">纯棉 / 精梳棉</option>
                  <option value="锦纶速干">锦纶速干</option>
                  <option value="美利诺羊毛">美利诺羊毛</option>
                  <option value="真丝素绉缎">真丝素绉缎</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-zinc-700 block mb-1">纤维成分及比例 *</label>
                <input
                  type="text"
                  required
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">克重 (gsm) *</label>
                <input
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">门幅 (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">织造品类</label>
                <select
                  value={weaveCategory}
                  onChange={(e) => setWeaveCategory(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                >
                  <option value="针织">针织</option>
                  <option value="梭织">梭织</option>
                  <option value="非织造">非织造</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">织法结构</label>
                <input
                  type="text"
                  value={weaveStructure}
                  onChange={(e) => setWeaveStructure(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">弹性等级</label>
                <select
                  value={elasticity}
                  onChange={(e) => setElasticity(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                >
                  <option value="无弹">无弹</option>
                  <option value="微弹">微弹</option>
                  <option value="二面弹">二面弹</option>
                  <option value="四面弹">四面弹</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">透光透明度</label>
                <select
                  value={opacity}
                  onChange={(e) => setOpacity(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                >
                  <option value="不透明">不透明</option>
                  <option value="半透明">半透明</option>
                  <option value="透明">透明</option>
                </select>
              </div>
            </div>

            {/* Special Crafts Multi-select */}
            <div className="pt-2">
              <label className="text-xs font-bold text-zinc-700 block mb-2">特殊后整理与工艺打标：</label>
              <div className="flex flex-wrap gap-2">
                {[
                  '磨毛/拉绒',
                  '液氨整理',
                  '三防(防水防油防污)',
                  '数码印花',
                  '丝光整理',
                  '抗起球整理',
                  '吸湿速干整理',
                  '抗菌防螨',
                  '免烫抗皱',
                ].map((craft) => (
                  <button
                    type="button"
                    key={craft}
                    onClick={() => toggleSpecialCraft(craft)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSpecialCrafts.includes(craft)
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    #{craft}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Terms */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-900" />
                <span>3. 商务价格与交付条款</span>
              </h3>
              <span className="text-[11px] text-zinc-500 font-sans">
                底价与大货价为内部专属 · 样品指导价对外展示
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">采购成本底价 *</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 font-mono">¥</span>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden font-mono font-bold"
                  />
                  <span className="text-[11px] text-zinc-500 shrink-0">元/米</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">批量大货采购价 *</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 font-mono">¥</span>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden font-mono font-bold"
                  />
                  <span className="text-[11px] text-zinc-500 shrink-0">元/米</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">样品散剪指导价 *</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 font-mono">¥</span>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={samplePrice}
                    onChange={(e) => setSamplePrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden font-mono font-bold"
                  />
                  <span className="text-[11px] text-zinc-500 shrink-0">元/米</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">起订量 (MOQ)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden font-mono"
                  />
                  <span className="text-[11px] text-zinc-500 shrink-0">米</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">供货交期</label>
                <input
                  type="text"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">功能特性标签</label>
                <input
                  type="text"
                  value={functions}
                  onChange={(e) => setFunctions(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Color Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-900" />
                <span>4. 可供颜色与色卡款式 ({colorVariants.length} 色)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-xs text-zinc-950 font-bold hover:text-zinc-600 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加新色号</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {colorVariants.map((c, i) => (
                <div
                  key={i}
                  className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => {
                          const updated = [...colorVariants];
                          updated[i].name = e.target.value;
                          setColorVariants(updated);
                        }}
                        className="text-xs font-bold text-zinc-900 bg-transparent border-b border-zinc-200 focus:outline-hidden w-20"
                      />
                      <input
                        type="text"
                        value={c.code}
                        onChange={(e) => {
                          const updated = [...colorVariants];
                          updated[i].code = e.target.value;
                          setColorVariants(updated);
                        }}
                        className="text-[10px] text-zinc-500 font-mono bg-transparent focus:outline-hidden block mt-0.5 w-20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('batch')}
              className="px-5 py-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              取消并返回
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>确认提交并生成统一系统编号</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
