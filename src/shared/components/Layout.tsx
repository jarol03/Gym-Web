import { useAuth } from '../../features/auth/hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

interface NavTab {
  key: string
  label: string
  icon: React.ReactNode
}

const userTabs: NavTab[] = [
  {
    key: 'inicio',
    label: 'Inicio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'checkin',
    label: 'Check-in',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    key: 'anuncios',
    label: 'Anuncios',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const adminTabs: NavTab[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    key: 'socios',
    label: 'Socios',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'inventario',
    label: 'Inventario',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    key: 'anuncios',
    label: 'Anuncios',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!profile) return <>{children}</>

  const tabs = isAdmin ? adminTabs : userTabs
  const basePath = isAdmin ? '/admin' : '/'
  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab') || (isAdmin ? 'dashboard' : 'inicio')

  // On /checkin route, highlight "checkin" tab for users
  const effectiveTab = !isAdmin && location.pathname === '/checkin'
    ? 'checkin'
    : currentTab

  function handleTabClick(tabKey: string) {
    if (!isAdmin && tabKey === 'checkin') {
      navigate('/checkin')
      return
    }
    const params = new URLSearchParams(location.search)
    if (tabKey === (isAdmin ? 'dashboard' : 'inicio')) {
      params.delete('tab')
    } else {
      params.set('tab', tabKey)
    }
    const qs = params.toString()
    navigate(qs ? `${basePath}?${qs}` : basePath, { replace: true })
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={() => navigate(basePath)}>
          IRON FIT
        </button>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{profile.full_name}</span>
          <button className={styles.logoutBtn} onClick={logout} title="Cerrar sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = effectiveTab === tab.key
          return (
            <button
              key={tab.key}
              className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.icon}
              <span className={styles.navLabel}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
