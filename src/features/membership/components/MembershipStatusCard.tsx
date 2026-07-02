import { useMyMembership } from '../hooks/useMyMembership'
import { getDaysUntilDue } from '../utils'
import styles from './MembershipStatusCard.module.css'

export function MembershipStatusCard() {
  const { data: membership, isLoading, error } = useMyMembership()

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.skelGlow} />
        <div className={styles.skeleton} style={{ width: 90, height: 22, borderRadius: 9999 }} />
        <div className={styles.skeleton} style={{ width: 100, height: 56, marginTop: 16, marginInline: 'auto' }} />
        <div className={styles.skeleton} style={{ width: 140, height: 14, marginTop: 8, marginInline: 'auto' }} />
        <div className={styles.skeleton} style={{ width: '100%', height: 6, marginTop: 16, borderRadius: 3 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div className={styles.skeleton} style={{ width: '100%', height: 14 }} />
          <div className={styles.skeleton} style={{ width: '100%', height: 14 }} />
        </div>
      </div>
    )
  }

  if (error || !membership) {
    return (
      <div className={`${styles.card} ${styles.cardError}`}>
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

  const lastPay = new Date(membership.last_payment_date)
  const nextDue = new Date(membership.next_due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalPeriod = Math.round((nextDue.getTime() - lastPay.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.round((today.getTime() - lastPay.getTime()) / (1000 * 60 * 60 * 24))
  const progress = isOverdue ? 100 : Math.min(Math.round((daysElapsed / totalPeriod) * 100), 100)

  return (
    <div className={`${styles.card} ${isOverdue ? styles.cardOverdue : styles.cardActive}`}>
      <div className={styles.cardGlow} />
      <div className={styles.shine} />

      <div className={styles.topRow}>
        <span className={`${styles.badge} ${isOverdue ? styles.badgeOverdue : styles.badgeActive}`}>
          <span className={styles.badgeDot} />
          {isOverdue ? 'Vencido' : 'Activo'}
        </span>
        <div className={styles.statusIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <div className={styles.daysBlock}>
        <span className={styles.daysNumber}>
          {isOverdue ? Math.abs(daysRemaining) : daysRemaining}
        </span>
        <span className={styles.daysLabel}>
          {isOverdue ? 'días de retraso' : 'días restantes'}
        </span>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressBar} ${isOverdue ? styles.progressOverdue : styles.progressActive}`}
            style={{ width: `${isOverdue ? 100 : progress}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {isOverdue ? 'Período vencido' : `${progress}% del período`}
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Último pago
          </span>
          <span className={styles.detailValue}>{new Date(membership.last_payment_date).toLocaleDateString()}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Próximo vencimiento
          </span>
          <span className={styles.detailValue}>{new Date(membership.next_due_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
