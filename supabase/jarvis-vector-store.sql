-- ============================================================
-- Jarvis RAG Vector Store Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge chunks table
CREATE TABLE IF NOT EXISTS jarvis_knowledge (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT NOT NULL,
  embedding   VECTOR(1024),
  source      TEXT NOT NULL CHECK (source IN ('github', 'linkedin_pdf', 'resume', 'manual')),
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ANN index for fast vector search
CREATE INDEX IF NOT EXISTS jarvis_knowledge_embedding_idx
  ON jarvis_knowledge
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 4. Create the match function used by RAG retrieval
CREATE OR REPLACE FUNCTION match_jarvis_knowledge(
  query_embedding VECTOR(1024),
  match_threshold FLOAT DEFAULT 0.5,
  match_count     INT   DEFAULT 5
)
RETURNS TABLE (
  id         UUID,
  content    TEXT,
  source     TEXT,
  metadata   JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    jk.id,
    jk.content,
    jk.source,
    jk.metadata,
    1 - (jk.embedding <=> query_embedding) AS similarity
  FROM jarvis_knowledge jk
  WHERE 1 - (jk.embedding <=> query_embedding) > match_threshold
  ORDER BY jk.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. (Optional) Row-level security — only service role can write
ALTER TABLE jarvis_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON jarvis_knowledge
  FOR SELECT USING (true);

CREATE POLICY "Allow service role full access" ON jarvis_knowledge
  USING (auth.role() = 'service_role');
