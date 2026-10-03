import { motion } from 'framer-motion'

export default function Loader({ label = 'LOADING...' }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-10 w-10">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-neon-cyan/20 border-t-neon-cyan"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-2 rounded-full bg-neon-cyan/10 blur-sm" />
      </div>
      <span className="font-display text-xs tracking-[0.3em] text-neon-cyan/80">{label}</span>
    </div>
  )
}
