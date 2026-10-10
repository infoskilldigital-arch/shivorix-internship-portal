import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, college_name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Unable to load profile" }, { status: 500 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email ?? null },
      profile,
    });
  } catch {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
}
