import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name || "",
        last_seen: new Date().toISOString(),
      }, { onConflict: "id" });
      return NextResponse.redirect(`${origin}/ask`);
    }
  }
  return NextResponse.redirect(`${origin}/auth?error=oauth_failed`);
}