import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Inbox,
  GitMerge,
  FileCheck,
  Grid,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const TourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(0);

  const tourSteps = [
    {
      title: '欢迎体验 Creabra 面料庫 P0 Demo',
      subtitle: '业务全链路交互原型导航',
      desc: '本原型直观展示从多模态资料导入、AI 提取与同款归组，到人工核验、面料墙检索及双向服装匹配的完整闭环。',
      targetTab: 'dashboard',
      icon: Sparkles,
      actionLabel: '第一步：查看导入收件箱',
      points: [
        '基于本地高仿真多模态数据，全流程纯黑白灰 Apple OS26 视觉规范',
        '严谨遵循 P0 业务规则基线（同款聚类阈值、缺失字段处理、内外视图脱敏）',
        '支持随时切换至外部脱敏模式，模拟嵌入 AI 生成环境',
      ],
    },
    {
      title: '步骤 1：多源导入与 AI 提取',
      subtitle: '资料收件箱 (Inbox)',
      desc: '支持批量导入公开网页链接、色卡截图、面料实拍、PDF产品册及 Excel 供应商清单。系统模拟实时流水线：OCR文字提取、图像特征向量分析与结构化字段映射。',
      targetTab: 'inbox',
      icon: Inbox,
      actionLabel: '第二步：体验同款归组确认',
      points: [
        '可点击“一键模拟执行 AI 解析”查看进度条与提取完成状态',
        '自动识别多色款式，聚合到统一母款',
      ],
    },
    {
      title: '步骤 2：同款归组确认与聚类',
      subtitle: '多模态多来源聚合 (Grouping)',
      desc: '解决多来源重复建档难题。系统将同一供应商货号或高度相似的色卡与网页聚合为候选包。',
      targetTab: 'grouping',
      icon: GitMerge,
      actionLabel: '第三步：进入审核工作台',
      points: [
        '≥85% 自动归组为同款主档并提取多色款式',
        '60%~84% 标记为疑似同款，强制人工审核',
        '<60% 拒绝合并，保留为独立草稿候选',
      ],
    },
    {
      title: '步骤 3：字段核验与冲突仲裁',
      subtitle: '审核工作台 (Review Workbench)',
      desc: '业务人员逐款核对 AI 提取结果。左侧调阅原始色卡切片与证据，中间查看带置信度与状态标签的物理字段，右侧直接进行多来源冲突仲裁。',
      targetTab: 'review',
      icon: FileCheck,
      actionLabel: '第四步：查看面料墙主档',
      points: [
        '支持一键采纳冲突来源 A 或来源 B',
        '支持标明“已确认 / 待确认 / 待补充 / AI推测 / 存在冲突”',
        '确认后赋予不可篡改的可信度标签并入库',
      ],
    },
    {
      title: '步骤 4：面料墙卡片检索与多维筛选',
      subtitle: '面料主档数字资产库 (Fabric Wall)',
      desc: '直观浏览已收录的所有面料。支持按纤维成分、织法、透明度、弹性、克重区间、主色系、审核状态及完整度进行深度交叉过滤。',
      targetTab: 'fabric_wall',
      icon: Grid,
      actionLabel: '第五步：体验双向智能匹配',
      points: [
        '点击卡片可查看完整面料大图、多颜色色卡切换及证据存证',
        '支持切换右上角【外部脱敏视图】测试敏感价格隐蔽效果',
      ],
    },
    {
      title: '步骤 5：双向智能服装匹配',
      subtitle: '面料找衣服 ⇄ 衣服找面料 (Smart Matching)',
      desc: '企划核心工具：既可由面料反推适用品类与物理禁忌，也可设定服装企划诉求，由 6 维权重模型即时打分排序。',
      targetTab: 'matching',
      icon: Sparkles,
      actionLabel: '第六步：查看待补充中心',
      points: [
        '推荐结果明确区分已确认依据、AI 推测边界与工艺风险',
        '若现有库存存在缺口，底部自动生成【AI概念面料参数】与采购询盘 Prompt',
      ],
    },
    {
      title: '步骤 6：待补充中心与供应商提交',
      subtitle: '供应链跟进与闭环 (Missing Center & Supplier Portal)',
      desc: '集中管理缺失克重、价格等关键字段的面料。自动生成针对供应商的微信沟通话术，并可一键导出 Excel 补充清单；同时提供标准化供应商 3 分钟在线录入入口。',
      targetTab: 'missing_center',
      icon: ClipboardList,
      actionLabel: '完成演示，进入系统',
      points: [
        '支持一键复制微信催单询盘话术',
        '支持模拟供应商资料回函流转回审核工作台',
      ],
    },
  ];

  const currentStep = tourSteps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    onNavigate(currentStep.targetTab);
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      onNavigate(tourSteps[step - 1].targetTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-950 text-white">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono block">
                {step + 1} / {tourSteps.length} 步骤导览
              </span>
              <h2 className="text-sm font-bold text-zinc-900">{currentStep.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-zinc-600">
          <div className="space-y-1">
            <span className="text-zinc-950 font-bold font-mono text-xs">{currentStep.subtitle}</span>
            <p className="text-zinc-600 text-xs leading-relaxed">{currentStep.desc}</p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
            <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              本环节核心交互要点：
            </span>
            <div className="space-y-1.5">
              {currentStep.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-zinc-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handlePrev}
            disabled={step === 0}
            className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-950 disabled:opacity-30 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 上一步
          </motion.button>

          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-zinc-950' : 'w-1.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleNext}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
