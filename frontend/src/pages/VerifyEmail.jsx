import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import OtpInput from '../components/common/OtpInput'
import CyberButton from '../components/common/CyberButton'
import SuccessAnimation from '../components/auth/SuccessAnimation'
import PageTransition from '../components/common/PageTransition'
import { authApi } from '../services/auth'
import { mapAuthError } from '../utils/errors'

const OTP_SECONDS = 300

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('input')
  const [scanText, setScanText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('cybervault_verify_email')
    if (!stored) {
      navigate('/signup')
      return
    }
    setEmail(stored)
  }, [navigate])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [secondsLeft])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const runVerifyAnimation = async () => {
    setPhase('scanning')
    setScanText('Scanning...')
    await new Promise((r) => setTimeout(r, 800))
    setScanText('Identity Found')
    await new Promise((r) => setTimeout(r, 800))
    setScanText('Identity Verified ✓')
    await new Promise((r) => setTimeout(r, 600))
    setPhase('success')
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return
    setError('')
    setLoading(true)
    try {
      await authApi.verifyEmail({ email, otp })
      sessionStorage.removeItem('cybervault_verify_email')
      await runVerifyAnimation()
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = mapAuthError(detail)
      if (msg.toLowerCase().includes('expired')) {
        setError('This verification code has expired. Request a new code.')
      } else {
        setError(msg || 'Verification code is incorrect.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    try {
      await authApi.resendVerification({ email })
      setSecondsLeft(OTP_SECONDS)
    } catch (err) {
      setError(mapAuthError(err.response?.data?.detail))
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <PageTransition>
      <AuthShell show3d={phase === 'input'}>
        <AnimatePresence mode="wait">
          {phase === 'success' ? (
            <motion.div key="success" className="glass-card max-w-md rounded-2xl p-10">
              <SuccessAnimation
                title="IDENTITY VERIFIED"
                subtitle="Your CyberVault account is now active."
                onComplete={() => navigate('/login')}
              />
            </motion.div>
          ) : phase === 'scanning' ? (
            <motion.div
              key="scan"
              className="glass-card flex min-h-[280px] max-w-md flex-col items-center justify-center rounded-2xl p-10"
            >
              <motion.div
                className="h-1 w-48 overflow-hidden rounded bg-slate-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-neon-cyan"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              <p className="font-display mt-8 tracking-[0.3em] text-neon-cyan">{scanText}</p>
            </motion.div>
          ) : (
            <AuthCard
              key="form"
              title="VERIFY YOUR IDENTITY"
              subtitle="We sent a verification code to your email."
            >
              <p className="mb-6 text-center text-sm text-slate-400">{email}</p>
              <form onSubmit={handleVerify} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                <p className="text-center font-display text-xs tracking-wider text-slate-500">
                  Expires in{' '}
                  <span className={secondsLeft < 60 ? 'text-red-400' : 'text-neon-cyan'}>
                    {formatTime(secondsLeft)}
                  </span>
                </p>
                {error && (
                  <p className="text-center text-sm text-red-300">{error}</p>
                )}
                <CyberButton type="submit" loading={loading} disabled={otp.length !== 6}>
                  {loading ? 'VERIFYING...' : 'VERIFY'}
                </CyberButton>
                <CyberButton
                  type="button"
                  variant="secondary"
                  loading={resendLoading}
                  onClick={handleResend}
                >
                  {resendLoading ? 'SENDING CODE...' : 'RESEND OTP'}
                </CyberButton>
              </form>
            </AuthCard>
          )}
        </AnimatePresence>
      </AuthShell>
    </PageTransition>
  )
}
