import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../features/auth/authService'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [gender, setGender] = useState('male')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signUp({ email, password, fullName, role, gender })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #f0f6fa; }
        .signup-panel { width: 420px; min-height: 100vh; background: #fff; display: flex; flex-direction: column; justify-content: center; padding: 3rem; position: relative; z-index: 1; box-shadow: 4px 0 40px rgba(0,80,120,0.07); }
        .signup-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 3rem; }
        .signup-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #0e7fa8, #12b3c8); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .signup-logo-icon svg { width: 20px; height: 20px; fill: none; stroke: white; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .signup-logo-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; color: #0b2d3e; letter-spacing: 0.01em; }
        .signup-heading { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 500; color: #0b2d3e; line-height: 1.2; margin-bottom: 0.5rem; }
        .signup-subheading { font-size: 0.92rem; color: #7a9aaa; margin-bottom: 2.5rem; font-weight: 400; }
        .signup-subheading a { color: #0e7fa8; text-decoration: none; font-weight: 500; }
        .signup-subheading a:hover { text-decoration: underline; }
        .signup-error { background: #fff2f2; border: 1px solid #ffc8c8; color: #c0392b; font-size: 0.85rem; padding: 0.7rem 1rem; border-radius: 8px; margin-bottom: 1.25rem; }
        .field-group { margin-bottom: 1.25rem; }
        .field-label { display: block; font-size: 0.8rem; font-weight: 600; color: #3d6272; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.45rem; }
        .field-wrap { position: relative; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9fc0cc; display: flex; align-items: center; pointer-events: none; transition: color 0.2s; }
        .field-wrap.focused .field-icon { color: #0e7fa8; }
        .field-input { width: 100%; padding: 0.75rem 0.9rem 0.75rem 2.75rem; border: 1.5px solid #d4e8f0; border-radius: 10px; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; color: #0b2d3e; background: #f7fbfd; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; -webkit-appearance: none; }
        .field-input:focus { border-color: #0e7fa8; background: #fff; box-shadow: 0 0 0 3px rgba(14,127,168,0.1); }
        .toggle-group { display: flex; gap: 0.75rem; margin-top: 0.45rem; }
        .toggle-btn { flex: 1; padding: 0.7rem; border: 1.5px solid #d4e8f0; border-radius: 10px; background: #f7fbfd; color: #3d6272; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .toggle-btn.active { border-color: #0e7fa8; background: #e0f4fa; color: #0e7fa8; }
        .signup-btn { width: 100%; margin-top: 2rem; padding: 0.85rem; background: linear-gradient(135deg, #0e7fa8 0%, #0aa8c0 100%); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; letter-spacing: 0.03em; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 14px rgba(14,127,168,0.3); }
        .signup-btn:hover:not(:disabled) { opacity: 0.93; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(14,127,168,0.38); }
        .signup-btn:active:not(:disabled) { transform: translateY(0); }
        .signup-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .signup-btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .signup-divider { display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0 0; color: #b0cdd8; font-size: 0.8rem; }
        .signup-divider::before, .signup-divider::after { content: ''; flex: 1; height: 1px; background: #e2eef3; }
        .signup-visual { flex: 1; background: linear-gradient(145deg, #0b3d52 0%, #0e7fa8 50%, #12c8d8 100%); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .signup-visual::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%); }
        .visual-card { position: relative; z-index: 1; text-align: center; color: #fff; padding: 2rem; max-width: 340px; }
        .visual-icon { width: 80px; height: 80px; background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.75rem; backdrop-filter: blur(8px); }
        .visual-icon svg { width: 38px; height: 38px; stroke: white; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
        .visual-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 500; margin-bottom: 0.75rem; line-height: 1.3; }
        .visual-desc { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
        .visual-features { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; text-align: left; }
        .visual-feature { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: rgba(255,255,255,0.85); }
        .visual-feature-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.6); flex-shrink: 0; }
        @media (max-width: 700px) { .signup-visual { display: none; } .signup-panel { width: 100%; padding: 2.5rem 1.5rem; } }
      `}</style>

      <div className="signup-root">
        <div className="signup-panel">
          <div className="signup-logo">
            <div className="signup-logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"/>
                <path d="M12 8v4l2 2"/>
              </svg>
            </div>
            <span className="signup-logo-name">MediCare</span>
          </div>

          <h1 className="signup-heading">Create account</h1>
          <p className="signup-subheading">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

          {error && <div className="signup-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Full name</label>
              <div className={`field-wrap${focused === 'name' ? ' focused' : ''}`}>
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="field-input"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Email address</label>
              <div className={`field-wrap${focused === 'email' ? ' focused' : ''}`}>
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  className="field-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className={`field-wrap${focused === 'password' ? ' focused' : ''}`}>
                <span className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="field-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">I am a</label>
              <div className="toggle-group">
                {['patient', 'doctor'].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`toggle-btn${role === r ? ' active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Gender</label>
              <div className="toggle-group">
                {['male', 'female', 'other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`toggle-btn${gender === g ? ' active' : ''}`}
                    onClick={() => setGender(g)}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button className="signup-btn" type="submit" disabled={loading}>
              {loading && <span className="signup-btn-spinner" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="signup-divider">Secure, HIPAA-compliant access</div>
        </div>

        <div className="signup-visual">
          <div className="visual-card">
            <div className="visual-icon">
              <svg viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="visual-title">Join thousands of patients and doctors</div>
            <p className="visual-desc">
              Create your account in seconds and start managing your healthcare journey today.
            </p>
            <div className="visual-features">
              <div className="visual-feature"><div className="visual-feature-dot"></div>Book appointments instantly</div>
              <div className="visual-feature"><div className="visual-feature-dot"></div>Access your medical records anytime</div>
              <div className="visual-feature"><div className="visual-feature-dot"></div>Connect with your care team</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
