export type FieldStatus =
  | 'confirmed'       // 已确认
  | 'pending_review' // 待确认
  | 'missing'        // 待补充
  | 'inferred'       // AI推测
  | 'conflicting'    // 存在冲突
  | 'not_applicable'; // 不适用

export type EvidenceLevel =
  | 'supplier_declared' // 供应商声明
  | 'ai_inferred'       // AI推测
  | 'human_confirmed'   // 人工确认
  | 'lab_tested';       // 检测验证

export type FabricReviewStatus =
  | 'draft'          // 草稿
  | 'pending_review' // 待审核
  | 'missing_info'   // 待补充
  | 'ready_to_match' // 可匹配 (正式入墙)
  | 'suspended';     // 暂停使用

export type WeaveCategory = '梭织' | '针织' | '非织造' | '未知';

export type WeaveStructure =
  | '平纹'
  | '斜纹'
  | '缎纹'
  | '罗纹'
  | '双面'
  | '提花'
  | '网眼'
  | '双绉'
  | '华夫格'
  | '其他'
  | '未知';

export type OpacityLevel =
  | '完全不透'
  | '微透明'
  | '半透明'
  | '全透明'
  | '不透明'
  | '透明'
  | '未知';

export type ElasticityLevel = '无弹' | '微弹' | '二面弹' | '四面弹' | '未知';

export type DrapeLevel = '挺括' | '中等' | '垂顺' | '未知';

export interface FieldValue<T> {
  value: T | null;
  unit?: string;
  status: FieldStatus;
  confidence: number; // 0 - 1.0
  sourceEvidence?: string[];
  requiredAction?: string | null;
  updatedBy?: string;
  updatedAt?: string;
  conflictValues?: {
    source: string;
    value: T;
    unit?: string;
    confidence: number;
    rawText: string;
  }[];
}

export interface ColorVariant {
  id: string;
  supplierColorName: string; // 供应商原色名 e.g. "雾霾蓝"
  supplierColorCode: string; // 供应商色号 e.g. "#BL-082"
  standardFamily: string;    // 标准色系 e.g. "蓝色系"
  standardColorName: string; // 标准色名 e.g. "低饱和灰蓝"
  hex: string;               // 视觉参考 HEX
  temp: '冷色' | '暖色' | '中性';
  brightness: '高明度' | '中明度' | '低明度';
  saturation: '高饱和' | '中饱和' | '低饱和';
  image: string;
  status: FieldStatus;
  confidence: number;
}

export interface SourceEvidenceItem {
  id: string;
  sourceId: string;
  type: 'web_page' | 'screenshot' | 'color_card' | 'pdf' | 'photo';
  title: string;
  url?: string;
  thumbnail: string;
  extractedAt: string;
  ocrSnippets: {
    field: string;
    text: string;
    confidence: number;
    box?: string;
  }[];
}

export interface AlternativeFabricItem {
  name: string;
  enName?: string;
  weight?: string;
  composition?: string;
  similarityNote?: string;
}

export interface FabricMaster {
  id: string; // e.g. "FAB-001"
  systemCode?: string; // e.g. "ST-LY-2041" (平台统一编码: 供应商简称+品类编码)
  name: FieldValue<string>;
  category: FieldValue<string>;
  supplierItemCode: FieldValue<string>; // 供应商原始货号 e.g. "CB-LY-2041"
  
  // 供应商与商务信息
  supplierName: string;
  supplierShortName?: string; // 供应商简称 e.g. "盛泰", "恒茂", "福泽"
  supplierContact: string;
  supplierPhone: string;
  basePrice: FieldValue<number>; // 底价 (内部采购成本底价)
  bulkPrice: FieldValue<number>; // 大货价 (批量订购价)
  samplePrice?: FieldValue<number>; // 样品价 (剪样/散剪指导价，外部脱敏可见)
  currency: string;             // CNY / USD
  priceUnit: string;            // 元/米, 元/公斤
  priceType: '样品价' | '现货价' | '大货价' | '暂缺';
  moq: FieldValue<number>;      // 起订量
  leadTime: FieldValue<string>; // 交期 (如 "现货3天 / 订织15天")
  internalNotes?: string;

  // 纤维与物理规格
  composition: FieldValue<string>; // e.g. "68% 莫代尔 27% 锦纶 5% 氨纶"
  compositionBreakdown: { fiber: string; percentage: number }[];
  weight: FieldValue<number>;      // 克重 gsm
  width: FieldValue<number>;       // 门幅 cm
  yarnCount: FieldValue<string>;   // 支数 / 规格
  weaveCategory: FieldValue<WeaveCategory>;
  weaveStructure: FieldValue<WeaveStructure>;
  elasticity: FieldValue<ElasticityLevel>;
  elasticityDetail?: string;
  opacity: FieldValue<OpacityLevel>;
  drape: FieldValue<DrapeLevel>;
  
  // 视觉与外观
  mainColorFamily: string;
  colorVariants: ColorVariant[];
  pattern: string; // 纯色 / 条纹 / 提花 / 印花
  sheen: '哑光' | '微光泽' | '明显光泽' | '未知';
  mainImage: string;
  detailImages: string[];
  
  // 功能标签
  functions: {
    name: string;
    evidenceLevel: EvidenceLevel;
    status: FieldStatus;
  }[];
  
