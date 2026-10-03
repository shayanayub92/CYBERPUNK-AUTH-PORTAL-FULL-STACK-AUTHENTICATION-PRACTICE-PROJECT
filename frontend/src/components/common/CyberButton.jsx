import { motion } from 'framer-motion'

export default function CyberButton({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  onClick,
}) {
  const isDisabled = disabled || loading
  const base =
    'relative w-full overflow-hidden rounded-lg px-6 py-3 font-display text-sm tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/40 hover:border-neon-cyan/70 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)]',
    secondary:
      'bg-transparent text-slate-300 border border-slate-600/50 hover:border-neon-purple/50 hover:text-neon-purple',
    ghost: 'bg-transparent text-neon-cyan border border-transparent hover:bg-neon-cyan/5',
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
    >
      <span className="relative z-10">{loading ? `${children}`.replace(/\.\.\.$/, '') + '...' : children}</span>
      {variant === 'primary' && !isDisabled && (
        <motion.span
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}
