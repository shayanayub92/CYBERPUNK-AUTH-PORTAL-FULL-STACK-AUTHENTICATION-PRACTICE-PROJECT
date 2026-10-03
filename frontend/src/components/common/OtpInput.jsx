import { useRef, useEffect } from 'react'

export default function OtpInput({ value, onChange, disabled = false }) {
  const inputsRef = useRef([])
  const digits = (value || '').padEnd(6, ' ').slice(0, 6).split('')

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const update = (next) => {
    const cleaned = next.replace(/\D/g, '').slice(0, 6)
    onChange(cleaned)
  }

  const handleChange = (index, char) => {
    if (!/^\d?$/.test(char)) return
    const arr = digits.map((d) => (d === ' ' ? '' : d))
    arr[index] = char
    update(arr.join(''))
    if (char && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    update(e.clipboardData.getData('text'))
    const len = Math.min(6, e.clipboardData.getData('text').replace(/\D/g, '').length)
    inputsRef.current[Math.min(len, 5)]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={d.trim()}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-12 w-10 rounded-lg border border-slate-700/80 bg-black/50 text-center font-display text-lg text-neon-cyan outline-none transition-all focus:border-neon-cyan/70 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)] sm:h-14 sm:w-12"
        />
      ))}
    </div>
  )
}
