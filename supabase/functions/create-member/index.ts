import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({ error: "Sesión inválida" }, 401);
    }

    const { data: callerProfile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (callerProfile?.role !== "admin") {
      return jsonResponse({ error: "Solo el admin puede crear usuarios" }, 403);
    }

    const { full_name, phone, cedula, pin, role } = await req.json();

    if (!full_name || !phone || !cedula || !pin) {
      return jsonResponse({ error: "Faltan datos requeridos" }, 400);
    }

    if (!/^\d{4}$/.test(pin)) {
      return jsonResponse(
        { error: "El PIN debe ser de exactamente 4 dígitos" },
        400,
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const syntheticEmail = `${phone}@gym.internal`;

    const paddedPassword = `gym_${pin}_pin`;

    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: syntheticEmail,
        password: paddedPassword,
        email_confirm: true,
      });

    if (createError || !newUser.user) {
      return jsonResponse(
        { error: "No se pudo crear el usuario: " + createError?.message },
        400,
      );
    }

    const finalRole = role === "admin" ? "admin" : "member";

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        full_name,
        phone,
        cedula,
        pin_hash: "managed_by_supabase_auth",
        role: finalRole,
      });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return jsonResponse(
        { error: "No se pudo crear el perfil: " + profileError.message },
        400,
      );
    }

    if (finalRole !== "admin") {
      const { error: membershipError } = await supabaseAdmin
        .from("memberships")
        .insert({
          member_id: newUser.user.id,
          last_payment_date: new Date().toISOString().split("T")[0],
        });

      if (membershipError) {
        return jsonResponse(
          {
            error:
              "Perfil creado pero falló la membresía: " + membershipError.message,
          },
          400,
        );
      }
    }

    return jsonResponse({ success: true, member_id: newUser.user.id });
  } catch (err) {
    return jsonResponse(
      { error: "Error inesperado: " + (err as Error).message },
      500,
    );
  }
});

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}