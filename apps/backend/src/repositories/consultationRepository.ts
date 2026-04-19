import { query } from '../config/database';

export interface Consultation {
  id: number;
  user_id: number | null;
  counselor_id: number | null;
  survey_data: object;
  analysis_result: object | null;
  status: 'ANALYZED' | 'ACTION_PLANNING' | 'COMPLETED';
  created_at: Date;
  updated_at: Date;
}

export class ConsultationRepository {
  async create(
    userId: number | null, 
    surveyData: object, 
    analysisResult: object,
    sessionId: string | null = null,
    clientIp: string | null = null,
    userAgent: string | null = null
  ): Promise<Consultation> {
    const result = await query(
      `INSERT INTO consultations (user_id, survey_data, analysis_result, session_id, client_ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, JSON.stringify(surveyData), JSON.stringify(analysisResult), sessionId, clientIp, userAgent]
    );
    return result.rows[0];
  }

  async findByUserId(userId: number): Promise<Consultation[]> {
    const result = await query(
      'SELECT * FROM consultations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async findById(id: number, userId: number): Promise<Consultation | null> {
    const result = await query(
      'SELECT * FROM consultations WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  }

  async updateStatus(id: number, status: Consultation['status']): Promise<void> {
    await query(
      'UPDATE consultations SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
  }

  // [NEW] 비로그인 사용자가 가입하는 순간, 이전 정보(IP, User-Agent) 기반으로 데이터를 내담자 계정으로 종속시킴
  async linkAnonymousRecords(userId: number, clientIp: string, userAgent: string): Promise<number> {
    const result = await query(
      `UPDATE consultations 
       SET user_id = $1 
       WHERE user_id IS NULL AND client_ip = $2 AND user_agent = $3`,
      [userId, clientIp, userAgent]
    );
    return result.rowCount || 0; // 연동된 상담 기록 개수 반환
  }

  async findAllForAdmin(): Promise<any[]> {
    const result = await query(`
      SELECT 
        c.id, c.status, c.created_at, 
        c.survey_data, c.analysis_result, 
        c.client_ip, c.session_id,
        u.username
      FROM consultations c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 200
    `);
    return result.rows;
  }
}

export const consultationRepository = new ConsultationRepository();
