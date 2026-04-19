import { query } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  user_id: number | null;
  status: 'in_progress' | 'completed';
  schema_version: number;
}

export interface SessionStep {
  id: string;
  session_id: string;
  step: number;
  data: any;
}

export class SessionRepository {
  async createSession(userId: number | null): Promise<string> {
    const id = uuidv4();
    await query(
      'INSERT INTO sessions (id, user_id) VALUES ($1, $2)',
      [id, userId]
    );
    return id;
  }

  async findSessionById(id: string): Promise<Session | null> {
    const result = await query('SELECT * FROM sessions WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async saveStep(sessionId: string, step: number, data: any): Promise<void> {
    const id = uuidv4();
    await query(
      'INSERT INTO session_steps (id, session_id, step, data) VALUES ($1, $2, $3, $4)',
      [id, sessionId, step, data]
    );
  }

  async getStepsBySessionId(sessionId: string): Promise<SessionStep[]> {
    const result = await query(
      'SELECT * FROM session_steps WHERE session_id = $1 ORDER BY step ASC, created_at ASC',
      [sessionId]
    );
    return result.rows;
  }

  async upsertSnapshot(sessionId: string, merged: any): Promise<void> {
    await query(
      `INSERT INTO session_snapshot (session_id, merged, updated_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (session_id) DO UPDATE 
       SET merged = EXCLUDED.merged, updated_at = NOW()`,
      [sessionId, merged]
    );
  }

  async getSnapshot(sessionId: string): Promise<any | null> {
    const result = await query('SELECT merged FROM session_snapshot WHERE session_id = $1', [sessionId]);
    return result.rows[0]?.merged || null;
  }

  async findAllWithSnapshots(): Promise<any[]> {
    const result = await query(`
      SELECT s.id, s.status, s.created_at, sn.merged, sn.updated_at as snapshot_updated_at
      FROM sessions s
      LEFT JOIN session_snapshot sn ON s.id = sn.session_id
      ORDER BY s.created_at DESC
      LIMIT 100
    `);
    return result.rows;
  }

  async updateStatus(id: string, status: 'completed'): Promise<void> {
    await query('UPDATE sessions SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
  }
}

export const sessionRepository = new SessionRepository();
