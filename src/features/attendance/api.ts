import { supabase } from "../../shared/lib/supabase";
import type { CheckinResult } from "./types";

export async function checkinAttendance(
  memberId: string,
  latitude: number,
  longitude: number,
  qrToken: string,
): Promise<CheckinResult> {
  const { data, error } = await supabase.rpc("checkin_attendance", {
    p_member_id: memberId,
    p_latitude: latitude,
    p_longitude: longitude,
    p_qr_token: qrToken,
  });

  if (error) {
    return { success: false, error: "No se pudo registrar tu asistencia" };
  }

  return data as CheckinResult;
}

export async function markManualAttendance(
  memberId: string,
  adminId: string,
): Promise<void> {
  const { error } = await supabase.from("attendance").insert({
    member_id: memberId,
    method: "admin_manual",
    marked_by: adminId,
  });

  if (error) {
    throw new Error("No se pudo registrar la asistencia");
  }
}

export async function fetchTodayAttendance(): Promise<string[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("attendance")
    .select("member_id")
    .gte("checked_in_at", todayStart.toISOString());

  if (error) {
    throw new Error("No se pudo cargar la asistencia de hoy");
  }

  return data.map((row) => row.member_id);
}
