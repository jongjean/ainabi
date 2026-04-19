import { sessionRepository, SessionStep } from '../repositories/sessionRepository';
import { StepSchemas } from '../schemas/stepSchemas';
import { createError } from '../middleware/errorHandler';

export class SessionService {
  /**
   * 단계별 데이터를 병합하여 최종 AI용 스냅샷 객체 생성
   * 전략: 동일 Step이 여러 번 저장된 경우 "최신값 우선(Latest Only)" 적용
   */
  private mergeSteps(steps: SessionStep[] | any[]) {
    const merged: any = {
      context: {},
      structure: {},
      depth: {},
      narrative: '',
      extra_notes: {}
    };

    // Step 번호별로 가장 최신(마지막) 데이터만 추출
    const latestStepMap = new Map<number, any>();
    for (const s of steps) {
      latestStepMap.set(s.step, s.data);
    }

    // 최신 데이터만 사용하여 병합 수행
    latestStepMap.forEach((data, stepNum) => {
      switch (stepNum) {
        case 1:
        case 2:
          merged.context = { ...merged.context, ...data };
          break;
        case 3:
        case 4:
          merged.structure = { ...merged.structure, ...data };
          break;
        case 5:
        case 6:
        case 7:
          merged.depth = { ...merged.depth, ...data };
          break;
        case 8:
          merged.narrative = data.description || data.narrative;
          break;
      }
    });

    return merged;
  }

  async createSession(userId: number | null): Promise<string> {
    return await sessionRepository.createSession(userId);
  }

  async processStep(sessionId: string, step: number, data: any): Promise<any> {
    // 1. 세션 존재 여부 확인
    const session = await sessionRepository.findSessionById(sessionId);
    if (!session) throw createError('세션을 찾을 수 없습니다.', 404);

    // [고도화] 단계 순서 검증 (Step Order Validation)
    const existingSteps = await sessionRepository.getStepsBySessionId(sessionId);
    const lastStepNum = existingSteps.length > 0 
      ? Math.max(...existingSteps.map(s => s.step)) 
      : 0;

    // 규칙: 현재 단계 N은 이전 단계들 중 최대값(max)보다 1 크거나, 이미 입력된 단계여야 함 (업데이트 허용)
    if (step > lastStepNum + 1) {
      throw createError(`순서가 올바르지 않습니다. 현재 ${lastStepNum}단계까지 완료되었습니다.`, 400);
    }

    // 2. Step 데이터 검증 (Zod)
    const schema = StepSchemas[step];
    if (!schema) throw createError(`정의되지 않은 단계입니다: ${step}`, 400);

    try {
      schema.parse(data);
    } catch (err: any) {
      throw createError(`데이터 형식이 올바르지 않습니다: ${err.message}`, 400);
    }

    // 3. Step 저장 (Append-only)
    await sessionRepository.saveStep(sessionId, step, data);

    // 4. 전체 Step 로드 및 병합 (Snapshot)
    const allSteps = await sessionRepository.getStepsBySessionId(sessionId);
    const merged = this.mergeSteps(allSteps);

    // 5. Snapshot 업데이트
    await sessionRepository.upsertSnapshot(sessionId, merged);

    // 6. 만약 마지막 단계(8)라면 상태 업데이트
    if (step === 8) {
      await sessionRepository.updateStatus(sessionId, 'completed');
    }

    return merged;
  }

  async getLatestSnapshot(sessionId: string) {
    return await sessionRepository.getSnapshot(sessionId);
  }
}

export const sessionService = new SessionService();
