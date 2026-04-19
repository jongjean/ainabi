import { query } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: Date;
}

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const result = await query(
      'SELECT id, username, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(username: string, password: string): Promise<Omit<User, 'password_hash'>> {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role, created_at',
      [username, passwordHash]
    );
    return result.rows[0];
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const userRepository = new UserRepository();
