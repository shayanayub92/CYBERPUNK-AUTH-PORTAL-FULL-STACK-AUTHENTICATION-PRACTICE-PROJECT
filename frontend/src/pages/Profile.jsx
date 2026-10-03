import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import AuthCard from '../components/auth/AuthCard'
import CyberInput from '../components/common/CyberInput'
import CyberButton from '../components/common/CyberButton'
import PasswordStrength from '../components/common/PasswordStrength'
import PageTransition from '../components/common/PageTransition'
import { useAuth } from '../context/AuthContext'
import { usersApi } from '../services/auth'
import { mapAuthError } from '../utils/errors'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user?.name])
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  const handleProfile = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    try {
      await usersApi.updateProfile({ name })
      await refreshUser()
      setProfileMsg('Profile updated.')
    } catch (err) {
      setProfileMsg(mapAuthError(err.response?.data?.detail))
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwMsg('')
    if (newPassword.length < 8) {
      setPwError('Use at least 8 characters with a stronger combination.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords must match.')
      return
    }
    setPwLoading(true)
    try {
      await usersApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      setPwMsg('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwError(mapAuthError(err.response?.data?.detail))
    } finally {
      setPwLoading(false)
    }
  }

  const created = user?.created_at
    ? new Date(user.created_at).toLocaleString()
    : '—'

  return (
    <PageTransition>
      <AuthShell show3d={false}>
        <div className="w-full max-w-lg space-y-6">
          <AuthCard title="PROFILE" subtitle="Manage your identity">
            <div className="mb-6 space-y-2 text-sm text-slate-400">
              <p>
                <span className="text-slate-500">Email:</span> {user?.email}
              </p>
              <p>
                <span className="text-slate-500">Verification:</span>{' '}
                {user?.is_email_verified ? 'Verified' : 'Pending'}
              </p>
              <p>
                <span className="text-slate-500">Created:</span> {created}
              </p>
            </div>
            <form onSubmit={handleProfile} className="space-y-4">
              <CyberInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              {profileMsg && <p className="text-sm text-neon-cyan">{profileMsg}</p>}
              <CyberButton type="submit" loading={profileLoading}>
                SAVE NAME
              </CyberButton>
            </form>
          </AuthCard>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <h3 className="font-display mb-4 text-sm tracking-[0.2em] text-white">CHANGE PASSWORD</h3>
            <form onSubmit={handlePassword} className="space-y-4">
              <CyberInput
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div>
                <CyberInput
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={newPassword} />
              </div>
              <CyberInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {pwError && <p className="text-sm text-red-300">{pwError}</p>}
              {pwMsg && <p className="text-sm text-neon-cyan">{pwMsg}</p>}
              <CyberButton type="submit" loading={pwLoading}>
                UPDATE PASSWORD
              </CyberButton>
            </form>
          </div>

          <Link to="/dashboard" className="block text-center text-sm text-slate-400 hover:text-neon-cyan">
            ← Back to Dashboard
          </Link>
        </div>
      </AuthShell>
    </PageTransition>
  )
}
