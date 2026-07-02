import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
async function reset() {
  const { data: user } = await supabase.from('users').select('id').eq('email', 'admin@teksysagro.com').single();
  if (!user) { console.log('Admin not found!'); return; }
  await supabase.from('users').update({ is_active: true }).eq('id', user.id);
  await supabase.from('user_passwords').delete().eq('user_id', user.id);
  const hash = await bcrypt.hash('Admin@1234', 12);
  const { error } = await supabase.from('user_passwords').insert({ user_id: user.id, password_hash: hash });
  console.log('Password reset:', error || 'OK');
}
reset();
