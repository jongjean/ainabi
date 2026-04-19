-- AI상담소 NAVI: Event-Log & Snapshot 기반 고도화 DDL

-- 1. sessions (상위 컨테이너)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  user_id INT, -- 기존 users 테이블과의 연동을 위해 INT 유지 (기존 schema 참고)
  status TEXT CHECK (status IN ('in_progress','completed')) DEFAULT 'in_progress',
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. session_steps (핵심 — Append-only 로그)
CREATE TABLE IF NOT EXISTS session_steps (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  step INT NOT NULL,              -- 1~8단계
  data JSONB NOT NULL,            -- 단계별 구조화 데이터
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 성능 최적화를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_session_steps_sid ON session_steps(session_id);
CREATE INDEX IF NOT EXISTS idx_session_steps_step ON session_steps(step);
CREATE INDEX IF NOT EXISTS idx_session_steps_data_gin ON session_steps USING GIN (data);

-- 3. session_snapshot (AI 분석용 최신 병합본)
CREATE TABLE IF NOT EXISTS session_snapshot (
  session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  merged JSONB NOT NULL,          -- 1~8단계 병합 결과 (context, structure, depth, narrative)
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 히스토리 추적을 위한 간단한 트리거 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
