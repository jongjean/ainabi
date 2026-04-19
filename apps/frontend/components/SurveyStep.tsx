'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface SurveyStepProps {
  question: string;
  description?: string;
  type: 'radio' | 'checkbox' | 'textarea';
  options?: Option[];
  value: any;
  onChange: (value: any) => void;
}

const SurveyStep: React.FC<SurveyStepProps> = ({
  question,
  description,
  type,
  options,
  value,
  onChange,
}) => {
  // Local state to manage the custom text for 'Other' option
  const [customText, setCustomText] = useState('');

  // Synchronize local custom text with external value
  useEffect(() => {
    if (type === 'radio' && typeof value === 'string' && value.startsWith('기타:')) {
      setCustomText(value.split('기타:')[1] || '');
    } else if (type === 'checkbox' && Array.isArray(value)) {
      const otherVal = value.find(v => v.startsWith('기타:'));
      if (otherVal) setCustomText(otherVal.split('기타:')[1] || '');
    }
  }, [value, type]);

  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
    if (type === 'radio') {
      onChange(`기타:${text}`);
    } else {
      const current = Array.isArray(value) ? value : [];
      const filtered = current.filter(v => !v.startsWith('기타'));
      onChange([...filtered, `기타:${text}`]);
    }
  };

  const toggleCheckbox = (val: string) => {
    const current = Array.isArray(value) ? value : [];
    if (current.some(v => v === val || (v.startsWith('기타') && val === '기타'))) {
      onChange(current.filter((v: string) => v !== val && !v.startsWith('기타:')));
    } else {
      onChange([...current, val === '기타' ? `기타:${customText}` : val]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-2xl mx-auto space-y-12 py-10 metallic-glass p-12 rounded-[40px] chrome-border"
    >
      <div className="space-y-4 text-center">
        {/* Adjusted question font size and break behavior */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-ainabi-blue via-ainabi-pink to-ainabi-green leading-snug tracking-tight pb-2 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {question}
        </h2>
        {description && (
          /* Using whitespace-pre-wrap to respect \n */
          <p className="text-white text-base md:text-lg font-medium opacity-90 drop-shadow-md whitespace-pre-wrap break-keep">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {type === 'radio' && options?.map((opt) => {
          const isOther = opt.value === '기타';
          const isSelected = isOther ? (typeof value === 'string' && value.startsWith('기타')) : (value === opt.value);
          
          return (
            <div key={opt.value} className="flex flex-col gap-3">
              <button
                onClick={() => onChange(isOther ? `기타:${customText}` : opt.value)}
                className={`group relative w-full p-6 rounded-[24px] border transition-all duration-500 text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-ainabi-blue/15 border-ainabi-blue/50 text-white shadow-[0_0_30px_rgba(0,229,255,0.2)] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white hover:border-white/40 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-lg font-medium">{opt.label}</span>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isSelected ? 'bg-ainabi-blue scale-125 shadow-[0_0_10px_#00E5FF]' : 'bg-white/30'
                }`} />
              </button>
              
              <AnimatePresence>
                {isSelected && isOther && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input 
                      type="text" 
                      placeholder="내용을 구체적으로 입력해주세요" 
                      autoFocus
                      value={customText}
                      onChange={(e) => handleCustomTextChange(e.target.value)}
                      className="w-full p-5 bg-white/[0.05] border border-ainabi-blue/30 rounded-[20px] text-white focus:outline-none focus:border-ainabi-blue focus:shadow-[0_0_15px_rgba(0,229,255,0.2)] placeholder:text-white/20 transition-all font-light"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {type === 'checkbox' && options?.map((opt) => {
          const isOther = opt.value === '기타';
          const isSelected = Array.isArray(value) && value.some(v => v === opt.value || (isOther && v.startsWith('기타:')));
          
          return (
            <div key={opt.value} className="flex flex-col gap-3">
              <button
                onClick={() => toggleCheckbox(opt.value)}
                className={`group relative w-full p-6 rounded-[24px] border transition-all duration-500 text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-ainabi-blue/15 border-ainabi-blue/50 text-white shadow-[0_0_30px_rgba(0,229,255,0.2)] scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white hover:border-white/40 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-lg font-medium">{opt.label}</span>
                <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                  isSelected ? 'bg-ainabi-blue border-ainabi-blue' : 'border-white/30'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-black" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isSelected && isOther && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input 
                      type="text" 
                      placeholder="내용을 구체적으로 입력해주세요" 
                      autoFocus
                      value={customText}
                      onChange={(e) => handleCustomTextChange(e.target.value)}
                      className="w-full p-5 bg-white/[0.05] border border-ainabi-blue/30 rounded-[20px] text-white focus:outline-none focus:border-ainabi-blue focus:shadow-[0_0_15px_rgba(0,229,255,0.2)] placeholder:text-white/20 transition-all font-light"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {type === 'textarea' && (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="상황을 구체적으로 적어주실수록 AI가 핵심을 더 정확히 짚어냅니다..."
            className="w-full h-80 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-xl font-light leading-relaxed focus:outline-none focus:border-ainabi-blue/40 focus:bg-white/[0.05] transition-all duration-500 resize-none placeholder:text-white/10 break-keep"
          />
        )}
      </div>
    </motion.div>
  );
};

export default SurveyStep;
