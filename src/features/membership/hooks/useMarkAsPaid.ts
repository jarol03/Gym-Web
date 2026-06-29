import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markAsPaid } from '../api'
import { useAuth } from '../../auth/hooks/useAuth'

export function useMarkAsPaid() {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: (membershipId: string) => markAsPaid(membershipId, profile!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
    },
  })
}