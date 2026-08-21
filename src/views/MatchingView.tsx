import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Layers,
  Compass,
  Info,
  Copy,
  Check,
  Search,
  ArrowLeft,
  Grid,
  SlidersHorizontal,
  Tag,
  ChevronRight,
  Filter,
  ChevronDown,
  X,
  Wand2,
  Eye,
  Shirt,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FabricMaster,
  GarmentRequirement,
  FabricMatchResult,
  AIConceptMaterialSpec,
  OpacityLevel,
} from '../types';

interface MatchingViewProps {
  fabrics: FabricMaster[];
  initialFabricId?: string;
  onNavigateToDetail: (fabric: FabricMaster) => void;
}

// Preset garment category groups for instant selection & quick search
const PRESET_GARMENT_CATEGORIES: { group: string; items: { name: string; desc: string; tag: string }[] }[] = [
  {
    group: '上衣与衬衫',
    items: [
      { name: '夏季防晒轻薄衬衫', desc: '轻薄透气、垂顺免烫、防紫外线', tag: '轻薄' },
      { name: '商务免烫正装衬衫', desc: '高支高密、骨感挺拔、抗皱防缩', tag: '精裁' },
      { name: '复古法式真丝衬衫', desc: '真丝光泽、优雅垂坠、触感柔滑', tag: '真丝' },
      { name: '夏季日系松弛感T恤', desc: '舒适纯棉、微落肩、亲肤透气', tag: '休闲' },
      { name: '重磅华夫格休闲长袖T恤', desc: '立体华夫格肌理、微保暖、吸湿', tag: '重磅' },
      { name: '极简落肩打底衫', desc: '亲肤莫代尔、高弹修身包裹', tag: '打底' },
    ],
  },
  {
    group: '裙装与连衣裙',
    items: [
      { name: '法式复古醋酸连衣裙', desc: '缎面高光、优雅垂顺、高奢流动感', tag: '轻奢' },
      { name: '高腰A字微阔伞裙', desc: '挺括微撑、修饰身形、防透光', tag: '挺括' },
      { name: '丝绒重工修身礼服裙', desc: '奢华光泽、垂坠丰盈、贴身包裹', tag: '礼服' },
      { name: '缎面飘逸吊带裙', desc: '丝滑轻盈、贴身垂顺、亲肤', tag: '丝滑' },
      { name: '雪纺碎花度假长裙', desc: '轻盈飘逸、微透层次、浪漫灵动', tag: '飘逸' },
    ],
  },
  {
    group: '裤装与下装',
    items: [
      { name: '高腰垂坠阔腿裤', desc: '高悬垂感、抗起球、四季透气', tag: '垂顺' },
      { name: '弹力修身西裤', desc: '微弹利落、挺括精裁、抗皱免烫', tag: '通勤' },
      { name: '工装多口袋机能短裤', desc: '耐磨防撕裂、硬挺骨感、速干', tag: '机能' },
      { name: '日常休闲纯棉直筒裤', desc: '舒适透气、水洗质感、耐穿', tag: '经典' },
      { name: '微喇复古牛仔裤', desc: '挺括棉质、修身塑形、耐磨', tag: '牛仔' },
    ],
  },
  {
    group: '外套与冲锋衣',
    items: [
      { name: '户外轻量防风冲锋衣', desc: '防风防泼水、轻盈耐磨、抗撕裂', tag: '户外' },
      { name: '极简通勤中长款风衣', desc: '挺括防风、高密梭织、干练利落', tag: '风衣' },
      { name: '高奢精纺羊毛西装外套', desc: '天然美利诺羊毛、利落精裁、挺括', tag: '正装' },
      { name: '美利诺羊毛针织开衫', desc: '柔软保暖、吸湿透气、弹性舒适', tag: '保暖' },
      { name: '户外滑雪保暖软壳夹克', desc: '防风防雪、耐磨微弹、加厚蓄热', tag: '滑雪' },
      { name: '休闲落肩连帽卫衣', desc: '重磅卫衣布、亲肤保暖、立体帽型', tag: '卫衣' },
    ],
  },
  {
    group: '运动与贴身内着',
    items: [
      { name: '瑜伽塑形无痕文胸/背心', desc: '裸感四面弹、吸湿速干、高承托', tag: '瑜伽' },
      { name: '高弹紧身芭蕾瑜伽裤', desc: '四面高弹、收腹提臀、完全防透光', tag: '塑形' },
      { name: '透气速干骑行运动服', desc: '排汗速干、轻盈透气、贴身低阻', tag: '速干' },
      { name: '裸感贴身打底吊带', desc: '亲肤无痕、高弹透气、不闷热', tag: '打底' },
    ],
  },
];

// Preset silhouette options for instant selection & quick search
const PRESET_SILHOUETTES: { name: string; desc: string; tag: string }[] = [
  { name: '宽松松弛廓形 (Oversized)', desc: '落肩大放量，注重自然松弛垂感或适度微撑', tag: '宽松' },
  { name: '修身贴身包裹 (Slim fit)', desc: '紧密贴合身体曲线，要求高回弹与亲肤度', tag: '修身' },
  { name: '直筒利落精裁 (Regular)', desc: '经典标准合体剪裁，要求织物骨感挺括、抗皱', tag: '合体' },
  { name: 'A字微阔下摆 (A-Line)', desc: '上紧下宽自然发散，需要面料具备一定支撑性', tag: 'A字' },
  { name: 'H型干练直身 (H-Silhouette)', desc: '上下等宽利落平直，兼具悬垂与抗变形', tag: 'H型' },
  { name: '茧型立体结构 (Cocoon)', desc: '中段微弧形膨出，需面料硬挺塑形防塌陷', tag: '立体' },
  { name: '短款紧身收腰 (Cropped Fit)', desc: '强调腰腹部收紧线条，要求面料高弹保形', tag: '收腰' },
  { name: '高腰垂坠阔腿 (Wide Leg)', desc: '大下摆宽阔剪裁，极其注重行走间流动垂感', tag: '阔腿' },
  { name: '落肩街头休闲 (Drop Shoulder)', desc: '肩线下落松量适中，强调天然面料肌理', tag: '落肩' },
];

