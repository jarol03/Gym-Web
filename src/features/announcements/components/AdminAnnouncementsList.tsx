import { useAllAnnouncements } from '../hooks/useAnnouncements'
import { useToggleAnnouncement } from '../hooks/useAnnouncementMutations'
import styles from './AdminAnnouncementsList.module.css'

export function AdminAnnouncementsList() {
  const { data: announcements, isLoading, error } = useAllAnnouncements()
  const toggleAnnouncement = useToggleAnnouncement()

  if (isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2].map((i) => (
          <div key={i} className={styles.skelCard}>
            <div className={styles.skeleton} style={{ width: '60%', height: 16 }} />
          </div>
        ))}
      </div>
    )
  }

  if (error || !announcements) {
    return (
      <div className={styles.empty}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Error al cargar anuncios
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        No hay anuncios aún
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {announcements.map((announcement, index) => (
        <div
          key={announcement.id}
          className={`${styles.card} ${!announcement.active ? styles.cardOff : ''}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className={styles.cardAccent} style={{ background: announcement.active ? 'var(--orange)' : 'var(--text-muted)' }} />
          <div className={styles.header}>
            <span className={styles.title}>
              {!announcement.active && <span className={styles.draftBadge}>Borrador</span>}
              {announcement.title}
            </span>
          </div>
          <p className={styles.body}>{announcement.body}</p>
          <div className={styles.meta}>
            <span className={styles.date}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date(announcement.created_at).toLocaleDateString()}
            </span>
            <button
              className={`${styles.toggleBtn} ${announcement.active ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => toggleAnnouncement.mutate({ id: announcement.id, active: !announcement.active })}
            >
              {announcement.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
