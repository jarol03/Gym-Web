import { useAuth } from '../../features/auth/hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!profile) return <>{children}</>

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={() => navigate(isAdmin ? '/admin' : '/')}>
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

      {!isAdmin && (
        <nav className={styles.bottomNav}>
          <button
            className={`${styles.navItem} ${location.pathname === '/' ? styles.navActive : ''}`}
            onClick={() => navigate('/')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Inicio</span>
          </button>
        </nav>
      )}
    </div>
  )
}
