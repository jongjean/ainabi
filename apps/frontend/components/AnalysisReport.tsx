'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, Zap } from 'lucide-react';
import CausalGraph from './CausalGraph';

interface AnalysisReportProps {
  analysisResult: any;
}

export default function AnalysisReport({ analysisResult }: AnalysisReportProps) {
  if (!analysisResult) return null;

  return (
    <div className="w-full space-y-24 pb-40">
      {/* RESULT STEP 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3 text-ainabi-blue">
            <LayoutDashboard className="w-5 h-5" />
            <h3 className="text-xs font-black tracking-widest uppercase">STEP 01. 문제 구조 분석</h3>
          </div>
          <div className="metallic-glass rounded-[40px] p-8 min-h-[500px] flex items-center justify-center relative overflow-hidden chrome-border">
            <CausalGraph data={analysisResult.graph} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-ainabi-blue">
              <Target className="w-5 h-5" />
              <h3 className="text-xs font-black tracking-widest uppercase">STEP 02. 영향력 분포</h3>
            </div>
            <div className="metallic-glass rounded-[32px] p-8 space-y-8 chrome-border">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/90 uppercase font-mono">핵심 영역</span>
                <span className="text-2xl font-black text-white liquid-metal">{analysisResult.domain}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(analysisResult.weight || 0) * 100}%` }} className="h-full bg-ainabi-blue shadow-[0_0_15px_#00E5FF]" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-ainabi-blue">
              <Zap className="w-5 h-5" />
              <h3 className="text-xs font-black tracking-widest uppercase">STEP 03. 핵심 인사이트</h3>
            </div>
            <div className="p-8 border-l-2 border-ainabi-blue/30 bg-gradient-to-r from-ainabi-blue/10 to-transparent rounded-r-3xl">
              <p className="text-xl font-light text-white leading-relaxed italic">"{analysisResult.insight}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* RESULT STEP 4, 5, 6: STRATEGY LAYER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ROOT CAUSE */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-4">
          <h4 className="text-[10px] font-bold text-white/80 tracking-widest uppercase">STEP 04. 근본 원인</h4>
          <p className="text-lg font-light text-white leading-relaxed">{analysisResult.rootCause}</p>
        </div>
        
        {/* SOLUTION ORDER */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
          <h4 className="text-[10px] font-bold text-white/80 tracking-widest uppercase">STEP 05. 해결 우선순위</h4>
          <ul className="space-y-4">
            {analysisResult.solutionOrder?.map((item: string, i: number) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="text-ainabi-blue font-mono text-xs">{i + 1}</span>
                <span className="text-sm text-ainabi-silver/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* TODAY'S ACTION */}
        <div className="bg-ainabi-blue rounded-3xl p-8 space-y-4 shadow-[0_0_40px_rgba(163,230,53,0.2)]">
          <h4 className="text-[10px] font-bold text-black/40 tracking-widest uppercase">STEP 06. 오늘의 행동 지침</h4>
          <p className="text-xl font-black text-black leading-tight tracking-tight">{analysisResult.todaysAction}</p>
        </div>
      </div>

      {/* ROADMAP SECTION */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-12 space-y-8">
        <h4 className="text-xs font-black text-ainabi-blue tracking-widest uppercase text-center">전략 로드맵 (Execution Plan)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center">
              <span className="text-[10px] text-white/70 uppercase">Short-term (1W)</span>
              <p className="text-sm text-white/80">{analysisResult.roadmap?.short}</p>
            </div>
            <div className="space-y-4 text-center transform md:scale-110 bg-white/[0.05] p-6 rounded-2xl border border-white/10">
              <span className="text-[10px] text-ainabi-blue uppercase font-bold">Mid-term (1M)</span>
              <p className="text-sm text-white">{analysisResult.roadmap?.mid}</p>
            </div>
            <div className="space-y-4 text-center">
              <span className="text-[10px] text-white/70 uppercase">Long-term (3M+)</span>
              <p className="text-sm text-white/80">{analysisResult.roadmap?.long}</p>
            </div>
        </div>
      </div>

      {/* [NEW] Stage 2: PREMIUM TEASER SECTION */}
      <div className="relative metallic-glass border-2 border-ainabi-blue/20 rounded-[48px] p-16 overflow-hidden group/premium no-print">
        <div className="absolute top-0 right-0 p-8">
            <div className="px-4 py-1 bg-ainabi-blue text-black text-[9px] font-black uppercase rounded-full shadow-[0_0_20px_#00E5FF]">Premium Only</div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white liquid-metal leading-tight">
                  PHASE 02.<br/>
                  실시간 시뮬레이션 및<br/>
                  전문 상담사 개입
                </h3>
                <p className="text-ainabi-silver/90 leading-relaxed font-light">
                  분석을 넘어 실전으로 들어갑니다. 당신의 상황에 맞춘 대화 시뮬레이션과 전담 상담사의 지능형 코칭을 통해 문제를 완전히 종결하세요.
                </p>
              </div>
              
              <button className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase rounded-full hover:bg-ainabi-blue transition-all duration-500 shadow-2xl">
                  프리미엄 상담 패키지 신청하기
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 opacity-50 grayscale group-hover/premium:grayscale-0 group-hover/premium:opacity-100 transition-all duration-1000">
              {[
                { title: 'AI Roleplay', desc: '상대방 반응 예측' },
                { title: 'Step-by-Step', desc: '매일의 스크립트' },
                { title: 'Counselor Connect', desc: '1:1 전문가 검토' },
                { title: 'Neural Report', desc: '심화 심리 대조' }
              ].map((feat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
                    <div className="text-ainabi-blue font-mono text-[9px] uppercase">{feat.title}</div>
                    <div className="text-xs text-white/60 font-medium">{feat.desc}</div>
                </div>
              ))}
            </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-ainabi-blue/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
