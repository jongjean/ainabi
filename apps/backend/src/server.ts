import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler, AppError, createError } from './middleware/errorHandler';
import { optionalAuth, requireAuth, AuthRequest } from './middleware/auth';
import { authService } from './services/authService';
import { analysisService } from './services/analysisService';
import { sessionService } from './services/sessionService';
import { consultationRepository } from './repositories/consultationRepository';
import { sessionRepository } from './repositories/sessionRepository';
import { StepSchemas } from './schemas/stepSchemas';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '8100');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: '분석 요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await authService.register(username, password, clientIp, userAgent);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// ─── Analysis Routes ──────────────────────────────────────────────────────────
// [NEW] 세션 초기화
app.post('/session', optionalAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id ?? null;
    const sessionId = await sessionService.createSession(userId);
    res.json({ success: true, sessionId });
  } catch (err) {
    next(err);
  }
});

// [NEW] 세션 상태 조회 (복구용)
app.get('/session/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.id;
    const session = await sessionRepository.findSessionById(sessionId);
    if (!session) throw createError('세션을 찾을 수 없습니다.', 404);

    const snapshot = await sessionService.getLatestSnapshot(sessionId);
    res.json({ 
      success: true, 
      status: session.status,
      snapshot 
    });
  } catch (err) {
    next(err);
  }
});

// [NEW] 단계별 데이터 저장 및 스냅샷 업데이트
app.post('/session/:id/step', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { step, data } = req.body;
    const sessionId = req.params.id;
    
    const session = await sessionRepository.findSessionById(sessionId);
    if (!session) throw createError('세션을 찾을 수 없습니다.', 404);

    const schema = StepSchemas[step as keyof typeof StepSchemas];
    if (!schema) throw createError(`정의되지 않은 단계입니다: ${step}`, 400);

    try {
      schema.parse(data);
    } catch (err: any) {
      throw createError(`데이터 형식이 올바르지 않습니다: ${err.message}`, 400);
    }

    const merged = await sessionService.processStep(sessionId, parseInt(step), data);
    res.json({ success: true, merged });
  } catch (err) {
    next(err);
  }
});

app.post('/analyze', optionalAuth, analyzeLimiter, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { surveyData, sessionId } = req.body; // surveyData는 하위 호환성, sessionId는 신규 구조
    const userId = req.user?.id ?? null;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await analysisService.analyze(surveyData || sessionId, userId, clientIp, userAgent);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── History Routes (Premium) ─────────────────────────────────────────────────
app.get('/history', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const history = await consultationRepository.findByUserId(req.user!.id);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
});

app.get('/history/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const consultation = await consultationRepository.findById(
      parseInt(req.params.id),
      req.user!.id
    );
    if (!consultation) {
      const err: AppError = new Error('상담 이력을 찾을 수 없습니다.');
      err.statusCode = 404;
      err.isOperational = true;
      return next(err);
    }
    res.json({ success: true, consultation });
  } catch (err) {
    next(err);
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.get('/admin/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const password = req.headers['x-admin-password'];
    if (password !== '4686') {
      throw createError('관리자 권한이 없습니다.', 401);
    }
    const sessions = await sessionRepository.findAllWithSnapshots();
    const consultations = await consultationRepository.findAllForAdmin();
    res.json({ success: true, sessions, consultations });
  } catch (err) {
    next(err);
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 AINABI Premium Backend v2.0 running at http://localhost:${port}`);
});
