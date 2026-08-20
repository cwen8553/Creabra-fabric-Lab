import { FabricMaster, GroupingCandidate, ImportJob, AlternativeFabricItem } from './types';

export interface SupplierProfile {
  id: string;
  name: string;
  shortName: string;
  codePrefix: string;
  contactPerson: string;
  phone: string;
  city: string;
  categorySpecialty: string[];
  cooperationTier: '战略合作' | '核心主供' | '储备开发';
  totalFabricsCount: number;
  missingFieldsCount: number;
  confirmedFabricsCount: number;
  lastUpdated: string;
}

export const INITIAL_SUPPLIERS: SupplierProfile[] = [
  {
    id: 'SUP-001',
    name: '绍兴盛泰纺织科技有限公司',
    shortName: '盛泰',
    codePrefix: 'ST',
    contactPerson: '林经理',
    phone: '138-5750-8821',
    city: '浙江绍兴 (柯桥)',
    categorySpecialty: ['天丝/莱赛尔', '高密衬衫布', '环保再生纤维'],
    cooperationTier: '战略合作',
    totalFabricsCount: 18,
    missingFieldsCount: 0,
    confirmedFabricsCount: 18,
    lastUpdated: '2026-08-16',
  },
  {
    id: 'SUP-002',
    name: '柯桥恒茂纺织科技有限公司',
    shortName: '恒茂',
    codePrefix: 'HM',
    contactPerson: '陈经理',
    phone: '138-5758-9921',
    city: '浙江绍兴 (柯桥)',
    categorySpecialty: ['莫代尔速干', '四面高弹针织', '贴身内搭'],
    cooperationTier: '核心主供',
    totalFabricsCount: 14,
    missingFieldsCount: 0,
    confirmedFabricsCount: 14,
    lastUpdated: '2026-08-16',
  },
  {
    id: 'SUP-003',
    name: '常州福泽针纺制品厂',
    shortName: '福泽',
    codePrefix: 'FZ',
    contactPerson: '赵总',
    phone: '139-5192-3341',
    city: '江苏常州',
    categorySpecialty: ['有机棉平纹', '华夫格针织', '童装及家居'],
    cooperationTier: '核心主供',
    totalFabricsCount: 12,
    missingFieldsCount: 3,
    confirmedFabricsCount: 9,
    lastUpdated: '2026-08-15',
  },
  {
    id: 'SUP-004',
    name: '山东如意毛纺织集团',
    shortName: '如意',
    codePrefix: 'RY',
    contactPerson: '王主管',
    phone: '137-0537-8890',
    city: '山东济宁',
    categorySpecialty: ['精纺美利诺羊毛', '高支西装呢', '羊绒大衣呢'],
    cooperationTier: '战略合作',
    totalFabricsCount: 16,
    missingFieldsCount: 2,
    confirmedFabricsCount: 14,
    lastUpdated: '2026-08-15',
  },
  {
    id: 'SUP-005',
    name: '深圳汇洁新材料技术部',
    shortName: '汇洁',
    codePrefix: 'HJ',
    contactPerson: '周工',
    phone: '136-8230-1120',
    city: '广东深圳',
    categorySpecialty: ['超细锦纶速干', '四面回弹防透布', '无痕贴合'],
    cooperationTier: '核心主供',
    totalFabricsCount: 10,
    missingFieldsCount: 2,
    confirmedFabricsCount: 8,
    lastUpdated: '2026-08-14',
  },
  {
    id: 'SUP-006',
    name: '吴江尚宏丝绸数码印染',
    shortName: '尚宏',
    codePrefix: 'SH',
    contactPerson: '钱经理',
    phone: '133-0625-7711',
    city: '江苏苏州 (盛泽)',
    categorySpecialty: ['桑蚕丝素绉缎', '真丝双绉', '数码喷绘印花'],
    cooperationTier: '储备开发',
    totalFabricsCount: 8,
    missingFieldsCount: 0,
    confirmedFabricsCount: 8,
    lastUpdated: '2026-08-14',
  },
  {
    id: 'SUP-007',
    name: '南通润祥高密家纺纺织',
    shortName: '润祥',
    codePrefix: 'RX',
    contactPerson: '孙厂长',
    phone: '135-0629-4455',
    city: '江苏南通',
    categorySpecialty: ['高支长绒棉', '双层棉纱', '抗菌防螨整理'],
    cooperationTier: '储备开发',
    totalFabricsCount: 9,
    missingFieldsCount: 1,
    confirmedFabricsCount: 8,
    lastUpdated: '2026-08-13',
  },
];

const SUPPLIER_CODE_MAP: Record<string, { shortName: string; prefix: string }> = {
  '绍兴盛泰纺织科技有限公司': { shortName: '盛泰', prefix: 'ST' },
  '柯桥恒茂纺织科技有限公司': { shortName: '恒茂', prefix: 'HM' },
  '常州福泽针纺制品厂': { shortName: '福泽', prefix: 'FZ' },
  '南通润祥高密家纺纺织': { shortName: '润祥', prefix: 'RX' },
  '吴江尚宏丝绸数码印染': { shortName: '尚宏', prefix: 'SH' },
  '山东如意毛纺织集团': { shortName: '如意', prefix: 'RY' },
  '深圳汇洁新材料技术部': { shortName: '汇洁', prefix: 'HJ' },
  '广州锦达针织实业': { shortName: '锦达', prefix: 'JD' },
  '浙江华孚色纺股份': { shortName: '华孚', prefix: 'HF' },
  '南通联发纺织': { shortName: '联发', prefix: 'LF' },
  '海宁华宇超纤新材料': { shortName: '华宇', prefix: 'HY' },
  '吴江鼎立纺织实业有限公司': { shortName: '鼎立', prefix: 'DL' },
  '广州锦宏纺织科技有限公司': { shortName: '锦宏', prefix: 'JH' },
  '绍兴柯桥金丰纺织': { shortName: '金丰', prefix: 'JF' },
  '湖州丝悦丝绸纺织': { shortName: '丝悦', prefix: 'SY' },
  '汕头潮南雅美刺绣蕾丝': { shortName: '雅美', prefix: 'YM' },
  '杭州织韵数码提花锦缎': { shortName: '织韵', prefix: 'ZY' },
  '常州华纺粗花呢实业': { shortName: '华纺', prefix: 'HF' },
  '张家港恒盛针纺科技': { shortName: '恒盛', prefix: 'HS' },
  '佛山德润高密针织科技': { shortName: '德润', prefix: 'DR' },
};

export const INITIAL_GROUPING_CANDIDATES: GroupingCandidate[] = [
  {
    id: 'GRP-001',
    suggestedFabricId: 'FAB-001',
    suggestedName: '60S天丝平纹 (多来源聚合建议)',
    supplierName: '绍兴盛泰纺织科技有限公司',
    supplierItemCode: 'CB-LY-2041',
    similarityScore: 92,
    ruleTier: 'auto_group',
    basis: {
      itemCodeMatch: true,
      specSimilarity: 95,
      visualSimilarity: 90,
      reasons: ['供应商货号完全一致', '成分均为100%莱赛尔', '克重差异仅在±3%内'],
    },
    sources: [],
    colorVariantsDetected: ['雾霾蓝', '燕麦米', '鼠尾草绿'],
    status: 'pending',
  },
];

export const INITIAL_IMPORT_JOBS: ImportJob[] = [
  {
    id: 'JOB-20260816-01',
    name: '2026春夏天丝/莫代尔针织色卡汇总',
    sourceType: 'excel_and_folder',
    totalSources: 85,
    processedSources: 85,
    successCount: 81,
    failedCount: 4,
    draftFabricsCount: 68,
    autoGroupedCount: 52,
    manualGroupNeededCount: 16,
    status: 'completed',
    currentStage: '已完成',
    progressPercent: 100,
    createdAt: '2026-08-16 10:30',
  },
];

