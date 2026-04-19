import { StagePayload } from '../types';
import { AIUtil } from '../utils/ai';

export class StrategyAgent {
  private model: string = 'deepseek-chat';

  public async process(context: any): Promise<StagePayload> {
    console.log("[StrategyAgent] Formulating execution roadmap...");
    
    const systemPrompt = `
      당신은 인생의 위기를 구조적으로 해결하는 최고의 전략 컨설턴트(Strategist)입니다.
      이전 단계의 분석 결과(인과관계, 핵심도메인 등)를 바탕으로 사용자에게 실질적인 '탈출구'를 제시하십시오.
      
      [분석 목표]
      1. root_cause: 문제의 기저에 깔린 가장 근본적인 심리적/구조적 원인을 단정적으로 추출하십시오.
      2. solution_order: 해결을 위해 먼저 건드려야 할 우선순위 리스트(3단계)를 작성하십시오.
      3. roadmap: 단기(1주), 중기(1개월), 장기(3개월)로 이어지는 단계적 로드맵을 작성하십시오.
      4. todays_action: 지금 당장, 아주 작은 행동으로 실천할 수 있는 '오늘의 첫걸음'을 제시하십시오.

      Return ONLY a JSON object with this structure:
      {
        "root_cause": "한 줄의 날카로운 근본 원인 분석",
        "solution_order": ["1순위", "2순위", "3순위"],
        "roadmap": { "short": "일주일 계획", "mid": "한달 계획", "long": "세달 후 목표" },
        "todays_action": "오늘 즉시 실행할 한 가지 구체적 행동"
      }
    `;

    const userPrompt = `[이전 분석 컨텍스트]\n${JSON.stringify(context)}`;

    const aiResult = await AIUtil.analyze(systemPrompt, userPrompt, this.model);

    return {
      stage: 'STRATEGY',
      data: aiResult || {
        root_cause: "분석 중입니다.",
        solution_order: ["현재 상황 파악", "감정 추스르기", "전문가 대화"],
        roadmap: { short: "휴식", mid: "대화 시도", long: "회복" },
        todays_action: "깊게 심호흡하고 물 한 잔 마시기"
      },
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
