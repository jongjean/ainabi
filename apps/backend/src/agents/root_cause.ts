import { StagePayload } from '../types';

/**
 * RootCauseAgent: 인과 지도에서 문제의 근본 원인을 식별합니다.
 */
export class RootCauseAgent {
  private model: string = 'claude-3-5-sonnet-20240620'; // 중요 판단은 상위 모델(Claude) 권장

  public async process(causalData: any, domainData: any): Promise<StagePayload> {
    console.log("[RootCauseAgent] Identifying the pivot node (Root Cause)...");

    const prompt = `
      제시된 인과 그래프와 도메인 분석 데이터를 바탕으로, 
      가장 먼저 개입하여 해결해야 할 '핵심 원인' 1가지를 식별하고 그 이유를 설명하세요.
      
      인과 지도: ${JSON.stringify(causalData)}
      도메인 가중치: ${JSON.stringify(domainData)}
    `;

    // TODO: AI가 그래프 노드 중 가중치가 가장 높거나 연결성이 강한 포인트를 선정
    const mockRoot = {
      core_node: "사업 악화",
      rationale: "재무 위기와 부부 갈등의 모든 시발점이 되는 지점이며, 이 고리를 끊지 않으면 다른 도메인의 회복이 불가능함.",
      impact_score: 0.95
    };

    return {
      stage: 'ROOT',
      data: mockRoot,
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
