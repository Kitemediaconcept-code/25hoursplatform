-- =============================================================
-- 25 Hours Platform — Supabase Schema
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- 1. Create the courses table
CREATE TABLE IF NOT EXISTS courses (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text        NOT NULL,
  category    text        NOT NULL,
  price       integer     NOT NULL DEFAULT 0,
  instructor  text        NOT NULL,
  duration    text        NOT NULL,
  image       text,
  status      text        NOT NULL DEFAULT 'Active',
  created_at  timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone with the anon key can read courses)
CREATE POLICY "Public can read courses"
  ON courses
  FOR SELECT
  USING (true);

-- 4. Insert policy — currently allows anon key to insert (for admin panel).
--    For production, replace `true` with an auth check, e.g.:
--    USING (auth.role() = 'authenticated')
CREATE POLICY "Admin can insert courses"
  ON courses
  FOR INSERT
  WITH CHECK (true);

-- 5. Update policy (same note as above)
CREATE POLICY "Admin can update courses"
  ON courses
  FOR UPDATE
  USING (true);

-- 6. Delete policy
CREATE POLICY "Admin can delete courses"
  ON courses
  FOR DELETE
  USING (true);
