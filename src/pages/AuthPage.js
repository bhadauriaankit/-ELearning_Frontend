import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login, register } from '../api'
import { ErrorMsg } from '../components/ui'

export default function AuthPage() {
  const [tab, setTab]         = useState('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { loginSuccess } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (tab === 'register') {
        await register(name, email, password)
        setTab('login')
        setError('')
        setName('')
        setPassword('')
      } else {
        const data = await login(email, password)
        const token = typeof data === 'string' ? data : data.token
        loginSuccess(token)
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'var(--bg-primary)' }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
             style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md animate-fade-up relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-mono text-3xl font-medium text-accent mb-2">ELearn</div>
          <p className="text-sm text-muted">Smart Exam Platform</p>
        </div>

        {/* Card */}
        <div className="card glow-blue">

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: '#080c14' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                      className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                      style={{
                        background: tab === t ? 'var(--accent)' : 'transparent',
                        color: tab === t ? '#fff' : 'var(--muted)',
                      }}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'register' && (
              <div className="animate-fade-up">
                <label className="label">Full Name</label>
                <input className="input" type="text" placeholder="Ankit Bhadauria"
                       value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                     value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                     value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <ErrorMsg msg={error} />}

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {tab === 'register' && (
            <p className="text-xs text-muted text-center mt-4">
              All new accounts are created as <span className="badge badge-blue ml-1">STUDENT</span>
              <br />Contact admin to change your role.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
