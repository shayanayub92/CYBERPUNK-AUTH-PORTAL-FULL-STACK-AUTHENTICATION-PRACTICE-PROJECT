export function mapAuthError(detail) {
  if (!detail) return 'Something went wrong. Please try again.'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d.message).join(' ')
  }
  return 'Something went wrong. Please try again.'
}
