import { StagePayload } from '../types';

/**
 * CommitmentAgent: 전략 로드맵을 초미세 실행 과제로 분해합니다.
 */
export class CommitmentAgent {
  private model: string = 'claude-3-5-sonnet-20240620';

  public async process(strategyData: any): Promise<StagePayload> {
    console.log("[CommitmentAgent] Generating daily micro-tasks...");

    const prompt = `
      다음 해결 전략을 바탕으로 사용자가 오늘 당장 수행할 수 있는 '초미세 과제' 3가지를 생성하세요.
      각 과제는 5분 내로 완료 가능해야 하며, 난이도(1~5)를 표기하세요.
      
      전략 데이터: ${JSON.stringify(strategyData)}
    `;

    // TODO: AI가 구체적인 Task 객체 배열을 생성
    const mockCommitments = [
      { id: "task_1", task: "배우자에게 '오늘 고생 많았어'라고 문자 한 통 보내기", difficulty: 1, domain: "Relationship" },
      { id: "task_2", task: "최근 3일간의 지출 영수증 한 곳에 모으기", difficulty: 2, domain: "Finance" },
      { id: "task_3", task: "현재 가장 큰 고민 3가지를 종이에 적어보기", difficulty: 1, domain: "Spirit" }
    ];

    return {
      stage: 'COMMITMENT',
      data: {
        daily_tasks: mockCommitments,
        total_difficulty: 4,
        message: "오늘의 작은 변화가 내일의 큰 기적을 만듭니다."
      },
      timestamp: new Date().toISOString(),
      model: this.model
    };
  }
}
