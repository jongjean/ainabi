import { StagePayload } from '../types';
import { AIUtil } from '../utils/ai';

export class CausalAgent {
  private model: string = 'deepseek-chat';

  public async process(rawInput: any): Promise<StagePayload> {
    console.log("[CausalAgent] Generating causal mapping with DeepSeek...");
    
    // Intake 단계 결과를 바탕으로 인과 관계 도출
    const systemPrompt = `
      You are a causal relationship expert.
      Based on the user's situation summary, identify 4-6 key problem nodes and their directional relationships.
      Return ONLY a JSON object:
      {
        "insight": "A brief insight about the most critical causal link in Korean",
        "graph": {
          "nodes": ["Node A", "Node B", ...],
          "edges": [["Source", "Target"], ["Source", "Target"]]
        }
      }
    `;

    const userPrompt = `Context: "${JSON.stringify(rawInput)}"`;

    const aiResult = await AIUtil.analyze(systemPrompt, userPrompt, this.model);

    const result = aiResult || {
      insight: "데이터 연동 지연으로 가상의 그래프를 출력합니다.",
      graph: { nodes: ["A", "B"], edges: [["A", "B"]] }
    };

    return {
      stage: 'CAUSAL',
      data: result,
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
