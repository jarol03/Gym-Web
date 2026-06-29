export interface CheckinResult {
  success: boolean;
  error?: string;
  distance?: number;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  checked_in_at: string;
  method: "qr_self" | "admin_manual";
  latitude: number | null;
  longitude: number | null;
  marked_by: string | null;
}

export interface MarkManualAttendanceInput {
  memberId: string;
  adminId: string;
}
