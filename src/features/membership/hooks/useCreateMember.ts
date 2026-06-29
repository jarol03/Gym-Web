import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMember } from "../api";
import type { NewMemberInput } from "../types";

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewMemberInput) => createMember(input),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["memberships"] });
      }
    },
  });
}
