import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { fetchMyMembership } from '../api'

export function useMyMembership() {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['membership', profile?.id],
    queryFn: () => fetchMyMembership(profile!.id),
    enabled: !!profile,
  })
}