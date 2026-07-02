import { useMutation, useQueryClient } from "@tanstack/react-query";
import { undoAttendance } from "../api";
import { useAuth } from "../../auth/hooks/useAuth";

export function useUndoAttendance() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (memberId: string) => undoAttendance(memberId, profile!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
