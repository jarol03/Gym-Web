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
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skelRow}>
            <div className={styles.skeleton} style={{ width: '50%', height: 16 }} />
            <div className={styles.skeleton} style={{ width: '30%', height: 14, marginTop: 4 }} />
          </div>
        ))}
      </div>
    )
  }

  if (error || !memberships) {
    return (
      <div className={styles.emptyState}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Error al cargar socios
      </div>
    )
  }

  if (memberships.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        </svg>
        No hay socios registrados
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {memberships.map((membership, index) => {
        const daysRemaining = getDaysUntilDue(membership.next_due_date)
        const isOverdue = membership.status === 'overdue'
        const isPayPending = markAsPaidMutation.isPending && markAsPaidMutation.variables === membership.id
        const isAttendancePending = markAttendanceMutation.isPending && markAttendanceMutation.variables === membership.member_id
        const attendedToday = todayAttendance?.includes(membership.member_id) ?? false

        return (
          <div
            key={membership.id}
            className={`${styles.row} ${isOverdue ? styles.rowOverdue : ''} ${attendedToday ? styles.rowAttended : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.accent} />
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{membership.profiles.full_name}</span>
                {attendedToday && (
                  <span className={styles.attendedBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>
                    Hoy
                  </span>
                )}
              </div>
              <span className={styles.phone}>{membership.profiles.phone}</span>
            </div>

            <div className={styles.actions}>
              <span className={`${styles.badge} ${isOverdue ? styles.badgeOverdue : styles.badgeActive}`}>
                {isOverdue ? `${Math.abs(daysRemaining)}d` : `${daysRemaining}d`}
              </span>

              <button
                className={`${styles.actionBtn} ${styles.attendanceBtn}`}
                disabled={isAttendancePending}
                onClick={() => markAttendanceMutation.mutate(membership.member_id)}
                title="Marcar asistencia"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </button>

              <button
                className={`${styles.actionBtn} ${styles.payBtn}`}
                disabled={isPayPending}
                onClick={() => markAsPaidMutation.mutate(membership.id)}
                title="Marcar como pagado"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
