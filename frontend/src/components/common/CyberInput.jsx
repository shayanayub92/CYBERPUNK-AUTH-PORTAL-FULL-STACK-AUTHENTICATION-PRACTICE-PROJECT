import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const CyberInput = forwardRef(function CyberInput(
  { label, error, shake = false, className = '', ...props },
  ref,
) {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <label className="block font-display text-xs tracking-[0.15em] text-slate-400 uppercase">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-lg border bg-black/40 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-neon-cyan/60 focus:shadow-[0_0_16px_rgba(0,240,255,0.15)] ${
          error ? 'border-red-500/60' : 'border-slate-700/80'
        }`}
        {...props}
      />
      {error && <p className="text-sm text-red-400/90">{error}</p>}
    </motion.div>
  )
})

export default CyberInput
