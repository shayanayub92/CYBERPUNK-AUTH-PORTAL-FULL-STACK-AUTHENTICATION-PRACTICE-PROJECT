import { useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import SuccessAnimation from '../components/auth/SuccessAnimation'
import PageTransition from '../components/common/PageTransition'

export default function Success() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <AuthShell show3d={false}>
        <div className="glass-card max-w-md rounded-2xl p-10">
          <SuccessAnimation
            title="IDENTITY VERIFIED"
            subtitle="Your CyberVault account is now active."
            onComplete={() => navigate('/login')}
          />
        </div>
      </AuthShell>
    </PageTransition>
  )
}
