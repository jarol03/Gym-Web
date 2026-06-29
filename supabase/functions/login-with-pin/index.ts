import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { identifier, pin } = await req.json();

    if (!identifier || !pin) {
      return jsonResponse({ error: "Faltan datos" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("LEGACY_ANON_KEY")!;

    console.log("APIKEY HASH (debug):", anonKey);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const windowStart = new Date(
      Date.now() - WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { count: failedAttempts } = await supabaseAdmin
      .from("login_attempts")
      .select("*", { count: "exact", head: true })
      .eq("identifier", identifier)
      .eq("success", false)
      .gte("attempted_at", windowStart);

    if (failedAttempts !== null && failedAttempts >= MAX_ATTEMPTS) {
      return jsonResponse(
        {
          error: `Demasiados intentos. Espera ${WINDOW_MINUTES} minutos e intenta de nuevo.`,
        },
        429,
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, phone")
      .or(`phone.eq.${identifier},cedula.eq.${identifier}`)
      .maybeSingle();

    if (!profile) {
      await logAttempt(supabaseAdmin, identifier, false);
      return jsonResponse({ error: "Teléfono o PIN incorrecto" }, 401);
    }

    const syntheticEmail = `${profile.phone}@gym.internal`;
    const paddedPassword = `gym_${pin}_pin`;

    const requestBody = JSON.stringify({
      email: syntheticEmail,
      password: paddedPassword,
    });

    console.log("BODY EXACTO A ENVIAR:", requestBody);

    const authResponse = await fetch(
      `${supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
    );

    const authData = await authResponse.json();
    console.log("Status auth:", authResponse.status, "Body:", JSON.stringify(authData));

    if (!authResponse.ok || !authData.access_token) {
      await logAttempt(supabaseAdmin, identifier, false);
      return jsonResponse({ error: "Teléfono o PIN incorrecto" }, 401);
    }

    await logAttempt(supabaseAdmin, identifier, true);

    return jsonResponse(
      {
        success: true,
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
      },
      200,
    );
  } catch (err) {
    return jsonResponse(
      { error: "Error inesperado: " + (err as Error).message },
      500,
    );
  }
});

async function logAttempt(
  client: ReturnType<typeof createClient>,
  identifier: string,
  success: boolean,
) {
  await client.from("login_attempts").insert({ identifier, success });
}

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}