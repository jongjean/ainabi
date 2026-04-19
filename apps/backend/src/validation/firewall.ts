import { ValidationResult } from '../types';

/**
 * ValidationFirewall: AI 응답의 정합성을 3단계로 검증합니다.
 */
export class ValidationFirewall {
  
  /**
   * validate: 통합 검증 실행
   */
  public async validate(data: any, stageSchema: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // 1. Syntax Check (이미 JSON 파싱이 된 전제로 타입 체크)
    if (typeof data !== 'object') {
      errors.push("Invalid syntax: Response is not a valid object.");
    }

    // 2. Schema Check (필수 필드 확인)
    this.checkSchema(data, stageSchema, errors);

    // 3. Logic Check (비즈니스 로직 및 일관성 확인)
    if (errors.length === 0) {
      this.checkSemanticLogic(data, stageSchema, errors);
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  private checkSchema(data: any, stage: string, errors: string[]) {
    if (stage === 'DOMAIN' && !data.domains) {
      errors.push("Schema fail: 'domains' field is missing.");
    }
    if (stage === 'CAUSAL' && (!data.nodes || !data.edges)) {
      errors.push("Schema fail: 'nodes' or 'edges' field is missing.");
    }
  }

  private checkSemanticLogic(data: any, stage: string, errors: string[]) {
    // 도메인 가중치 합계 1.0 검증
    if (stage === 'DOMAIN' && data.domains) {
      const sum = data.domains.reduce((acc: number, d: any) => acc + d.weight, 0);
      if (Math.abs(sum - 1.0) > 0.01) {
        errors.push(`Logic fail: Domain weights sum is ${sum}, must be 1.0.`);
      }
    }
    
    // 인과 그래프 순환 모순 검증 (Placeholder)
    if (stage === 'CAUSAL') {
      // TODO: Cycle detection algorithm
    }
  }
}
