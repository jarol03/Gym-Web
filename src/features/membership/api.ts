import { supabase } from "../../shared/lib/supabase";
import type {
  CreateMemberResult,
  Membership,
  MembershipWithProfile,
  NewMemberInput,
} from "./types";

export async function fetchMyMembership(memberId: string): Promise<Membership> {
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("member_id", memberId)
    .single();

  if (error) {
    throw new Error("No se pudo cargar la información de membresía");
  }

  return data as Membership;
}

export async function fetchAllMemberships(): Promise<MembershipWithProfile[]> {
  const { data, error } = await supabase
    .from("memberships")
    .select("*, profiles!memberships_member_id_fkey(full_name, phone)")
    .order("next_due_date", { ascending: true });

  if (error) {
    throw new Error("No se pudieron cargar las membresías");
  }

  return data as MembershipWithProfile[];
}

export async function markAsPaid(
  membershipId: string,
  adminId: string,
): Promise<void> {
  const { error } = await supabase
    .from("memberships")
    .update({
      last_payment_date: new Date().toISOString().split("T")[0],
      marked_paid_by: adminId,
    })
    .eq("id", membershipId);

  if (error) {
    throw new Error("No se pudo registrar el pago");
  }
}

export async function createMember(
  input: NewMemberInput,
): Promise<CreateMemberResult> {
  const { data, error } = await supabase.functions.invoke<CreateMemberResult>(
    "create-member",
    {
      body: input,
    },
  );

  if (error) {
    return { success: false, error: "No se pudo conectar con el servidor" };
  }

  if (!data?.success) {
    return {
      success: false,
      error: data?.error ?? "No se pudo crear el socio",
    };
  }

  return data;
}
