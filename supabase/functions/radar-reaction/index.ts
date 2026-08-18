import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Reaction = "happy" | "sad";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { edition_id, reaction } = await req.json();
    if (!edition_id || (reaction !== "happy" && reaction !== "sad")) {
      return new Response(JSON.stringify({ error: "edition_id and valid reaction required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("radar_reactions")
      .select("id, reaction")
      .eq("edition_id", edition_id)
      .eq("ip_address", ip)
      .maybeSingle();

    let current: Reaction | null = null;

    if (existing && existing.reaction === reaction) {
      // toggle off
      await supabase.from("radar_reactions").delete().eq("id", existing.id);
      current = null;
    } else if (existing) {
      await supabase.from("radar_reactions").update({ reaction }).eq("id", existing.id);
      current = reaction;
    } else {
      const { error } = await supabase
        .from("radar_reactions")
        .insert({ edition_id, ip_address: ip, reaction });
      if (error) throw error;
      current = reaction;
    }

    // Recount from source of truth to stay consistent
    const [{ count: happy }, { count: sad }] = await Promise.all([
      supabase
        .from("radar_reactions")
        .select("id", { count: "exact", head: true })
        .eq("edition_id", edition_id)
        .eq("reaction", "happy"),
      supabase
        .from("radar_reactions")
        .select("id", { count: "exact", head: true })
        .eq("edition_id", edition_id)
        .eq("reaction", "sad"),
    ]);

    await supabase
      .from("radar_editions")
      .update({ happy_count: happy ?? 0, sad_count: sad ?? 0 })
      .eq("id", edition_id);

    return new Response(
      JSON.stringify({ reaction: current, happy_count: happy ?? 0, sad_count: sad ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
