import { StagePayload } from '../types';
import { AIUtil } from '../utils/ai';

export class IntakeAgent {
  private model: string = 'deepseek-chat';

  public async process(rawInput: string): Promise<StagePayload> {
    console.log("[IntakeAgent] Processing real-time AI analysis...");
    
    const systemPrompt = `
      당신은 전문적인 AI 행동 분석 상담소의 인턴 머신(Intake Analyst)입니다.
      사용자가 입력한 설문 데이터(상황 요약 포함)를 정밀하게 분석하여 핵심 정서적/상황적 벡터를 추출하십시오.
      
      [분석 지침]
      1. normalized_summary: 설문 데이터와 서술 내용을 종합하여 1~2줄의 고해상도 상황 요약을 작성하십시오.
      2. entities: 상담의 핵심 키워드(예: '사업 실패', '배우자 갈등', '경제적 종속' 등)를 5개 내외로 추출하십시오.
      3. emotion: 주된 정서와 그 강도를 0.0~1.0 사이로 평가하십시오.
      4. risk_flags: 이혼, 자해, 파산, 폭력 등 고위험 요소를 감지하여 나열하십시오.

      Return ONLY a JSON object with this structure:
      {
        "normalized_summary": "상황 요약 (한국어)",
        "entities": ["키워드1", "키워드2"...],
        "emotion": { "type": "주된 감정", "intensity": 0.0-1.0 },
        "risk_flags": ["위험요소1"...]
      }
    `;

    const userPrompt = `[설문 기반 상황 컨텍스트]\n${rawInput}`;

    // 실제 AIUtil을 통한 DeepSeek 호출
    const aiResult = await AIUtil.analyze(systemPrompt, userPrompt, this.model);

    // AI 호출 실패 시 방어 로직 (Fallback)
    const result = aiResult || {
      normalized_summary: "분석 서버 지연으로 인한 간이 요약 상태입니다.",
      entities: ["분석 지연"],
      emotion: { type: "중립", intensity: 0.5 },
      risk_flags: []
    };

    return {
      stage: 'INTAKE',
      data: result,
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
