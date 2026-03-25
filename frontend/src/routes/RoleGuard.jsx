import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RoleGuard({ role, children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (profile?.role !== role) return <Navigate to="/unauthorized" replace />

  return children
}