export const RAW_INITIAL_FABRICS: FabricMaster[] = [
  {
    "id": "FAB-001",
    "systemCode": "ST-LY-2041",
    "supplierShortName": "盛泰",
    "name": {
      "value": "云感高密莱赛尔天丝平纹",
      "status": "confirmed",
      "confidence": 0.98,
      "sourceEvidence": [
        "色卡抬头",
        "产品详情页"
      ]
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "CB-LY-2041",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierName": "绍兴盛泰纺织科技有限公司",
    "supplierContact": "林经理",
    "supplierPhone": "138-5750-8821",
    "basePrice": {
      "value": 24.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "bulkPrice": {
      "value": 28,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 40.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.9
    },
    "leadTime": {
      "value": "现货3天 / 订织15天",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "100% 莱赛尔 (天丝LF)",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "莱赛尔",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 135,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.96
    },
    "width": {
      "value": 148,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "60S*60S / 120*80",
      "status": "confirmed",
      "confidence": 0.94
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "平纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "无弹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "elasticityDetail": "经纬向均为纯天然机织平纹，自然微韧无弹",
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.92
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.96
    },
    "mainColorFamily": "米蓝系",
    "pattern": "纯色",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80"
    ],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "description": "这款采用兰精LF级高支莱赛尔纤维纺制的轻薄平纹面料，专为春夏高阶衬衫与垂坠阔腿裤定制。面料表面细腻顺滑，触感如云朵般柔糯，自带天然真丝般的微光泽与卓越的透气排汗性能。经高密机织工艺处理后布面紧密匀净，下垂感自然流动，非常适合法式通勤衬衫、高级垂感长裙与无袖极简套装。",
    "enDescription": "Lightweight high-density 100% Tencel Lyocell LF plain weave fabric. Exceptionally soft and cool to the touch with liquid drape and delicate natural sheen, ideal for contemporary luxury shirts and fluid summer trousers.",
    "alternativeFabrics": [
      {
        "name": "高密铜氨丝平纹绸",
        "enName": "Cupro Plain Weave Silk Touch",
        "weight": "120g/m²",
        "composition": "100% 铜氨丝 (Cupro)",
        "similarityNote": "同属纤维素环保再生丝光感，垂坠感相似"
      },
      {
        "name": "40S长绒棉微光泽平纹衬衫布",
        "enName": "40S Long-Staple Cotton Plain Weave",
        "weight": "130g/m²",
        "composition": "100% 精梳长绒棉",
        "similarityNote": "棉质挺括度略强，透气亲肤"
      },
      {
        "name": "桑蚕丝棉交织平纹双绉",
        "enName": "Silk Cotton Blend Crepe",
        "weight": "125g/m²",
        "composition": "70% 棉 30% 桑蚕丝",
        "similarityNote": "更奢华光泽，抗静电"
      }
    ],
    "colorVariants": [
      {
        "id": "c1",
        "supplierColorName": "雾霾蓝",
        "supplierColorCode": "#BL-08",
        "standardFamily": "蓝色系",
        "standardColorName": "低饱和灰蓝",
        "hex": "#7c93a8",
        "temp": "冷色",
        "brightness": "中明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      },
      {
        "id": "c2",
        "supplierColorName": "燕麦米",
        "supplierColorCode": "#BG-02",
        "standardFamily": "米白系",
        "standardColorName": "暖调燕麦",
        "hex": "#e2dacf",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.94
      },
      {
        "id": "c3",
        "supplierColorName": "鼠尾草绿",
        "supplierColorCode": "#GR-15",
        "standardFamily": "绿色系",
        "standardColorName": "柔和灰绿",
        "hex": "#8ea193",
        "temp": "冷色",
        "brightness": "中明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.93
      }
    ],
    "functions": [
      {
        "name": "亲肤吸湿",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "丝滑垂坠",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "抑菌透气",
        "evidenceLevel": "ai_inferred",
        "status": "inferred"
      }
    ],
    "recommendedGarments": [
      "春夏垂坠衬衫",
      "休闲阔腿裤",
      "轻盈吊带裙",
      "通勤无袖上衣"
    ],
    "unsuitableGarments": [
      "紧身运动打底裤",
      "挺括重工西装大衣"
    ],
    "usageRisks": [
      "天丝原纤化特性，洗涤建议轻柔手洗",
      "深色色牢度需注意湿摩擦"
    ],
    "marketFabricType": {
      "value": "丝绸/天丝",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [
      {
        "id": "s1",
        "sourceId": "SRC-0001",
        "type": "color_card",
        "title": "盛泰纺织_天丝60S色卡原图.jpg",
        "thumbnail": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=300&auto=format&fit=crop&q=80",
        "extractedAt": "2026-08-15 14:20",
        "ocrSnippets": [
          {
            "field": "货号",
            "text": "CB-LY-2041",
            "confidence": 0.99
          },
          {
            "field": "成分",
            "text": "100% 莱赛尔 (TENCEL LF)",
            "confidence": 0.98
          },
          {
            "field": "克重",
            "text": "135 G/M2 门幅: 148CM",
            "confidence": 0.96
          }
        ]
      }
    ],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-002",
    "systemCode": "HY-SP-8830",
    "supplierShortName": "华宇",
    "name": {
      "value": "超轻凉感锦氨四面弹运动针织",
      "status": "confirmed",
      "confidence": 0.97
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "HY-SP-8830",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "海宁华宇超纤新材料有限公司",
    "supplierContact": "周总监",
    "supplierPhone": "139-6733-4920",
    "basePrice": {
      "value": 28.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 32.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "samplePrice": {
      "value": 47,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 500,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.92
    },
    "leadTime": {
      "value": "定染12-15天",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "75% 锦纶 25% 氨纶",
      "status": "confirmed",
      "confidence": 0.98
    },
    "compositionBreakdown": [
      {
        "fiber": "锦纶",
        "percentage": 75
      },
      {
        "fiber": "氨纶",
        "percentage": 25
      }
    ],
    "weight": {
      "value": 220,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.97
    },
    "width": {
      "value": 155,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "40D/34F 锦纶 + 30D 莱卡",
      "status": "confirmed",
      "confidence": 0.92
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "双面",
      "status": "confirmed",
      "confidence": 0.96
    },
    "elasticity": {
      "value": "四面弹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticityDetail": "经向拉伸率 110%，纬向拉伸率 130%，高回弹不卷边",
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.95
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.9
    },
    "mainColorFamily": "黑色系",
    "pattern": "纯色",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"
    ],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    "description": "采用高支超细消光锦纶与25%高比例莱卡氨纶双面密针织造，专为高强度瑜伽服与专业运动内衣研发。面料具备优异的四向高回弹包裹感与“裸感”亲肤触感，经特殊冷感整理，接触凉感系数优异，不透光且抗下垂起拱。",
    "enDescription": "75% Nylon 25% Spandex high-gauge double knit athletic fabric with 4-way hyper-stretch and butter-soft naked feel. Anti-squat opacity with instant cooling and sweat-wicking properties.",
    "alternativeFabrics": [
      {
        "name": "80/20 涤氨高弹磨毛运动布",
        "enName": "Poly/Spandex Brushed Interlock",
        "weight": "230g/m²",
        "composition": "80% 涤纶 20% 氨纶",
        "similarityNote": "保暖性好，成本更具优势"
      },
      {
        "name": "70D锦氨空气层双面针织",
        "enName": "Air Scuba Double Knit",
        "weight": "240g/m²",
        "composition": "70% 锦纶 30% 氨纶",
        "similarityNote": "支撑性更强，适合塑形腰封"
      }
    ],
    "colorVariants": [
      {
        "id": "c21",
        "supplierColorName": "曜石黑",
        "supplierColorCode": "#BK-001",
        "standardFamily": "黑色系",
        "standardColorName": "深邃纯黑",
        "hex": "#1e2022",
        "temp": "中性",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.99
      },
      {
        "id": "c22",
        "supplierColorName": "干枯玫瑰",
        "supplierColorCode": "#PK-402",
        "standardFamily": "粉色系",
        "standardColorName": "灰调豆沙粉",
        "hex": "#b38287",
        "temp": "暖色",
        "brightness": "中明度",
        "saturation": "中饱和",
        "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.94
      }
    ],
    "functions": [
      {
        "name": "四面高弹",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "吸湿排汗",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "裸感亲肤",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "UPF50+防紫外线",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "瑜伽无痕文胸",
      "运动高腰紧身裤",
      "骑行短裤",
      "塑形背心"
    ],
    "unsuitableGarments": [
      "硬挺防风风衣",
      "正装衬衫"
    ],
    "usageRisks": [
      "高温熨烫可能损伤氨纶弹性"
    ],
    "marketFabricType": {
      "value": "运动速干",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-14",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-003",
    "systemCode": "FZ-CT-901",
    "supplierShortName": "福泽",
    "name": {
      "value": "精梳棉微弹双面罗纹布 (待补克重)",
      "status": "pending_review",
      "confidence": 0.88
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.95
    },
    "supplierItemCode": {
      "value": "FZ-CT-901",
      "status": "confirmed",
      "confidence": 0.92
    },
    "supplierName": "常州福泽针纺制品厂",
    "supplierContact": "赵总",
    "supplierPhone": "139-5192-3341",
    "basePrice": {
      "value": 25,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.91
    },
    "bulkPrice": {
      "value": 29,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.9
    },
    "samplePrice": {
      "value": 42,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.9
    },
    "currency": "CNY",
    "priceUnit": "元/公斤",
    "priceType": "现货价",
    "moq": {
      "value": 100,
      "unit": "公斤",
      "status": "confirmed",
      "confidence": 0.9
    },
    "leadTime": {
      "value": "现货充足",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "95% 精梳棉 5% 氨纶",
      "status": "confirmed",
      "confidence": 0.95
    },
    "compositionBreakdown": [
      {
        "fiber": "棉",
        "percentage": 95
      },
      {
        "fiber": "氨纶",
        "percentage": 5
      }
    ],
    "weight": {
      "value": null,
      "unit": "gsm",
      "status": "missing",
      "confidence": 0,
      "requiredAction": "向常州福泽确认实测克重范围 (预估210-240gsm)"
    },
    "width": {
      "value": 175,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.94
    },
    "yarnCount": {
      "value": "32S 紧密纺",
      "status": "pending_review",
      "confidence": 0.82
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.96
    },
    "weaveStructure": {
      "value": "罗纹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "elasticity": {
      "value": "二面弹",
      "status": "inferred",
      "confidence": 0.85
    },
    "opacity": {
      "value": "不透明",
      "status": "inferred",
      "confidence": 0.78
    },
    "drape": {
      "value": "中等",
      "status": "inferred",
      "confidence": 0.8
    },
    "mainColorFamily": "白色系",
    "pattern": "纯色条坑",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    "description": "精选32支紧密纺精梳棉纱，搭配5%氨纶以2x2罗纹组织织造。横向拉伸弹性极佳且久穿不易变形起松，布面纵向凹凸纹理清晰立体，触感柔软透气，是高品质基础打底T恤、领口拼贴及贴身背心的经典首选。",
    "enDescription": "95% Combed Cotton 5% Spandex 2x2 rib knit textile. Superior crosswise elasticity with crisp longitudinal ribs, offering soft hand-feel and durable shape recovery.",
    "alternativeFabrics": [
      {
        "name": "40S精梳棉1x1细罗纹",
        "enName": "40S Combed Cotton 1x1 Fine Rib",
        "weight": "200g/m²",
        "composition": "95% 棉 5% 氨纶",
        "similarityNote": "坑条更细腻，手感更轻薄"
      },
      {
        "name": "莫代尔棉混纺高弹罗纹",
        "enName": "Modal Cotton Blend Rib Knit",
        "weight": "220g/m²",
        "composition": "48% 莫代尔 47% 棉 5% 氨纶",
        "similarityNote": "更加柔软丝滑"
      }
    ],
    "colorVariants": [
      {
        "id": "c31",
        "supplierColorName": "本白",
        "supplierColorCode": "#WH-01",
        "standardFamily": "白色系",
        "standardColorName": "自然纯白",
        "hex": "#f5f5f3",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      }
    ],
    "functions": [
      {
        "name": "吸汗透气",
        "evidenceLevel": "ai_inferred",
        "status": "inferred"
      },
      {
        "name": "亲肤柔软",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "打底背心",
      "贴身T恤",
      "家居服",
      "领口袖口罗纹拼贴"
    ],
    "unsuitableGarments": [
      "西服外套",
      "冲锋衣"
    ],
    "usageRisks": [
      "克重暂未确定，无法精准评估四季厚薄及是否会透身，建议先索样打样"
    ],
    "marketFabricType": {
      "value": "针织罗纹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "specialCrafts": [],
    "reviewStatus": "missing_info",
    "completeness": {
      "basic": 75,
      "matching": 65,
      "commercial": 90,
      "overall": 76
    },
    "missingFields": [
      "克重 (gsm)"
    ],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-004",
    "systemCode": "DL-NY-702D",
    "supplierShortName": "鼎立",
    "name": {
      "value": "防风防泼水三防锦纶斜纹梭织",
      "status": "confirmed",
      "confidence": 0.96
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierItemCode": {
      "value": "DL-NY-702D",
      "status": "confirmed",
      "confidence": 0.97
    },
    "supplierName": "吴江鼎立纺织实业有限公司",
    "supplierContact": "苏芳",
    "supplierPhone": "135-8429-1130",
    "basePrice": {
      "value": 15,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "bulkPrice": {
      "value": 17.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 25.4,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 1000,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "定织定染20天",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "100% 锦纶 70D (特氟龙三防整理)",
      "status": "confirmed",
      "confidence": 0.97
    },
    "compositionBreakdown": [
      {
        "fiber": "锦纶",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 110,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.95
    },
    "width": {
      "value": 150,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "70D*70D 2/2斜纹",
      "status": "confirmed",
      "confidence": 0.94
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "斜纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "无弹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.96
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.92
    },
    "mainColorFamily": "军绿/灰黑",
    "pattern": "纯色",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    "description": "采用70D高强锦纶长丝织造的2/2斜纹防风面料，经特氟龙三防（防水、防油、防污）环保后整理。面料质感紧密挺括，微带哑光科技质感，具有4级荷叶拒水效果与优异的抗风撕裂强度，是户外轻薄冲锋衣与机能风衣的专业之选。",
    "enDescription": "100% Nylon 70D 2/2 twill woven fabric with Teflon 3-proof durable water-repellent finishing. Crisp structure and high tear resistance, engineered for technical shells and windbreakers.",
    "alternativeFabrics": [
      {
        "name": "再生聚酯防泼水平纹布",
        "enName": "Recycled Polyester DWR Plain Weave",
        "weight": "115g/m²",
        "composition": "100% 再生聚酯纤维",
        "similarityNote": "GRS环保认证，平纹结构"
      },
      {
        "name": "50D微弹锦纶超轻防风布",
        "enName": "50D Stretch Nylon Ultralight Shell",
        "weight": "85g/m²",
        "composition": "92% 锦纶 8% 氨纶",
        "similarityNote": "更轻量，带微机械弹力"
      }
    ],
    "colorVariants": [
      {
        "id": "c41",
        "supplierColorName": "军橄榄绿",
        "supplierColorCode": "#OL-901",
        "standardFamily": "绿色系",
        "standardColorName": "低饱和橄榄灰绿",
        "hex": "#5b6356",
        "temp": "暖色",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.96
      },
      {
        "id": "c42",
        "supplierColorName": "太空银灰",
        "supplierColorCode": "#GR-002",
        "standardFamily": "灰色系",
        "standardColorName": "浅冷灰",
        "hex": "#c0c4c8",
        "temp": "冷色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      }
    ],
    "functions": [
      {
        "name": "荷叶防泼水(4级)",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "轻量防风",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "耐磨抗撕裂",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "户外轻薄冲锋衣",
      "防风机能外套",
      "休闲工装短裤",
      "防风防泼水风衣"
    ],
    "unsuitableGarments": [
      "贴身文胸",
      "垂坠长裙"
    ],
    "usageRisks": [
      "面料透气性相对较低，夏季贴身穿着易闷热"
    ],
    "marketFabricType": {
      "value": "斜纹布",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [
      "复合涂层"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-14",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-005",
    "systemCode": "LF-CT-3302",
    "supplierShortName": "联发",
    "name": {
      "value": "精梳棉弹力平纹布 (存在成分/克重冲突)",
      "status": "conflicting",
      "confidence": 0.65
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.95
    },
    "supplierItemCode": {
      "value": "NT-CT-3302",
      "status": "confirmed",
      "confidence": 0.93
    },
    "supplierName": "南通联发纺织股份有限公司",
    "supplierContact": "王经理",
    "supplierPhone": "136-0628-5541",
    "basePrice": {
      "value": 20,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.9
    },
    "bulkPrice": {
      "value": 23.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.9
    },
    "samplePrice": {
      "value": 34.1,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.88
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.85
    },
    "leadTime": {
      "value": "现货5天",
      "status": "confirmed",
      "confidence": 0.85
    },
    "composition": {
      "value": "95% 棉 5% 氨纶 (冲突待定)",
      "status": "conflicting",
      "confidence": 0.65
    },
    "compositionBreakdown": [
      {
        "fiber": "棉",
        "percentage": 95
      },
      {
        "fiber": "氨纶",
        "percentage": 5
      }
    ],
    "weight": {
      "value": 210,
      "unit": "gsm",
      "status": "conflicting",
      "confidence": 0.68
    },
    "width": {
      "value": 165,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.92
    },
    "yarnCount": {
      "value": "40S 精梳 + 30D 氨纶",
      "status": "pending_review",
      "confidence": 0.85
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.98
    },
    "weaveStructure": {
      "value": "平纹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "elasticity": {
      "value": "二面弹",
      "status": "confirmed",
      "confidence": 0.9
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.92
    },
    "drape": {
      "value": "中等",
      "status": "confirmed",
      "confidence": 0.88
    },
    "mainColorFamily": "黑色/白色",
    "pattern": "纯色",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80",
    "description": "40支精梳纯棉织造的高品质单面平纹汗布，织物紧密平整，手感柔软爽滑，亲肤透气不闷汗。加入适量氨纶赋能适度横向弹性，非常适合男女士四季修身T恤、打底长袖与日常家居服。",
    "enDescription": "40S Combed cotton single jersey with spandex. Smooth hand feel, natural breathability, and reliable recovery for premium daily tees.",
    "alternativeFabrics": [
      {
        "name": "50S双股长绒棉高密汗布",
        "enName": "50S/2 Long-Staple Cotton Single Jersey",
        "weight": "220g/m²",
        "composition": "100% 匹马棉",
        "similarityNote": "光泽更佳，纯棉无氨纶"
      },
      {
        "name": "60S莫代尔棉混纺平纹布",
        "enName": "Modal Cotton Single Jersey",
        "weight": "190g/m²",
        "composition": "50% 莫代尔 50% 棉",
        "similarityNote": "更凉爽垂顺"
      }
    ],
    "colorVariants": [
      {
        "id": "c51",
        "supplierColorName": "深海军蓝",
        "supplierColorCode": "#NV-01",
        "standardFamily": "蓝色系",
        "standardColorName": "藏青",
        "hex": "#1c2833",
        "temp": "冷色",
        "brightness": "低明度",
        "saturation": "中饱和",
        "image": "https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.9
      }
    ],
    "functions": [
      {
        "name": "亲肤透气",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "柔软微弹",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "基础修身短袖T恤",
      "休闲打底长袖",
      "打底背心"
    ],
    "unsuitableGarments": [
      "西服",
      "羽绒服外壳"
    ],
    "usageRisks": [
      "成分与克重在色卡与产品页存在差异，请优先核实实验室实测数据"
    ],
    "marketFabricType": {
      "value": "双层棉纱",
      "status": "confirmed",
      "confidence": 0.95
    },
    "specialCrafts": [],
    "reviewStatus": "draft",
    "completeness": {
      "basic": 85,
      "matching": 80,
      "commercial": 95,
      "overall": 86
    },
    "missingFields": [],
    "conflictFields": [
      "成分 (composition)",
      "克重 (weight)"
    ],
    "sources": [],
    "createdAt": "2026-08-15",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-006",
    "systemCode": "JH-Q618",
    "supplierShortName": "锦宏",
    "name": {
      "value": "法式透气浮雕提花网眼布",
      "status": "confirmed",
      "confidence": 0.96
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierItemCode": {
      "value": "SP-Q618",
      "status": "confirmed",
      "confidence": 0.97
    },
    "supplierName": "广州锦宏纺织科技有限公司",
    "supplierContact": "梁经理",
    "supplierPhone": "138-0288-9900",
    "basePrice": {
      "value": 28.9,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "bulkPrice": {
      "value": 34,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 49.3,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.94
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.92
    },
    "leadTime": {
      "value": "定染15天",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "88% 锦纶 12% 氨纶",
      "status": "confirmed",
      "confidence": 0.97
    },
    "compositionBreakdown": [
      {
        "fiber": "锦纶",
        "percentage": 88
      },
      {
        "fiber": "氨纶",
        "percentage": 12
      }
    ],
    "weight": {
      "value": 85,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.95
    },
    "width": {
      "value": 155,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "30D 锦纶提花织造",
      "status": "confirmed",
      "confidence": 0.92
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "提花",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "四面弹",
      "status": "confirmed",
      "confidence": 0.96
    },
    "opacity": {
      "value": "半透明",
      "status": "confirmed",
      "confidence": 0.95
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.92
    },
    "mainColorFamily": "法式黑白",
    "pattern": "提花花卉浮雕",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "description": "采用30D超细高强锦纶丝经多梳节经编提花机织造，呈现浪漫法式镂空浮雕花卉图案。织物透光微透却具备极佳的四向弹性与丝滑肤感，专为法式轻奢内衣罩面、夏季防晒轻薄开衫及礼服拼接设计。",
    "enDescription": "88% Nylon 12% Spandex delicate openwork floral relief jacquard mesh. Sheer, ultra-breathable with 4-way stretch for lingerie and luxury summer layering.",
    "alternativeFabrics": [
      {
        "name": "水溶花卉刺绣网纱",
        "enName": "Embroidered Tulle Lace",
        "weight": "90g/m²",
        "composition": "100% 聚酯纤维",
        "similarityNote": "立体花纹更厚重，弹性较低"
      },
      {
        "name": "超细弹力点子网眼布",
        "enName": "Stretch Dot Mesh",
        "weight": "80g/m²",
        "composition": "90% 锦纶 10% 氨纶",
        "similarityNote": "极简波点几何肌理"
      }
    ],
    "colorVariants": [
      {
        "id": "c61",
        "supplierColorName": "象牙白",
        "supplierColorCode": "#IV-01",
        "standardFamily": "白色系",
        "standardColorName": "柔和米白",
        "hex": "#faf9f5",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      },
      {
        "id": "c62",
        "supplierColorName": "夜幕黑",
        "supplierColorCode": "#BK-02",
        "standardFamily": "黑色系",
        "standardColorName": "深黑",
        "hex": "#111215",
        "temp": "中性",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.96
      }
    ],
    "functions": [
      {
        "name": "轻盈透气",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "浮雕立体",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "四面回弹",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "法式蕾丝内衣罩面",
      "夏季防晒轻薄罩衫",
      "礼服拼接袖口"
    ],
    "unsuitableGarments": [
      "羽绒服",
      "西裤"
    ],
    "marketFabricType": {
      "value": "雪纺",
      "status": "confirmed",
      "confidence": 0.95
    },
    "specialCrafts": [
      "蕾丝",
      "提花"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-13",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-007",
    "systemCode": "RY-W-1880",
    "supplierShortName": "如意",
    "name": {
      "value": "羊毛桑蚕丝混纺高支斜纹西装面料",
      "status": "confirmed",
      "confidence": 0.98
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "RY-WS-1880",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierName": "山东如意毛纺织集团",
    "supplierContact": "王主管",
    "supplierPhone": "137-0537-8890",
    "basePrice": {
      "value": 78,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 92,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 135,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 150,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货7天 / 定制30天",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "70% 美利诺羊毛 30% 桑蚕丝",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "羊毛",
        "percentage": 70
      },
      {
        "fiber": "桑蚕丝",
        "percentage": 30
      }
    ],
    "weight": {
      "value": 260,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.97
    },
    "width": {
      "value": 152,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.99
    },
    "yarnCount": {
      "value": "110S/2 精纺双股",
      "status": "confirmed",
      "confidence": 0.96
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "斜纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "微弹",
      "status": "confirmed",
      "confidence": 0.93
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.98
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.98
    },
    "mainColorFamily": "深灰/炭黑",
    "pattern": "精细微斜纹",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    "description": "甄选澳大利亚110S超细美利诺羊毛与天然顶级桑蚕丝精纺交织，经密织斜纹定型工艺。面料具备羊毛的挺拔骨感与桑蚕丝特有的内敛丝缎光泽，抗皱回弹性优异，垂坠感极佳，专为高定时装西装与奢华风衣定制。",
    "enDescription": "70% Australian Merino Wool 30% Mulberry Silk 110S/2 fine worsted twill. Natural resilience and luxurious subtle sheen, tailor-made for bespoke suiting and tailored coats.",
    "alternativeFabrics": [
      {
        "name": "100% 120S纯羊毛精纺斜纹西装呢",
        "enName": "100% Wool 120S Worsted Twill",
        "weight": "270g/m²",
        "composition": "100% 美利诺羊毛",
        "similarityNote": "纯羊毛哑光质感，保暖度稍高"
      },
      {
        "name": "羊毛涤纶混纺免烫西装布",
        "enName": "Wool Polyester Blend Suiting",
        "weight": "250g/m²",
        "composition": "55% 羊毛 45% 聚酯纤维",
        "similarityNote": "机洗免烫，适合快消商务工装"
      }
    ],
    "colorVariants": [
      {
        "id": "c71",
        "supplierColorName": "炭黑灰",
        "supplierColorCode": "#CH-01",
        "standardFamily": "灰色系",
        "standardColorName": "高级深炭灰",
        "hex": "#2b2c30",
        "temp": "冷色",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.98
      }
    ],
    "functions": [
      {
        "name": "高定光泽",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "自然抗皱",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "骨感挺括",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "高级定制男士西装",
      "女士收腰西服外套",
      "商务直筒西裤",
      "轻奢风衣"
    ],
    "unsuitableGarments": [
      "贴身打底背心",
      "运动短裤"
    ],
    "marketFabricType": {
      "value": "羊毛呢绒",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-14",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-008",
    "systemCode": "JD-Q150",
    "supplierShortName": "锦达",
    "name": {
      "value": "全消光吸排速干涤纶鸟眼网眼布",
      "status": "confirmed",
      "confidence": 0.97
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "JD-SP-Y150",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "广州锦达针织实业",
    "supplierContact": "陈总",
    "supplierPhone": "138-0299-1144",
    "basePrice": {
      "value": 16.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "bulkPrice": {
      "value": 19,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 27.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.94
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 500,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货3天",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "100% 全消光速干涤纶",
      "status": "confirmed",
      "confidence": 0.98
    },
    "compositionBreakdown": [
      {
        "fiber": "涤纶",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 150,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.96
    },
    "width": {
      "value": 160,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "75D/72F 异形截面微孔纱",
      "status": "confirmed",
      "confidence": 0.94
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "网眼",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "二面弹",
      "status": "confirmed",
      "confidence": 0.92
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.9
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.9
    },
    "mainColorFamily": "荧光/灰白",
    "pattern": "微孔鸟眼蜂巢",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    "description": "采用75D/72F十字异形截面吸排纤维织造的经典鸟眼网眼结构。微孔导湿槽设计可快速将汗液导向织物表面蒸发，布面哑光干爽，极轻无负担，广泛应用于马拉松跑步服、球类运动服与户外速干POLO衫。",
    "enDescription": "100% Dull Quick-dry Polyester bird-eye mesh. Cross-sectional micro channels provide rapid moisture transfer and instantaneous drying.",
    "alternativeFabrics": [
      {
        "name": "再生涤纶环保速干提花布",
        "enName": "Recycled Poly Quick-Dry Jacquard",
        "weight": "145g/m²",
        "composition": "100% GRS再生涤纶",
        "similarityNote": "低碳环保认证，微提花纹理"
      },
      {
        "name": "锦纶超轻吸排网眼布",
        "enName": "Nylon Ultralight Mesh",
        "weight": "130g/m²",
        "composition": "100% 锦纶",
        "similarityNote": "更柔软丝滑，耐磨性更高"
      }
    ],
    "colorVariants": [
      {
        "id": "c81",
        "supplierColorName": "亮白",
        "supplierColorCode": "#WH-01",
        "standardFamily": "白色系",
        "standardColorName": "纯白",
        "hex": "#ffffff",
        "temp": "冷色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      }
    ],
    "functions": [
      {
        "name": "秒级速干",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "透气散热",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "抗紫外线",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "马拉松速干T恤",
      "运动训练短袖",
      "户外POLO衫",
      "网球短裙"
    ],
    "unsuitableGarments": [
      "正装外套",
      "保暖冬装"
    ],
    "marketFabricType": {
      "value": "速干网眼",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-13",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-009",
    "systemCode": "HM-SP-4010",
    "supplierShortName": "恒茂",
    "name": {
      "value": "莫代尔真丝混纺轻奢罗纹针织",
      "status": "confirmed",
      "confidence": 0.96
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "HM-SP-4010",
      "status": "confirmed",
      "confidence": 0.97
    },
    "supplierName": "柯桥恒茂纺织科技有限公司",
    "supplierContact": "陈经理",
    "supplierPhone": "138-5758-9921",
    "basePrice": {
      "value": 36,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "bulkPrice": {
      "value": 42,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 61,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.94
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.92
    },
    "leadTime": {
      "value": "现货5天",
      "status": "confirmed",
      "confidence": 0.9
    },
    "composition": {
      "value": "85% 兰精莫代尔 10% 桑蚕丝 5% 氨纶",
      "status": "confirmed",
      "confidence": 0.98
    },
    "compositionBreakdown": [
      {
        "fiber": "莫代尔",
        "percentage": 85
      },
      {
        "fiber": "桑蚕丝",
        "percentage": 10
      },
      {
        "fiber": "氨纶",
        "percentage": 5
      }
    ],
    "weight": {
      "value": 195,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.96
    },
    "width": {
      "value": 165,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "60S 双股混纺",
      "status": "confirmed",
      "confidence": 0.94
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "罗纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "四面弹",
      "status": "confirmed",
      "confidence": 0.96
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.94
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.97
    },
    "mainColorFamily": "香槟/烟灰",
    "pattern": "细密微罗纹",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "description": "将85%奥地利兰精莫代尔与10%天然桑蚕丝精妙配比，以高针高密细罗纹机台织造。织物不仅拥有极度柔滑如液态丝绸的触感，更兼备微弱雅致的丝光与极佳的塑形回弹性，是高奢内搭与名媛打底衫的不二之选。",
    "enDescription": "85% Lenzing Modal 10% Mulberry Silk 5% Spandex fine rib knit. Liquid-soft touch with luxurious fluid drape, engineered for elevated innerwear.",
    "alternativeFabrics": [
      {
        "name": "100% 兰精天丝微细罗纹布",
        "enName": "100% Tencel Fine Rib Knit",
        "weight": "185g/m²",
        "composition": "100% 莱赛尔",
        "similarityNote": "纯纤维素植物丝光感"
      },
      {
        "name": "羊绒莫代尔保暖轻薄针织",
        "enName": "Cashmere Modal Blend Jersey",
        "weight": "205g/m²",
        "composition": "90% 莫代尔 10% 羊绒",
        "similarityNote": "秋冬季节保暖性更强"
      }
    ],
    "colorVariants": [
      {
        "id": "c91",
        "supplierColorName": "香槟金杏",
        "supplierColorCode": "#CP-01",
        "standardFamily": "米白系",
        "standardColorName": "香槟浅金",
        "hex": "#ede6d6",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      }
    ],
    "functions": [
      {
        "name": "真丝奢滑",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "恒温透气",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "持久回弹",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "轻奢打底衫",
      "真丝感背心",
      "法式紧身上衣",
      "高端家居服"
    ],
    "unsuitableGarments": [
      "重工风衣",
      "牛仔外套"
    ],
    "marketFabricType": {
      "value": "针织罗纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-13",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-010",
    "systemCode": "RX-CT-2200",
    "supplierShortName": "润祥",
    "name": {
      "value": "重磅水洗双层棉纱布 (亲肤透气)",
      "status": "confirmed",
      "confidence": 0.98
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "RX-CT-2200",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "南通润祥高密家纺纺织",
    "supplierContact": "孙厂长",
    "supplierPhone": "135-0629-4455",
    "basePrice": {
      "value": 18.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 21.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 31,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货充足",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "100% 优质长绒棉",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "棉",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 165,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.97
    },
    "width": {
      "value": 145,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "40S*40S 双层接结",
      "status": "confirmed",
      "confidence": 0.95
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "平纹",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "无弹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.93
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.9
    },
    "mainColorFamily": "原棉白/淡蓝",
    "pattern": "微皱自然肌理",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    "description": "采用100%优质棉纱经上下双层平纹接结织造，并经环保生物酶水洗预缩处理。面料形成独有的空气层与自然微皱纹理，触感越洗越蓬松柔软，吸水透气且不粘身，是日系文艺衬衫、母婴童装与舒适睡袍的绝佳材质。",
    "enDescription": "100% Long-staple cotton double-layer gauze (muslin) with natural crinkle wash finish. Highly breathable with airy softness, suitable for relaxed resort shirts and loungewear.",
    "alternativeFabrics": [
      {
        "name": "三层水洗泡泡棉纱布",
        "enName": "Triple Layer Crinkle Cotton Gauze",
        "weight": "210g/m²",
        "composition": "100% 棉",
        "similarityNote": "更厚实保暖，适合春秋"
      },
      {
        "name": "竹纤维棉混纺双层纱",
        "enName": "Bamboo Cotton Double Gauze",
        "weight": "160g/m²",
        "composition": "70% 竹纤维 30% 棉",
        "similarityNote": "天然抑菌凉爽"
      }
    ],
    "colorVariants": [
      {
        "id": "c101",
        "supplierColorName": "原棉米白",
        "supplierColorCode": "#CR-01",
        "standardFamily": "白色系",
        "standardColorName": "原白",
        "hex": "#f6f4ee",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.95
      }
    ],
    "functions": [
      {
        "name": "母婴级亲肤",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "越洗越软",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "天然透气",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "日系休闲衬衫",
      "日式家居服",
      "轻薄睡袍",
      "婴儿连体衣"
    ],
    "unsuitableGarments": [
      "紧身运动裤",
      "硬朗机能风衣"
    ],
    "marketFabricType": {
      "value": "双层棉纱",
      "status": "confirmed",
      "confidence": 0.98
    },
    "specialCrafts": [
      "水洗石磨"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-12",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-013",
    "systemCode": "JF-DN-1250",
    "supplierShortName": "金丰",
    "name": {
      "value": "12.5安重磅复古赤耳微弹竹节牛仔布",
      "status": "confirmed",
      "confidence": 0.98
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "JF-DN-1250",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "绍兴柯桥金丰纺织",
    "supplierContact": "吴经理",
    "supplierPhone": "139-5750-6677",
    "basePrice": {
      "value": 26,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 30.5,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 44,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 500,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货5天",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "98% 棉 2% 氨纶",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "棉",
        "percentage": 98
      },
      {
        "fiber": "氨纶",
        "percentage": 2
      }
    ],
    "weight": {
      "value": 420,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "width": {
      "value": 150,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "7S*7S 粗支竹节斜纹",
      "status": "confirmed",
      "confidence": 0.96
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "斜纹",
      "status": "confirmed",
      "confidence": 0.99
    },
    "elasticity": {
      "value": "微弹",
      "status": "confirmed",
      "confidence": 0.96
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.99
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.99
    },
    "mainColorFamily": "复古靛蓝",
    "pattern": "纯色竹节斜纹",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    "description": "采用古董穿梭织机织造的12.5盎司经典赤耳竹节牛仔布。采用天然植物靛蓝经纱多道浸染，竹节纱线带来粗犷而富有层次的复古落色感。微弹氨纶的加入极大提升了重磅牛仔裤的弯腿活动舒适度。",
    "enDescription": "12.5oz Selvedge slub denim woven with 98% Cotton 2% Spandex. Authentic rope-dyed indigo twill offering rich vintage fade potential and ease of movement.",
    "alternativeFabrics": [
      {
        "name": "14.5安硬质纯棉原牛布",
        "enName": "14.5oz 100% Rigid Raw Denim",
        "weight": "490g/m²",
        "composition": "100% 棉",
        "similarityNote": "养牛复古爱好首选，无弹"
      },
      {
        "name": "10安轻薄纯棉牛仔布",
        "enName": "10oz Light Cotton Denim",
        "weight": "340g/m²",
        "composition": "100% 棉",
        "similarityNote": "适合牛仔衬衫与夏季短裤"
      }
    ],
    "colorVariants": [
      {
        "id": "c131",
        "supplierColorName": "经典靛蓝",
        "supplierColorCode": "#DN-01",
        "standardFamily": "蓝色系",
        "standardColorName": "靛蓝",
        "hex": "#1f3a52",
        "temp": "冷色",
        "brightness": "低明度",
        "saturation": "中饱和",
        "image": "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.98
      }
    ],
    "functions": [
      {
        "name": "耐磨耐穿",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "复古落色",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "立体塑形",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "重磅修身直筒牛仔裤",
      "工装牛仔夹克",
      "复古牛仔工装裙"
    ],
    "unsuitableGarments": [
      "垂感衬衫",
      "紧身瑜伽背心"
    ],
    "marketFabricType": {
      "value": "牛仔",
      "status": "confirmed",
      "confidence": 0.99
    },
    "specialCrafts": [
      "水洗石磨"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-11",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-015",
    "systemCode": "SY-SK-1900",
    "supplierShortName": "丝悦",
    "name": {
      "value": "19姆米重磅桑蚕丝真丝双绉",
      "status": "confirmed",
      "confidence": 0.99
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "SY-SK-1900",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierName": "湖州丝悦丝绸纺织",
    "supplierContact": "沈经理",
    "supplierPhone": "136-5582-7711",
    "basePrice": {
      "value": 68,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "bulkPrice": {
      "value": 78,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.99
    },
    "samplePrice": {
      "value": 115,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 100,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "leadTime": {
      "value": "现货3天",
      "status": "confirmed",
      "confidence": 0.96
    },
    "composition": {
      "value": "100% 6A级桑蚕丝",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "桑蚕丝",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 82,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "width": {
      "value": 140,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "2/20/22D 强捻桑蚕丝",
      "status": "confirmed",
      "confidence": 0.96
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "双绉",
      "status": "confirmed",
      "confidence": 0.99
    },
    "elasticity": {
      "value": "微弹",
      "status": "confirmed",
      "confidence": 0.92
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.93
    },
    "drape": {
      "value": "垂顺",
      "status": "confirmed",
      "confidence": 0.99
    },
    "mainColorFamily": "珍珠香槟/墨黑",
    "pattern": "微细微凹凸绉纹",
    "sheen": "明显光泽",
    "mainImage": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "description": "选用100%天然6A级桑蚕丝强捻精织而成的19姆米重磅双绉。面料双向微带精细绉波纹，光泽柔和典雅而不刺眼，亲肤抗静电，垂顺度与透气性登峰造极，是奢牌真丝衬衫与晚宴礼服的经典标志面料。",
    "enDescription": "100% 6A Grade Mulberry Silk 19 Momme Crepe de Chine. Refined matte pebbled texture with luminous drape and hypoallergenic breathability.",
    "alternativeFabrics": [
      {
        "name": "16姆米桑蚕丝素绉缎",
        "enName": "16 Momme Silk Satin",
        "weight": "69g/m²",
        "composition": "100% 桑蚕丝",
        "similarityNote": "正面缎面亮光更强"
      },
      {
        "name": "三醋酸高仿真丝双绉",
        "enName": "Triacetate Silk-Feel Crepe",
        "weight": "135g/m²",
        "composition": "70% 三醋酸 30% 涤纶",
        "similarityNote": "不易皱且易打理"
      }
    ],
    "colorVariants": [
      {
        "id": "c151",
        "supplierColorName": "珍珠白",
        "supplierColorCode": "#SK-01",
        "standardFamily": "白色系",
        "standardColorName": "珠光白",
        "hex": "#fdfbf7",
        "temp": "暖色",
        "brightness": "高明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.99
      }
    ],
    "functions": [
      {
        "name": "养肤润肌",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "高雅柔光",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "极致垂顺",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "奢华真丝衬衫",
      "吊带真丝睡裙",
      "飘带晚礼服",
      "高阶真丝丝巾"
    ],
    "unsuitableGarments": [
      "羽绒服",
      "工装裤"
    ],
    "marketFabricType": {
      "value": "丝绸/天丝",
      "status": "confirmed",
      "confidence": 0.99
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-11",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-018",
    "systemCode": "HF-TW-3800",
    "supplierShortName": "华纺",
    "name": {
      "value": "小香风名媛金银丝颗粒感粗花呢",
      "status": "confirmed",
      "confidence": 0.97
    },
    "category": {
      "value": "梭织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "HF-TW-3800",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "常州华纺粗花呢实业",
    "supplierContact": "张总",
    "supplierPhone": "138-5190-2233",
    "basePrice": {
      "value": 48,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 55,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 80,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 200,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.94
    },
    "leadTime": {
      "value": "现货5天 / 定织15天",
      "status": "confirmed",
      "confidence": 0.92
    },
    "composition": {
      "value": "55% 聚酯纤维 35% 羊毛 10% 金银丝",
      "status": "confirmed",
      "confidence": 0.98
    },
    "compositionBreakdown": [
      {
        "fiber": "聚酯纤维",
        "percentage": 55
      },
      {
        "fiber": "羊毛",
        "percentage": 35
      },
      {
        "fiber": "金银丝",
        "percentage": 10
      }
    ],
    "weight": {
      "value": 380,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.97
    },
    "width": {
      "value": 148,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "花式圈圈纱 + 结子纱交织",
      "status": "confirmed",
      "confidence": 0.95
    },
    "weaveCategory": {
      "value": "梭织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "提花",
      "status": "confirmed",
      "confidence": 0.96
    },
    "elasticity": {
      "value": "无弹",
      "status": "confirmed",
      "confidence": 0.95
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.99
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.98
    },
    "mainColorFamily": "黑白编织/金线",
    "pattern": "花式多色立体编织",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "description": "精选羊毛混纺粗细花式圈圈纱与闪亮金属丝多重交织编织。布面呈现浓郁经典的法式颗粒感与立体凹凸层次，面料厚实挺拔且不易变形，自带名媛高级感，是小香风短外套、A字半裙与早秋套裙的标志性面料。",
    "enDescription": "380gsm Bouclé metallic yarn tweed. Intricate multi-yarn weave with rich tactile texture and structured drape, iconic for French luxury jackets and co-ords.",
    "alternativeFabrics": [
      {
        "name": "纯羊毛人字纹粗花呢",
        "enName": "100% Wool Herringbone Tweed",
        "weight": "400g/m²",
        "composition": "100% 羊毛",
        "similarityNote": "英伦复古风，保暖度更高"
      },
      {
        "name": "轻量化彩点粗花呢",
        "enName": "Lightweight Fleck Tweed",
        "weight": "320g/m²",
        "composition": "60% 聚酯 40% 棉",
        "similarityNote": "春秋单穿更轻薄"
      }
    ],
    "colorVariants": [
      {
        "id": "c181",
        "supplierColorName": "经典黑金",
        "supplierColorCode": "#TW-01",
        "standardFamily": "黑色系",
        "standardColorName": "黑金混色",
        "hex": "#222220",
        "temp": "暖色",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.98
      }
    ],
    "functions": [
      {
        "name": "立体挺括",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "名媛高级感",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "保暖抗风",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "小香风经典短外套",
      "复古高腰A字半身裙",
      "法式名媛马甲",
      "秋冬名媛套裙"
    ],
    "unsuitableGarments": [
      "贴身文胸",
      "运动跑步服"
    ],
    "marketFabricType": {
      "value": "粗花呢",
      "status": "confirmed",
      "confidence": 0.99
    },
    "specialCrafts": [
      "提花"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-10",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-019",
    "systemCode": "HS-SW-4200",
    "supplierShortName": "恒盛",
    "name": {
      "value": "420G 重磅纯棉大毛圈底卫衣布 (表面微磨毛)",
      "status": "confirmed",
      "confidence": 0.98
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "HS-SW-4200",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "张家港恒盛针纺科技",
    "supplierContact": "陆总",
    "supplierPhone": "137-7322-8811",
    "basePrice": {
      "value": 28,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 33,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 48,
      "unit": "元/公斤",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/公斤",
    "priceType": "大货价",
    "moq": {
      "value": 300,
      "unit": "公斤",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货充足",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "100% 精梳长绒棉",
      "status": "confirmed",
      "confidence": 0.99
    },
    "compositionBreakdown": [
      {
        "fiber": "棉",
        "percentage": 100
      }
    ],
    "weight": {
      "value": 420,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "width": {
      "value": 185,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "10S 紧密纺面纱 + 8S 鱼鳞大毛圈底纱",
      "status": "confirmed",
      "confidence": 0.96
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "双面",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "微弹",
      "status": "confirmed",
      "confidence": 0.94
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.99
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.96
    },
    "mainColorFamily": "花灰/燕麦",
    "pattern": "纯色微磨毛",
    "sheen": "哑光",
    "mainImage": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    "description": "采用100%精梳棉以三线大毛圈机台织造的420克重磅纯棉卫衣布。正面经精细碳素微磨毛处理，触感温润软糯；底面为紧致排列的鱼鳞大毛圈，保暖透气且吸汗。重磅结构带来极佳的廓形撑力，是重工潮牌连帽卫衣与卫裤的标杆面料。",
    "enDescription": "420gsm 100% Combed Cotton Heavyweight French Terry. Carbon-peach finished surface with structured loopback interior, creating dramatic oversized silhouettes.",
    "alternativeFabrics": [
      {
        "name": "480G复合加厚抓绒卫衣布",
        "enName": "480gsm Polar Fleece Backed Terry",
        "weight": "480g/m²",
        "composition": "80% 棉 20% 涤纶",
        "similarityNote": "内部抓绒，深冬超强保暖"
      },
      {
        "name": "320G四季轻量毛圈布",
        "enName": "320gsm Light French Terry",
        "weight": "320g/m²",
        "composition": "100% 棉",
        "similarityNote": "适合春秋单穿轻便套头衫"
      }
    ],
    "colorVariants": [
      {
        "id": "c191",
        "supplierColorName": "花灰麻",
        "supplierColorCode": "#GY-01",
        "standardFamily": "灰色系",
        "standardColorName": "经典花灰",
        "hex": "#b5b7b9",
        "temp": "冷色",
        "brightness": "中明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.98
      }
    ],
    "functions": [
      {
        "name": "廓形挺括",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "重磅保暖",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      },
      {
        "name": "微磨毛触感",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "重磅廓形连帽卫衣",
      "美式复古落肩套头衫",
      "重工束脚慢跑卫裤"
    ],
    "unsuitableGarments": [
      "轻薄夏装",
      "修身衬衫"
    ],
    "marketFabricType": {
      "value": "卫衣布",
      "status": "confirmed",
      "confidence": 0.99
    },
    "specialCrafts": [
      "磨毛/拉绒"
    ],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-09",
    "updatedAt": "2026-08-16"
  },
  {
    "id": "FAB-020",
    "systemCode": "DR-RM-3500",
    "supplierShortName": "德润",
    "name": {
      "value": "40S 高支锦棉双面紧密纺弹力罗马布",
      "status": "confirmed",
      "confidence": 0.98
    },
    "category": {
      "value": "针织面料",
      "status": "confirmed",
      "confidence": 0.99
    },
    "supplierItemCode": {
      "value": "DR-RM-3500",
      "status": "confirmed",
      "confidence": 0.98
    },
    "supplierName": "佛山德润高密针织科技",
    "supplierContact": "林总",
    "supplierPhone": "139-2866-3399",
    "basePrice": {
      "value": 32,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.96
    },
    "bulkPrice": {
      "value": 37,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.98
    },
    "samplePrice": {
      "value": 53,
      "unit": "元/米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "currency": "CNY",
    "priceUnit": "元/米",
    "priceType": "大货价",
    "moq": {
      "value": 400,
      "unit": "米",
      "status": "confirmed",
      "confidence": 0.95
    },
    "leadTime": {
      "value": "现货7天",
      "status": "confirmed",
      "confidence": 0.95
    },
    "composition": {
      "value": "65% 锦纶 30% 棉 5% 氨纶",
      "status": "confirmed",
      "confidence": 0.98
    },
    "compositionBreakdown": [
      {
        "fiber": "锦纶",
        "percentage": 65
      },
      {
        "fiber": "棉",
        "percentage": 30
      },
      {
        "fiber": "氨纶",
        "percentage": 5
      }
    ],
    "weight": {
      "value": 350,
      "unit": "gsm",
      "status": "confirmed",
      "confidence": 0.97
    },
    "width": {
      "value": 160,
      "unit": "cm",
      "status": "confirmed",
      "confidence": 0.98
    },
    "yarnCount": {
      "value": "40S 锦棉混纺紧密纺",
      "status": "confirmed",
      "confidence": 0.95
    },
    "weaveCategory": {
      "value": "针织",
      "status": "confirmed",
      "confidence": 0.99
    },
    "weaveStructure": {
      "value": "双面",
      "status": "confirmed",
      "confidence": 0.98
    },
    "elasticity": {
      "value": "四面弹",
      "status": "confirmed",
      "confidence": 0.96
    },
    "opacity": {
      "value": "不透明",
      "status": "confirmed",
      "confidence": 0.99
    },
    "drape": {
      "value": "挺括",
      "status": "confirmed",
      "confidence": 0.97
    },
    "mainColorFamily": "经典黑/深驼",
    "pattern": "纯色微细横纹",
    "sheen": "微光泽",
    "mainImage": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
    "detailImages": [],
    "garmentPreviewImage": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    "description": "采用双面大圆机密针织造的350克重磅锦棉罗马布。织物既具备梭织面料般平整硬挺的西装骨感，又兼具针织的高回弹与无拘束活动自由度。久坐不易鼓包起皱，是高端通勤西服、职场铅笔裤及修身包臀裙的高频首选面料。",
    "enDescription": "350gsm Compact Cotton-Nylon Ponte Roma double knit. Combines woven-like structure and smooth hand feel with effortless 4-way stretch and anti-crease durability.",
    "alternativeFabrics": [
      {
        "name": "人棉涤纶经典罗马布 (Ponte di Roma)",
        "enName": "Rayon/Poly Ponte Roma",
        "weight": "330g/m²",
        "composition": "68% 粘胶 28% 锦纶 4% 氨纶",
        "similarityNote": "垂感更顺滑，抗静电"
      },
      {
        "name": "高密空压层弹力罗马布",
        "enName": "Heavy Scuba Ponte Knit",
        "weight": "380g/m²",
        "composition": "75% 聚酯 20% 锦纶 5% 氨纶",
        "similarityNote": "廓形感更强"
      }
    ],
    "colorVariants": [
      {
        "id": "c201",
        "supplierColorName": "曜石黑",
        "supplierColorCode": "#RM-01",
        "standardFamily": "黑色系",
        "standardColorName": "曜石黑",
        "hex": "#161719",
        "temp": "中性",
        "brightness": "低明度",
        "saturation": "低饱和",
        "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
        "status": "confirmed",
        "confidence": 0.98
      }
    ],
    "functions": [
      {
        "name": "抗皱免烫",
        "evidenceLevel": "lab_tested",
        "status": "confirmed"
      },
      {
        "name": "骨感修身",
        "evidenceLevel": "human_confirmed",
        "status": "confirmed"
      },
      {
        "name": "四向微弹",
        "evidenceLevel": "supplier_declared",
        "status": "confirmed"
      }
    ],
    "recommendedGarments": [
      "通勤修身小西装",
      "职场干练小脚裤",
      "高阶及膝包臀裙",
      "优雅无袖连衣裙"
    ],
    "unsuitableGarments": [
      "超轻跑步背心",
      "羽绒服外壳"
    ],
    "marketFabricType": {
      "value": "罗马布",
      "status": "confirmed",
      "confidence": 0.99
    },
    "specialCrafts": [],
    "reviewStatus": "ready_to_match",
    "completeness": {
      "basic": 100,
      "matching": 100,
      "commercial": 100,
      "overall": 100
    },
    "missingFields": [],
    "conflictFields": [],
    "sources": [],
    "createdAt": "2026-08-08",
    "updatedAt": "2026-08-16"
  }
];

export const INITIAL_FABRICS: FabricMaster[] = RAW_INITIAL_FABRICS.map((fabric) => {
  const supplierInfo = SUPPLIER_CODE_MAP[fabric.supplierName] || {
    shortName: fabric.supplierName.slice(0, 2),
    prefix: 'SP',
  };
  const shortName = fabric.supplierShortName || supplierInfo.shortName;
  const rawCode = fabric.supplierItemCode?.value || fabric.id;
  const cleanCode = rawCode.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || fabric.id.replace('FAB-', '');
  const systemCode = fabric.systemCode || `${supplierInfo.prefix}-${cleanCode}`;

  return {
    ...fabric,
    supplierShortName: shortName,
    systemCode: systemCode,
  };
});
