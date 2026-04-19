import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5500'),
  user: process.env.DB_USER || 'ainabi',
  password: process.env.DB_PASSWORD || 'ainabi_pass',
  database: process.env.DB_NAME || 'ainabi_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
