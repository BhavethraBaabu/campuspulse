import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type User = {
  id: string;
  email: string;
  full_name: string;
  query_count: number;
  created_at: string;
  last_seen?: string;
};