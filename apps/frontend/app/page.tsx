'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import RelationCanvas from '../components/RelationCanvas';

export default function LandingPage() {
  // Force scroll to top on refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Navigation handler
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-wrapper">
      <style jsx global>{`
        :root {
            --bg-main: #001233;
            --bg-sub: #001C44;
            --neon-blue: #00E5FF;
            --neon-green: #00FFA3;
            --neon-pink: #FF00E5;
            --text-main: #F1F5F9;
            --text-muted: #94A3B8;
            --glass-bg: rgba(0, 255, 163, 0.03);
            --glass-border: rgba(0, 255, 163, 0.15);
        }

        .landing-wrapper {
            font-family: 'Pretendard', sans-serif;
            background: #000814;
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
            word-break: keep-all;
            min-height: 100vh;
        }

        .bg-layer {
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 15% 15%, rgba(0, 229, 255, 0.15), transparent 45%),
                        radial-gradient(circle at 85% 85%, rgba(0, 255, 163, 0.2), transparent 45%),
                        radial-gradient(circle at 50% 50%, rgba(0, 18, 51, 0.6), rgba(0, 8, 20, 0.8));
            backdrop-filter: blur(1px);
            z-index: 1;
        }

        .butterfly-fixed {
            position: fixed;
            bottom: 5%;
            left: 50%;
            transform: translateX(-50%);
            width: 50%;
            max-width: 500px;
            opacity: 0.9;
            z-index: 0;
            pointer-events: none;
            mix-blend-mode: lighten;
            filter: brightness(1.6) contrast(1.2) saturate(1.2);
        }

        .content-layer {
            position: relative;
            z-index: 10;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .glass {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(12px);
            border-radius: 20px;
        }

        nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
            backdrop-filter: blur(4px);
        }

        @media (min-width: 640px) { nav { padding: 32px; } }

        .logo-box {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid rgba(0, 229, 255, 0.5);
            box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        @media (min-width: 640px) { .logo-box { width: 48px; height: 48px; } }
        .logo-box:hover { transform: scale(1.1); }
        .logo-box img { width: 100%; height: 100%; object-fit: cover; }

        .header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        @media (min-width: 640px) { .header-info { gap: 32px; } }

        .branding {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        .branding h1 {
            font-size: 16px;
            font-weight: 500;
            background: linear-gradient(to right, var(--neon-blue), var(--neon-pink), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            margin: 0;
            display: flex;
            align-items: baseline;
            gap: 6px;
            white-space: nowrap;
            /* Precise width matching for English subtext */
            letter-spacing: 0.02em;
        }
        @media (min-width: 640px) { 
            .branding h1 { font-size: 22px; } 
        }
        .branding h1 .nabi-big {
            font-size: 1.6em;
            font-weight: 900;
            letter-spacing: -0.02em;
            color: #fff;
            -webkit-text-fill-color: #fff; /* Override gradient */
        }
        .branding span {
            display: none;
            font-size: 10px;
            font-family: monospace;
            color: var(--neon-blue);
            text-transform: uppercase;
            letter-spacing: 0.2em;
            opacity: 0.7;
            margin-top: 4px;
            width: 100%;
            white-space: nowrap;
            text-align: justify;
            text-align-last: justify;
        }
        @media (min-width: 640px) { .branding span { display: block; } }

        .login-btn-box {
            padding: 8px 16px;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.05);
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
        }
        .login-btn-box a {
            font-size: 9px;
            font-weight: 700;
            color: var(--neon-blue);
            text-decoration: none;
            letter-spacing: 0.2em;
            transition: transform 0.3s ease;
            display: inline-block;
        }
        @media (min-width: 640px) { .login-btn-box a { font-size: 10px; } }
        .login-btn-box a:hover { transform: scale(1.05); }

        .btn-primary {
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
            color: #000;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            display: inline-block;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
            border: none;
            cursor: pointer;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), 0 0 40px rgba(0, 255, 163, 0.2);
        }

        section {
            padding: 100px 0;
            position: relative;
        }

        .hero {
            padding-top: 180px;
            padding-bottom: 80px;
            text-align: center;
        }

        .hero h2 {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 900;
            margin-bottom: 16px;
            background: linear-gradient(to bottom, #fff, #94A3B8);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
        }

        .hero .subtitle {
            font-size: clamp(16px, 2vw, 22px);
            color: var(--neon-blue);
            font-weight: 600;
            margin-bottom: 50px;
            letter-spacing: 0.1em;
        }

        .hero-questions {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 50px;
        }

        .question-item {
            padding: 24px;
            font-size: 18px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .question-item:last-child { border: none; }

        .hero-desc {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 24px;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .diagram-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 80px;
        }

        .main-flow {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
        }

        .terminal-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
            position: relative;
        }

        .terminal-row::before {
            content: '';
            position: absolute;
            right: 48px;
            top: -20px;
            width: 1px;
            height: 20px;
            background: linear-gradient(to bottom, var(--neon-green), transparent);
            opacity: 0.4;
        }

        .highlight-text {
            background: linear-gradient(to right, var(--neon-blue), var(--neon-pink), var(--neon-green));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 900;
        }

        .node {
            padding: 12px 24px;
            font-size: 13px;
            font-weight: 800;
            border-radius: 12px;
            text-align: center;
            border: 1px solid rgba(0, 255, 163, 0.1);
            background: rgba(0, 255, 163, 0.05);
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .node.active {
            border-color: var(--neon-green);
            color: var(--neon-green);
            background: rgba(0, 255, 163, 0.1);
            box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
            transform: scale(1.1);
        }

        .connector {
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--neon-green), transparent);
            min-width: 20px;
            opacity: 0.6;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 60px;
        }

        .card {
            padding: 40px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(0, 255, 163, 0.1);
        }

        .card h3 {
            font-size: 20px;
            margin-bottom: 20px;
            color: var(--neon-green);
        }

        .card p {
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.7;
        }

        .card:hover {
            border-color: var(--neon-green);
            transform: translateY(-8px);
            background: rgba(0, 255, 163, 0.08);
            box-shadow: 0 10px 30px rgba(0, 255, 163, 0.15);
        }

        .method-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            align-items: center;
        }
        @media (min-width: 768px) {
            .method-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        .method-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .method-item {
            display: flex;
            align-items: center;
            gap: 20px;
            font-size: 18px;
            font-weight: 700;
        }

        .method-dot {
            width: 8px;
            height: 8px;
            background: var(--neon-green);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--neon-green);
            flex-shrink: 0;
        }

        .cta-bottom {
            text-align: center;
            padding-bottom: 120px;
        }

        .cta-bottom h2 {
            font-size: clamp(24px, 4vw, 36px);
            font-weight: 800;
            margin-bottom: 40px;
            line-height: 1.4;
        }

        footer {
            position: relative;
            width: 100%;
            padding: 32px 0;
            text-align: center;
            z-index: 10;
        }

        footer p {
            font-size: 10px;
            font-family: monospace;
            letter-spacing: 0.2em;
            color: #fff;
            text-transform: uppercase;
            font-weight: 700;
            padding: 0 24px;
        }

        .admin-link {
            cursor: pointer;
            transition: color 0.3s ease;
        }
        .admin-link:hover { color: var(--neon-blue); }

        @media (max-width: 768px) {
            section { padding: 60px 0; }
            .hero { padding-top: 140px; }
            .diagram-container { flex-direction: column; align-items: stretch; }
            .connector { width: 1px; height: 30px; margin: 0 auto; }
            .node { width: 100%; }
        }
      `}</style>

      <div className="bg-layer" />
      <img src="/ainabi/butterfly.png" className="butterfly-fixed" alt="Background Butterfly" />

      <div className="content-layer">
        {/* Header Navigation */}
        <nav>
          <div onClick={handleLogoClick} className="logo-box">
            <img src="/ainabi/logo.png" alt="AI상담소 NABI Logo" />
          </div>
          <div className="header-info">
            <div className="branding">
              <h1>지능형 온라인 상담소 <span className="nabi-big">NABI</span></h1>
              <span>Neural Analysis & Behavioral Intelligence</span>
            </div>
            <div className="login-btn-box">
              <Link href="/start">LOGIN</Link>
            </div>
          </div>
        </nav>

        {/* Section 1: Hero */}
        <section className="hero">
          <div className="container">
            <FadeInSection>
              <h2>온라인 상담소 아이나비</h2>
              <div style={{ fontSize: '14px', fontWeight: 200, letterSpacing: '0.8em', color: 'var(--neon-blue)', marginTop: '-10px', marginBottom: '30px', opacity: 0.8, fontFamily: 'monospace' }}>A I N A B I</div>
              <p className="subtitle">복잡한 상황을 정리하고 방향을 잡습니다</p>
            </FadeInSection>
            
            <FadeInSection>
              <div className="glass hero-questions">
                <div className="question-item">무슨 일이 있었나요?</div>
                <div className="question-item">누구와의 문제인가요?</div>
                <div className="question-item">어떻게 여기까지 오게 되었나요?</div>
              </div>
            </FadeInSection>

            <FadeInSection>
              <p style={{ marginBottom: '40px', fontWeight: 300 }}>이 세 가지 질문으로 문제의 구조가 정리됩니다</p>
              
              <div>
                <Link href="/start" className="btn-primary">플랫폼 바로가기</Link>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Section 2: Diagram */}
        <section>
          <div className="container">
            <FadeInSection>
              <h2 style={{ textAlign: 'center', fontSize: '14px', color: 'var(--neon-green)', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '40px', fontWeight: 900 }}>Systemic Flow</h2>
              <div className="diagram-container">
                <div className="main-flow">
                  <div className="node">문제</div>
                  <div className="connector"></div>
                  <div className="node active">3가지 질문</div>
                  <div className="connector"></div>
                  <div className="node">구조 분석</div>
                  <div className="connector"></div>
                  <div className="node">보충자료수집</div>
                  <div className="connector"></div>
                  <div className="node">전략 가이드</div>
                  <div className="connector"></div>
                  <div className="node">실행 지원</div>
                </div>
                <div className="terminal-row">
                  <div className="node">문제 종결</div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Section 3: Services */}
        <section>
          <div className="container">
            <div className="grid-3">
              <FadeInSection>
                <div className="card glass">
                  <h3>기본 플랫폼 상담</h3>
                  <p>AI 신경망 분석을 통해 문제의 핵심 인과관계를 차트로 구현하고 해결 우선순위를 도출합니다.</p>
                </div>
              </FadeInSection>
              <FadeInSection delay={0.2}>
                <div className="card glass">
                  <h3>전문가 협업</h3>
                  <p>이메일, 줌, 방문 상담을 통해 AI 분석 결과에 전문 상담사의 지능형 코칭을 더합니다.</p>
                </div>
              </FadeInSection>
              <FadeInSection delay={0.4}>
                <div className="card glass">
                  <h3>후속 관리</h3>
                  <p>상황 종료 시까지 지속적인 피드백과 단계별 시뮬레이션을 제공하여 실질적인 변화를 만듭니다.</p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Section 4: Method */}
        <section style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="container">
            <FadeInSection>
              <div className="method-grid">
                <div>
                  <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '40px' }}>아이나비의 방식</h2>
                  <div className="method-list">
                    <div className="method-item">
                      <div className="method-dot"></div>
                      <span>구조 중심 : 객관적 관점의 인과관계</span>
                    </div>
                    <div className="method-item">
                      <div className="method-dot"></div>
                      <span>관계 중심 : 역동의 파악과 대응 전략</span>
                    </div>
                    <div className="method-item">
                      <div className="method-dot"></div>
                      <span>실행 중심 : 실전 대화와 구체적 행동</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <RelationCanvas />
                  <p style={{ marginTop: '16px', fontSize: '11px', textAlign: 'center', color: 'var(--neon-blue)', opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Interactive Relation Network</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Section 5: Capabilities */}
        <section>
          <div className="container" style={{ textAlign: 'center' }}>
            <FadeInSection>
              <div className="glass" style={{ padding: '80px 40px', display: 'inline-block', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <h2 style={{ fontSize: '12px', color: 'var(--neon-blue)', letterSpacing: '0.4em', marginBottom: '50px', textTransform: 'uppercase', fontWeight: 900 }}>The Professional Legacy</h2>
                
                <div style={{ marginBottom: '40px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--neon-green)', fontWeight: 700, letterSpacing: '0.2em', display: 'block', marginBottom: '8px' }}>대표 상담사</span>
                  <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', lineHeight: 1 }}>성 주 향</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'left', maxWidth: '700px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: 'var(--neon-blue)', fontSize: '14px', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>Professional Expertise</h4>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontWeight: 300 }}>
                        40년 상담경력의 집약체<br/>
                        (가정 · 성 · 직장 · 군대 · 경영 상담)<br/>
                        국군간호사관학교 10기 (간호사)
                      </p>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: 'var(--neon-blue)', fontSize: '14px', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>Leadership</h4>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontWeight: 300 }}>
                        한국가정법률상담소 울산지부 설립<br/>
                        울산 YWCA 설립
                      </p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--neon-green)', fontSize: '14px', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>Honors</h4>
                      <p style={{ fontSize: '15px', color: '#fff', lineHeight: 1.8, fontWeight: 600 }}>
                        대통령 표장<br/>
                        국민훈장 목련장 수훈<br/>
                        마르퀴즈 후즈 후(Marquis Who's Who) 등재
                      </p>
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontSize: '120px', fontWeight: 900, color: 'rgba(255,255,255,0.02)', pointerEvents: 'none', userSelect: 'none' }}>NABI</div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Section 6: CTA Bottom */}
        <section className="cta-bottom">
          <div className="container">
            <FadeInSection>
              <h2>
                열심히, 최선이 답이 아닙니다.<br/>
                참고, 버티는 것만 능사가 아닙니다.<br/>
                <span className="highlight-text">한번은 구조로 정리해 보셔야 합니다.</span>
              </h2>
              <div>
                <Link href="/start" className="btn-primary">플랫폼 바로가기</Link>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container">
            <p>
              © 2026 나비동행 주식회사. NEURAL ANALYSIS & <Link href="/admin" className="admin-link">B</Link>EHAVIORAL INTELLIGENCE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
    >
      {children}
    </motion.div>
  );
}
