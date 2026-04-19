-- [AINABI] Database Schema v.1.0

-- 1. 회원 테이블 (users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER', -- USER, COUNSELOR, ADMIN
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 상담 이력 테이블 (consultations)
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- 비회원 분석 허용을 위해 NULL 허용
    counselor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    survey_data JSONB NOT NULL,
    analysis_result JSONB,
    status VARCHAR(50) DEFAULT 'ANALYZED', -- ANALYZED, ACTION_PLANNING, COMPLETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 상담사-내담자 매핑 가속을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_counselor ON consultations(counselor_id);
