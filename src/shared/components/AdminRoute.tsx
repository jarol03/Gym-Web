import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useAuth()

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>
  if (!profile) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}