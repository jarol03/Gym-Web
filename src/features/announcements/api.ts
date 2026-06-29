import { supabase } from '../../shared/lib/supabase'
import type { Announcement, NewAnnouncement } from './types'

export async function fetchActiveAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('No se pudieron cargar los anuncios')
  }

  return data as Announcement[]
}

export async function fetchAllAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('No se pudieron cargar los anuncios')
  }

  return data as Announcement[]
}

export async function createAnnouncement(
  announcement: NewAnnouncement,
  createdBy: string
): Promise<void> {
  const { error } = await supabase.from('announcements').insert({
    title: announcement.title,
    body: announcement.body,
    created_by: createdBy,
  })

  if (error) {
    throw new Error('No se pudo crear el anuncio')
  }
}

export async function toggleAnnouncementActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('announcements')
    .update({ active })
    .eq('id', id)

  if (error) {
    throw new Error('No se pudo actualizar el anuncio')
  }
}