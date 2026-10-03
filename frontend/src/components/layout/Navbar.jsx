import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar({ variant = 'landing' }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 flex items-center justify-between px-4 py-5 sm:px-8 lg:px-12"
    >
      <Link to="/" className="font-display text-lg tracking-[0.35em] text-white sm:text-xl">
        CYBER<span className="text-neon-cyan text-glow-cyan">VAULT</span>
      </Link>

      {variant === 'landing' && (
        <nav className="hidden items-center gap-8 md:flex">
          {['Security', 'Authentication', 'Technology'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-display text-xs tracking-[0.2em] text-slate-400 transition-colors hover:text-neon-cyan"
            >
              {item.toUpperCase()}
            </a>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/login"
          className="rounded-lg border border-slate-700/60 px-3 py-2 font-display text-[10px] tracking-[0.2em] text-slate-300 transition hover:border-neon-cyan/50 hover:text-neon-cyan sm:px-4 sm:text-xs"
        >
          LOGIN
        </Link>
        <Link
          to="/signup"
          className="rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-2 font-display text-[10px] tracking-[0.2em] text-neon-cyan transition hover:bg-neon-cyan/20 sm:px-4 sm:text-xs"
        >
          CREATE ACCOUNT
        </Link>
      </div>
    </motion.header>
  )
}
