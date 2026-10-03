import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function SuccessAnimation({ title, subtitle, onComplete }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onAnimationComplete={() => {
        if (onComplete) setTimeout(onComplete, 2200)
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute h-32 w-32 rounded-full border border-neon-cyan/30"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
          transition={{ duration: 1.8, delay: i * 0.25, repeat: Infinity, repeatDelay: 0.5 }}
        />
      ))}
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 shadow-[0_0_60px_rgba(0,240,255,0.4)]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Check className="h-12 w-12 text-neon-cyan" strokeWidth={2.5} />
      </motion.div>
      <motion.h2
        className="font-display mt-8 text-2xl tracking-[0.2em] text-white"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mt-3 max-w-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  )
}
