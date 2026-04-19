/**
 * AdaptiveLoop: 사용자의 이행 상태에 따라 과제의 난이도를 동적으로 조절합니다.
 */
export class AdaptiveLoop {
  
  /**
   * recalculate: 실패 시 난이도를 하향 조정하고 새로운 대안을 제안합니다.
   */
  public static async recalibrate(failedTask: any, history: any[]): Promise<any> {
    console.log(`[AdaptiveLoop] recalibrating for failed task: ${failedTask.id}`);

    // 난이도 하향 밎 단편화 전략
    const currentDifficulty = failedTask.difficulty || 3;
    const newDifficulty = Math.max(1, currentDifficulty - 1);

    // TODO: AI를 호출하여 더 쉬운 '대안 과제' 생성
    const alternative = {
      original_task_id: failedTask.id,
      new_task: `기존 과제('${failedTask.task}')보다 조금 더 쉬운 단계로 시도해볼까요?`,
      new_difficulty: newDifficulty,
      suggestion: "작은 성공이 모여 큰 변화가 됩니다. 오늘은 이것만이라도 해보세요!"
    };

    return alternative;
  }

  /**
   * calculateTrustIndex: 이행률 기반 신뢰 지수 산출 (수식 적용)
   */
  public static calculateTrustIndex(stats: { commitment: number, conflict: number, positive: number }): number {
    // 수식: (이행률 * 0.5) + (갈등 감소율 * 0.3) + (긍정 소통 * 0.2)
    const index = (stats.commitment * 0.5) + (stats.conflict * 0.3) + (stats.positive * 0.2);
    return parseFloat(index.toFixed(2));
  }
}