  // 适用服装品类推荐 (AI & 人工)
  recommendedGarments: string[];
  unsuitableGarments?: string[];
  usageRisks?: string[];

  // 专业面料简介与替代面料推荐 (Creabra 级专业纺织叙述体系)
  description?: string;
  enDescription?: string;
  alternativeFabrics?: AlternativeFabricItem[];
  garmentPreviewImage?: string; // 成衣上身参考效果

  // 市场通用面料品类与特殊工艺 (服装款式通用描述)
  marketFabricType?: FieldValue<string>; // 如: 牛仔, 雪纺, 丝绸, 卫衣布, 罗马布, 灯芯绒, 欧根纱, 粗花呢, 华夫格, 缎面等
  specialCrafts?: string[];              // 如: 绣花, 蕾丝, 烧花, 织锦, 压褶, 烫金, 植绒, 拔印等

  // 状态与完整度
  reviewStatus: FabricReviewStatus;
  completeness: {
    basic: number;     // 基础信息完整度 0-100
    matching: number;  // 匹配信息完整度 0-100
    commercial: number;// 商务信息完整度 0-100
    overall: number;   // 综合 0-100
  };
  missingFields: string[];
  conflictFields: string[];
  sources: SourceEvidenceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupingCandidate {
  id: string;
  suggestedFabricId?: string;
  suggestedName: string;
  supplierName: string;
  supplierItemCode: string;
  similarityScore: number; // 0 - 100
  ruleTier: 'auto_group' | 'manual_confirm' | 'separate_candidate'; // ≥85%, 60-84%, <60%
  basis: {
    itemCodeMatch: boolean;
    specSimilarity: number;
    visualSimilarity: number;
    reasons: string[];
  };
  sources: SourceEvidenceItem[];
  colorVariantsDetected: string[];
  status: 'pending' | 'confirmed' | 'split' | 'deferred';
}

export interface ImportJob {
  id: string;
  name: string;
  sourceType: 'excel_and_folder' | 'web_crawler' | 'supplier_direct';
  totalSources: number;
  processedSources: number;
  successCount: number;
  failedCount: number;
  draftFabricsCount: number;
  autoGroupedCount: number;
  manualGroupNeededCount: number;
  status: 'uploading' | 'ai_extracting' | 'grouping' | 'pending_review' | 'completed' | 'failed';
  currentStage: string;
  progressPercent: number;
  createdAt: string;
  failedDetails?: {
    sourceId: string;
    filenameOrUrl: string;
    reason: string;
    suggestedFix: string;
  }[];
}

export interface GarmentRequirement {
  category: string;       // e.g. "夏季防晒衬衫"
  silhouette: string;     // "宽松廓形" | "修身贴合" | "直筒"
  season: '春夏' | '秋冬' | '四季';
  targetPriceMax?: number; // 目标价格上限 元/米
  requiredDrape: DrapeLevel;
  requiredElasticity: ElasticityLevel;
  requiredOpacity: OpacityLevel; // e.g. "不透明" (不允许透光)
  allowLining: boolean;   // 是否允许使用内衬解决半透
  requiredFunctions: string[]; // ["透气", "速干", "防紫外线", "抗皱"]
  targetColorFamily: string; // "蓝色系" | "大地色系" | "不限"
  targetTone: string;     // "低饱和" | "高明度" | "不限"
}

export interface MatchScoreBreakdown {
  compositionAndStructure: { score: number; max: 25; notes: string };
  functionAndPerformance: { score: number; max: 20; notes: string };
  weightAndDrape: { score: number; max: 15; notes: string };
  colorAndAesthetics: { score: number; max: 20; notes: string };
  priceAndSupply: { score: number; max: 10; notes: string };
  dataCredibility: { score: number; max: 10; notes: string };
  totalScore: number;
}

export interface FabricMatchResult {
  fabric: FabricMaster;
  scoreBreakdown: MatchScoreBreakdown;
  recommendationLevel: 'recommended' | 'conditional_recommended' | 'not_recommended'; // ≥75, 60-74, <60
  recommendationReasons: string[];
  confirmedEvidence: string[];
  aiInferences: string[];
  keyGaps: string[];
  usageRisks: string[];
  hardConstraintsViolated: string[];
}

export interface AIConceptMaterialSpec {
  name: string;
  rationale: string;
  idealComposition: string;
  idealWeightGsm: string;
  idealWeave: string;
  idealOpacity: string;
  idealElasticity: string;
  idealFunctions: string[];
  estimatedTargetPrice: string;
  procurementPrompt: string;
  isConceptNotice: string; // "【非现有库存，需要采购或新开发】"
}

export interface SupplierSubmissionForm {
  supplierName: string;
  contactPerson: string;
  contactMethod: string; // 手机 / 微信 / 邮箱
  fabricNameOrCode: string;
  fileList: { name: string; size: string; type: string }[];
  priceAmount: number | '';
  currency: 'CNY' | 'USD' | 'EUR';
  priceUnit: '元/米' | '元/公斤' | '元/码';
  priceType: '样品价' | '现货价' | '大货价';
  // 可选
  moq?: string;
  leadTime?: string;
  stockStatus?: string;
  priceValidUntil?: string;
  declaredFunctions?: string[];
  certifications?: string;
  notes?: string;
}
