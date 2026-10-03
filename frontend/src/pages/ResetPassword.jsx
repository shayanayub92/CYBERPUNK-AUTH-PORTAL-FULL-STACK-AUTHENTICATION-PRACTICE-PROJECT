import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import CyberInput from '../components/common/CyberInput'
import CyberButton from '../components/common/CyberButton'
import PasswordStrength from '../components/common/PasswordStrength'
import SuccessAnimation from '../components/auth/SuccessAnimation'
import PageTransition from '../components/common/PageTransition'
import { authApi } from '../services/auth'
import { mapAuthError } from '../utils/errors'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('cybervault_reset_email') || ''
    setEmail(stored)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Use at least 8 characters with a stronger combination.')
      return
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword({
        email,
        otp,
        new_password: password,
        confirm_password: confirmPassword,
      })
      sessionStorage.removeItem('cybervault_reset_email')
      setSuccess(true)
    } catch (err) {
      const msg = mapAuthError(err.response?.data?.detail)
      if (msg.toLowerCase().includes('expired')) {
        setError('This verification code has expired. Request a new code.')
      } else {
        setError(msg || 'Verification code is incorrect.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <PageTransition>
        <AuthShell show3d={false}>
          <div className="glass-card max-w-md rounded-2xl p-10">
            <SuccessAnimation
              title="ACCESS RESTORED"
              subtitle="Your password has been updated. Sign in with your new credentials."
              onComplete={() => navigate('/login')}
            />
          </div>
        </AuthShell>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <AuthShell>
        <AuthCard title="RESTORE ACCESS" subtitle="Enter your recovery code and new password">
          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CyberInput
              label="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              required
            />
            <div>
              <CyberInput
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrength password={password} />
            </div>
            <CyberInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <CyberButton type="submit" loading={loading}>
              {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
            </CyberButton>
            <Link to="/forgot-password" className="block text-center text-sm text-neon-cyan">
              Request new code
            </Link>
          </form>
        </AuthCard>
      </AuthShell>
    </PageTransition>
  )
}
