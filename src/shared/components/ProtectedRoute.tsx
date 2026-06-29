import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>
  if (!profile) return <Navigate to="/login" replace />

  return <>{children}</>
}