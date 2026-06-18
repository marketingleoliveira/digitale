import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { edition_id } = await req.json();
    if (!edition_id) {
      return new Response(JSON.stringify({ error: "edition_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get visitor IP from request headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to insert the like (unique constraint will prevent duplicates)
    const { error: insertError } = await supabase
      .from("radar_likes")
      .insert({ edition_id, ip_address: ip });

    if (insertError) {
      if (insertError.code === "23505") {
        // Already liked from this IP — idempotent, never decrement
        const { data: edition } = await supabase
          .from("radar_editions")
          .select("likes")
          .eq("id", edition_id)
          .single();

        return new Response(
          JSON.stringify({ liked: true, likes: edition?.likes ?? 0, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw insertError;
    }

    // Increment likes count
    const { data: edition } = await supabase
      .from("radar_editions")
      .select("likes")
      .eq("id", edition_id)
      .single();

    const newLikes = (edition?.likes ?? 0) + 1;
    await supabase
      .from("radar_editions")
      .update({ likes: newLikes })
      .eq("id", edition_id);

    return new Response(
      JSON.stringify({ liked: true, likes: newLikes }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
