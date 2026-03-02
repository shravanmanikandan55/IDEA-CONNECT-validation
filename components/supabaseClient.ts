import { createClient } from '@supabase/supabase-js';

// Try multiple ways to get the environment variables
const getEnv = (key: string) => {
  // Try import.meta.env first (Vite standard)
  // @ts-ignore
  const importMetaVal = import.meta.env[key];
  if (importMetaVal) return importMetaVal;
  
  // Try process.env (Node.js standard, including Vite-defined globals)
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  
  // Try window._env_ (Netlify pattern)
  // @ts-ignore
  if (typeof window !== 'undefined' && window._env_ && window._env_[key]) {
    // @ts-ignore
    return window._env_[key];
  }
  
  return undefined;
};

const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

const cleanValue = (val: any) => {
  if (!val) return undefined;
  let s = String(val).trim();
  if (s === 'undefined' || s === 'null' || s === '') return undefined;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s;
};

const supabaseUrl = cleanValue(rawUrl);
const supabaseAnonKey = cleanValue(rawKey);

if (typeof window !== 'undefined') {
  console.log('Supabase Config Check:', {
    urlSet: !!supabaseUrl,
    urlValue: supabaseUrl,
    urlValid: supabaseUrl?.startsWith('https://'),
    keySet: !!supabaseAnonKey,
    keyValue: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : undefined,
    origin: window.location.origin,
    importMetaEnv: Object.keys(import.meta.env || {}).filter(k => k.includes('SUPABASE'))
  });
}

export const isSupabaseConfigured = () => {
  const configured = !!supabaseUrl && supabaseUrl.startsWith('https://') && !!supabaseAnonKey;
  console.log('Supabase configured:', configured, { supabaseUrl, supabaseAnonKey: !!supabaseAnonKey });
  return configured;
};

export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl! : 'https://bchuntzfagrdsiewyqwm.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey! : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
