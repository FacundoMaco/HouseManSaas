import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// #region agent log
const logEnv = (name: string, val: string | undefined) => {
  fetch('http://127.0.0.1:7243/ingest/acd4d412-b0f2-4fa0-bef1-a5bea1dfb529', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'supabaseClient.ts',
      message: `Checking env var: ${name}`,
      data: {
        exists: !!val,
        length: val?.length,
        prefix: val?.substring(0, 10),
        suffix: val?.substring((val?.length || 0) - 5),
        hasSpaces: val?.includes(' '),
        hasQuotes: val?.startsWith('"') || val?.startsWith("'"),
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      hypothesisId: 'H3'
    })
  }).catch(() => {});
};
logEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl);
logEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey);
// #endregion

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
