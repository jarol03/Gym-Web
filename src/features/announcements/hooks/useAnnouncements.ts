import { useQuery } from '@tanstack/react-query'
import { fetchActiveAnnouncements, fetchAllAnnouncements } from '../api'

export function useActiveAnnouncements() {
  return useQuery({
    queryKey: ['announcements', 'active'],
    queryFn: fetchActiveAnnouncements,
  })
}

export function useAllAnnouncements() {
  return useQuery({
    queryKey: ['announcements', 'all'],
    queryFn: fetchAllAnnouncements,
  })
}