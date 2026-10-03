import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import SecuritySphere from '../components/3d/SecuritySphere'
import FloatingParticles from '../components/common/FloatingParticles'
import PageTransition from '../components/common/PageTransition'

const statusItems = [
  { label: 'IDENTITY PROTECTION', value: 'ACTIVE' },
  { label: 'EMAIL SECURITY', value: 'ENABLED' },
  { label: 'SESSION ENCRYPTION', value: 'ACTIVE' },
]

export default function Landing() {
  return (
    <PageTransition className="cyber-grid-bg relative min-h-screen overflow-hidden">
      <FloatingParticles count={28} />
      <Navbar />

      <main className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-2 lg:items-center lg:gap-4 lg:px-12 lg:pb-24">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center gap-2 font-display text-xs tracking-[0.25em] text-neon-cyan"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_12px_#00f0ff]" />
            SYSTEM ONLINE
          </motion.div>

          <motion.h1
            className="font-display text-3xl leading-tight font-bold tracking-wide text-white sm:text-4xl lg:text-5xl xl:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            SECURE YOUR
            <br />
            <span className="text-glow-cyan text-neon-cyan">DIGITAL IDENTITY</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-lg text-lg text-slate-400 sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Authentication engineered for the next generation.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Link
              to="/login"
              className="rounded-lg border border-neon-cyan/50 bg-neon-cyan/15 px-8 py-4 text-center font-display text-sm tracking-[0.25em] text-neon-cyan transition hover:bg-neon-cyan/25 hover:shadow-[0_0_32px_rgba(0,240,255,0.3)]"
            >
              ENTER THE VAULT
            </Link>
            <Link
              to="/signup"
              className="rounded-lg border border-neon-purple/40 px-8 py-4 text-center font-display text-sm tracking-[0.25em] text-slate-300 transition hover:border-neon-purple/70 hover:text-neon-purple"
            >
              CREATE IDENTITY
            </Link>
          </motion.div>

          <motion.div
            id="security"
            className="mt-12 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="glass-card rounded-xl px-4 py-3"
              >
                <p className="font-display text-[9px] tracking-[0.15em] text-slate-500">{item.label}</p>
                <p className="font-display mt-1 text-xs tracking-wider text-neon-cyan">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="order-1 h-[45vh] min-h-[280px] lg:order-2 lg:h-[70vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <SecuritySphere />
        </motion.div>
      </main>

      <section id="authentication" className="relative z-10 border-t border-slate-800/50 px-4 py-16 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl tracking-[0.2em] text-white">AUTHENTICATION STACK</h2>
          <p className="mt-4 text-slate-400">
            JWT sessions, email verification, OTP recovery, and Argon2 password hashing — built for practice at production depth.
          </p>
        </div>
      </section>

      <section id="technology" className="relative z-10 px-4 pb-20 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {['React · Three.js', 'FastAPI · SQLAlchemy', 'Redis · SMTP'].map((t) => (
            <div key={t} className="glass-card rounded-xl p-6 text-center font-display text-xs tracking-[0.2em] text-slate-400">
              {t}
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
