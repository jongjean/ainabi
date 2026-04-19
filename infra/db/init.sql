-- AINABI Platform DB Schema v1.0

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cases table (The top-level problem container)
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, PENDING_REVIEW, APPROVED
    schema_version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sessions / Stage Outputs table (Storing the 10-step data)
CREATE TABLE IF NOT EXISTS stage_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    stage_name VARCHAR(50) NOT NULL, -- INTAKE, CAUSAL, etc.
    data JSONB NOT NULL,
    summary TEXT,
    model_used VARCHAR(50),
    latency FLOAT,
    pass_gate BOOLEAN DEFAULT FALSE,
    schema_version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Commitments (Micro-actions tracking)
CREATE TABLE IF NOT EXISTS commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    owner VARCHAR(50) NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    failure_reason TEXT,
    difficulty_level INT DEFAULT 1,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. KPI Logs
CREATE TABLE IF NOT EXISTS kpi_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    metrics JSONB NOT NULL, -- {trust_index: 0.8, etc.}
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
