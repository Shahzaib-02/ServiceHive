/** Static category hero images served from /public/categories */
export const categoryImagePaths = {
  home: '/categories/home.png',
  automotive: '/categories/automotive.png',
  medical: '/categories/medical.png',
  tutoring: '/categories/tutoring.png',
  personal: '/categories/personal.png',
  emergency: '/categories/emergency.png',
}

export const getCategoryImage = (groupId) => {
  const key = String(groupId || '').toLowerCase()
  return categoryImagePaths[key] || ''
}

/**
 * Normalize image src for <img> tags.
 * API image paths stay relative (/api/...) so the Vite dev proxy serves them
 * same-origin. Absolute localhost:5000 URLs are blocked by CORP when embedded
 * from the Vite app on :5174.
 */
export const resolveServiceImageSrc = (src) => {
  if (!src || typeof src !== 'string') return ''
  const trimmed = src.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('data:')) return trimmed

  if (trimmed.startsWith('/api/')) return trimmed

  if (/^https?:\/\//i.test(trimmed)) {
    const relativeApi = trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000(\/api\/.*)$/i, '$2')
    if (relativeApi !== trimmed) return relativeApi
    return trimmed
  }

  return trimmed
}
