'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/ainabi-api/login' : '/ainabi-api/register';
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      
      if (data.success) {
        if (isLogin) {
          onSuccess(data.token, data.user);
          onClose();
        } else {
          setIsLogin(true);
          setError('회원가입이 완료되었습니다. 로그인해 주세요.');
        }
      } else {
        setError(data.error || '인증에 실패했습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md metallic-glass p-10 rounded-[40px] chrome-border overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-ainabi-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-ainabi-blue/20">
                <ShieldCheck className="w-8 h-8 text-ainabi-blue" />
              </div>
              <h2 className="text-2xl font-black text-white liquid-metal mb-2">
                {isLogin ? 'Premium Access' : 'Create Account'}
              </h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
                {isLogin ? '로그인하여 분석 리포트를 소장하세요' : '아이나비의 프리미엄 회원이 되어보세요'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold ml-4">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-ainabi-blue/50 transition-all outline-none"
                    placeholder="아이디를 입력하세요"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold ml-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:border-ainabi-blue/50 transition-all outline-none"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-ainabi-blue transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login Now' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] text-white/40 hover:text-ainabi-blue transition-all uppercase tracking-tighter"
              >
                {isLogin ? "계정이 없으신가요? 회원가입하기" : "이미 계정이 있으신가요? 로그인하기"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
