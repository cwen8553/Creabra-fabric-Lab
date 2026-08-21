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
      title: '欢迎查看 Creabra V1 视觉参考',
      subtitle: '面料入库与选料流程导览',
      desc: '本原型使用虚构样例数据，展示资料导入、人工核对、面料检索和服装匹配的主要交互。',
      targetTab: 'dashboard',
      icon: Sparkles,
      actionLabel: '第一步：查看导入收件箱',
      points: [
        '从收件箱开始，按顺序查看每个业务环节',
        '页面展示的结果仅用于开发团队理解交互',
      ],
    },
    {
      title: '步骤 1：导入面料资料',
      subtitle: '资料收件箱 (Inbox)',
      desc: '将网页链接、色卡截图、面料实拍、PDF 或 Excel 放入收件箱，查看整理后的样例结果。',
      targetTab: 'inbox',
      icon: Inbox,
      actionLabel: '第二步：体验同款归组确认',
      points: [
        '检查已导入文件和待处理状态',
        '确认面料名称、货号和基础规格',
      ],
    },
    {
      title: '步骤 2：确认是否为同款',
      subtitle: '同款候选 (Grouping)',
      desc: '查看可能属于同一款面料的资料，由业务人员决定合并或分开保留。',
      targetTab: 'grouping',
      icon: GitMerge,
      actionLabel: '第三步：进入审核工作台',
      points: [
        '对照供应商、货号、规格和原始图片',
        '不确定时保留为待确认，不直接合并',
      ],
    },
    {
      title: '步骤 3：字段核验与冲突仲裁',
      subtitle: '审核工作台 (Review Workbench)',
      desc: '逐款对照原始资料和整理结果，确认已知信息，处理缺失或冲突字段。',
      targetTab: 'review',
      icon: FileCheck,
      actionLabel: '第四步：查看面料墙主档',
      points: [
        '明确区分已确认、待补充、推测和冲突',
        '确认完成后再进入面料库',
      ],
    },
    {
      title: '步骤 4：面料墙卡片检索与多维筛选',
      subtitle: '面料主档数字资产库 (Fabric Wall)',
      desc: '浏览已确认的面料，使用成分、织法、弹性、克重和供应商等条件快速筛选。',
      targetTab: 'fabric_wall',
      icon: Grid,
      actionLabel: '第五步：查看双向选料',
      points: [
        '点击卡片查看图片、颜色和规格',
        '使用筛选和搜索缩小选料范围',
      ],
    },
    {
      title: '步骤 5：面料与服装双向查找',
      subtitle: '面料找衣服 ⇄ 衣服找面料',
      desc: '从真实库存中查看接近的面料或适合的服装方向，并了解已知依据、资料缺口和使用风险。',
      targetTab: 'matching',
      icon: Sparkles,
      actionLabel: '第六步：查看待补充中心',
      points: [
        '真实库存和非库存概念建议分开展示',
        '结果供选款和打样参考，由业务人员最终确认',
      ],
    },
    {
      title: '步骤 6：待补充中心与供应商提交',
      subtitle: '供应链跟进与闭环 (Missing Center & Supplier Portal)',
      desc: '集中查看缺少克重、价格、门幅或成分的面料，按供应商跟进并补齐。',
      targetTab: 'missing_center',
      icon: ClipboardList,
      actionLabel: '完成演示，进入系统',
      points: [
        '按供应商查看待补充项',
        '补充后返回审核工作台再次确认',
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
