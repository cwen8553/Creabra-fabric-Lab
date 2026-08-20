import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Eye,
  Check,
  Tag,
  Info,
  Sliders,
  Wand2,
  Edit3,
  X,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
  Star,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EvidenceModal } from '../components/EvidenceModal';

const HIGH_RES_FABRIC_PRESETS = [
  { name: '75D莫代尔速干高弹平纹', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80' },
  { name: '60S天丝双面细针提花', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80' },
  { name: '50S精梳棉高密斜纹', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80' },
  { name: '21S重磅立体华夫格', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80' },
  { name: '100%桑蚕丝双绉微光泽', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80' },
  { name: '80S美利诺超细精纺呢', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1200&auto=format&fit=crop&q=80' },
  { name: '12oz复古竹节水洗牛仔', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=1200&auto=format&fit=crop&q=80' },
  { name: '雪纺微透光亲肤垂感', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80' },
];

const MARKET_FABRIC_OPTIONS = [
  '牛仔',
  '雪纺',
  '丝绸',
  '丝绸/天丝',
  '卫衣布',
  '罗马布',
  '灯芯绒',
  '欧根纱',
  '粗花呢',
  '华夫格',
  '缎面',
  '府绸',
  '斜纹布',
  '针织罗纹',
  '速干网眼',
  '双层棉纱',
  '运动速干',
  '羊毛呢绒',
  '莫代尔',
  '亚麻',
  '纯棉平纹',
];

const SPECIAL_CRAFT_OPTIONS = [
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
  '数码印花',
];

const COMMON_FUNCTION_OPTIONS = [
  '吸湿速干',
  '四面高弹',
  '抗菌抑菌',
  '抗皱免烫',
  '接触凉感',
  '防透光',
  '亲肤透气',
  '防紫外线',
  '耐磨抗起球',
  '双重保暖',
  '水洗保型',
  '防泼水',
];

interface ReviewViewProps {
  fabrics: FabricMaster[];
  onUpdateFabric: (fabric: FabricMaster) => void;
  onNavigate: (tab: string) => void;
  initialFabricId?: string;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  fabrics,
  onUpdateFabric,
  initialFabricId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedFieldForEvidence, setSelectedFieldForEvidence] = useState<string | undefined>();
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Inline editing states
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [fieldInputVal, setFieldInputVal] = useState<string>('');
  const [fieldSecondaryVal, setFieldSecondaryVal] = useState<string>('');
  
  // Custom modals
  const [customCraftInput, setCustomCraftInput] = useState<string>('');
  const [showCustomCraftModal, setShowCustomCraftModal] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState<boolean>(false);
  const [customFunctionInput, setCustomFunctionInput] = useState<string>('');
  const [showCustomFunctionModal, setShowCustomFunctionModal] = useState<boolean>(false);

  // Image management modal dialog states
  const [imageModalMode, setImageModalMode] = useState<'replace_main' | 'add_detail' | 'replace_detail' | null>(null);
  const [targetDetailIndex, setTargetDetailIndex] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [zoomImageUrl, setZoomImageUrl] = useState<string>('');
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialFabricId when provided or changed
  useEffect(() => {
    if (initialFabricId && fabrics.length > 0) {
      const idx = fabrics.findIndex((f) => f.id === initialFabricId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialFabricId, fabrics]);

  const currentFabric = fabrics[currentIndex] || fabrics[0];

  // Helper to parse multi-selected market types
  const getSelectedMarketTypes = (fabric: FabricMaster): string[] => {
    const val = fabric.marketFabricType?.value;
    if (!val) return [];
    return Array.from(new Set(val.split(/[,，、/]/).map((s) => s.trim()).filter(Boolean)));
  };

  // Safe detail images
  const currentDetailImages = currentFabric.detailImages || [];

  // Auto-detect classification and special crafts from text context if not explicitly set
  useEffect(() => {
    if (!currentFabric) return;
    let needsUpdate = false;
    let newMarketType = currentFabric.marketFabricType?.value;
    let newCrafts = [...(currentFabric.specialCrafts || [])];

    const contextText = [
      currentFabric.name?.value || '',
      currentFabric.composition?.value || '',
      currentFabric.weaveStructure?.value || '',
      currentFabric.pattern || '',
      ...(currentFabric.features || []),
      ...(currentFabric.sources?.map((s) => (s.ocrSnippets || []).map((sn) => sn.text).join(' ')) || []),
    ].join(' ');

    if (!newMarketType) {
      for (const opt of MARKET_FABRIC_OPTIONS) {
        if (contextText.includes(opt)) {
          newMarketType = opt;
          needsUpdate = true;
          break;
        }
      }
      if (!newMarketType) {
        if (contextText.includes('羊毛') || contextText.includes('美利诺') || contextText.includes('精纺')) {
          newMarketType = '羊毛呢绒';
          needsUpdate = true;
        } else if (contextText.includes('莫代尔')) {
          newMarketType = '莫代尔';
          needsUpdate = true;
        } else if (contextText.includes('丝') || contextText.includes('真丝') || contextText.includes('桑蚕丝')) {
          newMarketType = '丝绸';
          needsUpdate = true;
        }
      }
    }

    for (const craft of SPECIAL_CRAFT_OPTIONS) {
      if (contextText.includes(craft) && !newCrafts.includes(craft)) {
        newCrafts.push(craft);
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      onUpdateFabric({
        ...currentFabric,
        marketFabricType: {
          value: newMarketType || '通用织物',
          status: 'confirmed',
          confidence: 0.96,
        },
        specialCrafts: newCrafts,
      });
    }
  }, [currentFabric?.id]);

  // Helper to trigger toast
  const showToast = (msg: string) => {
    setSaveSuccessToast(msg);
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Recalculate completeness helper
  const calculateCompleteness = (fabric: FabricMaster) => {
    let score = 0;
    if (fabric.name.value) score += 15;
    if (fabric.supplierItemCode.value) score += 15;
    if (fabric.composition.value) score += 20;
    if (fabric.weight.value !== null) score += 15;
    if (fabric.width.value !== null) score += 10;
    if (fabric.bulkPrice.value !== null) score += 15;
    if (fabric.marketFabricType?.value) score += 10;
    return Math.min(100, score);
  };

  // Open inline edit for a field
  const handleStartEdit = (fieldKey: string, initialVal: string, initialSecondary = '') => {
    setEditingFieldKey(fieldKey);
    setFieldInputVal(initialVal || '');
    setFieldSecondaryVal(initialSecondary || '');
  };

  // Save inline edit field
  const handleSaveFieldEdit = (fieldKey: string) => {
    if (!currentFabric) return;
    const updated: FabricMaster = { ...currentFabric };
    let fieldLabel = '';

    switch (fieldKey) {
      case 'name':
        updated.name = { value: fieldInputVal.trim(), status: 'confirmed', confidence: 1.0 };
        fieldLabel = '面料名称';
        break;

      case 'supplierItemCode':
        updated.supplierItemCode = { value: fieldInputVal.trim(), status: 'confirmed', confidence: 1.0 };
        fieldLabel = '供应商货号';
        break;

      case 'composition':
        updated.composition = { value: fieldInputVal.trim(), status: 'confirmed', confidence: 1.0 };
        updated.missingFields = updated.missingFields.filter((f) => !f.includes('成分'));
        fieldLabel = '成分配比';
        break;

      case 'weight': {
        const numVal = parseFloat(fieldInputVal);
        updated.weight = {
          value: isNaN(numVal) ? null : numVal,
          unit: 'gsm',
          status: 'confirmed',
          confidence: 1.0,
        };
        if (!isNaN(numVal)) {
          updated.missingFields = updated.missingFields.filter((f) => !f.includes('克重'));
        }
        fieldLabel = '克重';
        break;
      }

      case 'width': {
        const numVal = parseFloat(fieldInputVal);
        updated.width = {
          value: isNaN(numVal) ? null : numVal,
          unit: 'cm',
          status: 'confirmed',
          confidence: 1.0,
        };
        if (!isNaN(numVal)) {
          updated.missingFields = updated.missingFields.filter((f) => !f.includes('门幅'));
        }
        fieldLabel = '门幅';
        break;
      }

      case 'bulkPrice': {
        const numVal = parseFloat(fieldInputVal);
        updated.bulkPrice = {
          value: isNaN(numVal) ? null : numVal,
          unit: 'm',
          status: 'confirmed',
          confidence: 1.0,
        };
        if (!isNaN(numVal)) {
          updated.missingFields = updated.missingFields.filter((f) => !f.includes('价格'));
        }
        fieldLabel = '大货价格';
        break;
      }

      case 'moq': {
        const numVal = parseFloat(fieldInputVal);
        updated.moq = {
          value: isNaN(numVal) ? null : numVal,
          unit: '米',
          status: 'confirmed',
          confidence: 1.0,
        };
        fieldLabel = '起订量';
        break;
      }

      case 'yarnCount':
        updated.yarnCount = { value: fieldInputVal.trim(), status: 'confirmed', confidence: 1.0 };
        fieldLabel = '纱支规格';
        break;

      case 'weave':
        updated.weaveCategory = {
          value: (fieldInputVal as any) || '梭织',
          status: 'confirmed',
          confidence: 1.0,
        };
        updated.weaveStructure = {
          value: fieldSecondaryVal.trim() || '平纹',
          status: 'confirmed',
          confidence: 1.0,
        };
        fieldLabel = '织造结构';
        break;
    }

    updated.completeness = {
      ...updated.completeness,
      overall: calculateCompleteness(updated),
    };
    if (updated.missingFields.length === 0 && updated.reviewStatus === 'missing_info') {
      updated.reviewStatus = 'pending_review';
    }

    onUpdateFabric(updated);
    setEditingFieldKey(null);
    showToast(`已成功保存并更新【${fieldLabel}】`);
  };

  // Toggle Market Fabric Type (Multi-select)
  const handleToggleMarketType = (typeVal: string) => {
    const current = getSelectedMarketTypes(currentFabric);
    const exists = current.includes(typeVal);
    let updatedList: string[];
    if (exists) {
      updatedList = current.filter((x) => x !== typeVal);
      if (updatedList.length === 0) updatedList = ['通用织物'];
    } else {
      updatedList = current.filter((x) => x !== '通用织物');
      updatedList.push(typeVal);
    }
    const val = updatedList.join(' / ');
    const updated: FabricMaster = {
      ...currentFabric,
      marketFabricType: {
        value: val,
        status: 'confirmed',
        confidence: 1.0,
      },
    };
    onUpdateFabric(updated);
    showToast(exists ? `已取消品类特点：【${typeVal}】` : `已添加品类特点：【${typeVal}】`);
  };

  // Add Custom Market Type Tag
  const handleAddCustomCategory = () => {
    if (!customCategoryInput.trim()) return;
    const tag = customCategoryInput.trim();
    const current = getSelectedMarketTypes(currentFabric);
    if (!current.includes(tag)) {
      const updatedList = current.filter((x) => x !== '通用织物');
      updatedList.push(tag);
      const val = updatedList.join(' / ');
      const updated: FabricMaster = {
        ...currentFabric,
        marketFabricType: {
          value: val,
          status: 'confirmed',
          confidence: 1.0,
        },
      };
      onUpdateFabric(updated);
      showToast(`已新增并勾选自定义品类：【${tag}】`);
    }
    setCustomCategoryInput('');
    setShowCustomCategoryModal(false);
  };

  // Toggle Special Craft Tag (Multi-select)
  const handleToggleSpecialCraft = (craft: string) => {
    const currentCrafts = currentFabric.specialCrafts || [];
    const exists = currentCrafts.includes(craft);
    const newCrafts = exists
      ? currentCrafts.filter((c) => c !== craft)
      : [...currentCrafts, craft];

    const updated: FabricMaster = {
      ...currentFabric,
      specialCrafts: newCrafts,
    };
    onUpdateFabric(updated);
    showToast(exists ? `已移除工艺：【${craft}】` : `已添加特殊工艺：【${craft}】`);
  };

  // Add Custom Craft Tag
  const handleAddCustomCraft = () => {
    if (!customCraftInput.trim()) return;
    const tag = customCraftInput.trim();
    const currentCrafts = currentFabric.specialCrafts || [];
    if (!currentCrafts.includes(tag)) {
      const updated: FabricMaster = {
        ...currentFabric,
        specialCrafts: [...currentCrafts, tag],
      };
      onUpdateFabric(updated);
      showToast(`已新增并勾选自定义工艺：【${tag}】`);
    }
    setCustomCraftInput('');
    setShowCustomCraftModal(false);
  };

  // Toggle Performance & Function Features (Multi-select)
  const handleToggleFunction = (funcName: string) => {
    const currentFuncs = currentFabric.functions || [];
    const exists = currentFuncs.some((f) => f.name === funcName);
    let updatedFuncs: FabricMaster['functions'];
    if (exists) {
      updatedFuncs = currentFuncs.filter((f) => f.name !== funcName);
    } else {
      updatedFuncs = [
        ...currentFuncs,
        {
          name: funcName,
          evidenceLevel: 'supplier_declared',
          status: 'confirmed',
        },
      ];
    }
    const updated: FabricMaster = {
      ...currentFabric,
      functions: updatedFuncs,
    };
    onUpdateFabric(updated);
    showToast(exists ? `已取消性能特点：【${funcName}】` : `已添加性能特点：【${funcName}】`);
  };

  // Add Custom Function Tag
  const handleAddCustomFunction = () => {
    if (!customFunctionInput.trim()) return;
    const tag = customFunctionInput.trim();
    const currentFuncs = currentFabric.functions || [];
    if (!currentFuncs.some((f) => f.name === tag)) {
      const updated: FabricMaster = {
        ...currentFabric,
        functions: [
          ...currentFuncs,
          {
            name: tag,
            evidenceLevel: 'supplier_declared',
            status: 'confirmed',
          },
        ],
      };
      onUpdateFabric(updated);
      showToast(`已新增并添加自定义性能：【${tag}】`);
    }
    setCustomFunctionInput('');
    setShowCustomFunctionModal(false);
  };

  // Image CRUD operations for single fabric details
  const handleSetAsMainImage = (newMainUrl: string) => {
    const oldMain = currentFabric.mainImage;
    const currentDetails = currentFabric.detailImages || [];
    const updatedDetails = [
      oldMain,
      ...currentDetails.filter((img) => img !== newMainUrl),
    ].filter((img, idx, self) => img && self.indexOf(img) === idx && img !== newMainUrl);

    const updated: FabricMaster = {
      ...currentFabric,
      mainImage: newMainUrl,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    showToast('已成功将选定图片设为封面主图！');
  };

  const handleDeleteDetailImage = (indexToDelete: number) => {
    const currentDetails = currentFabric.detailImages || [];
    const updatedDetails = currentDetails.filter((_, idx) => idx !== indexToDelete);
    const updated: FabricMaster = {
      ...currentFabric,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    showToast('已删除详情图片');
  };

  const handleAddDetailImage = (newUrl: string) => {
    if (!newUrl.trim()) return;
    const currentDetails = currentFabric.detailImages || [];
    const updatedDetails = [...currentDetails, newUrl.trim()];
    const updated: FabricMaster = {
      ...currentFabric,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    showToast('已新增 1 张详情实拍图！');
  };

  const handleReplaceMainImage = (newUrl: string) => {
    if (!newUrl.trim()) return;
    const oldMain = currentFabric.mainImage;
    const currentDetails = currentFabric.detailImages || [];
    const updatedDetails = [
      oldMain,
      ...currentDetails.filter((img) => img !== newUrl),
    ].filter((img, idx, self) => img && self.indexOf(img) === idx && img !== newUrl);

    const updated: FabricMaster = {
      ...currentFabric,
      mainImage: newUrl.trim(),
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    showToast('已替换封面主图！');
  };

  const handleReplaceSpecificDetail = (indexToReplace: number, newUrl: string) => {
    if (!newUrl.trim()) return;
    const currentDetails = [...(currentFabric.detailImages || [])];
    currentDetails[indexToReplace] = newUrl.trim();
    const updated: FabricMaster = {
      ...currentFabric,
      detailImages: currentDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    setTargetDetailIndex(null);
    showToast('已更新详情图！');
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;
      if (imageModalMode === 'replace_main') {
        handleReplaceMainImage(dataUrl);
      } else if (imageModalMode === 'add_detail') {
        handleAddDetailImage(dataUrl);
      } else if (imageModalMode === 'replace_detail' && targetDetailIndex !== null) {
        handleReplaceSpecificDetail(targetDetailIndex, dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Actions
  const handleConfirmAndNext = () => {
    const updated: FabricMaster = {
      ...currentFabric,
      reviewStatus: 'ready_to_match',
      conflictFields: [],
      composition: { ...currentFabric.composition, status: 'confirmed', confidence: 1.0 },
      weight: { ...currentFabric.weight, status: currentFabric.weight.value ? 'confirmed' : 'missing' },
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    showToast(`【${currentFabric.id}】已完成核验，正式入库！`);
    if (currentIndex < fabrics.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSaveDraft = () => {
    showToast(`【${currentFabric.id}】当前修改已暂存。`);
  };

  const handleMarkMissing = () => {
    const updated: FabricMaster = {
      ...currentFabric,
      reviewStatus: 'missing_info',
    };
    onUpdateFabric(updated);
    showToast(`【${currentFabric.id}】已标记为待补充资料，已同步至待补充中心。`);
  };

  const handleSuspend = () => {
    const updated: FabricMaster = {
      ...currentFabric,
      reviewStatus: 'suspended',
    };
    onUpdateFabric(updated);
    showToast(`【${currentFabric.id}】已暂停使用，将不参与后续匹配。`);
  };

  // Conflict resolution helper
  const handleResolveConflict = (fieldName: 'composition' | 'weight', chosenValue: any, unit?: string) => {
    if (fieldName === 'composition') {
      const updated: FabricMaster = {
        ...currentFabric,
        composition: {
          ...currentFabric.composition,
          value: chosenValue,
          status: 'confirmed',
          confidence: 1.0,
          conflictValues: undefined,
          requiredAction: null,
        },
        conflictFields: currentFabric.conflictFields.filter((f) => !f.includes('成分')),
      };
      onUpdateFabric(updated);
      showToast('已完成成分核验并保存！');
    } else if (fieldName === 'weight') {
      const updated: FabricMaster = {
        ...currentFabric,
        weight: {
          ...currentFabric.weight,
          value: Number(chosenValue),
          unit: unit || 'gsm',
          status: 'confirmed',
          confidence: 1.0,
          conflictValues: undefined,
          requiredAction: null,
        },
        conflictFields: currentFabric.conflictFields.filter((f) => !f.includes('克重')),
      };
      onUpdateFabric(updated);
      showToast('已完成克重核验并保存！');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Header & Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-100 text-zinc-800 rounded-xl border border-zinc-200">
            <FileCheck className="w-4 h-4 text-zinc-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-950">
                面料核对与审核 ({currentIndex + 1} / {fabrics.length})
              </h1>
              <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                {currentFabric.supplierShortName ? `${currentFabric.supplierShortName} · ` : ''}
                {currentFabric.systemCode || currentFabric.id}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                (原厂货号: {currentFabric.supplierItemCode?.value})
              </span>
              <StatusBadge status={currentFabric.reviewStatus} size="sm" />
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              核对提取参数与原始凭证，支持直接编辑修改或仲裁冲突项，确保面料档案准确入库
            </p>
          </div>
        </div>

        {/* Previous / Next & Fabric Quick Selector */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 border border-zinc-200 rounded-xl text-zinc-700 transition-colors cursor-pointer"
            title="上一款"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <select
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="text-xs font-medium bg-white border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 shadow-2xs font-mono"
          >
            {fabrics.map((f, idx) => (
              <option key={f.id} value={idx}>
                [{f.supplierShortName ? `${f.supplierShortName} · ` : ''}{f.systemCode || f.id}] {f.name.value}
              </option>
            ))}
          </select>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentIndex(Math.min(fabrics.length - 1, currentIndex + 1))}
            disabled={currentIndex === fabrics.length - 1}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 border border-zinc-200 rounded-xl text-zinc-700 transition-colors cursor-pointer"
            title="下一款"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 bg-zinc-900 text-white text-xs rounded-xl flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-zinc-300" />
            <span>{saveSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Column Core Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 Cols): Photo, Detail Gallery & Raw Source Evidence */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-zinc-700" />
                <span>实物实拍与封面相册</span>
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">
                {currentDetailImages.length + 1} 张图片
              </span>
            </div>

            {/* Main Image Box */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 h-52 bg-zinc-100 group">
              <img
                src={currentFabric.mainImage}
                alt={currentFabric.name.value || ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-950/80 text-white text-[10px] backdrop-blur-md font-mono border border-white/20 shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>封面主图</span>
              </div>

              {/* Hover actions on main image */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setImageModalMode('replace_main');
                    setImageUrlInput('');
                  }}
                  className="px-2 py-1 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md cursor-pointer transition-all shadow-xs"
                  title="替换封面主图"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>替换主图</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomImageUrl(currentFabric.mainImage);
                    setShowZoomModal(true);
                  }}
                  className="p-1 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-lg text-[10px] backdrop-blur-md cursor-pointer transition-all shadow-xs"
                  title="放大查看原图"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-md bg-zinc-950/70 text-white text-[10px] backdrop-blur-md font-mono flex items-center justify-between">
                <span>{currentFabric.mainColorFamily || '标准色系'} • {currentFabric.pattern || '纯色'}</span>
                <span>{currentFabric.systemCode || currentFabric.id}</span>
              </div>
            </div>

            {/* Detail Images Gallery Grid (Add, Delete, Replace, Set as Main) */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1">
                  <span>多角度实拍与纹理详情</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setImageModalMode('add_detail');
                    setImageUrlInput('');
                  }}
                  className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-[10px] font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>增加详情图</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {/* Main image badge item */}
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-zinc-900 bg-zinc-200 group">
                  <img src={currentFabric.mainImage} alt="Main" className="w-full h-full object-cover" />
                  <span className="absolute top-0.5 left-0.5 px-1 bg-zinc-950 text-white text-[8px] font-bold rounded">
                    主图
                  </span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white">
                    <button
                      onClick={() => {
                        setZoomImageUrl(currentFabric.mainImage);
                        setShowZoomModal(true);
                      }}
                      className="p-1 bg-white/20 hover:bg-white/40 rounded text-white cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Detail images */}
                {currentDetailImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 group"
                  >
                    <img src={imgUrl} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-0.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setZoomImageUrl(imgUrl);
                            setShowZoomModal(true);
                          }}
                          className="p-0.5 bg-white/20 hover:bg-white/40 rounded text-white cursor-pointer"
                          title="查看"
                        >
                          <Eye className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleSetAsMainImage(imgUrl)}
                          className="p-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded cursor-pointer"
                          title="设为封面主图"
                        >
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </button>
                        <button
                          onClick={() => {
                            setTargetDetailIndex(idx);
                            setImageModalMode('replace_detail');
                            setImageUrlInput('');
                          }}
                          className="p-0.5 bg-white/20 hover:bg-white/40 rounded text-white cursor-pointer"
                          title="替换"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDetailImage(idx)}
                          className="p-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                          title="删除"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add button placeholder */}
                <button
                  type="button"
                  onClick={() => {
                    setImageModalMode('add_detail');
                    setImageUrlInput('');
                  }}
                  className="aspect-square rounded-lg border border-dashed border-zinc-300 hover:border-zinc-500 hover:bg-zinc-100 flex flex-col items-center justify-center gap-0.5 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[9px]">加图</span>
                </button>
              </div>
            </div>

            {/* Evidence Thumbnails */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">关联原始凭证 ({currentFabric.sources?.length || 1} 份)</span>
                <button
                  onClick={() => {
                    setSelectedFieldForEvidence(undefined);
                    setEvidenceModalOpen(true);
                  }}
                  className="text-zinc-700 hover:text-zinc-950 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> 查看凭证切片
                </button>
              </div>

              <div className="space-y-2">
                {currentFabric.sources && currentFabric.sources.length > 0 ? (
                  currentFabric.sources.map((src, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedFieldForEvidence(undefined);
                        setEvidenceModalOpen(true);
                      }}
                      className="p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-200 overflow-hidden shrink-0">
                        <img src={src.thumbnail} alt={src.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-zinc-900 truncate text-[11px]">{src.title}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{src.sourceId}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-500">
                    已从原始色卡与技术参数表中提取字段，可随时调阅原始凭证切片。
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column (5 Cols): Structured Fields with Inline Editing & Conflict Resolution */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-950">参数核验与编辑</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  支持点击编辑图标快速补充修改，点击右侧标签查看核对状态
                </p>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                资料完整度: {currentFabric.completeness?.overall || 0}%
              </span>
            </div>

            {/* Conflict Resolution Block if Fabric has conflicts */}
            {currentFabric.conflictFields && currentFabric.conflictFields.length > 0 && (
              <div className="p-4 bg-zinc-50 border border-zinc-300 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-950">
                  <AlertCircle className="w-4 h-4 text-zinc-700" />
                  <span>检测到多来源参数不一致，请点击采纳正确项：</span>
                </div>

                {/* Composition Conflict */}
                {currentFabric.composition.conflictValues && (
                  <div className="bg-white p-3.5 rounded-lg border border-zinc-200 text-xs space-y-2">
                    <p className="font-bold text-zinc-800">【成分冲突】</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentFabric.composition.conflictValues.map((cv, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => handleResolveConflict('composition', cv.value)}
                          className="p-3 rounded-lg border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-zinc-900">{cv.value}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400">{cv.source}</p>
                          <button className="mt-1.5 w-full py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-[10px] font-medium transition-all">
                            采纳此成分
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weight Conflict */}
                {currentFabric.weight.conflictValues && (
                  <div className="bg-white p-3.5 rounded-lg border border-zinc-200 text-xs space-y-2">
                    <p className="font-bold text-zinc-800">【克重冲突】</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentFabric.weight.conflictValues.map((wv, wIdx) => (
                        <div
                          key={wIdx}
                          onClick={() => handleResolveConflict('weight', wv.value, wv.unit)}
                          className="p-3 rounded-lg border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-zinc-900">
                              {wv.value} {wv.unit}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400">{wv.source}</p>
                          <button className="mt-1.5 w-full py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-[10px] font-medium transition-all">
                            采纳此克重
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Field Rows with Direct Edit */}
            <div className="space-y-3 text-xs">
              {/* Name Row */}
              <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium w-20 shrink-0">面料名称</span>
                  {editingFieldKey === 'name' ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={fieldInputVal}
                        onChange={(e) => setFieldInputVal(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 font-medium"
                        placeholder="输入面料名称"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveFieldEdit('name')}
                        className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-[11px] font-medium hover:bg-zinc-800"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingFieldKey(null)}
                        className="p-1 text-zinc-400 hover:text-zinc-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-medium text-zinc-900 truncate pr-2">
                        {currentFabric.name.value}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEdit('name', currentFabric.name.value)}
                          className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-md transition-colors"
                          title="修改名称"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <StatusBadge status={currentFabric.name.status} size="sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Item Code Row */}
              <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium w-20 shrink-0">供应商货号</span>
                  {editingFieldKey === 'supplierItemCode' ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={fieldInputVal}
                        onChange={(e) => setFieldInputVal(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-hidden font-mono"
                        placeholder="输入货号"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveFieldEdit('supplierItemCode')}
                        className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-[11px] font-medium"
                      >
                        保存
                      </button>
                      <button onClick={() => setEditingFieldKey(null)} className="p-1 text-zinc-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-mono font-medium text-zinc-900 truncate pr-2">
                        {currentFabric.supplierItemCode.value}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEdit('supplierItemCode', currentFabric.supplierItemCode.value)}
                          className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-md transition-colors"
                          title="修改货号"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <StatusBadge status={currentFabric.supplierItemCode.status} size="sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Composition Row */}
              <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium w-20 shrink-0">成分配比</span>
                  {editingFieldKey === 'composition' ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={fieldInputVal}
                        onChange={(e) => setFieldInputVal(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-hidden"
                        placeholder="如：70% 羊毛 30% 桑蚕丝"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveFieldEdit('composition')}
                        className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-[11px] font-medium"
                      >
                        保存
                      </button>
                      <button onClick={() => setEditingFieldKey(null)} className="p-1 text-zinc-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="font-medium text-zinc-900 truncate pr-2">
                        {currentFabric.composition.value || (
                          <button
                            onClick={() => handleStartEdit('composition', '')}
                            className="text-zinc-500 hover:text-zinc-800 underline decoration-dashed text-[11px] cursor-pointer"
                          >
                            + 点击补录成分
                          </button>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEdit('composition', currentFabric.composition.value || '')}
                          className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-md transition-colors"
                          title="编辑成分"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <StatusBadge status={currentFabric.composition.status} size="sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight & Width Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weight */}
                <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium w-12 shrink-0">克重</span>
                    {editingFieldKey === 'weight' ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="number"
                          value={fieldInputVal}
                          onChange={(e) => setFieldInputVal(e.target.value)}
                          className="w-16 px-2 py-0.5 text-xs bg-white border border-zinc-300 rounded font-mono"
                          placeholder="克重"
                          autoFocus
                        />
                        <span className="text-[10px] text-zinc-400">gsm</span>
                        <button
                          onClick={() => handleSaveFieldEdit('weight')}
                          className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[10px]"
                        >
                          存
                        </button>
                        <button onClick={() => setEditingFieldKey(null)} className="p-0.5 text-zinc-400">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between flex-1 min-w-0 pl-1">
                        <span className="font-mono font-medium text-zinc-900 truncate">
                          {currentFabric.weight.value !== null ? (
                            `${currentFabric.weight.value} gsm`
                          ) : (
                            <button
                              onClick={() => handleStartEdit('weight', '')}
                              className="text-zinc-500 hover:text-zinc-800 underline decoration-dashed text-[11px]"
                            >
                              + 补录克重
                            </button>
                          )}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <button
                            onClick={() => handleStartEdit('weight', String(currentFabric.weight.value || ''))}
                            className="p-1 text-zinc-400 hover:text-zinc-800 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <StatusBadge status={currentFabric.weight.status} size="sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Width */}
                <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium w-12 shrink-0">门幅</span>
                    {editingFieldKey === 'width' ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="number"
                          value={fieldInputVal}
                          onChange={(e) => setFieldInputVal(e.target.value)}
                          className="w-16 px-2 py-0.5 text-xs bg-white border border-zinc-300 rounded font-mono"
                          placeholder="门幅"
                          autoFocus
                        />
                        <span className="text-[10px] text-zinc-400">cm</span>
                        <button
                          onClick={() => handleSaveFieldEdit('width')}
                          className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[10px]"
                        >
                          存
                        </button>
                        <button onClick={() => setEditingFieldKey(null)} className="p-0.5 text-zinc-400">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between flex-1 min-w-0 pl-1">
                        <span className="font-mono font-medium text-zinc-900 truncate">
                          {currentFabric.width.value !== null ? (
                            `${currentFabric.width.value} cm`
                          ) : (
                            <button
                              onClick={() => handleStartEdit('width', '')}
                              className="text-zinc-500 hover:text-zinc-800 underline decoration-dashed text-[11px]"
                            >
                              + 补录门幅
                            </button>
                          )}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <button
                            onClick={() => handleStartEdit('width', String(currentFabric.width.value || ''))}
                            className="p-1 text-zinc-400 hover:text-zinc-800 rounded"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <StatusBadge status={currentFabric.width.status} size="sm" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Commercial Info */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-2">
                <div className="flex items-center justify-between text-zinc-800">
                  <span className="font-medium text-xs">商务价格条件</span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {currentFabric.priceType} • {currentFabric.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs gap-2 pt-1 border-t border-zinc-100">
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-zinc-500">大货价:</span>
                    {editingFieldKey === 'bulkPrice' ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={fieldInputVal}
                          onChange={(e) => setFieldInputVal(e.target.value)}
                          className="w-16 px-1.5 py-0.5 bg-white border border-zinc-300 rounded font-mono text-xs"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveFieldEdit('bulkPrice')}
                          className="px-1.5 py-0.5 bg-zinc-900 text-white rounded text-[10px]"
                        >
                          存
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-zinc-900 font-mono">
                        {currentFabric.bulkPrice.value !== null ? (
                          `¥${currentFabric.bulkPrice.value}/${currentFabric.priceUnit}`
                        ) : (
                          <button
                            onClick={() => handleStartEdit('bulkPrice', '')}
                            className="text-zinc-500 hover:text-zinc-800 underline decoration-dashed text-[11px]"
                          >
                            + 补录价格
                          </button>
                        )}
                      </span>
                    )}
                    {editingFieldKey !== 'bulkPrice' && (
                      <button
                        onClick={() => handleStartEdit('bulkPrice', String(currentFabric.bulkPrice.value || ''))}
                        className="p-0.5 text-zinc-400 hover:text-zinc-800"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500">起订量:</span>
                    <span className="font-medium text-zinc-900 font-mono">
                      {currentFabric.moq.value || '待定'} {currentFabric.moq.unit}
                    </span>
                  </div>
                  <StatusBadge status={currentFabric.basePrice?.status || 'confirmed'} size="sm" />
                </div>
              </div>

              {/* 市场服装款式通用面料名称分类与品类特点 (多选) */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-900 text-xs">
                    <Sliders className="w-3.5 h-3.5 text-zinc-600" />
                    <span>通用品类与款式特点 (多选)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-200/80 text-zinc-700 font-medium">
                      已选 {getSelectedMarketTypes(currentFabric).length} 项
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomCategoryModal(true)}
                      className="text-[10px] text-zinc-700 hover:text-zinc-950 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> 自定义分类
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  用于面料库多维筛选与服装款式匹配（支持同时勾选多种特点标签）：
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_FABRIC_OPTIONS.map((opt, oIdx) => {
                    const isSelected = getSelectedMarketTypes(currentFabric).includes(opt);
                    return (
                      <button
                        key={`mkt-opt-${oIdx}-${opt}`}
                        type="button"
                        onClick={() => handleToggleMarketType(opt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}

                  {/* Render any custom categories */}
                  {Array.from(new Set<string>(getSelectedMarketTypes(currentFabric)))
                    .filter((c) => !MARKET_FABRIC_OPTIONS.includes(c) && c !== '通用织物')
                    .map((customCat, cIdx) => (
                      <button
                        key={`mkt-custom-${cIdx}-${customCat}`}
                        type="button"
                        onClick={() => handleToggleMarketType(customCat)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-white" />
                        <span>{customCat}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 特殊工艺选项打标 (多选) */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-900 text-xs">
                    <Wand2 className="w-3.5 h-3.5 text-zinc-600" />
                    <span>特殊工艺打标 (多选)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-200/80 text-zinc-700 font-medium">
                      已选 {(currentFabric.specialCrafts || []).length} 项
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomCraftModal(true)}
                      className="text-[10px] text-zinc-700 hover:text-zinc-950 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> 自定义工艺
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  支持多重组合打标（原色卡包含对应工艺时自动选中，可点击增删）：
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIAL_CRAFT_OPTIONS.map((craft, cIdx) => {
                    const isChecked = (currentFabric.specialCrafts || []).includes(craft);
                    return (
                      <button
                        key={`craft-opt-${cIdx}-${craft}`}
                        type="button"
                        onClick={() => handleToggleSpecialCraft(craft)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isChecked
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                        <span>{craft}</span>
                      </button>
                    );
                  })}

                  {/* Render any custom craft tags added by user */}
                  {Array.from(new Set<string>(currentFabric.specialCrafts || []))
                    .filter((c) => !SPECIAL_CRAFT_OPTIONS.includes(c))
                    .map((customCraft, ccIdx) => (
                      <button
                        key={`craft-custom-${ccIdx}-${customCraft}`}
                        type="button"
                        onClick={() => handleToggleSpecialCraft(customCraft)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-white" />
                        <span>{customCraft}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* 面料性能与功能特点打标 (多选) */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-900 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                    <span>性能特点与功能声明 (多选)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-200/80 text-zinc-700 font-medium">
                      已选 {(currentFabric.functions || []).length} 项
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCustomFunctionModal(true)}
                      className="text-[10px] text-zinc-700 hover:text-zinc-950 underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> 自定义性能
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  多选面料功能性标签（吸湿速干、高弹、抗菌、防透光等），生成标准规范：
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_FUNCTION_OPTIONS.map((funcName, fnIdx) => {
                    const isChecked = (currentFabric.functions || []).some((f) => f.name === funcName);
                    return (
                      <button
                        key={`func-opt-${fnIdx}-${funcName}`}
                        type="button"
                        onClick={() => handleToggleFunction(funcName)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isChecked
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                        <span>{funcName}</span>
                      </button>
                    );
                  })}

                  {/* Render any custom functions */}
                  {(currentFabric.functions || [])
                    .filter((f) => !COMMON_FUNCTION_OPTIONS.includes(f.name))
                    .map((customFunc, fIdx) => (
                      <button
                        key={`func-custom-${fIdx}-${customFunc.name}`}
                        type="button"
                        onClick={() => handleToggleFunction(customFunc.name)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-white" />
                        <span>{customFunc.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 Cols): Alerts, Apparel Suggestions & Actions */}
        <div className="lg:col-span-3 space-y-4">
          {/* Missing Field Alert */}
          {currentFabric.missingFields && currentFabric.missingFields.length > 0 ? (
            <div className="border border-zinc-200 rounded-2xl p-5 space-y-2.5 text-xs bg-zinc-50/70">
              <div className="flex items-center gap-2 font-medium text-zinc-900">
                <HelpCircle className="w-4 h-4 text-zinc-600" />
                <span>待补充字段提醒 ({currentFabric.missingFields.length})</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                以下字段尚待核实补充，可点击中间栏直接补录：
              </p>
              <div className="space-y-1">
                {(currentFabric.missingFields || []).map((mf, i) => (
                  <div key={i} className="px-3 py-1.5 bg-white rounded-lg border border-zinc-200 text-[11px] text-zinc-800 font-medium flex items-center justify-between">
                    <span>{mf}</span>
                    <button
                      onClick={() => {
                        if (mf.includes('克重')) handleStartEdit('weight', '');
                        else if (mf.includes('成分')) handleStartEdit('composition', '');
                        else if (mf.includes('门幅')) handleStartEdit('width', '');
                        else if (mf.includes('价格')) handleStartEdit('bulkPrice', '');
                      }}
                      className="text-zinc-600 hover:text-zinc-950 underline text-[10px]"
                    >
                      立即补录
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-400 pt-1">
                已同步至待补充中心，可导出清单向供应商索要。
              </p>
            </div>
          ) : (
            <div className="border border-zinc-200 rounded-2xl p-5 text-xs flex items-center gap-2.5 text-zinc-800 font-medium bg-zinc-50/50">
              <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0" />
              <span>基础参数齐全，符合入库标准。</span>
            </div>
          )}

          {/* Recommended Apparel & Notes */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs space-y-3 text-xs">
            <h4 className="font-medium text-zinc-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-700" />
              推荐适配品类
            </h4>

            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {(currentFabric.recommendedGarments || []).map((g, i) => (
                  <span key={i} className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-md text-[11px] font-medium border border-zinc-200">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {currentFabric.usageRisks && currentFabric.usageRisks.length > 0 && (
              <div className="pt-2 border-t border-zinc-100 space-y-1">
                <p className="text-zinc-800 font-medium text-[11px] flex items-center gap-1">
                  <Info className="w-3 h-3 text-zinc-500" /> 工艺与使用注意事项：
                </p>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  {currentFabric.usageRisks[0]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Toolbar */}
      <div className="bg-white/90 backdrop-blur-md border border-zinc-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <span className="font-medium text-zinc-900">数据状态：</span>
          <span>经核对确认后的面料将更新入库状态并同步至面料库</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSuspend}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-medium transition-all cursor-pointer border border-zinc-200"
          >
            暂停使用
          </button>
          <button
            onClick={handleMarkMissing}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-medium transition-all cursor-pointer border border-zinc-200"
          >
            标记待补充
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-2xs"
          >
            暂存修改
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirmAndNext}
            className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-zinc-100" />
            <span>确认入库并审核下一款</span>
          </motion.button>
        </div>
      </div>

      {/* Custom Craft Tag Modal */}
      <AnimatePresence>
        {showCustomCraftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900">添加自定义特殊工艺</h4>
                <button onClick={() => setShowCustomCraftModal(false)} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={customCraftInput}
                onChange={(e) => setCustomCraftInput(e.target.value)}
                placeholder="输入工艺名称（如：特种烂花、手工串珠）"
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomCraft();
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCustomCraftModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCustomCraft}
                  className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  添加并选中
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Category Modal */}
      <AnimatePresence>
        {showCustomCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900">添加自定义面料品类特点</h4>
                <button onClick={() => setShowCustomCategoryModal(false)} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="输入品类特点（如：羽绒防风内胆、重磅针织）"
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomCategory();
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCustomCategoryModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCustomCategory}
                  className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  添加并选中
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Function Tag Modal */}
      <AnimatePresence>
        {showCustomFunctionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900">添加自定义性能与功能</h4>
                <button onClick={() => setShowCustomFunctionModal(false)} className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={customFunctionInput}
                onChange={(e) => setCustomFunctionInput(e.target.value)}
                placeholder="输入功能特点（如：远红外发热、单向导湿、防水透湿）"
                className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomFunction();
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCustomFunctionModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCustomFunction}
                  className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  添加并选中
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
      />

      {/* Image Add/Replace Dialog Modal */}
      <AnimatePresence>
        {imageModalMode && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-2xl max-w-lg w-full space-y-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-zinc-900" />
                  <h3 className="font-bold text-sm text-zinc-900">
                    {imageModalMode === 'replace_main' && '替换封面主图'}
                    {imageModalMode === 'add_detail' && '增加面料实拍/详情图'}
                    {imageModalMode === 'replace_detail' && `替换详情附图 #${(targetDetailIndex ?? 0) + 1}`}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setImageModalMode(null);
                    setImageUrlInput('');
                    setTargetDetailIndex(null);
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload Method 1: Local File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 block">方法 1：从电脑上传本地实拍图</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 hover:border-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer group"
                >
                  <Upload className="w-6 h-6 text-zinc-500 group-hover:text-zinc-950 transition-colors" />
                  <span className="text-xs font-bold text-zinc-800">点击选择本地高清面料图片</span>
                  <span className="text-[10px] text-zinc-400">支持 JPG, PNG, WEBP 高清实拍特写</span>
                </button>
              </div>

              {/* Upload Method 2: Image URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-800 block">方法 2：输入网络图片链接 (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://... 请输入或粘贴图片完整网址"
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-xl text-xs focus:outline-hidden focus:border-zinc-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageModalMode === 'replace_main') {
                        handleReplaceMainImage(imageUrlInput);
                      } else if (imageModalMode === 'add_detail') {
                        handleAddDetailImage(imageUrlInput);
                      } else if (imageModalMode === 'replace_detail' && targetDetailIndex !== null) {
                        handleReplaceSpecificDetail(targetDetailIndex, imageUrlInput);
                      }
                    }}
                    disabled={!imageUrlInput.trim()}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer transition-all shrink-0"
                  >
                    确认应用
                  </button>
                </div>
              </div>

              {/* Upload Method 3: Pick from High-definition fabric texture presets */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <label className="text-[11px] font-bold text-zinc-600 block">方法 3：从高清纺织面料特写预设库中直接挑选</label>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                  {HIGH_RES_FABRIC_PRESETS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        if (imageModalMode === 'replace_main') {
                          handleReplaceMainImage(preset.url);
                        } else if (imageModalMode === 'add_detail') {
                          handleAddDetailImage(preset.url);
                        } else if (imageModalMode === 'replace_detail' && targetDetailIndex !== null) {
                          handleReplaceSpecificDetail(targetDetailIndex, preset.url);
                        }
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-950 transition-all cursor-pointer"
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 transition-opacity">
                        <span className="text-[9px] text-white font-bold text-center leading-tight">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImageModalMode(null);
                    setImageUrlInput('');
                    setTargetDetailIndex(null);
                  }}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Image Zoom Lightbox */}
      {showZoomModal && (
        <div
          className="fixed inset-0 z-70 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowZoomModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomImageUrl || currentFabric.mainImage}
              alt="High-Res Macro"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setShowZoomModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title={`[${currentFabric.id}] 原始凭证切片与核验`}
        evidenceItems={currentFabric.sources}
        fieldName={selectedFieldForEvidence}
      />
    </div>
  );
};
