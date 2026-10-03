export function getPasswordStrength(password) {
  if (!password || password.length < 8) {
    return { level: 'weak', label: 'WEAK', score: 0 }
  }

  let score = 0
  if (password.length >= 10) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 1) return { level: 'fair', label: 'FAIR', score: 1 }
  return { level: 'strong', label: 'STRONG', score: 2 }
}
