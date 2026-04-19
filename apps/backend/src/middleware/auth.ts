import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'ainabi-metallic-secret-key-2024';

export interface AuthRequest extends Request {
  user?: { id: number; username: string; role: string };
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
  } catch {
    return null;
  }
};

export const generateToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

/** 토큰이 있으면 req.user에 주입, 없어도 통과 (Free Tier 허용) */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const user = verifyToken(token);
    if (user) req.user = user;
  }
  next();
};

/** 토큰 필수 (Premium 기능에 사용) */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: '로그인이 필요합니다.' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ success: false, error: '유효하지 않은 토큰입니다.' });

  req.user = user;
  next();
};
