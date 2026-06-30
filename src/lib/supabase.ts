import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Create a safe mock client proxy that chain-returns itself and resolves to standard empty responses
// to prevent startup crashes when Supabase is not yet configured.
const createMockSupabase = () => {
  const dummy: any = () => dummy;
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: null, error: new Error('Supabase credentials not configured.') });
      }
      return new Proxy(dummy, handler);
    },
    apply(target, thisArg, argArray) {
      return new Proxy(dummy, handler);
    }
  };
  return new Proxy(dummy, handler) as any;
};

let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.info(
    'Supabase environment variables (VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY) are missing. ' +
    'The application will fall back to default data if database calls fail.'
  );
  supabaseClient = createMockSupabase();
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.info('Failed to initialize Supabase client:', err);
    supabaseClient = createMockSupabase();
  }
}

export const supabase = supabaseClient;
