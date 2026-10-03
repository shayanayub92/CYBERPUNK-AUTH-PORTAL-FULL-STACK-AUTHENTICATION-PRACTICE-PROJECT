import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import CyberInput from '../components/common/CyberInput'
import CyberButton from '../components/common/CyberButton'
import PageTransition from '../components/common/PageTransition'
import { authApi } from '../services/auth'
import { mapAuthError } from '../utils/errors'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await authApi.forgotPassword({ email })
      sessionStorage.setItem('cybervault_reset_email', email)
      setMessage('If an account exists for this email, a recovery code has been sent.')
      setTimeout(() => navigate('/reset-password'), 1500)
    } catch (err) {
      setError(mapAuthError(err.response?.data?.detail))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <AuthShell>
        <AuthCard
          title="RECOVER ACCESS"
          subtitle="Enter your email to receive a secure recovery code."
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <CyberInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {message && (
              <p className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-sm text-neon-cyan/90">
                {message}
              </p>
            )}
            {error && <p className="text-sm text-red-300">{error}</p>}
            <CyberButton type="submit" loading={loading}>
              {loading ? 'SENDING CODE...' : 'SEND RECOVERY CODE'}
            </CyberButton>
            <Link to="/login" className="block text-center text-sm text-slate-400 hover:text-white">
              Back to Login
            </Link>
          </form>
        </AuthCard>
      </AuthShell>
    </PageTransition>
  )
}
