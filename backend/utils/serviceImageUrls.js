export const buildServiceImageUrls = (serviceId, count) => {
  const id = String(serviceId)
  const safeCount = Math.max(0, Number(count) || 0)
  return Array.from({ length: safeCount }, (_, index) => `/api/services/${id}/images/${index}`)
}

export const parseStoredImage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null

  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: 'redirect', url: trimmed }
  }

  const match = trimmed.match(/^data:([^;]+);base64,([\s\S]+)$/)
  if (!match) return null

  return {
    kind: 'buffer',
    contentType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  }
}
