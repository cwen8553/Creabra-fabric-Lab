import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Crop,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  FileSearch,
  ScanLine,
  Plus,
  Trash2,
  FileText,
  Building2,
  CheckCheck,
  Star,
  Eye,
  X,
  Move,
  RotateCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_SUPPLIERS, SupplierProfile } from '../mockData';

export type MaterialAssetTag = 'hangtag' | 'color_card' | 'macro_texture' | 'test_report' | 'garment_sample' | 'other';

export interface UploadedMaterialAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  tag: MaterialAssetTag;
  isMain: boolean;
  cropParams?: {
    zoom: number;
    rotation: number;
    aspectRatio: string;
  };
}

export interface ExtraAttachment {
  id: string;
  name: string;
  url: string;
  type: 'color_card' | 'test_report' | 'back_texture' | 'hangtag' | 'other';
  size?: string;
  previewUrl?: string;
}

export interface ExtractedFabricData {
  supplierName: string;
  supplierShortName: string;
  contactName: string;
  contactPhone: string;
  fabricName: string;
  itemCode: string;
  marketFabricType: string;
  composition: string;
  weight: string;
  width: string;
  weaveCategory: '梭织' | '针织' | '非织造';
  weaveStructure: string;
  elasticity: '无弹' | '微弹' | '二面弹' | '四面弹';
  opacity: '不透明' | '半透明' | '透明';
  specialCrafts: string[];
  basePrice: string;
  bulkPrice: string;
  samplePrice: string;
  priceUnit: string;
  moq: string;
  leadTime: string;
  functions: string;
  mainImage: string;
  colorVariants: Array<{ name: string; code: string; hex: string }>;
  extraAttachments?: ExtraAttachment[];
  isNewSupplier?: boolean;
}

interface SingleFabricAiExtractorProps {
  onExtracted: (data: ExtractedFabricData) => void;
  onCroppedImageChange: (imageUrl: string) => void;
  currentMainImage?: string;
  existingSuppliers?: SupplierProfile[];
}

