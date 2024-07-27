import { createClient } from '@supabase/supabase-js';
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function createSupabaseClient() {
    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase
}