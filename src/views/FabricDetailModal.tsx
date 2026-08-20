import React, { useState, useRef } from 'react';
import {
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Palette,
  Eye,
  Shirt,
  FileText,
  Building2,
  Info,
  Maximize2,
  Upload,
  Plus,
  Trash2,
  RefreshCw,
  Star,
  Image as ImageIcon,
  Check,
  Tag,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FabricMaster } from '../types';
import { StatusBadge } from '../components/StatusBadge';

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

interface FabricDetailModalProps {
  fabric: FabricMaster | null;
  isOpen: boolean;
  onClose: () => void;
  isDesensitizedMode: boolean;
  onNavigateToMatch: (fabricId: string) => void;
  onEdit: (fabric: FabricMaster) => void;
  onUpdateFabric?: (updatedFabric: FabricMaster) => void;
}

export const FabricDetailModal: React.FC<FabricDetailModalProps> = ({
  fabric,
  isOpen,
  onClose,
  isDesensitizedMode,
  onNavigateToMatch,
  onEdit,
  onUpdateFabric,
}) => {
  if (!isOpen || !fabric) return null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    fabric.colorVariants[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'creabra_spec' | 'garment_look' | 'commercial' | 'sources'>('creabra_spec');
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string>('');

  // Image management modal dialog states
  const [imageModalMode, setImageModalMode] = useState<'replace_main' | 'add_detail' | 'replace_detail' | null>(null);
  const [targetDetailIndex, setTargetDetailIndex] = useState<number | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeVariant =
    fabric.colorVariants.find((v) => v.id === selectedVariantId) ||
    fabric.colorVariants[0];

  const currentSwatchUrl = activeVariant?.image || fabric.mainImage;

  // Build standard bilingual spec mapping for Creabra design
  const fabricTypeZh = fabric.weaveCategory.value || '梭织';
  const fabricTypeEn = fabricTypeZh.includes('针织') ? 'Knit' : 'Woven';

  const weightStr = fabric.weight.value !== null ? `${fabric.weight.value} g/m²` : '待实测补录';
  
  const drapeZh = fabric.drape?.value || '中等挺括';
  const drapeEn = drapeZh.includes('垂顺') ? 'Fluid' : drapeZh.includes('挺括') ? 'Structured' : 'Medium Drape';

  const textureZh = fabric.weaveStructure?.value || '平纹';
  const textureEn = textureZh.includes('斜纹')
    ? 'Twill'
    : textureZh.includes('平纹')
    ? 'Plain Weave'
    : textureZh.includes('罗纹')
    ? 'Rib'
    : textureZh.includes('双面')
    ? 'Double Knit'
    : textureZh.includes('提花')
    ? 'Jacquard'
    : 'Woven';

  // Helper to parse multi-selected market types
  const marketTypesList = (fabric.marketFabricType?.value || '通用织物')
    .split(/[,，、/]/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Detail images safe list
  const currentDetailImages = fabric.detailImages || [];

  // Handle setting an image as Main Image
  const handleSetAsMainImage = (newMainUrl: string) => {
    if (!onUpdateFabric) return;
    const oldMain = fabric.mainImage;
    // Replace mainImage with newMainUrl, put oldMain into detailImages if not already there
    const updatedDetails = [
      oldMain,
      ...currentDetailImages.filter((img) => img !== newMainUrl),
    ].filter((img, idx, self) => img && self.indexOf(img) === idx && img !== newMainUrl);

    const updated: FabricMaster = {
      ...fabric,
      mainImage: newMainUrl,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    showToast('已成功将选定图片设为面料主图！');
  };

  // Handle deleting a detail image
  const handleDeleteDetailImage = (indexToDelete: number) => {
    if (!onUpdateFabric) return;
    const targetUrl = currentDetailImages[indexToDelete];
    const updatedDetails = currentDetailImages.filter((_, idx) => idx !== indexToDelete);
    const updated: FabricMaster = {
      ...fabric,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    showToast('已删除详情图');
  };

  // Handle adding a new detail image
  const handleAddDetailImage = (newUrl: string) => {
    if (!newUrl.trim() || !onUpdateFabric) return;
    const updatedDetails = [...currentDetailImages, newUrl.trim()];
    const updated: FabricMaster = {
      ...fabric,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    showToast('已新增 1 张面料详情图！');
  };

  // Handle replacing main image
  const handleReplaceMainImage = (newUrl: string) => {
    if (!newUrl.trim() || !onUpdateFabric) return;
    const oldMain = fabric.mainImage;
    const updatedDetails = [
      oldMain,
      ...currentDetailImages.filter((img) => img !== newUrl),
    ].filter((img, idx, self) => img && self.indexOf(img) === idx && img !== newUrl);

    const updated: FabricMaster = {
      ...fabric,
      mainImage: newUrl.trim(),
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    showToast('已替换封面主图！');
  };

  // Handle replacing a specific detail image
  const handleReplaceSpecificDetail = (indexToReplace: number, newUrl: string) => {
    if (!newUrl.trim() || !onUpdateFabric) return;
    const updatedDetails = [...currentDetailImages];
    updatedDetails[indexToReplace] = newUrl.trim();
    const updated: FabricMaster = {
      ...fabric,
      detailImages: updatedDetails,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateFabric(updated);
    setImageModalMode(null);
    setImageUrlInput('');
    setTargetDetailIndex(null);
    showToast('已更新详情图！');
  };

  // Handle local file upload
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
    // Reset file input
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200 font-sans">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 360 }}
          className="bg-white rounded-3xl shadow-2xl border border-zinc-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-zinc-950 text-white shadow-2xs">
                {fabric.systemCode || fabric.id}
              </span>
              <div>
                <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                  {fabric.name.value}
                  <StatusBadge status={fabric.reviewStatus} size="sm" />
                </h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  原厂货号: <span className="font-mono font-medium text-zinc-700">{fabric.supplierItemCode.value}</span> • 供应商: <span className="text-zinc-700 font-medium">{isDesensitizedMode ? '*** 纺织 (已脱敏)' : fabric.supplierName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  onNavigateToMatch(fabric.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-200" />
                <span>用于服装匹配</span>
              </motion.button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="px-6 border-b border-zinc-200 bg-white flex items-center gap-6 text-xs font-bold text-zinc-600">
            <button
              onClick={() => setActiveTab('creabra_spec')}
              className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'creabra_spec'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>面料档案与规格 (Creabra 视觉)</span>
            </button>
            <button
              onClick={() => setActiveTab('garment_look')}
              className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'garment_look'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>成衣上身与款式应用</span>
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'commercial'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>三维报价与供应链</span>
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'sources'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>原始色卡与质检报告 ({fabric.sources?.length || 0})</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-zinc-50/30">
            {activeTab === 'creabra_spec' && (
              <div className="space-y-6">
                {/* Creabra Main Card (Aesthetic layout exactly from user screenshot 4) */}
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Square Fabric Macro Closeup Photo & Detail Images Gallery */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Main Image Box */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200/90 bg-zinc-100 shadow-xs group">
                      <img
                        src={currentSwatchUrl}
                        alt={fabric.name.value}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Top Action Buttons (Hover overlay & permanent access) */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                        {onUpdateFabric && (
                          <button
                            onClick={() => {
                              setImageModalMode('replace_main');
                              setImageUrlInput('');
                            }}
                            className="px-2.5 py-1.5 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-xl backdrop-blur-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-white/20"
                            title="替换当前封面主图"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>替换主图</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setZoomImageUrl(currentSwatchUrl);
                            setShowFullImageModal(true);
                          }}
                          className="p-1.5 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-xs border border-white/20"
                          title="查看高清原图"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Active Color Tag */}
                      {activeVariant && (
                        <div className="absolute bottom-3 left-3 right-3 bg-zinc-950/80 backdrop-blur-md rounded-xl p-2.5 text-white text-xs flex items-center justify-between border border-white/10 z-10">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-white/60 shrink-0 shadow-2xs"
                              style={{ backgroundColor: activeVariant.hex }}
                            ></span>
                            <span className="font-bold">{activeVariant.supplierColorName}</span>
                            <span className="text-[10px] text-zinc-300">({activeVariant.standardColorName})</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">{activeVariant.supplierColorCode}</span>
                        </div>
                      )}
                    </div>

                    {/* Image Toast Feedback */}
                    {toastMessage && (
                      <div className="p-2.5 bg-emerald-950 text-white rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{toastMessage}</span>
                      </div>
                    )}

                    {/* Color Swatch Switcher */}
                    {fabric.colorVariants && fabric.colorVariants.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-600 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-zinc-900" />
                          颜色款式切换 ({fabric.colorVariants.length} 色)：
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {fabric.colorVariants.map((variant, vIdx) => (
                            <button
                              key={variant.id ? `variant-${variant.id}` : `variant-idx-${vIdx}`}
                              onClick={() => setSelectedVariantId(variant.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all cursor-pointer ${
                                selectedVariantId === variant.id
                                  ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                                  : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700 bg-white'
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-white/40 shrink-0 shadow-2xs"
                                style={{ backgroundColor: variant.hex }}
                              ></span>
                              <span className="text-[11px]">{variant.supplierColorName}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detail Images & Texture Gallery Management (增加/删除/替换/设为主图) */}
                    <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-zinc-700" />
                          实拍图与详情相册 ({currentDetailImages.length + 1} 张)
                        </span>
                        {onUpdateFabric && (
                          <button
                            onClick={() => {
                              setImageModalMode('add_detail');
                              setImageUrlInput('');
                            }}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>增加详情图</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {/* Main Image Thumbnail */}
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-zinc-950 bg-zinc-200 group">
                          <img
                            src={fabric.mainImage}
                            alt="Main"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-zinc-950 text-white text-[9px] font-bold rounded-md z-10 shadow-xs">
                            主图
                          </span>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white p-1">
                            <button
                              onClick={() => {
                                setZoomImageUrl(fabric.mainImage);
                                setShowFullImageModal(true);
                              }}
                              className="p-1 bg-white/20 hover:bg-white/40 rounded text-[10px] cursor-pointer"
                              title="查看原图"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            {onUpdateFabric && (
                              <button
                                onClick={() => {
                                  setImageModalMode('replace_main');
                                  setImageUrlInput('');
                                }}
                                className="px-1.5 py-0.5 bg-white text-zinc-950 rounded text-[9px] font-bold cursor-pointer"
                                title="替换主图"
                              >
                                替换
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Detail Images Thumbnails */}
                        {currentDetailImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 group"
                          >
                            <img
                              src={imgUrl}
                              alt={`Detail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/60 text-white text-[8px] font-mono rounded">
                              附图 {idx + 1}
                            </span>
                            {/* Hover Action Overlay */}
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white p-1">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setZoomImageUrl(imgUrl);
                                    setShowFullImageModal(true);
                                  }}
                                  className="p-1 bg-white/20 hover:bg-white/40 rounded text-white cursor-pointer"
                                  title="放大查看"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                {onUpdateFabric && (
                                  <>
                                    <button
                                      onClick={() => handleSetAsMainImage(imgUrl)}
                                      className="p-1 bg-amber-500 hover:bg-amber-600 text-white rounded cursor-pointer"
                                      title="设为封面主图"
                                    >
                                      <Star className="w-3 h-3 fill-current" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTargetDetailIndex(idx);
                                        setImageModalMode('replace_detail');
                                        setImageUrlInput('');
                                      }}
                                      className="p-1 bg-white/20 hover:bg-white/40 rounded text-white cursor-pointer"
                                      title="替换此图"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDetailImage(idx)}
                                      className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                                      title="删除此图"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add Detail Photo Placeholder Button */}
                        {onUpdateFabric && (
                          <button
                            onClick={() => {
                              setImageModalMode('add_detail');
                              setImageUrlInput('');
                            }}
                            className="aspect-square rounded-xl border border-dashed border-zinc-300 hover:border-zinc-500 hover:bg-zinc-100 flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-medium">增加图片</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        提示：支持将任意实拍详情图一键【设为主图】，或上传本地高清图替换/删除。
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Spec Grid & Description & Alternative Fabrics (Creabra Style) */}
                  <div className="md:col-span-7 space-y-5">
                    
                    {/* Top Spec 2x3 Grid (Bilingual & High contrast) */}
                    <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">ID</span>
                        <span className="font-mono font-bold text-xs text-zinc-950 mt-1 block truncate">
                          {fabric.systemCode || fabric.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">Type (品类)</span>
                        <span className="font-bold text-xs text-zinc-950 mt-1 block">
                          {fabricTypeZh} <span className="text-[10px] text-zinc-500 font-normal">({fabricTypeEn})</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">Weight (克重)</span>
                        <span className="font-mono font-bold text-xs text-zinc-950 mt-1 block">
                          {weightStr}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-zinc-200/60">
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">Composition (成分)</span>
                        <span className="font-bold text-xs text-zinc-950 mt-1 block leading-snug">
                          {fabric.composition.value}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-zinc-200/60">
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">Drape (垂感)</span>
                        <span className="font-bold text-xs text-zinc-950 mt-1 block">
                          {drapeZh} <span className="text-[10px] text-zinc-500 font-normal">({drapeEn})</span>
                        </span>
                      </div>
                      <div className="pt-2 border-t border-zinc-200/60">
                        <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-bold">Texture (组织)</span>
                        <span className="font-bold text-xs text-zinc-950 mt-1 block">
                          {textureZh} <span className="text-[10px] text-zinc-500 font-normal">({textureEn})</span>
                        </span>
                      </div>
                    </div>

                    {/* Description Section (Creabra Style) */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-zinc-900" />
                        <span>Description (面料简介与特性叙述)</span>
                      </h4>
                      <div className="p-3.5 bg-zinc-50/70 rounded-xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed font-sans">
                        <p>{fabric.description || '这款高品质面料专为高要求服装品类研发，具备优异的触感与垂坠感。面料结构紧密，透气舒适，非常适合现代成衣设计。'}</p>
                        {fabric.enDescription && (
                          <p className="mt-2 text-[11px] text-zinc-500 italic border-t border-zinc-200/60 pt-2 font-serif">
                            {fabric.enDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alternative Fabrics Section (Creabra Style) */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                        <span>Alternative Fabrics (对标与替代面料建议)</span>
                      </h4>
                      <div className="space-y-1.5">
                        {fabric.alternativeFabrics && fabric.alternativeFabrics.length > 0 ? (
                          fabric.alternativeFabrics.map((alt, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 bg-zinc-50 hover:bg-zinc-100/80 rounded-xl border border-zinc-200/80 flex items-start justify-between gap-3 text-xs transition-colors"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 shrink-0"></span>
                                  <span className="font-bold text-zinc-950">{alt.name}</span>
                                  {alt.enName && (
                                    <span className="text-[10px] text-zinc-500 font-sans">({alt.enName})</span>
                                  )}
                                </div>
                                {alt.similarityNote && (
                                  <p className="text-[11px] text-zinc-600 pl-3">
                                    {alt.similarityNote}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-200/80 text-zinc-800 rounded-md">
                                  {alt.weight || '标准'}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
                            暂无对标替代面料
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Functions tags */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-zinc-600">面料性能声明与功能标签：</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(fabric.functions || []).map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white text-zinc-900 border border-zinc-300 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3 text-zinc-950" />
                            {f.name}
                            <span className="text-[10px] text-zinc-400 font-normal">
                              ({f.evidenceLevel === 'supplier_declared' ? '供应商' : f.evidenceLevel === 'lab_tested' ? '实测报告' : 'AI推测'})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === 'garment_look' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left: Garment Silhouette application photo */}
                  <div className="md:col-span-5 space-y-2">
                    <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-zinc-900" />
                      成衣上身实拍与轮廓参考：
                    </span>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xs">
                      <img
                        src={fabric.garmentPreviewImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'}
                        alt="成衣款式参考"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-zinc-950/80 backdrop-blur-md rounded-xl p-2.5 text-white text-xs border border-white/10">
                        <span className="font-bold block">设计应用建议</span>
                        <span className="text-[10px] text-zinc-300">自然悬垂与立体剪裁表现</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Recommendations & Craft Risks */}
                  <div className="md:col-span-7 space-y-5">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                        推荐服装款式与适用场景：
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(fabric.recommendedGarments || []).map((g, i) => (
                          <div
                            key={i}
                            className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        不推荐品类与工艺风险提示：
                      </span>
                      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs text-amber-950">
                        {fabric.unsuitableGarments && fabric.unsuitableGarments.length > 0 && (
                          <div>
                            <span className="font-bold text-amber-900 block">不推荐款式：</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(fabric.unsuitableGarments || []).map((u, i) => (
                                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[11px] font-medium">
                                  {u}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-amber-900 block">工艺与洗涤注意事项：</span>
                          <div className="space-y-1 text-[11px] text-amber-900/90 mt-1">
                            {fabric.usageRisks?.map((r, i) => (
                              <p key={i}>• {r}</p>
                            )) || <p>暂无明显工艺风险</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commercial' && (
              <div className="space-y-4">
                {/* 3-Tier Price Matrix & Supply Chain Section */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="px-5 py-3 bg-zinc-950 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-zinc-300" />
                      <span className="font-bold">商务报价与供应链全景</span>
                      <span className="text-[10px] bg-zinc-800 px-2.5 py-0.5 rounded-full text-zinc-300">
                        {isDesensitizedMode ? '外部脱敏视图 (仅展示样品价)' : '内部商务视图 (全量价格与底价可见)'}
                      </span>
                    </div>
                  </div>

                  {isDesensitizedMode ? (
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block">供应商企业</span>
                        <span className="font-bold text-zinc-950 mt-1 block">
                          {fabric.supplierShortName ? `${fabric.supplierShortName}纺织 (已脱敏)` : '**** 纺织科技 (已脱敏)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">业务对接人</span>
                        <span className="font-mono text-zinc-950 mt-1 block font-bold">
                          商务代表 (400-***-8821)
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-medium">样品指导价 (散剪打样)</span>
                        <span className="font-bold text-zinc-950 font-mono mt-1 text-sm block">
                          ¥{fabric.samplePrice?.value || 35} {fabric.priceUnit}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">批量大货价</span>
                        <span className="text-zinc-400 font-mono mt-1 block">
                          达成打样合作后向商务申请
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">起订量 (MOQ)</span>
                        <span className="text-zinc-800 font-mono mt-1 block font-bold">
                          散剪 1 米起 • 现货现剪
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">交期说明</span>
                        <span className="text-zinc-800 mt-1 block font-medium">
                          {fabric.leadTime?.value || '现货快速发货'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 space-y-4 text-xs">
                      {/* 3-Tier Price Matrix */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                        <div className="border-r border-zinc-200/80 pr-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px] font-medium">1. 采购成本底价</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-zinc-950 text-white rounded font-mono font-bold">内部底价</span>
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="font-mono font-bold text-lg text-zinc-950">
                              ¥{fabric.basePrice?.value || '--'}
                            </span>
                            <span className="text-zinc-500 text-[11px]">{fabric.priceUnit}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">底线核算价 / 谈判基准</p>
                        </div>

                        <div className="border-r border-zinc-200/80 pr-3">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px] font-medium">2. 批量大货采购价</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-zinc-200 text-zinc-800 rounded font-mono font-bold">大货价</span>
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="font-mono font-bold text-lg text-zinc-950">
                              ¥{fabric.bulkPrice?.value || '--'}
                            </span>
                            <span className="text-zinc-500 text-[11px]">{fabric.priceUnit}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">MOQ 达到 {fabric.moq?.value || 300} 米阶梯价</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 text-[11px] font-medium">3. 样品散剪指导价</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-zinc-100 text-zinc-700 rounded font-mono font-bold">样品价</span>
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="font-mono font-bold text-lg text-zinc-950">
                              ¥{fabric.samplePrice?.value || '--'}
                            </span>
                            <span className="text-zinc-500 text-[11px]">{fabric.priceUnit}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">打样散剪指导价</p>
                        </div>
                      </div>

                      {/* Supplier & Contract Terms */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                        <div>
                          <span className="text-zinc-500 block">供应商企业全称</span>
                          <span className="font-bold text-zinc-950 mt-1 block">
                            {fabric.supplierName}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">商务对接人及电话</span>
                          <span className="font-mono text-zinc-950 mt-1 block font-bold">
                            {fabric.supplierContact} • {fabric.supplierPhone}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">起订量 (MOQ) / 交期</span>
                          <span className="font-bold text-zinc-800 mt-1 block font-mono">
                            {fabric.moq?.value ? `${fabric.moq.value}${fabric.moq.unit}` : '无限制'} • {fabric.leadTime?.value || '以排单为准'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">内部合作备注</span>
                          <span className="text-zinc-600 mt-1 block truncate">
                            {fabric.internalNotes || '品控稳定，常备现货仓'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-zinc-900" />
                    多模态采集凭证与原始色卡照片
                  </h4>
                  {fabric.sources && fabric.sources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fabric.sources.map((s, sIdx) => (
                        <div key={s.id ? `src-${s.id}` : `src-idx-${sIdx}`} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-3">
                          <img
                            src={s.thumbnail}
                            alt={s.title}
                            className="w-20 h-20 rounded-lg object-cover border border-zinc-200 shrink-0"
                          />
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-zinc-950 block">{s.title}</span>
                            <span className="text-[10px] text-zinc-400 font-mono block">提取时间: {s.extractedAt}</span>
                            <div className="space-y-0.5 text-[11px] text-zinc-600">
                              {(s.ocrSnippets || []).map((ocr, i) => (
                                <p key={i} className="truncate">
                                  <span className="text-zinc-400 font-medium">{ocr.field}:</span> {ocr.text}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 text-center text-xs text-zinc-500">
                      该面料已通过系统规范化建档，暂未附加扫描附页
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono text-[11px]">
              更新时间: {fabric.updatedAt} • 创建时间: {fabric.createdAt}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onEdit(fabric);
                }}
                className="px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-xl font-bold transition-all cursor-pointer shadow-2xs"
              >
                编辑主档
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </div>

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
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-70 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowFullImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomImageUrl || currentSwatchUrl}
              alt="High-Res Macro"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setShowFullImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
