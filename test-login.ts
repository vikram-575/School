import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

supabase.auth.signInWithPassword({ email: 'admin@school-os.com', password: 'SuperAdminPassword123!' })
  .then(res => {
    if (res.error) console.log("ERROR:", res.error.message);
    else console.log("SUCCESS:", res.data.user?.email);
  });
