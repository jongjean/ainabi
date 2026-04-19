'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, ArrowLeft, LayoutDashboard, Target, Zap } from 'lucide-react';
import SurveyStep from '../../components/SurveyStep';
import SummaryPanel from '../../components/SummaryPanel';
import CausalGraph from '../../components/CausalGraph';
import AnalysisReport from '../../components/AnalysisReport';
import { AuthModal } from '../../components/AuthModal';
import { useEffect } from 'react';

export default function Home() {
  // Force scroll to top on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const [currentStage, setCurrentStage] = useState('READY'); 
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [surveyData, setSurveyData] = useState<any>({
    category: '',
    target: '',
    types: [],
    period: '',
    severity: '',
    impact: [],
    response: '',
    description: ''
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const isAnalyzing = useRef(false);

  // 세션 복구 및 초기화 로직
  useEffect(() => {
    const savedToken = localStorage.getItem('ainabi_token');
    const savedUser = localStorage.getItem('ainabi_user');
    const savedSessionId = localStorage.getItem('ainabi_session_id');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    if (savedSessionId) {
      // 서버에서 실시간 스냅샷 조회하여 복구
      fetch(`/ainabi-api/session/${savedSessionId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.status === 'in_progress' && result.snapshot) {
            const snap = result.snapshot;
            setSessionId(savedSessionId);
            setSurveyData({
              ...snap.context,
              ...snap.structure,
              ...snap.depth,
              description: snap.narrative
            });
            // 마지막 응답한 단계 다음으로 단계 설정 (간단히 채워진 데이터 수로 판별 가능하지만, 
            // 여기서는 스냅샷이 존재하면 최소 1단계는 한 것으로 보고 진행)
            setCurrentStage('STEP');
            // 채워진 필드 검사하여 단계 추론 로직 (생략 가능, 1단계부터 보여줘도 데이터는 프리필 되어 있음)

          } else {
            localStorage.removeItem('ainabi_session_id');
          }
        })
        .catch(err => console.error("세션 복구 로드 실패:", err));
    }
  }, []);

  const [isStarting, setIsStarting] = useState(false);

  const handleAuthSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('ainabi_token', newToken);
    localStorage.setItem('ainabi_user', JSON.stringify(newUser));
  };

  const handleStartProcess = async () => {
    if (isStarting) return;
    
    // [DRY] Reset all survey states immediately to ensure a clean start
    const resetSurvey = () => {
      setCurrentStep(1);
      setSurveyData({
        category: '',
        target: '',
        types: [],
        period: '',
        severity: '',
        impact: [],
        response: '',
        description: ''
      });
      setAnalysisResult(null);
    };

    setIsStarting(true);
    resetSurvey(); // Reset before API call to be safe

    try {
      const resp = await fetch('/ainabi-api/session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const result = await resp.json();
      if (result.success) {
        setSessionId(result.sessionId);
        localStorage.setItem('ainabi_session_id', result.sessionId);
        setCurrentStage('STEP');
      } else {
        throw new Error(result.error || "세션 생성 실패");
      }
    } catch (err) {
      console.error("세션 생성 실패:", err);
      // Even if session creation fails, we allow starting (offline-ish or retry logic)
      // but ensure we are at step 1.
      setCurrentStage('STEP');
    } finally {
      setIsStarting(false);
    }
  };

  // 설문 문항 구성 (사용자 시나리오 기반 MECE 개편)
  const steps = [
    {
      id: 1,
      question: "무슨 문제가 있습니까?",
      description: "문제를 구조화하는 첫 번째 단계입니다.",
      type: 'radio',
      key: 'category',
      options: [
        { label: '개인/심리', value: '심리' },
        { label: '사람/관계', value: '관계' },
        { label: '재무/경제', value: '재무' },
        { label: '직장/사업', value: '직장' },
        { label: '잘 모르겠다', value: '모름' }
      ]
    },
    {
      id: 2,
      question: "누구(무엇)와의 문제(관계)인가요?",
      description: "문제의 대상을 명확히 함으로써 인과관계의 정밀도를 높입니다.",
      type: 'radio',
      key: 'target',
      options: surveyData.category === '심리' 
        ? [
            { label: '나 자신 (정체성/방향)', value: '나자신' },
            { label: '감정/스트레스', value: '감정스트레스' },
            { label: '성격/습관', value: '성격습관' },
            { label: '불안/우울/무기력', value: '불안우울' },
            { label: '동기/의욕', value: '동기의욕' },
            { label: '자기관리 (생활, 루틴)', value: '자기관리' },
            { label: '건강/컨디션', value: '건강' },
            { label: '그외', value: '기타' }
          ]
        : surveyData.category === '관계'
        ? [
            { label: '배우자/연인', value: '배우자연인' },
            { label: '가족/친지', value: '가족' },
            { label: '자녀', value: '자녀' },
            { label: '친구/지인', value: '지인' },
            { label: '상사/동료', value: '상사동료' },
            { label: '갈등/소통 문제', value: '소통' },
            { label: '신뢰/배신', value: '신뢰' },
            { label: '그외', value: '기타' }
          ]
        : surveyData.category === '재무'
        ? [
            { label: '급여/소득', value: '급여소득' },
            { label: '매출/수익', value: '매출수익' },
            { label: '지출/관리', value: '지출관리' },
            { label: '부채/대출', value: '부채대출' },
            { label: '투자/자산', value: '투자자산' },
            { label: '세금/노무', value: '세무노무' },
            { label: '자금 운영', value: '자금운영' },
            { label: '그외', value: '기타' }
          ]
        : surveyData.category === '직장'
        ? [
            { label: '업무 스트레스', value: '업무스트레스' },
            { label: '조직 문제', value: '조직' },
            { label: '고객/거래처', value: '고객거래처' },
            { label: '사업 운영', value: '사업운영' },
            { label: '성과/매출 구조', value: '성과구조' },
            { label: '진로/이직', value: '진로이직' },
            { label: '불법/부당 상황', value: '부당' },
            { label: '그외', value: '기타' }
          ]
        : [
            { label: '나 자신', value: '자기' },
            { label: '조직/회사', value: '조직' },
            { label: '시장/고객', value: '시장' },
            { label: '가족/지인', value: '가족지인' },
            { label: '그외', value: '기타' }
          ]
    },
    {
      id: 3,
      question: "다른 영역도 영향을 받고 있나요?",
      description: "복합적인 상황일수록 더 입체적인 분석이 가능합니다.",
      type: 'checkbox',
      key: 'impact',
      options: [
        { label: '관계 (사람과 갈등)', value: '관계' },
        { label: '재무 (금전적 손실)', value: '재무' },
        { label: '심리 (정신적 고통)', value: '심리' },
        { label: '사업 (업무상 지장)', value: '사업' },
        { label: '그외', value: '기타' }
      ]
    },
    {
      id: 4,
      question: "어떤 유형의 불편함이 있나요?",
      description: "복수 선택이 가능합니다. 문제의 조각들을 모두 알려주세요.",
      type: 'checkbox',
      key: 'types',
      options: [
        { label: '대화 부족/단절', value: '대화' },
        { label: '신뢰 문제', value: '신뢰' },
        { label: '경제적 갈등', value: '경제' },
        { label: '성격/가치관 차이', value: '가치관' },
        { label: '감정적 폭발/다툼', value: '다툼' },
        { label: '미래에 대한 불안', value: '불안' },
        { label: '그외', value: '기타' }
      ]
    },
    {
      id: 5,
      question: "문제는 언제부터 시작되었나요?",
      type: 'radio',
      key: 'period',
      options: [
        { label: '최근(1개월 이내)', value: '최근' },
        { label: '1~3개월', value: '단기' },
        { label: '3~6개월', value: '중기' },
        { label: '6개월~1년', value: '장기' },
        { label: '1년 이상', value: '고질적' },
        { label: '10년 이상', value: '10년이상' }
      ]
    },
    {
      id: 6,
      question: "현재 상황은 어느 정도로 심각한가요?",
      type: 'radio',
      key: 'severity',
      options: [
        { label: '가벼운 스트레스', value: '경미' },
        { label: '지속적인 불편함', value: '보통' },
        { label: '상당히 고통스러움', value: '심각' },
        { label: '관계/상황 붕괴 직전', value: '임계' },
        { label: '그외', value: '기타' }
      ]
    },
    {
      id: 7,
      question: "지금까지 어떻게 대응해 오셨나요?",
      type: 'radio',
      key: 'response',
      options: [
        { label: '그냥 참고 있음', value: '인내' },
        { label: '대화를 시도함', value: '노력' },
        { label: '전문가 상담 시도', value: '도움' },
        { label: '갈등 반복/폭발', value: '갈등' },
        { label: '회피/포기 상태', value: '포기' },
        { label: '그외', value: '기타' }
      ]
    },
    {
      id: 8,
      question: "자유롭게 하고 싶은 말 무엇이건 적어주세요.",
      description: "사건의 맥락과 감정을 자유롭게 서술해 주세요.\n\nAI 상담의 핵심 데이터가 됩니다.",
      type: 'textarea',
      key: 'description'
    }
  ];

  const handleNext = async () => {
    const currentStepConfig = steps[currentStep - 1];
    const stepData = { [currentStepConfig.key]: surveyData[currentStepConfig.key] };

    if (sessionId) {
      setIsSavingStep(true);
      try {
        await fetch(`/ainabi-api/session/${sessionId}/step`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: currentStep,
            data: stepData
          })
        });
      } catch (err) {
        console.error("단계 저장 실패:", err);
      } finally {
        setIsSavingStep(false);
      }
    }

    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleAnalyze();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setCurrentStage('READY');
    }
  };

  const handleAnalyze = async () => {
    if (isAnalyzing.current) return;
    
    isAnalyzing.current = true;
    setCurrentStage('ANALYZING');

    try {
      const resp = await fetch('/ainabi-api/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          surveyData, 
          sessionId
        })
      });
      
      const result = await resp.json();
      if (result.success) {
        // 분석 성공 시 세션 클리어
        localStorage.removeItem('ainabi_session_id');
        setSessionId(null);

        const { causal, domain, strategy } = result.data;
        setAnalysisResult({
          insight: causal.insight,
          graph: causal.graph,
          domain: domain.domain,
          weight: domain.weight || 0.8,
          // 전략 데이터 매핑
          rootCause: strategy.root_cause,
          solutionOrder: strategy.solution_order,
          roadmap: strategy.roadmap,
          todaysAction: strategy.todays_action
        });
        setCurrentStage('RESULT');
      } else {
        throw new Error(result.error || "분석 실패");
      }
    } catch (err) {
      console.error("분석 에러:", err);
      setCurrentStage('STEP');
      setCurrentStep(8);
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      isAnalyzing.current = false;
    }
  };

  const updateSurveyData = (key: string, val: any) => {
    setSurveyData((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-ainabi-silver font-sans selection:bg-ainabi-blue/30 overflow-x-hidden relative flex flex-col">
      {/* [NEW] Cyber Scanline Overlay */}
      <div className="scanline-overlay" />

      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 px-4 py-4 sm:p-8 flex justify-between items-center bg-gradient-to-b from-black/95 to-transparent backdrop-blur-sm">
        {/* LEFT: Logo (Flat butterfly masked to circle) */}
        <div onClick={() => window.location.href = '/ainabi/'} className="flex items-center cursor-pointer group shrink-0">
          <motion.div 
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="w-10 h-10 sm:w-12 sm:h-12 relative rounded-full overflow-hidden border border-ainabi-blue/50 shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-110 transition-transform"
          >
            <img src="/ainabi/logo.png" alt="AI상담소 NABI Logo" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* RIGHT: Typography + Menu */}
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="flex flex-col text-right items-end">
            <h1 className="text-base sm:text-lg md:text-[22px] font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-ainabi-blue via-ainabi-pink to-ainabi-green leading-none flex items-baseline gap-2 whitespace-nowrap">
              지능형 온라인 상담소 <span className="text-2xl sm:text-3xl md:text-[35.2px] font-black text-[#fff] [text-fill-color:white] [-webkit-text-fill-color:white]">NABI</span>
            </h1>
            <span className="hidden sm:block text-[10px] font-mono text-ainabi-blue tracking-[0.2em] uppercase opacity-70 mt-1 w-full text-justify text-last-justify whitespace-nowrap">Neural Analysis & Behavioral Intelligence</span>
          </div>
          
          <div className="flex items-center px-4 sm:px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-[9px] sm:text-[10px] font-bold text-ainabi-blue uppercase tracking-widest truncate max-w-[60px] sm:max-w-none">{user.username}</span>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="text-[8px] sm:text-[9px] text-white/70 hover:text-white uppercase border-l border-white/10 pl-2 sm:pl-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[9px] sm:text-[10px] font-bold text-ainabi-blue uppercase tracking-widest hover:scale-105 transition-transform"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-32 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStage === 'READY' && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12"
            >
              <div className="space-y-6 flex flex-col items-center relative w-full">
                {/* [NEW] Main Butterfly Graphic (Responsive up to 512px) */}
                <div className="w-full max-w-[512px] aspect-square flex items-center justify-center relative -mb-16 -mt-10 mix-blend-screen opacity-90 z-0 pointer-events-none">
                  <div className="absolute inset-0 bg-ainabi-blue/5 rounded-full blur-[100px]" />
                  <img src="/ainabi/butterfly.png" alt="Cyber Butterfly Main" className="w-full h-full object-contain" />
                </div>

                <h2 className="relative z-10 w-full text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-mono font-black leading-[1.3] md:leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-ainabi-silver to-white/50 text-center break-keep px-2">
                  지금 당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-ainabi-blue via-ainabi-pink to-ainabi-green">어려움</span>을<br className="hidden sm:block"/>
                  <span className="sm:hidden"> </span>AI 신경망으로 분석해 드립니다.
                </h2>
                <p className="max-w-xl mx-auto text-ainabi-blue/80 text-sm md:text-lg font-mono font-medium leading-relaxed mt-6 tracking-wide break-keep px-4">
                  단순한 상담이 아닙니다. 문제의 인과관계를 차트로 구현하고 <br className="hidden sm:block"/>
                  최적의 행동 경로를 설계하는 AI 데이터 경험입니다.
                </p>
              </div>
              <button 
                onClick={handleStartProcess}
                className="relative mt-12 px-12 py-6 bg-gradient-to-r from-ainabi-blue via-ainabi-pink to-ainabi-green text-black font-black rounded-full hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] hover:scale-105 transition-all duration-500 flex items-center gap-4 mx-auto text-lg border cursor-pointer z-10"
              >
                <span className="relative z-10 uppercase tracking-widest">분석 파이프라인 가동</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </button>
            </motion.div>
          )}

          {currentStage === 'STEP' && (
            <motion.div 
              key="step"
              className="w-full flex flex-col items-center"
            >
              {/* Progress Tracker (Slim) & Navigation */}
              <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center gap-6 mb-6">
                   <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(currentStep / 8) * 100}%` }}
                         className="h-full bg-ainabi-blue shadow-[0_0_10px_#00E5FF]"
                      />
                   </div>
                   <span className="text-[10px] font-mono text-ainabi-blue tracking-widest uppercase">{currentStep} / 8</span>
                </div>
                
                {/* 이전 단계 버튼 (위치 이동) */}
                <div className="flex justify-start">
                   <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-white/80 hover:text-ainabi-green transition-colors text-sm font-bold tracking-widest uppercase"
                   >
                     <ArrowLeft className="w-4 h-4" />
                     {currentStep === 1 ? '처음으로 돌아가기' : '이전 단계'}
                   </button>
                </div>
              </div>

              {/* Main Survey Card */}
              <SurveyStep 
                question={steps[currentStep-1].question}
                description={steps[currentStep-1].description}
                type={steps[currentStep-1].type as any}
                options={steps[currentStep-1].options}
                value={surveyData[steps[currentStep-1].key]}
                onChange={(val) => updateSurveyData(steps[currentStep-1].key, val)}
              />

              {/* [NEW] Primary Global CTA - 다음 단계 분석 단추 */}
              <div className="mt-16 w-full max-w-2xl space-y-6">
                 <button 
                  onClick={handleNext}
                  disabled={isSavingStep || !surveyData[steps[currentStep-1].key] || (Array.isArray(surveyData[steps[currentStep-1].key]) && surveyData[steps[currentStep-1].key].length === 0)}
                  className="group relative w-full py-8 bg-white text-black text-xl font-black uppercase rounded-3xl hover:bg-ainabi-blue transition-all duration-500 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] disabled:opacity-30 transition-transform active:scale-95"
                >
                  <div className="relative z-10 flex items-center justify-center gap-4">
                     <span>{isSavingStep ? (
                       <span className="flex items-center gap-2">
                         <Activity className="w-6 h-6 animate-spin" />
                         데이터 동기화 중...
                       </span>
                     ) : (
                       currentStep === 8 ? 'AI 인과관계 분석 실행' : '다음 단계로'
                     )}</span>
                     {!isSavingStep && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
                <p className="text-center mt-6 text-[10px] font-mono text-white/60 uppercase tracking-[0.5em]">Neural Path Analysis Proceeding</p>
              </div>
            </motion.div>
          )}

          {currentStage === 'ANALYZING' && (
            <motion.div 
              key="analyzing"
              className="flex flex-col items-center justify-center p-20 space-y-10"
            >
              <div className="relative">
                <Activity className="w-16 h-16 text-ainabi-blue animate-spin-slow" />
                <div className="absolute inset-0 scale-150 blur-3xl bg-ainabi-blue/10 rounded-full"></div>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-white font-mono text-xl tracking-[0.5em] uppercase animate-pulse">Computing Path...</p>
                <p className="text-ainabi-silver/80 text-xs font-light">문제의 인과 구조를 수학적으로 파악하는 중입니다.</p>
              </div>
            </motion.div>
          )}

          {currentStage === 'RESULT' && analysisResult && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <AnalysisReport analysisResult={analysisResult} />

              <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8">
                <p className="text-white/70 text-[10px] font-mono tracking-[1em] uppercase md:mr-auto">End of Analysis v.1.5</p>
                
                <button 
                  onClick={() => {
                    if (!token) {
                      setIsAuthModalOpen(true);
                    } else {
                      window.print();
                    }
                  }}
                  className="px-10 py-5 bg-ainabi-blue text-black text-[10px] font-black tracking-widest uppercase rounded-full hover:shadow-[0_0_20px_#00E5FF] transition-all flex items-center gap-3 group/btn relative overflow-hidden"
                >
                  <Activity className="w-4 h-4" />
                  <span>{token ? 'Export Report to PDF' : 'Save & Export Report (Premium)'}</span>
                  {!token && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />}
                </button>

                <button 
                  onClick={() => {
                    setCurrentStage('READY');
                    setCurrentStep(1);
                    setSurveyData({ category: '', target: '', types: [], period: '', severity: '', impact: [], response: '', description: '' });
                  }}
                  className="px-10 py-5 text-[10px] font-black tracking-widest text-white/90 hover:text-white transition-all border border-white/10 rounded-full hover:bg-white/5 uppercase"
                >
                  Restart New Discovery
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SUMMARY SIDEBAR */}
      <SummaryPanel 
        data={surveyData} 
        active={currentStage === 'STEP'} 
      />

      <footer className="relative w-full py-8 text-center z-10 mt-auto">
        <p className="text-[10px] font-mono tracking-[0.2em] text-white uppercase drop-shadow-md font-bold px-4 pointer-events-none">
          © 2026 나비동행 주식회사. NEURAL ANALYSIS & <span onClick={() => window.location.href='/ainabi/admin'} className="cursor-default pointer-events-auto hover:text-white/80 transition-colors">B</span>EHAVIORAL INTELLIGENCE. ALL RIGHTS RESERVED.
        </p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}
