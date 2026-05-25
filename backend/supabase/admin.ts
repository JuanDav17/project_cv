import { createClient } from "@supabase/supabase-js";

import { getSupabaseAdminEnv } from "@/backend/config/env";

export function createAdminSupabaseClient() {
  const { url, secretKey } = getSupabaseAdminEnv();

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

