import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--black)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
      }}>
        Cargando...
      </div>
    )
  }

  if (!profile) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
