import { userRepository } from '../repositories/userRepository';
import { consultationRepository } from '../repositories/consultationRepository';
import { generateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';


export class AuthService {
  async register(username: string, password: string, clientIp: string = '', userAgent: string = '') {
    if (!username || username.length < 3) {
      throw createError('아이디는 3자 이상이어야 합니다.', 400);
    }
    if (!password || password.length < 6) {
      throw createError('비밀번호는 6자 이상이어야 합니다.', 400);
    }

    const existing = await userRepository.findByUsername(username);
    if (existing) throw createError('이미 사용 중인 아이디입니다.', 409);

    const user = await userRepository.create(username, password);

    // [핵심] 가입 즉시 이전 비회원 상담 데이터를 계정으로 연결 (마이그레이션)
    const linkedCount = await consultationRepository.linkAnonymousRecords(user.id, clientIp, userAgent);
    console.log(`[AUTH] User registered: ${username}, Linked old records: ${linkedCount}`);

    return { user, linkedCount };
  }

  async login(username: string, password: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw createError('존재하지 않는 아이디입니다.', 401);

    const valid = await userRepository.verifyPassword(password, user.password_hash);
    if (!valid) throw createError('비밀번호가 일치하지 않습니다.', 401);

    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    return {
      token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}

export const authService = new AuthService();
