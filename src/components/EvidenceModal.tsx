import React from 'react';
import { SourceEvidenceItem } from '../types';
import { X, ExternalLink, FileText, Image as ImageIcon, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evidenceItems: SourceEvidenceItem[];
  fieldName?: string;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  title,
  evidenceItems,
  fieldName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 text-white rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                {title}
                {fieldName && (
                  <span className="text-[11px] bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded-full font-mono">
                    字段：{fieldName}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                多模态 OCR 提取原始证据切片与可信度核验
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {evidenceItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">暂无关联的原始切片证据</p>
            </div>
          ) : (
            evidenceItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-zinc-200 text-zinc-800 rounded-lg text-[11px] px-2 font-medium flex items-center gap-1 font-mono">
                      {item.type === 'color_card' ? (
                        <>
                          <ImageIcon className="w-3 h-3" /> 实物色卡
                        </>
                      ) : item.type === 'web_page' ? (
                        <>
                          <ExternalLink className="w-3 h-3" /> 公开网页
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" /> 截图/PDF
                        </>
                      )}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 font-semibold">{item.sourceId}</span>
                    <span className="text-xs text-zinc-800 font-medium truncate max-w-xs">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">{item.extractedAt}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 h-28 flex items-center justify-center group">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        查看原图
                      </span>
                    </div>
                  </div>

                  {/* OCR extracted texts */}
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-[11px] font-bold text-zinc-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-900" />
                      OCR 区域识别切片与文本：
                    </p>
                    <div className="space-y-1.5">
                      {item.ocrSnippets.map((snippet, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white p-2.5 rounded-xl border border-zinc-200 text-xs flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-[11px] shrink-0 font-medium">{snippet.field}:</span>
                            <span className="font-mono text-zinc-900 font-medium">{snippet.text}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 font-mono shrink-0 font-bold">
                            {Math.round(snippet.confidence * 100)}% 置信
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-400">
          <span>所有证据均由 AI 多模态自动对齐并保留来源指纹</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs"
          >
            关闭预览
          </button>
        </div>
      </motion.div>
    </div>
  );
};
