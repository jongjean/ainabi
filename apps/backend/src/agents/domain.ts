import { StagePayload } from '../types';
import { AIUtil } from '../utils/ai';

export class DomainAgent {
  private model: string = 'deepseek-chat';

  public async process(rawInput: any): Promise<StagePayload> {
    console.log("[DomainAgent] Calculating domain impact weights...");
    
    const systemPrompt = `
      You are an impact analyzer.
      Assign weight (0.0 to 1.0) to the most dominant domain influenced by the current situation.
      Domains: Relationship, Financial, Psychological, Career, Health.
      Return ONLY a JSON object:
      {
        "domain": "The most impacted domain in English",
        "weight": 0.45,
        "insight": "Why this domain is primary in Korean"
      }
    `;

    const userPrompt = `Context: "${JSON.stringify(rawInput)}"`;
    const aiResult = await AIUtil.analyze(systemPrompt, userPrompt, this.model);

    return {
      stage: 'DOMAIN',
      data: aiResult || { domain: "Relationship", weight: 0.5, insight: "데이터 오류" },
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
