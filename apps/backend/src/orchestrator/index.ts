import { Stage, SessionState, StagePayload } from '../types';
import { IntakeAgent } from '../agents/intake';
import { CausalAgent } from '../agents/causal';
import { DomainAgent } from '../agents/domain';
import { StrategyAgent } from '../agents/strategy';
import { ValidationFirewall } from '../validation/firewall';

export class Orchestrator {
  private state: SessionState;
  private intakeAgent: IntakeAgent;
  private causalAgent: CausalAgent;
  private domainAgent: DomainAgent;
  private strategyAgent: StrategyAgent;
  private firewall: ValidationFirewall;

  constructor(initialState: SessionState) {
    this.state = initialState;
    this.intakeAgent = new IntakeAgent();
    this.causalAgent = new CausalAgent();
    this.domainAgent = new DomainAgent();
    this.strategyAgent = new StrategyAgent();
    this.firewall = new ValidationFirewall();
  }

  /**
   * 8단계 설문 데이터를 기반으로 전체 분석 파이프라인(1~6단계 결과 도출)을 완주합니다.
   */
  public async runFullPipeline(surveyData: any): Promise<any> {
    const context = this.formatSurveyContext(surveyData);
    console.log("[Orchestrator] Executing Full Analysis Pipeline...");
    
    // 1. INTAKE (상황 파악)
    const intakeResult = await this.intakeAgent.process(context);
    
    // 2. CAUSAL (인과 보강)
    const causalResult = await this.causalAgent.process(intakeResult.data);

    // 3. DOMAIN (영역 가중치)
    const domainResult = await this.domainAgent.process(causalResult.data);

    // 4. STRATEGY (핵심원인/로드맵/행동)
    // 이전 모든 결과를 취합하여 전달
    const strategyResult = await this.strategyAgent.process({
      intake: intakeResult.data,
      causal: causalResult.data,
      domain: domainResult.data
    });

    this.state.currentStage = 'DOMAIN';

    return {
      success: true,
      data: {
        intake: intakeResult.data,
        causal: causalResult.data,
        domain: domainResult.data,
        strategy: strategyResult.data
      }
    };
  }

  /**
   * 설문 데이터를 분석용 텍스트 컨텍스트로 변환
   */
  private formatSurveyContext(data: any): string {
    return `
[상담 대상 상황 요약]
- 영역: ${data.category || '미지정'}
- 대상: ${data.target || '미지정'}
- 유형: ${Array.isArray(data.types) ? data.types.join(', ') : '미지정'}
- 기간: ${data.period || '알 수 없음'}
- 심각도: ${data.severity || '보통'}
- 영향: ${Array.isArray(data.impact) ? data.impact.join(', ') : '미지정'}
- 대응: ${data.response || '없음'}

[상세 서술내용]
${data.description || '내용 없음'}
    `.trim();
  }

  public async runNextStage(rawInput: any): Promise<StagePayload | null> {
    // 하위 호환성을 위해 유지 (단일 단계 실행용)
    return null; 
  }

  public getState(): SessionState {
    return this.state;
  }
}
