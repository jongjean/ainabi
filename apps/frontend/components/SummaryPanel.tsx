'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, HelpCircle, AlertCircle } from 'lucide-react';

interface SummaryData {
  category?: string;
  target?: string;
  types?: string[];
  period?: string;
  severity?: string;
}

interface SummaryPanelProps {
  data: SummaryData;
  active: boolean;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ data, active }) => {
  if (!active) return null;

  const items = [
    { label: '분석 영역', value: data.category, icon: <HelpCircle className="w-3 h-3" /> },
    { label: '대상', value: data.target, icon: <User className="w-3 h-3" /> },
    { label: '문제 유형', value: data.types?.join(', '), icon: <AlertCircle className="w-3 h-3" /> },
    { label: '기간', value: data.period, icon: <CheckCircle2 className="w-3 h-3" /> },
    { label: '심각도', value: data.severity, icon: <AlertCircle className="w-3 h-3" /> },
  ].filter(item => item.value);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-8 top-1/2 -translate-y-1/2 w-72 hidden xl:block"
    >
      <div className="metallic-glass chrome-border rounded-[32px] p-8 space-y-8 backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle Watermark inside Panel */}
        <img src="/images/butterfly.png" alt="" className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 grayscale filter" />
        <div className="space-y-1">
          <h3 className="text-xs font-bold tracking-widest text-ainabi-blue uppercase">실시간 요약</h3>
          <p className="text-[10px] text-white opacity-60 uppercase tracking-tighter">Current Diagnosis Context</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-2 text-white opacity-70 uppercase text-[9px] font-bold tracking-widest">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <p className="text-sm font-light text-white/90 truncate">{item.value}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <p className="text-xs text-white opacity-40 italic py-10 text-center">선택 시 요약이 표시됩니다</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryPanel;
