import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markManualAttendance } from "../api";
import { useAuth } from "../../auth/hooks/useAuth";

export function useMarkManualAttendance() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (memberId: string) =>
      markManualAttendance(memberId, profile!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
