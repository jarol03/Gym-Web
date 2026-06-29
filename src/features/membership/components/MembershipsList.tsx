import { useAllMemberships } from '../hooks/useAllMemberships'
import { useMarkAsPaid } from '../hooks/useMarkAsPaid'
import { useMarkManualAttendance } from '../../attendance/hooks/useMarkManualAttendance'
import { useTodayAttendance } from '../../attendance/hooks/useTodayAttendance'
import { getDaysUntilDue } from '../utils'
import styles from './MembershipsList.module.css'

export function MembershipsList() {
  const { data: memberships, isLoading, error } = useAllMemberships()
  const { data: todayAttendance } = useTodayAttendance()
  const markAsPaidMutation = useMarkAsPaid()
  const markAttendanceMutation = useMarkManualAttendance()

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando socios...</p>
  }

  if (error || !memberships) {
    return <p className={styles.errorText}>No se pudieron cargar los socios</p>
  }

  return (
    <div className={styles.container}>
      {memberships.map((membership) => {
        const daysRemaining = getDaysUntilDue(membership.next_due_date)
        const isOverdue = membership.status === 'overdue'
        const isPayPending = markAsPaidMutation.isPending && markAsPaidMutation.variables === membership.id
        const isAttendancePending =
          markAttendanceMutation.isPending && markAttendanceMutation.variables === membership.member_id
        const attendedToday = todayAttendance?.includes(membership.member_id) ?? false

        return (
          <div key={membership.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.name}>{membership.profiles.full_name}</span>
              <span className={styles.phone}>{membership.profiles.phone}</span>
              {attendedToday && <span className={styles.attendedBadge}>✓ Asistió hoy</span>}
            </div>

            <div className={styles.statusRow}>
              <span className={`${styles.badge} ${isOverdue ? styles.badgeOverdue : styles.badgeActive}`}>
                {isOverdue ? `Vencido (${Math.abs(daysRemaining)}d)` : `${daysRemaining}d restantes`}
              </span>

              <button
                className={styles.attendanceButton}
                disabled={isAttendancePending}
                onClick={() => markAttendanceMutation.mutate(membership.member_id)}
              >
                {isAttendancePending ? 'Marcando...' : attendedToday ? 'Marcar otra vez' : 'Marcar asistencia'}
              </button>

              <button
                className={styles.payButton}
                disabled={isPayPending}
                onClick={() => markAsPaidMutation.mutate(membership.id)}
              >
                {isPayPending ? 'Guardando...' : 'Marcar pagado'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}