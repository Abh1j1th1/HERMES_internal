import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Unauthorized() {
  const { profile } = useAuth()

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Access denied</h1>
      <p style={{ color: 'gray', marginBottom: '2rem' }}>
        You don't have permission to view that page.
      </p>
      <Link to={profile?.role === 'doctor' ? '/doctor' : '/patient'}>
        Go to my dashboard
      </Link>
    </div>
  )
}
