import { useQuery } from '@tanstack/react-query'
import { fetchAllMemberships } from '../api'

export function useAllMemberships() {
  return useQuery({
    queryKey: ['memberships', 'all'],
    queryFn: fetchAllMemberships,
  })
}