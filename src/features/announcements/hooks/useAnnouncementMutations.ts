import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnnouncement, toggleAnnouncementActive } from '../api'
import { useAuth } from '../../auth/hooks/useAuth'
import type { NewAnnouncement } from '../types'

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  return useMutation({
    mutationFn: (announcement: NewAnnouncement) => createAnnouncement(announcement, profile!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  })
}

export function useToggleAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleAnnouncementActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  })
}