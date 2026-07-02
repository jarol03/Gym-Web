import { useAllMemberships } from '../hooks/useAllMemberships'
import { useTodayAttendance } from '../../attendance/hooks/useTodayAttendance'
import { useInventory } from '../../inventory/hooks/useInventory'
import styles from './AdminStats.module.css'

function StatCard({
  icon,
  label,
  value,
  color,
  sub,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
  sub?: string
  delay: number
}) {
  return (
    <div className={styles.card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.cardIcon} style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardValue}>{value}</span>
        <span className={styles.cardLabel}>{label}</span>
        {sub && <span className={styles.cardSub}>{sub}</span>}
      </div>
    </div>
  )
}

export function AdminStats() {
  const { data: memberships } = useAllMemberships()
  const { data: todayAttendance } = useTodayAttendance()
  const { data: inventory } = useInventory()

  const totalMembers = memberships?.length ?? 0
  const overdueCount = memberships?.filter((m) => m.status === 'overdue').length ?? 0
  const activeCount = totalMembers - overdueCount
  const todayCount = todayAttendance?.length ?? 0
  const totalItems = inventory?.length ?? 0
  const lowStockItems = inventory?.filter((i) => i.quantity <= i.min_stock_alert).length ?? 0

  return (
    <div className={styles.grid}>
      <StatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          </svg>
        }
        label="Total usuarios"
        value={totalMembers}
        color="var(--purple)"
        sub={`${activeCount} activos · ${overdueCount} vencidos`}
        delay={0.08}
      />
      <StatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
        label="Asistencia hoy"
        value={todayCount}
        color="var(--green)"
        delay={0.14}
      />
      <StatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        }
        label="Items inventario"
        value={totalItems}
        color="var(--cyan)"
        sub={`${lowStockItems} con stock bajo`}
        delay={0.2}
      />
      <StatCard
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
        label="Usuarios vencidos"
        value={overdueCount}
        color="var(--red)"
        delay={0.26}
      />
    </div>
  )
}
