import { motion } from 'framer-motion'

export default function AuthCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card glow-cyan w-full max-w-md rounded-2xl p-6 sm:p-8"
    >
      <div className="mb-8 text-center">
        <p className="font-display text-xs tracking-[0.4em] text-neon-cyan/80">CYBERVAULT</p>
        <h1 className="font-display mt-2 text-xl tracking-wide text-white sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}
