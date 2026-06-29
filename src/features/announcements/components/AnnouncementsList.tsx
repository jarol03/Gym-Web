import { useActiveAnnouncements } from '../hooks/useAnnouncements'
import styles from './AnnouncementsList.module.css'

export function AnnouncementsList() {
  const { data: announcements, isLoading, error } = useActiveAnnouncements()

  if (isLoading) return <p className={styles.loadingText}>Cargando anuncios...</p>
  if (error) return <p className={styles.errorText}>No se pudieron cargar los anuncios</p>
  if (!announcements || announcements.length === 0) {
    return <p className={styles.empty}>No hay anuncios por el momento</p>
  }

  return (
    <div className={styles.container}>
      {announcements.map((announcement) => (
        <div key={announcement.id} className={styles.card}>
          <p className={styles.title}>{announcement.title}</p>
          <p className={styles.body}>{announcement.body}</p>
          <span className={styles.date}>
            {new Date(announcement.created_at).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  )
}