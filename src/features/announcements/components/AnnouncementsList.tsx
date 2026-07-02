import { useActiveAnnouncements } from '../hooks/useAnnouncements'
import styles from './AnnouncementsList.module.css'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString()
}

const cardColors = ['var(--pink)', 'var(--cyan)', 'var(--purple)', 'var(--orange)', 'var(--green)']

export function AnnouncementsList() {
  const { data: announcements, isLoading, error } = useActiveAnnouncements()

  if (isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2].map((i) => (
          <div key={i} className={styles.skelCard}>
            <div className={styles.skelAccent} />
            <div className={styles.skeleton} style={{ width: '55%', height: 16 }} />
            <div className={styles.skeleton} style={{ width: '100%', height: 12, marginTop: 8 }} />
            <div className={styles.skeleton} style={{ width: '30%', height: 10, marginTop: 10 }} />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.empty}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Error al cargar anuncios
      </div>
    )
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p className={styles.emptyTitle}>Sin anuncios</p>
        <p className={styles.emptySub}>No hay novedades por el momento</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {announcements.map((announcement, index) => {
        const color = cardColors[index % cardColors.length]
        return (
          <div key={announcement.id} className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={styles.cardAccent} style={{ background: color }} />
            <div className={styles.cardHeader}>
              <span className={styles.cardDot} style={{ background: color }} />
              <span className={styles.cardBadge} style={{ background: `${color}18`, color }}>Nuevo</span>
            </div>
            <p className={styles.title}>{announcement.title}</p>
            <p className={styles.body}>{announcement.body}</p>
            <div className={styles.meta}>
              <span className={styles.date}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {formatDate(announcement.created_at)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
