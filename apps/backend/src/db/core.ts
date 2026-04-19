// [database.ts] PostgreSQL Pool Setup
import { Pool } from 'pg';

export const pool = new Pool({
  host: 'localhost',
  port: 5500,
  user: 'ainabi',
  password: 'ainabi_pass',
  database: 'ainabi_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// [auth.ts] Security Utilities
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'ainabi-metallic-secret-key-2024';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
