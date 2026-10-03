import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import CyberButton from '../components/common/CyberButton'
import PageTransition from '../components/common/PageTransition'
import FloatingParticles from '../components/common/FloatingParticles'

function StatusRow({ label, value, ok = true }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/80 py-3 last:border-0">
      <span className="font-display text-xs tracking-[0.15em] text-slate-500">{label}</span>
      <span className={`font-display text-xs tracking-wider ${ok ? 'text-neon-cyan' : 'text-amber-400'}`}>
        {value}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <PageTransition className="cyber-grid-bg relative min-h-screen">
      <FloatingParticles count={16} />
      <header className="relative z-10 flex items-center justify-between border-b border-slate-800/50 px-4 py-5 sm:px-8">
        <Link to="/" className="font-display text-sm tracking-[0.35em]">
          CYBER<span className="text-neon-cyan">VAULT</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/profile" className="text-slate-400 hover:text-neon-cyan">
            Profile
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-slate-400">Your vault session is secured.</p>
        </motion.div>

        <motion.div
          className="glass-card mt-10 rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="font-display mb-4 text-sm tracking-[0.25em] text-neon-purple">SECURITY STATUS</h2>
          <StatusRow label="EMAIL" value={user?.is_email_verified ? 'VERIFIED' : 'PENDING'} />
          <StatusRow label="ACCOUNT" value={user?.is_active ? 'ACTIVE' : 'INACTIVE'} />
          <StatusRow label="SESSION" value="SECURE" />
          <StatusRow label="MEMBER SINCE" value={memberSince} ok={false} />
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/profile" className="flex-1">
            <CyberButton variant="primary" className="w-full">
              PROFILE
            </CyberButton>
          </Link>
          <CyberButton variant="secondary" onClick={() => logout().then(() => (window.location.href = '/login'))}>
            LOGOUT
          </CyberButton>
        </div>
      </main>
    </PageTransition>
  )
}
