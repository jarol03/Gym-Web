import { useAllAnnouncements } from '../hooks/useAnnouncements'
import { useToggleAnnouncement } from '../hooks/useAnnouncementMutations'
import styles from './AdminAnnouncementsList.module.css'

export function AdminAnnouncementsList() {
  const { data: announcements, isLoading, error } = useAllAnnouncements()
  const toggleAnnouncement = useToggleAnnouncement()

  if (isLoading) return <p className={styles.loadingText}>Cargando anuncios...</p>
  if (error || !announcements) return <p className={styles.errorText}>No se pudieron cargar los anuncios</p>

  return (
    <div className={styles.container}>
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`${styles.card} ${!announcement.active ? styles.cardInactive : ''}`}
        >
          <div className={styles.header}>
            <span className={styles.title}>{announcement.title}</span>
          </div>
          <p className={styles.body}>{announcement.body}</p>
          <div className={styles.meta}>
            <span className={styles.date}>
              {new Date(announcement.created_at).toLocaleDateString()}
            </span>
            <button
              className={styles.toggleButton}
              onClick={() =>
                toggleAnnouncement.mutate({ id: announcement.id, active: !announcement.active })
              }
            >
              {announcement.active ? 'Desactivar' : 'Reactivar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}