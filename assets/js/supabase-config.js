/**
 * 25 Hours Platform — Supabase Client Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://supabase.com and create a free project
 * 2. In your project: Settings → API
 * 3. Copy "Project URL" → paste as SUPABASE_URL below
 * 4. Copy "anon / public" key → paste as SUPABASE_ANON_KEY below
 * 5. Run supabase/schema.sql in your Supabase SQL Editor
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Replace these two values with your Supabase project credentials ───────
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';       // e.g. https://abcxyz.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // long JWT string (safe to expose)
// ──────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
