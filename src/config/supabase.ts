import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('🔑 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key prefix:', supabaseServiceKey?.substring(0, 15) + '...');
console.log('🔑 Supabase Key length:', supabaseServiceKey?.length);

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Test connection on import
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Supabase connection test FAILED:', error.message);
      console.error('   Full error:', JSON.stringify(error));
    } else {
      console.log('✅ Supabase connection test PASSED. Rows returned:', data?.length ?? 0);
    }
  } catch (e: any) {
    console.error('❌ Supabase connection test EXCEPTION:', e.message);
  }
})();
