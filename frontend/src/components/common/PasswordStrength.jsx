import { getPasswordStrength } from '../../utils/passwordStrength'

const colors = {
  weak: 'from-red-500 to-red-600',
  fair: 'from-amber-400 to-orange-500',
  strong: 'from-neon-cyan to-neon-purple',
}

export default function PasswordStrength({ password }) {
  const { level, label } = getPasswordStrength(password)
  const width = level === 'weak' ? '33%' : level === 'fair' ? '66%' : '100%'

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${colors[level]}`}
          style={{ width }}
        />
      </div>
      <p className="font-display text-[10px] tracking-[0.25em] text-slate-500">
        STRENGTH: <span className="text-neon-cyan">{label}</span>
      </p>
    </div>
  )
}
