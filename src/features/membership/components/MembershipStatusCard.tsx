import { useMyMembership } from '../hooks/useMyMembership'
import { getDaysUntilDue } from '../utils'
import styles from './MembershipStatusCard.module.css'

export function MembershipStatusCard() {
  const { data: membership, isLoading, error } = useMyMembership()

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeleton} style={{ width: 100, height: 20, borderRadius: 20 }} />
        <div className={styles.skeleton} style={{ width: 80, height: 48, marginTop: 12 }} />
        <div className={styles.skeleton} style={{ width: 160, height: 14, marginTop: 8 }} />
        <div className={styles.skelDetails}>
          <div className={styles.skeleton} style={{ width: '100%', height: 14 }} />
          <div className={styles.skeleton} style={{ width: '100%', height: 14 }} />
        </div>
      </div>
    )
  }

  if (error || !membership) {
    return (
      <div className={styles.card} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red)', fontSize: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          No se pudo cargar tu membresía
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysUntilDue(membership.next_due_date)
  const isOverdue = membership.status === 'overdue'

  return (
    <div className={`${styles.card} ${isOverdue ? styles.cardOverdue : styles.cardActive}`}>
      <div className={styles.cardGlow} />

      <div className={styles.topRow}>
        <span className={`${styles.badge} ${isOverdue ? styles.badgeOverdue : styles.badgeActive}`}>
          <span className={styles.badgeDot} />
          {isOverdue ? 'Vencido' : 'Activo'}
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isOverdue ? 'var(--red)' : 'var(--green)' }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <div className={styles.daysBlock}>
        <span className={styles.daysNumber}>{isOverdue ? Math.abs(daysRemaining) : daysRemaining}</span>
        <span className={styles.daysLabel}>{isOverdue ? 'días de retraso' : 'días restantes'}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.details}>
        <div className={styles.detail}>
          <span>Último pago</span>
          <span>{new Date(membership.last_payment_date).toLocaleDateString()}</span>
        </div>
        <div className={styles.detail}>
          <span>Próximo vencimiento</span>
          <span>{new Date(membership.next_due_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