export const MatchingView: React.FC<MatchingViewProps> = ({
  fabrics,
  initialFabricId,
  onNavigateToDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'garment_to_fabric' | 'fabric_to_garment'>('garment_to_fabric');
  const [isClientPortalMode, setIsClientPortalMode] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State for Fabric -> Garment (Fabric Wall search & inspection)
  const [fabricSearchTerm, setFabricSearchTerm] = useState<string>('');
  const [fabricCategoryFilter, setFabricCategoryFilter] = useState<string>('all');
  const [inspectedFabricId, setInspectedFabricId] = useState<string | null>(initialFabricId || null);

  // State for Garment -> Fabric Comboboxes
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isSilhouetteDropdownOpen, setIsSilhouetteDropdownOpen] = useState(false);
  const [silhouetteSearchQuery, setSilhouetteSearchQuery] = useState('');

  // Dropdown click outside listeners
  const categoryComboboxRef = useRef<HTMLDivElement>(null);
  const silhouetteComboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryComboboxRef.current &&
        !categoryComboboxRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        silhouetteComboboxRef.current &&
        !silhouetteComboboxRef.current.contains(event.target as Node)
      ) {
        setIsSilhouetteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered fabrics for Fabric Wall
  const filteredWallFabrics = useMemo(() => {
    return fabrics.filter((f) => {
      const matchSearch =
        !fabricSearchTerm.trim() ||
        f.id.toLowerCase().includes(fabricSearchTerm.toLowerCase()) ||
        f.name.value.toLowerCase().includes(fabricSearchTerm.toLowerCase()) ||
        (f.supplierItemCode?.value && f.supplierItemCode.value.toLowerCase().includes(fabricSearchTerm.toLowerCase())) ||
        (f.composition?.value && f.composition.value.toLowerCase().includes(fabricSearchTerm.toLowerCase())) ||
        (f.marketFabricType?.value && f.marketFabricType.value.toLowerCase().includes(fabricSearchTerm.toLowerCase())) ||
        f.recommendedGarments.some((g) => g.toLowerCase().includes(fabricSearchTerm.toLowerCase()));

      const matchCategory =
        fabricCategoryFilter === 'all' ||
        f.category?.value === fabricCategoryFilter ||
        f.weaveCategory?.value === fabricCategoryFilter ||
        f.marketFabricType?.value === fabricCategoryFilter;

      return matchSearch && matchCategory;
    });
  }, [fabrics, fabricSearchTerm, fabricCategoryFilter]);

  const inspectedFabric = useMemo(() => {
    if (!inspectedFabricId) return null;
    return fabrics.find((f) => f.id === inspectedFabricId) || fabrics[0];
  }, [fabrics, inspectedFabricId]);

  // State for Garment -> Fabric
  const [garmentForm, setGarmentForm] = useState<GarmentRequirement>({
    category: '夏季防晒轻薄衬衫',
    silhouette: '宽松松弛廓形 (Oversized)',
    season: '春夏',
    targetPriceMax: 30,
    requiredDrape: '垂顺',
    requiredElasticity: '无弹',
    requiredOpacity: '完全不透',
    allowLining: false,
    requiredFunctions: ['透气', '亲肤吸湿'],
    targetColorFamily: '蓝色系',
    targetTone: '低饱和',
  });

  // Dedicated lining preference: 'no_lining' (单层无内衬) | 'with_lining' (配内衬) | 'flexible' (自由选配)
  const [liningPreference, setLiningPreference] = useState<'no_lining' | 'with_lining' | 'flexible'>('no_lining');

  // AI Semantic Profile Extraction (Deconstruct any user custom text)
  const semanticAnalysis = useMemo(() => {
    const rawCat = garmentForm.category.toLowerCase();
    const rawSil = garmentForm.silhouette.toLowerCase();
    const text = `${rawCat} ${rawSil}`;

    // 1. Core apparel categorization
    const isShirt = /衬衫|衬衣|开领|blouse|shirt/i.test(text);
    const isDressOrSkirt = /裙|连衣裙|半裙|长裙|短裙|吊带|礼服|旗袍|dress|skirt/i.test(text);
    const isPants = /裤|阔腿|西裤|休闲裤|短裤|长裤|卫裤|工装裤|pants|trousers/i.test(text);
    const isJacketOutdoor = /冲锋衣|夹克|风衣|外套|大衣|西装|西服|羽绒|滑雪|登山|防风|jacket|coat/i.test(text);
    const isTeeOrSweatshirt = /t恤|卫衣|连帽|打底|背心|针织|长袖|圆领|tee|hoodie/i.test(text);
    const isSportYoga = /瑜伽|运动|紧身|文胸|内衣|骑行|健身|跑步|塑形|芭蕾|bra|leggings/i.test(text);

    // 2. Desired fiber & fabric traits
    const wantsSilkOrTencel = /真丝|丝绸|天丝|莱赛尔|莫代尔|醋酸|丝光|silk|tencel/i.test(text);
    const wantsWool = /羊毛|美利诺|精纺|粗纺|羊绒|wool|cashmere/i.test(text);
    const wantsCotton = /纯棉|棉|全棉|有机棉|长绒棉|cotton/i.test(text);
    const wantsTechNylon = /锦纶|尼龙|涤纶|防撕裂|机能|防水|涂层|nylon/i.test(text);
    const wantsHighStretch = /弹力|高弹|四面弹|氨纶|紧身|贴身|塑形|stretch|spandex/i.test(text);

    // 3. Weight & Drape
    const wantsLightweight = /轻薄|薄款|夏季|防晒|凉爽|透气|飘逸|light/i.test(text) || garmentForm.season === '春夏';
    const wantsHeavyweight = /重磅|厚实|秋冬|加厚|保暖|夹克|大衣|heavy/i.test(text) || garmentForm.season === '秋冬';
    const wantsDrape = /垂坠|垂顺|飘逸|阔腿|松弛|drape/i.test(text);
    const wantsCrisp = /挺括|骨感|精裁|正装|硬挺|西装|风衣|冲锋|crisp/i.test(text);

    // Derived AI matching pillars description
    const detectedPillars: string[] = [];
    if (isJacketOutdoor) detectedPillars.push('防风耐磨与防护性能');
    if (isSportYoga) detectedPillars.push('高弹回缩与吸湿裸感');
    if (isShirt || wantsLightweight) detectedPillars.push('轻盈透气与垂顺亲肤');
    if (isDressOrSkirt || wantsDrape) detectedPillars.push('流动悬垂感与光泽度');
    if (isPants) detectedPillars.push('抗皱下坠与耐磨保形');
    if (wantsCrisp) detectedPillars.push('挺括骨感精裁结构');

    return {
      isShirt,
      isDressOrSkirt,
      isPants,
      isJacketOutdoor,
      isTeeOrSweatshirt,
      isSportYoga,
      wantsSilkOrTencel,
      wantsWool,
      wantsCotton,
      wantsTechNylon,
      wantsHighStretch,
      wantsLightweight,
      wantsHeavyweight,
      wantsDrape,
      wantsCrisp,
      detectedPillars: detectedPillars.length > 0 ? detectedPillars.join('、') : '多功能纺织规格平衡',
    };
  }, [garmentForm.category, garmentForm.silhouette, garmentForm.season]);

  // Robust AI Scoring engine for Garment -> Fabric matching (Never returns empty results!)
  const matchResults: FabricMatchResult[] = useMemo(() => {
    const list = (fabrics || []).map((fabric) => {
      let compScore = 18;
      let funcScore = 14;
      let weightScore = 12;
      let colorScore = 15;
      let priceScore = 8;
      let credibilityScore = 8;

      const violatedConstraints: string[] = [];
      const confirmedEvidence: string[] = [];
      const aiInferences: string[] = [];
      const keyGaps: string[] = [];
      const usageRisks: string[] = [...(fabric.usageRisks || [])];

      const fabComp = (fabric.composition?.value || '').toLowerCase();
      const fabName = (fabric.name?.value || '').toLowerCase();
      const fabMarket = (fabric.marketFabricType?.value || '').toLowerCase();
      const fabRec = (fabric.recommendedGarments || []).join(' ').toLowerCase();

      // 1. Composition & Category Match (Max 25)
      let compMatch = false;
      if (semanticAnalysis.isShirt) {
        if (fabComp.includes('莱赛尔') || fabComp.includes('天丝') || fabComp.includes('棉') || fabComp.includes('真丝') || fabComp.includes('莫代尔')) {
          compScore = 24;
          compMatch = true;
          confirmedEvidence.push('纯天然/天丝纤维可作为轻薄衬衫的候选材料');
        } else if (fabComp.includes('锦纶') && fabric.weaveStructure?.value === '斜纹') {
          compScore = 14;
          usageRisks.push('机能锦纶偏硬挺，制作轻盈垂坠衬衫穿着体感偏闷');
        }
      } else if (semanticAnalysis.isSportYoga) {
        if (fabComp.includes('氨纶') && (fabric.elasticity?.value === '四面弹' || fabric.elasticity?.value === '二面弹')) {
          compScore = 25;
          compMatch = true;
          confirmedEvidence.push('高配比氨纶四面高弹，满足紧身运动塑形与包裹要求');
        } else {
          compScore = 10;
          violatedConstraints.push('运动塑形服饰优先需要高弹力，该面料弹力偏弱');
        }
      } else if (semanticAnalysis.isJacketOutdoor) {
        if (fabComp.includes('锦纶') || fabComp.includes('涤纶') || fabComp.includes('防撕裂') || fabName.includes('冲锋') || fabRec.includes('冲锋衣')) {
          compScore = 25;
          compMatch = true;
          confirmedEvidence.push('高密耐磨机能材质，防风防泼水性能契合户外外套诉求');
        } else {
          compScore = 12;
          aiInferences.push('该面料为非专业机能布，若用于户外需增加防风复合涂层');
        }
      } else if (semanticAnalysis.isDressOrSkirt) {
        if (fabComp.includes('醋酸') || fabComp.includes('真丝') || fabComp.includes('莫代尔') || fabComp.includes('天丝') || fabric.drape?.value === '垂顺') {
          compScore = 24;
          compMatch = true;
          confirmedEvidence.push('高垂顺度与柔润光泽感，契合优雅裙装的流动下坠设计');
        }
      } else if (semanticAnalysis.isPants) {
        if (fabric.drape?.value === '垂顺' || fabComp.includes('棉') || fabMarket.includes('牛仔') || fabMarket.includes('斜纹')) {
          compScore = 23;
          compMatch = true;
          confirmedEvidence.push('织造密度适中，具备良好的下坠感与抗皱保形度');
        }
      }

      // If user typed a custom keyword that matches fabric's recommended list or name
      const userKeywords = garmentForm.category.split(/[\s,，/、]+/);
      for (const kw of userKeywords) {
        if (kw.length >= 2 && (fabRec.includes(kw) || fabName.includes(kw) || fabMarket.includes(kw))) {
          compScore = Math.max(compScore, 24);
          if (!compMatch) {
            confirmedEvidence.push(`面料已标定适合【${kw}】相关款式企划`);
            compMatch = true;
          }
        }
      }

      // AI semantic bridge inference if no exact direct match
      if (!compMatch) {
        compScore = 18;
        aiInferences.push(`适配提示：该面料的【${fabric.weaveStructure?.value || '织造结构'}】可作为挺括度与亲肤度方面的候选`);
      }

      // 2. Functions & Performance (Max 20)
      const hasBreathable = fabric.functions?.some((f) => f.name?.includes('透气') || f.name?.includes('吸湿'));
      const hasSunproof = fabric.functions?.some((f) => f.name?.includes('防紫外线') || f.name?.includes('防晒'));
      const hasWaterproof = fabric.functions?.some((f) => f.name?.includes('防水') || f.name?.includes('防泼水'));

      if (hasBreathable || hasSunproof || hasWaterproof) {
        funcScore = 18;
      }
      if (fabric.functions?.some((f) => f.evidenceLevel === 'ai_inferred')) {
        aiInferences.push('部分功能表现依据纤维分子特性推断，待第三方实测');
      }

      // 3. Weight & Drape (Max 15)
      if (fabric.weight?.value === null || fabric.weight?.value === undefined) {
        weightScore = 7;
        keyGaps.push('缺失实测克重，无法精确评估厚薄及下坠骨感');
      } else if (garmentForm.season === '春夏' && fabric.weight.value <= 160) {
        weightScore = 15;
      } else if (garmentForm.season === '秋冬' && fabric.weight.value >= 220) {
        weightScore = 15;
      } else if (garmentForm.season === '春夏' && fabric.weight.value > 260) {
        weightScore = 8;
        usageRisks.push(`克重(${fabric.weight.value}gsm)过厚，不适宜春夏季轻薄穿着`);
      } else {
        weightScore = 12;
      }

      // 4. Opacity & Lining Matching
      const fabOpacity = fabric.opacity?.value || '不透明';
      const isOpaqueReq = garmentForm.requiredOpacity === '完全不透' || garmentForm.requiredOpacity === '不透明';
      const isSemiOrTransReq = garmentForm.requiredOpacity === '微透明' || garmentForm.requiredOpacity === '半透明' || garmentForm.requiredOpacity === '全透明';
      const userAllowsLining = liningPreference === 'with_lining' || liningPreference === 'flexible' || garmentForm.allowLining;

      if (isOpaqueReq && (fabOpacity === '半透明' || fabOpacity === '透明' || fabOpacity === '全透明')) {
        if (!userAllowsLining) {
          colorScore -= 6;
          violatedConstraints.push('服装企划要求完全不透光，该面料轻薄微透且未勾选配内衬');
        } else {
          colorScore += 2;
          confirmedEvidence.push('已设定搭配内衬工艺，成功解决轻薄微透光问题');
        }
      } else if (isSemiOrTransReq && (fabOpacity === '半透明' || fabOpacity === '透明' || fabOpacity === '微透明')) {
        colorScore += 4;
        confirmedEvidence.push('面料透光度完美符合半透/微透的朦胧层次设计诉求');
      }

      // 5. Price & Budget (Max 10)
      if (!fabric.bulkPrice?.value) {
        priceScore = 5;
        keyGaps.push('大货价格未标定，无法完成精确成本核算');
      } else if (garmentForm.targetPriceMax && fabric.bulkPrice.value <= garmentForm.targetPriceMax) {
        priceScore = 10;
        confirmedEvidence.push(`大货价 ¥${fabric.bulkPrice.value} 满足预算上限 (≤¥${garmentForm.targetPriceMax})`);
      } else if (garmentForm.targetPriceMax && fabric.bulkPrice.value > garmentForm.targetPriceMax) {
        priceScore = 4;
        usageRisks.push(`大货价 ¥${fabric.bulkPrice.value} 超出目标预算 ¥${garmentForm.targetPriceMax}`);
      }

      // Total score calculation
      let totalScore = Math.min(
        100,
        Math.max(38, compScore + funcScore + weightScore + colorScore + priceScore + credibilityScore)
      );

      if (violatedConstraints.length > 0) {
        totalScore = Math.min(totalScore, 62); // Constraint soft penalty
      }

      let recommendationLevel: 'recommended' | 'conditional_recommended' | 'not_recommended' = 'not_recommended';
      if (totalScore >= 75 && violatedConstraints.length === 0) {
        recommendationLevel = 'recommended';
      } else if (totalScore >= 58) {
        recommendationLevel = 'conditional_recommended';
      }

      return {
        fabric,
        scoreBreakdown: {
          compositionAndStructure: { score: compScore, max: 25, notes: '纤维与织法适配' },
          functionAndPerformance: { score: funcScore, max: 20, notes: '透气与功能达标' },
          weightAndDrape: { score: weightScore, max: 15, notes: '四季厚度与悬垂' },
          colorAndAesthetics: { score: colorScore, max: 20, notes: '色系明度与光泽' },
          priceAndSupply: { score: priceScore, max: 10, notes: '预算成本与交期' },
          dataCredibility: { score: credibilityScore, max: 10, notes: '证据完整度' },
          totalScore,
        },
        recommendationLevel,
        recommendationReasons: [
          `面料【${fabric.name?.value || fabric.id}】在纤维亲肤度与克重厚薄上符合${garmentForm.category}的企划诉求`,
          `主色系与织物光泽感契合${garmentForm.silhouette}设计视觉风格`,
        ],
        confirmedEvidence,
        aiInferences,
        keyGaps,
        usageRisks,
        hardConstraintsViolated: violatedConstraints,
      };
    });

    // Sort by best score descending (Guaranteed to return all fabrics in ranking order, never empty)
    return list.sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);
  }, [fabrics, garmentForm, semanticAnalysis, liningPreference]);

  // AI Concept Material Spec (When inventory has gaps, generate ideal spec dynamically)
  const aiConceptSpec: AIConceptMaterialSpec = useMemo(() => {
    let idealComposition = '80% 兰精天丝LF + 20% 桑蚕丝高支微捻 (或 95% 莫代尔 5% 氨纶)';
    let idealWeightGsm = '125 - 140 gsm (兼顾春夏透气与不透光)';
    let idealWeave = '高密平纹微绉 或 32S 单面紧密纺拉架';

    if (semanticAnalysis.isJacketOutdoor) {
      idealComposition = '100% 70D/24F 紧密抗撕裂锦纶66 (表层防泼水 + 底层透湿PU微孔薄膜)';
      idealWeightGsm = '160 - 210 gsm (兼具轻量化与耐磨抗刮)';
      idealWeave = '格子防撕裂梭织 (Ripstop) 或 2.5层复合贴合';
    } else if (semanticAnalysis.isSportYoga) {
      idealComposition = '75% 超细锦纶66 + 25% 莱卡氨纶 (双面高针织造)';
      idealWeightGsm = '210 - 230 gsm (裸感不透光、防卷边)';
      idealWeave = '50针超密双面针织 (Interlock)';
    } else if (semanticAnalysis.isDressOrSkirt) {
      idealComposition = '100% 日本三菱三醋酸 或 93% 桑蚕丝 7% 氨纶双绉';
      idealWeightGsm = '140 - 180 gsm (极佳悬垂性与柔和珍珠光泽)';
      idealWeave = '缎纹高密梭织 或 缎面提花';
    }

    return {
      name: `非库存概念建议：${garmentForm.category} 候选规格`,
      rationale: `当前需求为【${garmentForm.category} / ${garmentForm.silhouette} / 预算 ≤¥${garmentForm.targetPriceMax}】。若现有库存不足，以下内容仅作为非库存询盘方向，需由面料专业人员和供应商确认。`,
      idealComposition,
      idealWeightGsm,
      idealWeave,
      idealOpacity: garmentForm.requiredOpacity === '完全不透' ? '高密防透光 (遮蔽率 ≥ 95%)' : '微透/半透质感',
      idealElasticity: garmentForm.requiredElasticity,
      idealFunctions: garmentForm.requiredFunctions,
      estimatedTargetPrice: `¥22.0 - ¥28.0 元/米 (按 ${garmentForm.targetPriceMax} 元上限倒推)`,
      procurementPrompt: `需向柯桥/盛泽供应链定制开发：${idealWeightGsm} ${idealComposition}，织造要求${idealWeave}，要求满足${garmentForm.silhouette}版型下垂感与抗皱保形度。`,
      isConceptNotice: '【非现有库存，需要采购或新开发】',
    };
  }, [garmentForm, semanticAnalysis]);

  const handleCopyPrompt = () => {
    navigator.clipboard?.writeText(aiConceptSpec.procurementPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Filtered categories for Combobox search
  const filteredCategoryGroups = useMemo(() => {
    if (!categorySearchQuery.trim()) return PRESET_GARMENT_CATEGORIES;
    const q = categorySearchQuery.toLowerCase();
    return PRESET_GARMENT_CATEGORIES.map((g) => ({
      ...g,
      items: g.items.filter(
        (it) => it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q) || it.tag.includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [categorySearchQuery]);

  // Filtered silhouettes for Combobox search
  const filteredSilhouettes = useMemo(() => {
    if (!silhouetteSearchQuery.trim()) return PRESET_SILHOUETTES;
    const q = silhouetteSearchQuery.toLowerCase();
    return PRESET_SILHOUETTES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tag.includes(q)
    );
  }, [silhouetteSearchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Top Header & Dual Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-zinc-900" />
              双向智能匹配 (面料找服装 ⇄ 服装找面料)
            </h1>
            {isClientPortalMode && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-bold">
                客户对外选款视图 (敏感信息已脱敏)
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            支持基于服装企划多维检索面料，或依据现有面料推导适用品类与设计禁忌
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsClientPortalMode(!isClientPortalMode);
              showToast(
                !isClientPortalMode
                  ? '已切换至【客户选款模式】：隐藏供应商联系方式与内部进价，保留选款企划功能。'
                  : '已切回【内部企划模式】：恢复完整供应链底价与多来源凭证。'
              );
            }}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
              isClientPortalMode
                ? 'bg-zinc-950 text-white border-zinc-900 shadow-2xs'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {isClientPortalMode ? '退出客户视图' : '对外选款模式'}
          </button>

          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
            <button
              onClick={() => setActiveTab('garment_to_fabric')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'garment_to_fabric'
                  ? 'bg-white text-zinc-950 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              服装找面料
            </button>
            <button
              onClick={() => setActiveTab('fabric_to_garment')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'fabric_to_garment'
                  ? 'bg-white text-zinc-950 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              面料找服装
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-zinc-900 text-white text-xs rounded-xl flex items-center gap-2.5 shadow-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mode 1: Garment -> Fabric (服装找面料) */}
      {activeTab === 'garment_to_fabric' && (
        <div className="space-y-8">
          {/* Garment Requirement Input Form */}
          <div className="os26-glass rounded-3xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
              <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-900" />
                服装企划需求设定
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-sans">
                  在 <strong className="text-zinc-950 font-mono">{fabrics.length}</strong> 款样例面料中查看接近的候选
                </span>
              </div>
            </div>

            {/* 5-Column Responsive Clean Form Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              
              {/* 1. Garment Category Combobox (Searchable & Directly Editable) */}
              <div className="relative" ref={categoryComboboxRef}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-700 font-bold flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-zinc-900" />
                    服装品类
                  </label>
                  <span className="text-[10px] text-zinc-400">可搜索/自定输入</span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={garmentForm.category}
                    onChange={(e) => {
                      setGarmentForm({ ...garmentForm, category: e.target.value });
                      setCategorySearchQuery(e.target.value);
                      setIsCategoryDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setCategorySearchQuery(garmentForm.category);
                      setIsCategoryDropdownOpen(true);
                    }}
                    placeholder="输入或选择服装品类..."
                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-3 pr-8 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="absolute right-2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Combobox Popover Dropdown */}
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-xl p-2 max-h-80 overflow-y-auto w-[320px] sm:w-[360px]"
                    >
                      {/* Search box inside dropdown */}
                      <div className="relative mb-2 px-1">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          placeholder="快速搜索预设品类或输入新类别..."
                          className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                        />
                      </div>

                      {/* Custom input quick apply */}
                      {categorySearchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setGarmentForm({ ...garmentForm, category: categorySearchQuery.trim() });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 mb-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold flex items-center justify-between hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Wand2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                            使用自定义品类："{categorySearchQuery.trim()}"
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-md shrink-0">自定义</span>
                        </button>
                      )}

                      {/* Grouped preset categories */}
                      <div className="space-y-2">
                        {filteredCategoryGroups.map((group) => (
                          <div key={group.group} className="space-y-1">
                            <div className="text-[11px] font-bold text-zinc-400 px-2 pt-1">
                              {group.group}
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                              {group.items.map((item) => {
                                const isSelected = garmentForm.category === item.name;
                                return (
                                  <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => {
                                      setGarmentForm({ ...garmentForm, category: item.name });
                                      setIsCategoryDropdownOpen(false);
                                    }}
                                    className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-start justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300'
                                        : 'hover:bg-zinc-50 text-zinc-800'
                                    }`}
                                  >
                                    <div className="min-w-0 pr-2">
                                      <div className="font-bold truncate">{item.name}</div>
                                      <div className="text-[10px] text-zinc-400 truncate">{item.desc}</div>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 shrink-0 font-medium">
                                      {item.tag}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Silhouette Combobox (Searchable & Directly Editable) */}
              <div className="relative" ref={silhouetteComboboxRef}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-700 font-bold flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-900" />
                    版型廓形
                  </label>
                  <span className="text-[10px] text-zinc-400">可搜索/自定输入</span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={garmentForm.silhouette}
                    onChange={(e) => {
                      setGarmentForm({ ...garmentForm, silhouette: e.target.value });
                      setSilhouetteSearchQuery(e.target.value);
                      setIsSilhouetteDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setSilhouetteSearchQuery(garmentForm.silhouette);
                      setIsSilhouetteDropdownOpen(true);
                    }}
                    placeholder="输入或选择版型廓形..."
                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-3 pr-8 text-zinc-900 font-bold focus:outline-hidden focus:border-zinc-900 shadow-2xs text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSilhouetteDropdownOpen(!isSilhouetteDropdownOpen)}
                    className="absolute right-2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSilhouetteDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Silhouette Popover Dropdown */}
                <AnimatePresence>
                  {isSilhouetteDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-xl p-2 max-h-80 overflow-y-auto w-[300px] sm:w-[340px]"
                    >
                      {/* Search box */}
                      <div className="relative mb-2 px-1">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={silhouetteSearchQuery}
                          onChange={(e) => setSilhouetteSearchQuery(e.target.value)}
                          placeholder="搜索版型结构或输入新版型..."
                          className="w-full pl-7 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-900"
                        />
                      </div>

                      {/* Custom input quick apply */}
                      {silhouetteSearchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setGarmentForm({ ...garmentForm, silhouette: silhouetteSearchQuery.trim() });
                            setIsSilhouetteDropdownOpen(false);
                          }}
                          className="w-full text-left p-2 mb-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold flex items-center justify-between hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Wand2 className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                            使用自定义版型："{silhouetteSearchQuery.trim()}"
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-md shrink-0">自定义</span>
                        </button>
                      )}

                      {/* Preset list */}
                      <div className="space-y-1">
                        {filteredSilhouettes.map((item) => {
                          const isSelected = garmentForm.silhouette === item.name;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                setGarmentForm({ ...garmentForm, silhouette: item.name });
                                setIsSilhouetteDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-start justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300'
                                  : 'hover:bg-zinc-50 text-zinc-800'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="font-bold truncate">{item.name}</div>
                                <div className="text-[10px] text-zinc-400 truncate">{item.desc}</div>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 shrink-0 font-medium">
                                {item.tag}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Season & Budget Target Max Price */}
              <div>
                <label className="text-zinc-700 font-bold block mb-1">季节与目标大货单价</label>
                <div className="flex items-center gap-2">
                  <select
                    value={garmentForm.season}
                    onChange={(e: any) => setGarmentForm({ ...garmentForm, season: e.target.value })}
                    className="w-1/2 bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden cursor-pointer shadow-2xs"
                  >
                    <option value="春夏">春夏季</option>
                    <option value="秋冬">秋冬季</option>
                    <option value="四季">四季通用</option>
                  </select>
                  <div className="w-1/2 relative">
                    <input
                      type="number"
                      value={garmentForm.targetPriceMax || ''}
                      onChange={(e) =>
                        setGarmentForm({ ...garmentForm, targetPriceMax: Number(e.target.value) })
                      }
                      placeholder="最高单价"
                      className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 pr-6 text-zinc-900 font-mono font-bold focus:outline-hidden shadow-2xs"
                    />
                    <span className="absolute right-2 top-2.5 text-zinc-400 text-[10px]">元/米</span>
                  </div>
                </div>
              </div>

              {/* 4. Transparency Setting (Dedicated Single Selector) */}
              <div>
                <label className="text-zinc-700 font-bold block mb-1 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-900" />
                  透明度设定
                </label>
                <select
                  value={garmentForm.requiredOpacity}
                  onChange={(e: any) =>
                    setGarmentForm({ ...garmentForm, requiredOpacity: e.target.value as OpacityLevel })
                  }
                  className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden cursor-pointer shadow-2xs"
                >
                  <option value="完全不透">完全不透 (严禁透肤/全遮蔽)</option>
                  <option value="微透明">微透明 (透光不透肤/轻盈感)</option>
                  <option value="半透明">半透明 (朦胧微透/轻纱层次)</option>
                  <option value="全透明">全透明 (高透视感/镂空薄纱)</option>
                </select>
              </div>

              {/* 5. Lining Specification Setting (Dedicated Separate Option) */}
              <div>
                <label className="text-zinc-700 font-bold block mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-zinc-900" />
                  内衬工艺
                </label>
                <select
                  value={liningPreference}
                  onChange={(e: any) => {
                    const val = e.target.value as 'no_lining' | 'with_lining' | 'flexible';
                    setLiningPreference(val);
                    setGarmentForm({ ...garmentForm, allowLining: val === 'with_lining' });
                  }}
                  className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-zinc-900 font-bold focus:outline-hidden cursor-pointer shadow-2xs"
                >
                  <option value="no_lining">单层无内衬 (要求面料遮光亲肤)</option>
                  <option value="with_lining">配内衬 (允许轻薄微透面料)</option>
                  <option value="flexible">自由选配 (视面料透光度定)</option>
                </select>
              </div>

            </div>

            {/* Current requirement summary */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-zinc-600 bg-zinc-50 border border-zinc-100 p-2.5 rounded-2xl">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span className="font-bold text-zinc-950">当前需求：</span>
              <span className="truncate">
                【<strong className="text-zinc-900">{garmentForm.category}</strong> / <strong className="text-zinc-900">{garmentForm.silhouette}</strong>】，重点查看：{semanticAnalysis.detectedPillars}。
              </span>
            </div>
          </div>

          {/* Results: Top Ranked Real Fabrics (Top 3) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-900" />
                  最接近的真实库存面料推荐
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5 font-sans">
                  根据当前企划条件展示样例结果
                </p>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                共 {fabrics.length} 款样例面料
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {matchResults.slice(0, 3).map((res) => {
                const { fabric, recommendationLevel } = res;

                return (
                  <div
                    key={fabric.id}
                    className="os26-card rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 bg-white"
                  >
                    {/* Header: Score & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-zinc-950 bg-zinc-100 border border-zinc-300 px-2.5 py-0.5 rounded-full">
                            {fabric.id}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                              recommendationLevel === 'recommended'
                                ? 'bg-zinc-950 text-white border-zinc-950'
                                : recommendationLevel === 'conditional_recommended'
                                ? 'bg-zinc-100 text-zinc-900 border-zinc-300'
                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                            }`}
                          >
                            {recommendationLevel === 'recommended'
                              ? '推荐选款'
                              : recommendationLevel === 'conditional_recommended'
                              ? '有条件推荐'
                              : '不推荐'}
                          </span>
                        </div>
                        <h3 className="font-bold text-zinc-950 text-sm mt-1.5 truncate max-w-xs">
                          {fabric.name.value}
                        </h3>
                      </div>

                      {/* Prototype result label; do not expose internal sample scores */}
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-zinc-500">样例结果</span>
                      </div>
                    </div>

                    {/* Photo & Quick Specs */}
                    <div className="flex items-center gap-3 p-2.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                        <img src={fabric.mainImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 text-xs space-y-0.5">
                        <p className="font-bold text-zinc-950 truncate">{fabric.composition.value || '成分待补'}</p>
                        <p className="text-zinc-500 font-mono text-[11px]">
                          {fabric.weight.value !== null ? `${fabric.weight.value}gsm` : '缺克重'} • {fabric.weaveStructure.value} • {fabric.elasticity.value}
                        </p>
                        <p className="text-zinc-500 text-[11px] flex items-center gap-1.5 font-mono">
                          <span>底: <strong className="text-zinc-950">¥{fabric.basePrice?.value || '--'}</strong></span>
                          <span>大货: <strong className="text-zinc-950">¥{fabric.bulkPrice?.value || '--'}</strong></span>
                          <span>样: <strong className="text-zinc-950">¥{fabric.samplePrice?.value || '--'}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Explanations Breakdown (PRD Section 9.5) */}
                    <div className="space-y-2 text-xs">
                      {/* Confirmed Evidence */}
                      {res.confirmedEvidence.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-zinc-900 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" /> 已确认依据：
                          </p>
                          <p className="text-zinc-600 text-[11px] pl-4">{res.confirmedEvidence[0]}</p>
                        </div>
                      )}

                      {/* Hard Constraint or Gaps */}
                      {res.hardConstraintsViolated.length > 0 ? (
                        <div className="p-2.5 bg-zinc-100 border border-zinc-300 rounded-xl space-y-1">
                          <p className="text-zinc-950 font-bold text-[11px] flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-zinc-950" /> 暂不建议使用：
                          </p>
                          <p className="text-zinc-700 text-[11px]">{res.hardConstraintsViolated[0]}</p>
                        </div>
                      ) : res.keyGaps.length > 0 ? (
                        <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-0.5">
                          <p className="text-zinc-900 font-bold text-[11px] flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-zinc-700" /> 关键资料缺口：
                          </p>
                          <p className="text-zinc-600 text-[11px]">{res.keyGaps[0]}</p>
                        </div>
                      ) : null}

                      {/* Usage Risks */}
                      {res.usageRisks.length > 0 && (
                        <div className="text-[11px] text-zinc-500 space-y-0.5 pt-1">
                          <span className="font-bold text-zinc-800">工艺提示：</span>
                          <span>{res.usageRisks[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigateToDetail(fabric)}
                      className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>查看面料完整主档与色卡</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Concept Material Spec Block (Pure Monochrome Apple OS26 Graphite / Obsidian) */}
          <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-zinc-800 space-y-5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 text-white rounded-xl border border-white/15">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    {aiConceptSpec.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    根据当前企划整理的非库存候选方向
                  </p>
                </div>
              </div>

              {/* Mandatory Non-inventory disclaimer */}
              <span className="px-3 py-1 bg-white/10 border border-white/20 text-zinc-200 text-xs font-bold rounded-full">
                {aiConceptSpec.isConceptNotice}
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
              {aiConceptSpec.rationale}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">理想成分配比</span>
                <span className="font-bold text-white text-[11px] block">{aiConceptSpec.idealComposition}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">理想克重区间</span>
                <span className="font-bold text-white text-[11px] font-mono block">{aiConceptSpec.idealWeightGsm}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">织造结构</span>
                <span className="font-bold text-white text-[11px] block">{aiConceptSpec.idealWeave}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">透明度要求</span>
                <span className="font-bold text-white text-[11px] block">{aiConceptSpec.idealOpacity}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">弹性指标</span>
                <span className="font-bold text-white text-[11px] block">{aiConceptSpec.idealElasticity}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 block font-medium">采购预估单价</span>
                <span className="font-bold text-white text-[11px] font-mono block">{aiConceptSpec.estimatedTargetPrice}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-zinc-300 font-bold shrink-0">供应链采购询盘建议：</span>
                <span className="text-zinc-400 text-[11px] truncate max-w-xl font-mono">{aiConceptSpec.procurementPrompt}</span>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? '已复制' : '复制询盘内容'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Fabric -> Garment (面料找服装) */}
      {activeTab === 'fabric_to_garment' && (
        <div className="space-y-6">
          {/* Sub-view A: Fabric Wall Grid Selector (When no specific fabric is being inspected) */}
          {!inspectedFabric ? (
            <div className="space-y-5">
              {/* Search & Category Filter Bar */}
              <div className="os26-glass rounded-3xl border border-zinc-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fabricSearchTerm}
                      onChange={(e) => setFabricSearchTerm(e.target.value)}
                      placeholder="搜索面料编号 (如 FAB-001)、名称、成分 (如 真丝/莫代尔/牛仔) 或适合服装..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all shadow-2xs"
                    />
                    {fabricSearchTerm && (
                      <button
                        onClick={() => setFabricSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer font-bold"
                      >
                        清空
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 shrink-0 font-medium">
                    <span>共找到 <strong className="text-zinc-950 font-mono">{filteredWallFabrics.length}</strong> 款面料</span>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { id: 'all', label: '全部面料' },
                    { id: '梭织面料', label: '梭织' },
                    { id: '针织面料', label: '针织' },
                    { id: '丝绸', label: '真丝/丝绸' },
                    { id: '双层棉纱', label: '棉纱' },
                    { id: '牛仔', label: '牛仔' },
                    { id: '雪纺', label: '雪纺' },
                    { id: '斜纹布', label: '工装斜纹' },
                  ].map((cat) => {
                    const isSelected = fabricCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFabricCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-950 text-white shadow-xs'
                            : 'bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200/80 shadow-2xs'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Wall Grid */}
              {filteredWallFabrics.length === 0 ? (
                <div className="os26-card rounded-3xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900">未找到符合条件的面料</h3>
                  <p className="text-xs text-zinc-500">
                    请尝试更换面料编号、品名或清空筛选条件重新搜索
                  </p>
                  <button
                    onClick={() => {
                      setFabricSearchTerm('');
                      setFabricCategoryFilter('all');
                    }}
                    className="px-4 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-zinc-800"
                  >
                    重置所有筛选
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredWallFabrics.map((f) => (
                    <motion.div
                      key={f.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setInspectedFabricId(f.id)}
                      className="os26-card rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-zinc-400 hover:shadow-md transition-all cursor-pointer flex flex-col group bg-white"
                    >
                      {/* Image swatch */}
                      <div className="h-44 relative overflow-hidden bg-zinc-100">
                        <img
                          src={f.mainImage}
                          alt={f.name.value}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        
                        {/* Top badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-zinc-950/80 backdrop-blur-md text-white border border-white/20 shadow-xs">
                            {f.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-zinc-800 border border-zinc-200/60 shadow-2xs">
                            {f.weaveCategory.value} • {f.weaveStructure.value}
                          </span>
                        </div>

                        {/* Price on image bottom */}
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white">
                            {f.bulkPrice?.value ? `¥${f.bulkPrice.value}/米` : '价格待核'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-zinc-950 line-clamp-1 group-hover:text-zinc-700 transition-colors">
                            {f.name.value}
                          </h4>
                          <p className="text-[11px] text-zinc-500 line-clamp-1 font-sans">
                            {f.composition.value || '成分待核'}
                          </p>

                          {/* Quick spec strip */}
                          <div className="flex items-center gap-2 text-[10px] text-zinc-600 pt-1">
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded-md font-mono">
                              {f.weight.value ? `${f.weight.value}gsm` : '缺克重'}
                            </span>
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded-md">
                              {f.elasticity.value}
                            </span>
                            <span className="bg-zinc-100 px-1.5 py-0.5 rounded-md">
                              {f.drape.value}
                            </span>
                          </div>
                        </div>

                        {/* Suitable Garments Preview */}
                        <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-700">
                            <Sparkles className="w-3 h-3 text-zinc-900" />
                            <span>推荐适合服装：</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(f.recommendedGarments || []).slice(0, 2).map((rg, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md font-medium truncate max-w-[130px]"
                              >
                                {rg}
                              </span>
                            ))}
                            {(f.recommendedGarments || []).length > 2 && (
                              <span className="text-[10px] px-1 py-0.5 bg-zinc-100 text-zinc-500 rounded-md">
                                +{(f.recommendedGarments || []).length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card bottom action */}
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-zinc-950 group-hover:text-zinc-800">
                          <span>点击查看适合服装与禁忌</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Sub-view B: In-depth Fabric-to-Garment Analysis (When a fabric is selected) */
            <div className="space-y-6">
              {/* Back Navigation Bar & Quick Selector */}
              <div className="os26-glass rounded-3xl border border-zinc-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInspectedFabricId(null)}
                    className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>返回面料墙选择</span>
                  </button>

                  <div className="h-4 w-px bg-zinc-200" />

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">当前分析面料：</span>
                    <select
                      value={inspectedFabric.id}
                      onChange={(e) => setInspectedFabricId(e.target.value)}
                      className="text-xs font-bold bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-zinc-900 focus:outline-hidden cursor-pointer shadow-2xs max-w-xs truncate"
                    >
                      {fabrics.map((f) => (
                        <option key={f.id} value={f.id}>
                          [{f.id}] {f.name.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToDetail(inspectedFabric)}
                  className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>查看完整面料主档</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top Specification Banner Card */}
              <div className="os26-card rounded-3xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
                {/* Left image */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="h-56 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 relative">
                    <img
                      src={inspectedFabric.mainImage}
                      alt={inspectedFabric.name.value}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-white border border-white/20">
                        {inspectedFabric.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                    <span>面料主色系：<strong className="text-zinc-800">{inspectedFabric.mainColorFamily || '标准色'}</strong></span>
                    <span>大货起订量：<strong className="text-zinc-800 font-mono">{inspectedFabric.moq?.value || 300}米</strong></span>
                  </div>
                </div>

                {/* Right specs breakdown */}
                <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {inspectedFabric.category?.value}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {inspectedFabric.weaveCategory?.value} • {inspectedFabric.weaveStructure?.value}
                      </span>
                      {inspectedFabric.supplierItemCode?.value && (
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-md border border-zinc-200">
                          货号: {inspectedFabric.supplierItemCode.value}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-zinc-950">
                      {inspectedFabric.name.value}
                    </h2>
                    <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                      成分构成：{inspectedFabric.composition.value}
                    </p>
                  </div>

                  {/* Attribute Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                      <span className="text-[10px] text-zinc-400 block font-medium">克重</span>
                      <span className="font-bold text-zinc-950 font-mono text-xs">
                        {inspectedFabric.weight.value !== null ? `${inspectedFabric.weight.value} gsm` : '暂缺'}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                      <span className="text-[10px] text-zinc-400 block font-medium">弹性等级</span>
                      <span className="font-bold text-zinc-950 text-xs">{inspectedFabric.elasticity.value}</span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                      <span className="text-[10px] text-zinc-400 block font-medium">透光遮蔽度</span>
                      <span className="font-bold text-zinc-950 text-xs">{inspectedFabric.opacity.value}</span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
                      <span className="text-[10px] text-zinc-400 block font-medium">垂感表现</span>
                      <span className="font-bold text-zinc-950 text-xs">{inspectedFabric.drape.value}</span>
                    </div>
                  </div>

                  {/* Commercial row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>底价：<strong className="text-zinc-950 font-mono text-xs font-bold">¥{inspectedFabric.basePrice?.value || '--'}</strong> /米</span>
                      <span>大货价：<strong className="text-zinc-950 font-mono text-xs font-bold">¥{inspectedFabric.bulkPrice?.value || '--'}</strong> /米</span>
                      <span>样品价：<strong className="text-zinc-950 font-mono text-xs font-bold">¥{inspectedFabric.samplePrice?.value || '--'}</strong> /米</span>
                      <span>货期：<strong className="text-zinc-800">{inspectedFabric.leadTime?.value || '现货3天'}</strong></span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">
                      数据完整度：<strong className="text-emerald-700 font-mono">{inspectedFabric.completeness?.overall || 95}%</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Core Apparel Matching Section (最下面它可能适合的服装有哪一些) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-900" />
                    <span>服装开发建议与适用场景</span>
                  </h3>
                  <span className="text-xs text-zinc-500">样例结果·需人工确认</span>
                </div>

                {/* 1. Recommended Garments (适合的服装) */}
                <div className="os26-card rounded-3xl p-6 shadow-xs space-y-4 bg-white">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <h4 className="text-xs font-bold text-zinc-950">
                        核心推荐适用品类与设计方向 ({inspectedFabric.recommendedGarments.length}款)
                      </h4>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-sans">
                      参考【{inspectedFabric.weaveCategory.value}】组织与【{inspectedFabric.composition.value}】成分信息
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {(inspectedFabric.recommendedGarments || []).map((g, i) => (
                      <div
                        key={i}
                        className="p-4 bg-zinc-50/80 border border-zinc-200/80 rounded-2xl text-xs space-y-2 hover:border-zinc-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-950 text-xs block">{g}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold">
                            高契合度
                          </span>
                        </div>
                        <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                          充分发挥该面料【{inspectedFabric.drape.value}】的下垂质感与【{inspectedFabric.elasticity.value}】的体感优势，契合人体工学与穿着体验。
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Unsuitable Garments & Structural Caveats (不适合的服装) */}
                <div className="os26-card rounded-3xl p-6 shadow-xs space-y-4 bg-white">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                        ✕
                      </div>
                      <h4 className="text-xs font-bold text-zinc-950">
                        不适合品类与工艺结构禁忌
                      </h4>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-sans">
                      规避版型塌陷、拉伸变形或穿着闷热
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {inspectedFabric.unsuitableGarments && inspectedFabric.unsuitableGarments.length > 0 ? (
                      inspectedFabric.unsuitableGarments.map((ug, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-rose-50/30 border border-rose-100 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-900">禁忌款式：{ug}</span>
                            <p className="text-zinc-600 text-[11px]">
                              原因：该面料
                              {inspectedFabric.elasticity.value === '无弹'
                                ? '属于无弹机织结构，如设计为修身贴身裤装，活动时易发生膝盖鼓包或接缝撕裂。'
                                : inspectedFabric.weight.value && inspectedFabric.weight.value > 280
                                ? '克重偏厚挺括，不适宜需要轻薄垂顺的轻盈夏装。'
                                : '组织特征与该品类受力特征不匹配。'}
                            </p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold shrink-0">
                            结构不兼容
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-xs py-2">暂无明确结构冲突品类，可通用性强。</p>
                    )}
                  </div>
                </div>

                {/* 3. Production & Sampling Risk Reminders (生产与打样风险) */}
                <div className="bg-zinc-100/80 border border-zinc-200 rounded-3xl p-5.5 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-zinc-950">
                    <Info className="w-4 h-4 text-zinc-800" />
                    <span>成衣打样、样板制作与生产避坑要点：</span>
                  </div>
                  <div className="space-y-1.5 text-zinc-700 text-[11px] leading-relaxed font-sans pl-1">
                    {inspectedFabric.usageRisks && inspectedFabric.usageRisks.length > 0 ? (
                      inspectedFabric.usageRisks.map((r, i) => (
                        <p key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-zinc-900">•</span>
                          <span>{r}</span>
                        </p>
                      ))
                    ) : (
                      <p className="flex items-start gap-1.5">
                        <span className="font-bold text-zinc-900">•</span>
                        <span>首次大货前必须索取米样进行缩水率测试与耐摩擦色牢度试验。</span>
                      </p>
                    )}
                    {inspectedFabric.opacity.value === '半透明' || inspectedFabric.opacity.value === '透明' ? (
                      <p className="flex items-start gap-1.5 text-amber-900 font-medium">
                        <span className="font-bold">•</span>
                        <span>透明度提示：本款面料具有一定透光性，制作外穿单品时需企划配套防透内衬或打底设计。</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
