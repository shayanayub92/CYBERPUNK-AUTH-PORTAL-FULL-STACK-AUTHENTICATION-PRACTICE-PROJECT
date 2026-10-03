import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import CyberInput from '../components/common/CyberInput'
import CyberButton from '../components/common/CyberButton'
import PasswordStrength from '../components/common/PasswordStrength'
import PageTransition from '../components/common/PageTransition'
import { authApi } from '../services/auth'
import { mapAuthError } from '../utils/errors'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Use at least 8 characters with a stronger combination.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }

    setLoading(true)
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      })
      sessionStorage.setItem('cybervault_verify_email', form.email)
      navigate('/verify-email')
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
          title="CREATE YOUR DIGITAL IDENTITY"
          subtitle="Register for secure vault access"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput label="Name" value={form.name} onChange={update('name')} required />
            <CyberInput
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
            />
            <div>
              <CyberInput
                label="Password"
                type="password"
                value={form.password}
                onChange={update('password')}
                required
              />
              <PasswordStrength password={form.password} />
            </div>
            <CyberInput
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              required
            />

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <CyberButton type="submit" loading={loading}>
              {loading ? 'CREATING IDENTITY...' : 'CREATE IDENTITY'}
            </CyberButton>

            <p className="text-center text-sm text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="text-neon-cyan hover:underline">
                Login
              </Link>
            </p>
          </form>
        </AuthCard>
      </AuthShell>
    </PageTransition>
  )
}
