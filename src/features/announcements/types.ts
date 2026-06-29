export interface Announcement {
  id: string
  title: string
  body: string
  created_by: string
  created_at: string
  active: boolean
}

export interface NewAnnouncement {
  title: string
  body: string
}