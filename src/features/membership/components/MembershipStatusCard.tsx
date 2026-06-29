import { useMyMembership } from '../hooks/useMyMembership'
import { getDaysUntilDue } from '../utils'
import styles from './MembershipStatusCard.module.css'

export function MembershipStatusCard() {
  const { data: membership, isLoading, error } = useMyMembership()

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando tu membresía...</p>
  }

  if (error || !membership) {
    return <p className={styles.errorText}>No se pudo cargar tu información de membresía</p>
  }

  const daysRemaining = getDaysUntilDue(membership.next_due_date)
  const isOverdue = membership.status === 'overdue'

  return (
    <div className={styles.card}>
      <span className={`${styles.statusBadge} ${isOverdue ? styles.statusOverdue : styles.statusActive}`}>
        {isOverdue ? 'Pago vencido' : 'Membresía activa'}
      </span>

      <p className={styles.daysNumber}>
        {isOverdue ? Math.abs(daysRemaining) : daysRemaining}
      </p>
      <p className={styles.daysLabel}>
        {isOverdue ? 'días de retraso' : 'días para tu próximo pago'}
      </p>

      <div className={styles.detail}>
        <span>Último pago</span>
        <span>{new Date(membership.last_payment_date).toLocaleDateString()}</span>
      </div>
      <div className={styles.detail}>
        <span>Próximo vencimiento</span>
        <span>{new Date(membership.next_due_date).toLocaleDateString()}</span>
      </div>
    </div>
  )
}