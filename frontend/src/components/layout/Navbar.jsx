import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { signOut } from '../../features/auth/authService'

export default function Navbar() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const isDoctor = profile?.role === 'doctor'
  const base = isDoctor ? '/doctor' : '/patient'

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: 56,
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      background: 'white',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span style={{ fontWeight: 600, fontSize: 18 }}>Hermes</span>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to={base}>Dashboard</Link>
          <Link to={`${base}/appointments`}>Appointments</Link>

          {isDoctor ? (
            <>
              <Link to="/doctor/patients">Patients</Link>
              <Link to="/doctor/availability">Availability</Link>
            </>
          ) : (
            <>
              <Link to="/patient/records">Records</Link>
              <Link to="/patient/doctors">Doctors</Link>
            </>
          )}

          <Link to={`${base}/profile`}>Profile</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: 14, color: 'gray' }}>
          {profile?.full_name}
        </span>
        <span style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 20,
          background: isDoctor ? '#dbeafe' : '#dcfce7',
          color: isDoctor ? '#1d4ed8' : '#15803d',
          textTransform: 'capitalize'
        }}>
          {profile?.role}
        </span>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  )
}
