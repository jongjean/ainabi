import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class AIUtil {
  private static internalCallCount = 0; // [증명용] 실시간 카운터
  private static deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    timeout: 30000, 
    maxRetries: 0    // [긴급 조치] 토큰 폭증 방지를 위해 자동 재시도 전면 차단
  });

  public static async analyze(systemPrompt: string, userPrompt: string, model: string = 'deepseek-chat'): Promise<any> {
    this.internalCallCount++;
    console.log(`[AI_CALL_EXECUTE] #${this.internalCallCount} 모델:${model} at ${new Date().toISOString()}`);
    
    try {
      const response = await this.deepseek.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        // 토큰 절약을 위해 응답 길이를 엄격히 제한하고 압축된 JSON 요구
        response_format: { type: 'json_object' },
        max_tokens: 1000 
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : null;
    } catch (error) {
      console.error('[AIUtil] Token guarded error:', error);
      return null;
    }
  }
}
