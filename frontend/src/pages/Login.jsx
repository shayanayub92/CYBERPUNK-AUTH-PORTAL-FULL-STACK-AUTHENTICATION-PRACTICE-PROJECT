import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import CyberInput from '../components/common/CyberInput'
import CyberButton from '../components/common/CyberButton'
import PageTransition from '../components/common/PageTransition'
import { useAuth } from '../context/AuthContext'
import { mapAuthError } from '../utils/errors'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password, remember })
      navigate(from, { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(
        mapAuthError(detail) ||
          'Authentication failed. Check your credentials and try again.',
      )
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <AuthShell>
        <AuthCard title="SECURE LOGIN" subtitle="Access your secured vault">
          <form onSubmit={handleSubmit} className="space-y-5">
            <CyberInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              shake={shake}
            />
            <div className="relative">
              <CyberInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                shake={shake}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-500 hover:text-neon-cyan"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-slate-600 bg-black/40 text-neon-cyan focus:ring-neon-cyan/30"
              />
              Remember this device
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <CyberButton type="submit" loading={loading}>
              {loading ? 'LOGIN...' : 'LOGIN'}
            </CyberButton>

            <div className="flex flex-col gap-2 text-center text-sm">
              <Link to="/forgot-password" className="text-neon-cyan/80 hover:text-neon-cyan">
                Forgot Password?
              </Link>
              <Link to="/signup" className="text-slate-400 hover:text-white">
                Create Account
              </Link>
            </div>
          </form>
        </AuthCard>
      </AuthShell>
    </PageTransition>
  )
}
