import { Orchestrator } from '../orchestrator/index';
import { consultationRepository } from '../repositories/consultationRepository';
import { sessionRepository } from '../repositories/sessionRepository';
import { createError } from '../middleware/errorHandler';

// 오케스트레이터는 싱글톤으로 유지 (AI 세션 상태 보존)
const orchestrator = new Orchestrator({
  sessionId: 'default-session',
  userId: 'anonymous',
  caseId: 'case-001',
  currentStage: 'INTAKE',
  retries: 0,
  maxRetries: 3,
  history: [],
  riskFlags: [],
  schemaVersion: 1,
});

export class AnalysisService {
  private lastSecond: string = '';
  private seqCount: number = 1;

  async analyze(dataOrSessionId: any, userId: number | null, clientIp: string = '', userAgent: string = '') {
    let surveyData = dataOrSessionId;

    // 만약 데이터가 UUID 형식의 sessionId라면 스냅샷 로드
    const isSessionId = typeof dataOrSessionId === 'string' && dataOrSessionId.length > 20;
    
    if (isSessionId) {
      const snapshot = await sessionRepository.getSnapshot(dataOrSessionId);
      if (!snapshot) throw createError('유효한 상담 세션 데이터를 찾을 수 없습니다.', 404);
      
      // AI가 이해할 수 있는 surveyData 포맷으로 변환 (하위 호환성 유지)
      surveyData = {
        ...snapshot.context,
        ...snapshot.structure,
        ...snapshot.depth,
        description: snapshot.narrative
      };
    }

    if (!surveyData || !surveyData.category) {
      throw createError('설문 데이터가 유효하지 않습니다.', 400);
    }

    // 세션 ID 생성 (로깅용)
    const now = new Date();
    const currentSecond = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    let seqStr = '001';
    if (this.lastSecond === currentSecond) {
      this.seqCount++;
      seqStr = String(this.seqCount).padStart(3, '0');
    } else {
      this.lastSecond = currentSecond;
      this.seqCount = 1;
    }
    const logSessionId = isSessionId ? dataOrSessionId : `${currentSecond}_${seqStr}`;

    console.log(`[AI_CALL] user=${userId ?? 'anonymous'} IP=${clientIp} Session=${logSessionId} category=${surveyData.category}`);

    const fullResult = await orchestrator.runFullPipeline(surveyData);

    // 저장 시에도 신규 sessionId 혹은 생성된 logSessionId 사용
    await consultationRepository.create(userId, surveyData, fullResult, logSessionId, clientIp, userAgent);
    console.log(`[DB] Consultation saved for session=${logSessionId} (IP: ${clientIp})`);

    return fullResult;
  }
}


export const analysisService = new AnalysisService();
