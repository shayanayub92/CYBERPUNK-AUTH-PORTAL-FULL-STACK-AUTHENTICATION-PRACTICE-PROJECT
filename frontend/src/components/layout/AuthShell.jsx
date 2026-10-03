import SecuritySphere from '../3d/SecuritySphere'
import FloatingParticles from '../common/FloatingParticles'

export default function AuthShell({ children, show3d = true }) {
  return (
    <div className="cyber-grid-bg relative flex min-h-screen flex-col lg:flex-row">
      <FloatingParticles count={20} />
      {show3d && (
        <div className="relative hidden min-h-[40vh] flex-1 lg:block lg:min-h-screen">
          <SecuritySphere compact />
        </div>
      )}
      <div className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-8">
        {children}
      </div>
    </div>
  )
}