export const SingleFabricAiExtractor: React.FC<SingleFabricAiExtractorProps> = ({
  onExtracted,
  onCroppedImageChange,
  currentMainImage,
  existingSuppliers = INITIAL_SUPPLIERS,
}) => {
  // Initial default assets in production workbench
  const [assets, setAssets] = useState<UploadedMaterialAsset[]>([
    {
      id: 'asset-main-1',
      name: '75D莫代尔速干高弹平纹_挂牌扫描件.jpg',
      url: currentMainImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80',
      size: '2.8 MB',
      tag: 'hangtag',
      isMain: true,
      cropParams: { zoom: 1, rotation: 0, aspectRatio: '1:1' },
    },
    {
      id: 'asset-texture-2',
      name: '布料微距针织平纹肌理特写.jpg',
      url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=1000&auto=format&fit=crop&q=80',
      size: '3.4 MB',
      tag: 'macro_texture',
      isMain: false,
      cropParams: { zoom: 1, rotation: 0, aspectRatio: '1:1' },
    },
    {
      id: 'asset-report-3',
      name: 'SGS纤维成分与透气抑菌检测报告.pdf',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80',
      size: '1.2 MB',
      tag: 'test_report',
      isMain: false,
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [extractedSuccess, setExtractedSuccess] = useState(false);
  const [activeExtractedData, setActiveExtractedData] = useState<ExtractedFabricData | null>(null);

  // Active Cropping & Studio state
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);
  const [activeCropAssetId, setActiveCropAssetId] = useState<string | null>('asset-main-1');
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotation, setCropRotation] = useState(0);
  const [cropAspectRatio, setCropAspectRatio] = useState<'1:1' | '4:3' | '3:4' | 'free'>('1:1');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find currently designated main asset
  const mainAsset = assets.find((a) => a.isMain) || assets[0];

  // Set designated asset as main image
  const handleSetMainAsset = (assetId: string) => {
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;

    const updated = assets.map((a) => ({
      ...a,
      isMain: a.id === assetId,
    }));
    setAssets(updated);
    onCroppedImageChange(target.url);

    if (activeExtractedData) {
      const updatedData = { ...activeExtractedData, mainImage: target.url };
      setActiveExtractedData(updatedData);
      onExtracted(updatedData);
    }
  };

  // Process batch uploaded files (either multi-drop or multi-select)
  const processUploadedFiles = (files: FileList | File[]) => {
    const newItems: UploadedMaterialAsset[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file, index) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
      const previewUrl = isImg
        ? URL.createObjectURL(file)
        : 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80';

      const fileNameLower = file.name.toLowerCase();
      let tag: MaterialAssetTag = 'other';
      if (fileNameLower.includes('挂牌') || fileNameLower.includes('tag') || fileNameLower.includes('吊牌')) {
        tag = 'hangtag';
      } else if (fileNameLower.includes('色卡') || fileNameLower.includes('color')) {
        tag = 'color_card';
      } else if (fileNameLower.includes('微距') || fileNameLower.includes('纹理') || fileNameLower.includes('肌理')) {
        tag = 'macro_texture';
      } else if (fileNameLower.includes('报告') || fileNameLower.includes('检测') || isPdf) {
        tag = 'test_report';
      } else if (fileNameLower.includes('成衣') || fileNameLower.includes('样衣')) {
        tag = 'garment_sample';
      }

      newItems.push({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        url: previewUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        tag,
        isMain: assets.length === 0 && index === 0, // First item is main if list is empty
        cropParams: { zoom: 1, rotation: 0, aspectRatio: '1:1' },
      });
    });

    const combined = [...assets, ...newItems];
    // Ensure at least one is main
    if (!combined.some((a) => a.isMain) && combined.length > 0) {
      combined[0].isMain = true;
    }

    setAssets(combined);

    // Automatically trigger AI Multimodal Multi-Image Parsing
    triggerAiMultimodalExtraction(combined);
  };

  // Paste handler for quick screenshot drop
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const imageFiles = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
          processUploadedFiles(imageFiles);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [assets]);

  // Remove an asset
  const handleRemoveAsset = (assetId: string) => {
    const remaining = assets.filter((a) => a.id !== assetId);
    if (remaining.length > 0 && !remaining.some((a) => a.isMain)) {
      remaining[0].isMain = true;
      onCroppedImageChange(remaining[0].url);
    }
    setAssets(remaining);
  };

  // Change asset tag
  const handleChangeAssetTag = (assetId: string, newTag: MaterialAssetTag) => {
    setAssets(assets.map((a) => (a.id === assetId ? { ...a, tag: newTag } : a)));
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  // Open cropping tool for specific asset
  const handleOpenCropStudio = (asset: UploadedMaterialAsset) => {
    setActiveCropAssetId(asset.id);
    setCropZoom(asset.cropParams?.zoom || 1);
    setCropRotation(asset.cropParams?.rotation || 0);
    setCropAspectRatio((asset.cropParams?.aspectRatio as any) || '1:1');
    setIsCroppingOpen(true);
  };

  // Apply crop parameters
  const handleSaveCrop = () => {
    if (!activeCropAssetId) return;

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === activeCropAssetId) {
          return {
            ...a,
            cropParams: {
              zoom: cropZoom,
              rotation: cropRotation,
              aspectRatio: cropAspectRatio,
            },
          };
        }
        return a;
      })
    );

    const croppedAsset = assets.find((a) => a.id === activeCropAssetId);
    if (croppedAsset && croppedAsset.isMain) {
      onCroppedImageChange(croppedAsset.url);
    }

    setIsCroppingOpen(false);
  };

  // Check supplier existence against supplier library
  const checkSupplierMatch = (name: string, shortName: string) => {
    return existingSuppliers.find(
      (s) =>
        s.name.trim().toLowerCase() === name.trim().toLowerCase() ||
        (s.shortName && s.shortName.trim().toLowerCase() === shortName.trim().toLowerCase()) ||
        name.includes(s.shortName) ||
        s.name.includes(shortName)
    );
  };

  // AI Multimodal Multi-Image Deep Parsing Pipeline
  const triggerAiMultimodalExtraction = (currentAssetList = assets) => {
    if (currentAssetList.length === 0) return;

    setIsScanning(true);
    setScanStep(1);
    setExtractedSuccess(false);

    const activeMain = currentAssetList.find((a) => a.isMain) || currentAssetList[0];
    const assetNames = currentAssetList.map((a) => a.name).join(' ');

    // Deduce or synthesize high-precision textile parameters based on uploaded assets
    let deducedSupplier = '柯桥恒茂纺织科技有限公司';
    let deducedShort = '恒茂';
    let deducedContact = '陈经理';
    let deducedPhone = '138-5758-9921';
    let deducedFabricName = '75D 莫代尔速干透气高弹平纹布';
    let deducedItemCode = 'HM-2025-MOD88';
    let deducedComp = '78% 兰精莫代尔 16% 涤纶 6% 氨纶';
    let deducedWeight = '185';
    let deducedWidth = '165';
    let deducedCategory: '针织' | '梭织' | '非织造' = '针织';
    let deducedWeave = '单面平纹';
    let deducedElasticity: '无弹' | '微弹' | '二面弹' | '四面弹' = '四面弹';
    let deducedOpacity: '不透明' | '半透明' | '透明' = '不透明';
    let deducedCrafts = ['磨毛/拉绒', '吸湿速干整理', '抗菌防螨'];
    let deducedBasePrice = '25.0';
    let deducedBulkPrice = '29.5';
    let deducedSamplePrice = '42.0';
    let deducedMoq = '500';
    let deducedLeadTime = '15-20天';
    let deducedFunctions = '吸湿排汗, 亲肤透气, 四面高弹, 抗菌防臭, 柔软挺括';

    if (assetNames.includes('盛泰') || assetNames.includes('天丝') || assetNames.includes('莱赛尔')) {
      deducedSupplier = '绍兴盛泰纺织科技有限公司';
      deducedShort = '盛泰';
      deducedContact = '林经理';
      deducedPhone = '138-5750-8821';
      deducedFabricName = '60S 兰精天丝莱赛尔双面微提花针织布';
      deducedItemCode = 'ST-2026-TS60';
      deducedComp = '92% 兰精天丝(莱赛尔) 8% 锦纶';
      deducedWeight = '210';
      deducedWidth = '170';
      deducedCategory = '针织';
      deducedWeave = '双面小提花';
      deducedElasticity = '二面弹';
      deducedCrafts = ['丝光整理', '液氨整理'];
      deducedBasePrice = '38.0';
      deducedBulkPrice = '45.0';
      deducedSamplePrice = '65.0';
      deducedMoq = '300';
      deducedLeadTime = '10-15天';
      deducedFunctions = '丝滑亲肤, 天然抑菌, 悬垂透气, 冰感舒适';
    } else if (assetNames.includes('福泽') || assetNames.includes('棉') || assetNames.includes('斜纹')) {
      deducedSupplier = '常州福泽针纺制品厂';
      deducedShort = '福泽';
      deducedContact = '周经理';
      deducedPhone = '137-7512-8833';
      deducedFabricName = '50S/2 双股精梳棉高密挺括斜纹布';
      deducedItemCode = 'FZ-2026-CT50';
      deducedComp = '100% 长绒棉';
      deducedWeight = '245';
      deducedWidth = '150';
      deducedCategory = '梭织';
      deducedWeave = '2/1 左斜纹';
      deducedElasticity = '无弹';
      deducedCrafts = ['免烫抗皱', '液氨整理'];
      deducedBasePrice = '28.0';
      deducedBulkPrice = '33.0';
      deducedSamplePrice = '48.0';
      deducedMoq = '600';
      deducedLeadTime = '20天';
      deducedFunctions = '纯棉透气, 骨感挺括, 经典斜纹肌理, 抗起球';
    } else if (assetNames.includes('华宇') || assetNames.includes('冲锋') || assetNames.includes('尼龙')) {
      deducedSupplier = '海宁华宇超纤新材料股份有限公司';
      deducedShort = '华宇';
      deducedContact = '王经理';
      deducedPhone = '139-5731-6677';
      deducedFabricName = '70D 哑光超泼水四面弹力冲锋衣复合面料';
      deducedItemCode = 'HY-2026-WP70';
      deducedComp = '88% 锦纶 12% 氨纶';
      deducedWeight = '195';
      deducedWidth = '148';
      deducedCategory = '梭织';
      deducedWeave = '平纹复合膜';
      deducedElasticity = '四面弹';
      deducedCrafts = ['DWR超泼水', 'TPU微孔透湿贴膜', '防风防撕裂'];
      deducedBasePrice = '32.0';
      deducedBulkPrice = '36.5';
      deducedSamplePrice = '52.0';
      deducedMoq = '400';
      deducedLeadTime = '15天';
      deducedFunctions = '防暴雨透湿, 防风保暖, 耐磨抗撕裂, 微弹自如';
    }

    const attachmentsFormatted: ExtraAttachment[] = currentAssetList
      .filter((a) => !a.isMain)
      .map((a) => ({
        id: a.id,
        name: a.name,
        url: a.url,
        type: a.tag === 'test_report' ? 'test_report' : a.tag === 'color_card' ? 'color_card' : 'other',
        size: a.size,
        previewUrl: a.url,
      }));

    const extractedData: ExtractedFabricData = {
      supplierName: deducedSupplier,
      supplierShortName: deducedShort,
      contactName: deducedContact,
      contactPhone: deducedPhone,
      fabricName: deducedFabricName,
      itemCode: deducedItemCode,
      marketFabricType: deducedComp.includes('莫代尔')
        ? '莫代尔'
        : deducedComp.includes('天丝')
        ? '天丝/莱赛尔'
        : deducedComp.includes('棉')
        ? '纯棉/精梳棉'
        : '锦纶/尼龙',
      composition: deducedComp,
      weight: deducedWeight,
      width: deducedWidth,
      weaveCategory: deducedCategory,
      weaveStructure: deducedWeave,
      elasticity: deducedElasticity,
      opacity: deducedOpacity,
      specialCrafts: deducedCrafts,
      basePrice: deducedBasePrice,
      bulkPrice: deducedBulkPrice,
      samplePrice: deducedSamplePrice,
      priceUnit: '元/米',
      moq: deducedMoq,
      leadTime: deducedLeadTime,
      functions: deducedFunctions,
      mainImage: activeMain ? activeMain.url : '',
      colorVariants: [
        { name: '冷雾蓝', code: '08-Cloud', hex: '#63829b' },
        { name: '极光黑', code: '01-Black', hex: '#181b20' },
        { name: '奶油杏', code: '03-Almond', hex: '#eae2cf' },
      ],
      extraAttachments: attachmentsFormatted,
    };

    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => setScanStep(4), 1800);
    setTimeout(() => {
      setIsScanning(false);
      setExtractedSuccess(true);
      setActiveExtractedData(extractedData);
      // Automatically and immediately populate form fields below!
      onExtracted(extractedData);
      if (extractedData.mainImage) {
        onCroppedImageChange(extractedData.mainImage);
      }
    }, 2400);
  };

  const matchedSupplier = activeExtractedData
    ? checkSupplierMatch(activeExtractedData.supplierName, activeExtractedData.supplierShortName)
    : null;

  return (
    <div className="bg-white border-2 border-zinc-200 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
      {/* Hidden File Input for Multi-Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processUploadedFiles(e.target.files);
          }
        }}
        multiple
        accept="image/*,.pdf,.doc,.docx,.xlsx"
        className="hidden"
      />

      {/* Top Header & Workstation Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-zinc-950">
                多模态多图智能识别与主图提取工作台
              </h2>
              <span className="text-[10px] bg-zinc-100 text-zinc-900 border border-zinc-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                P0 交互标准 · 多图多模态解析
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              支持批量拖入/上传色卡实拍、挂牌扫描件、布料纹理微距与检测报告。可在素材库中指定主图并实时裁剪，系统自动多图融合解析并填入下方主档。
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-zinc-800 rounded-xl text-xs font-bold border border-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-700" />
            <span>批量上传图片/附件</span>
          </button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => triggerAiMultimodalExtraction(assets)}
            disabled={isScanning || assets.length === 0}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-200" />
                <span>多模态解析中 ({scanStep}/4)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                <span>一键多模态深度解析并注入表单</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Unified Dropzone & Multi-Image Gallery Studio Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 rounded-2xl p-5 transition-all ${
          isDragging
            ? 'border-zinc-950 ring-4 ring-zinc-900/20 bg-zinc-100 scale-[1.005]'
            : 'border-dashed border-zinc-300 bg-zinc-50/70 hover:border-zinc-400'
        }`}
      >
        {/* Drag Active Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-zinc-950/90 z-40 rounded-2xl flex flex-col items-center justify-center p-6 text-white space-y-3 pointer-events-none animate-in fade-in">
            <Upload className="w-12 h-12 text-zinc-200 animate-bounce" />
            <p className="text-sm font-bold">松开鼠标即可批量添加所有图片与附件素材</p>
            <p className="text-xs text-zinc-400">支持拖入多张 JPG/PNG 色卡实拍、挂牌扫描件、微距照片或 PDF 报告</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5/12): Main Image Preview & Interactive Cropper Studio */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-zinc-900 text-white">
                  <Star className="w-3 h-3 fill-white" />
                </span>
                <span className="text-xs font-bold text-zinc-900">当前选定主图</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {mainAsset ? `(${mainAsset.size})` : ''}
                </span>
              </div>

              {mainAsset && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCropStudio(mainAsset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCroppingOpen
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    <Crop className="w-3 h-3" />
                    <span>{isCroppingOpen ? '退出裁剪' : '裁剪 / 调整主图'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Image Stage Box */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-xs flex items-center justify-center group">
              {mainAsset ? (
                <div
                  className="w-full h-full relative overflow-hidden flex items-center justify-center bg-zinc-950"
                  style={{
                    transform: isCroppingOpen
                      ? `scale(${cropZoom}) rotate(${cropRotation}deg)`
                      : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <img
                    src={mainAsset.url}
                    alt={mainAsset.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Cropping Grid Guide Overlay */}
                  {isCroppingOpen && (
                    <div className="absolute inset-0 border-2 border-white/90 border-dashed m-6 rounded-lg pointer-events-none flex items-center justify-center shadow-2xl">
                      <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-40">
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div className="border-r border-b border-white" />
                        <div />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                        主图输出比例: {cropAspectRatio}
                      </span>
                    </div>
                  )}

                  {/* AI Scanning Visual Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col justify-between p-4 pointer-events-none">
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-bounce shadow-xl" />
                      <div className="flex justify-between items-start">
                        <div className="px-2 py-1 bg-black/80 text-white rounded text-[10px] font-mono border border-white/20 flex items-center gap-1.5 animate-pulse">
                          <ScanLine className="w-3 h-3 text-zinc-200" />
                          <span>挂牌 OCR 与材质纹理提取中...</span>
                        </div>
                        <div className="px-2 py-1 bg-black/80 text-white rounded text-[10px] font-mono border border-white/20">
                          99.2%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-white/60 border-dashed rounded p-1.5 text-[10px] text-white font-mono bg-white/15">
                          织物结构: 针织单面平纹
                        </div>
                        <div className="border border-white/60 border-dashed rounded p-1.5 text-[10px] text-white font-mono bg-white/15 text-right">
                          弹性判定: 四面高弹
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center p-6 space-y-2 cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-zinc-500 mx-auto" />
                  <p className="text-xs font-bold text-zinc-300">暂无主图，点击上传或拖拽图片入内</p>
                </div>
              )}
            </div>

            {/* Cropping Control Toolbar */}
            <AnimatePresence>
              {isCroppingOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-white border border-zinc-200 rounded-2xl space-y-3 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 text-[11px] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-zinc-600" />
                      裁剪与视口调节
                    </span>
                    <div className="flex items-center gap-1">
                      {(['1:1', '4:3', '3:4', 'free'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setCropAspectRatio(ratio)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                            cropAspectRatio === ratio
                              ? 'bg-zinc-950 text-white'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center pt-1 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCropZoom(Math.max(1, cropZoom - 0.2))}
                        className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 cursor-pointer"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[10px] font-bold text-zinc-800 min-w-10 text-center">
                        {Math.round(cropZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setCropZoom(Math.min(2.5, cropZoom + 0.2))}
                        className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCropRotation((prev) => (prev + 90) % 360)}
                        className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 flex items-center gap-1 text-[10px] font-medium cursor-pointer"
                        title="顺时针旋转90度"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>旋转</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCropZoom(1);
                          setCropRotation(0);
                        }}
                        className="p-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 flex items-center gap-1 text-[10px] font-medium cursor-pointer"
                        title="复位"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>复位</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setIsCroppingOpen(false)}
                      className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900 text-xs font-medium cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCrop}
                      className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>保存并应用主图裁剪</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (7/12): Multi-Image Asset Gallery & AI Parsing Overview */}
          <div className="lg:col-span-7 space-y-4">
            {/* Multi-Image Asset Gallery Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-800" />
                <span className="text-xs font-bold text-zinc-900">
                  多图素材库 ({assets.length} 张已就绪)
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-zinc-900 hover:text-black font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>继续追加素材</span>
              </button>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center gap-3 relative ${
                    asset.isMain
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => setPreviewModalUrl(asset.url)}
                    className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shrink-0 relative cursor-pointer group"
                  >
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Metadata & Tag */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      {asset.isMain ? (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-white text-zinc-950 font-bold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-zinc-950" />
                          <span>主图</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainAsset(asset.id)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold border border-zinc-200 transition-colors cursor-pointer"
                        >
                          设为主图
                        </button>
                      )}

                      {/* Tag Selector */}
                      <select
                        value={asset.tag}
                        onChange={(e) => handleChangeAssetTag(asset.id, e.target.value as MaterialAssetTag)}
                        className={`text-[10px] font-bold rounded px-1.5 py-0.5 border cursor-pointer ${
                          asset.isMain
                            ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <option value="hangtag">挂牌扫描件</option>
                        <option value="color_card">色卡实拍</option>
                        <option value="macro_texture">微距纹理</option>
                        <option value="test_report">检测报告</option>
                        <option value="garment_sample">成衣样板</option>
                        <option value="other">其他细节</option>
                      </select>
                    </div>

                    <p className="text-[11px] font-bold truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <p className={`text-[10px] font-mono ${asset.isMain ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {asset.size}
                    </p>
                  </div>

                  {/* Actions (Crop & Delete) */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenCropStudio(asset)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        asset.isMain
                          ? 'hover:bg-zinc-800 text-zinc-300'
                          : 'hover:bg-zinc-100 text-zinc-500'
                      }`}
                      title="裁剪此图"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                    {assets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          asset.isMain
                            ? 'hover:bg-rose-900/50 text-rose-300'
                            : 'hover:bg-rose-50 text-rose-600'
                        }`}
                        title="删除此素材"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Multi-modal Extraction Status & Real-time Auto-fill Summary */}
            <div className="pt-2 border-t border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-zinc-900" />
                  <span className="text-xs font-bold text-zinc-950">多模态多图参数抽取与自动填单状态</span>
                </div>
                {extractedSuccess && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    已自动同步填入下方全部表单
                  </span>
                )}
              </div>

              {isScanning ? (
                <div className="py-6 space-y-3 text-center bg-white rounded-2xl border border-zinc-200">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-900">
                      {scanStep === 1 && '第 1/4 步：正在并发执行多图 OCR 与挂牌字符结构化...'}
                      {scanStep === 2 && '第 2/4 步：正在结合微距图像分析经纬密、单双面与组织结构...'}
                      {scanStep === 3 && '第 3/4 步：正在提取底价/大货/样布价格体系与起订交期条款...'}
                      {scanStep === 4 && '第 4/4 步：正在对齐供应商知识图谱并将数据完整注入主档...'}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      多模态引擎自动融合挂牌与实拍特征，实现零人工二次输入的极致效率
                    </p>
                  </div>
                </div>
              ) : activeExtractedData ? (
                <div className="space-y-3">
                  {/* Supplier Grouping Intelligent Detection Banner */}
                  <div
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs transition-all ${
                      matchedSupplier
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-zinc-900 text-white border-zinc-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-zinc-300 mt-0.5 shrink-0" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs">
                          {matchedSupplier ? '已匹配已有供应商分组' : '✨ 检测到全新供应商'}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/20 font-mono font-medium">
                          {activeExtractedData.supplierShortName}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        {matchedSupplier ? (
                          <>
                            供应商全称【{matchedSupplier.name}】已存在于档案库中（名下已有 {matchedSupplier.totalFabricsCount} 款面料）。
                            <strong className="text-white font-semibold"> 录入后将自动归入已有供应商面料组。</strong>
                          </>
                        ) : (
                          <>
                            供应商【{activeExtractedData.supplierName}】为新入库伙伴。
                            <strong className="text-white font-semibold"> 录入后系统将自动为您创建新供应商档案及其独立业务分组。</strong>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Visual Extracted Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">面料品名 / 供应商款号</span>
                      <p className="font-bold text-zinc-950 truncate text-[11px]">{activeExtractedData.fabricName}</p>
                      <p className="font-mono text-[10px] text-zinc-600 font-bold">{activeExtractedData.itemCode}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">纤维成分</span>
                      <p className="font-mono text-zinc-900 font-bold text-[11px] truncate">
                        {activeExtractedData.composition}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium">置信度 99.8%</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">物理参数 (克重/门幅/弹力)</span>
                      <p className="font-mono text-zinc-900 font-bold text-[11px]">
                        {activeExtractedData.weight} gsm • {activeExtractedData.width} cm
                      </p>
                      <p className="text-[10px] text-zinc-600">{activeExtractedData.weaveCategory} • {activeExtractedData.elasticity}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">供应商 / 商务对接</span>
                      <p className="font-bold text-zinc-950 text-[11px] truncate">{activeExtractedData.supplierShortName}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{activeExtractedData.contactName} • {activeExtractedData.contactPhone}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">三维价格体系 (元/米)</span>
                      <p className="font-mono text-zinc-950 font-bold text-[11px]">
                        底: ¥{activeExtractedData.basePrice} / 大货: ¥{activeExtractedData.bulkPrice}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">样布: ¥{activeExtractedData.samplePrice}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 space-y-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">起订量 / 货期</span>
                      <p className="font-bold text-zinc-950 text-[11px] font-mono">{activeExtractedData.moq}米 • {activeExtractedData.leadTime}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{activeExtractedData.specialCrafts.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center text-zinc-400 text-xs bg-white rounded-2xl border border-zinc-200">
                  请上传面料图片或点击【一键多模态深度解析并注入表单】启动自动提取
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      <AnimatePresence>
        {previewModalUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewModalUrl(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden bg-zinc-950 p-2 border border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewModalUrl}
                alt="Enlarged preview"
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
