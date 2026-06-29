export interface Membership {
  id: string;
  member_id: string;
  last_payment_date: string;
  next_due_date: string;
  status: "active" | "overdue";
  marked_paid_by: string | null;
  updated_at: string;
}

export interface MembershipWithProfile extends Membership {
  profiles: {
    full_name: string;
    phone: string;
  };
}

export interface NewMemberInput {
  full_name: string;
  phone: string;
  cedula: string;
  pin: string;
}

export interface CreateMemberResult {
  success: boolean;
  member_id?: string;
  error?: string;
}
