/** Avatar for UI: uploaded profile image or generated illustration from email/id. */
export function displayUserAvatarUrl(user) {
  const raw = user?.profileImageDataUrl
  const dataUrl = typeof raw === 'string' ? raw.trim() : ''
  if (dataUrl.startsWith('data:image/')) {
    return dataUrl
  }
  const seed = encodeURIComponent(user?.email || user?.id || user?.name || 'user')
  
  // Use local avatar directly to avoid DiceBear API timeouts
  // This prevents connection timeouts entirely
  return getLocalAvatar(seed)
}

/** Local fallback avatar generator */
function getLocalAvatar(seed) {
  // Generate a consistent avatar based on seed using simple shapes and colors
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  
  // Create a simple SVG avatar as data URL
  const svg = `
    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <circle cx="128" cy="128" r="128" fill="${colors[index]}" />
      <circle cx="128" cy="100" r="40" fill="white" />
      <path d="M 128 140 Q 100 180 128 200 Q 156 180 128 140" fill="white" />
      <circle cx="115" cy="90" r="8" fill="#333" />
      <circle cx="141" cy="90" r="8" fill="#333" />
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
