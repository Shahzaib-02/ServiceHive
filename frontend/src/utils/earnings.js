/** Platform commission (8%) — provider receives the remainder. */
export const ADMIN_COMMISSION_RATE = 0.08

/** Refund processing fee (6%) — deducted from refund amount. */
export const REFUND_FEE_RATE = 0.06

export function providerNetAmount(grossAmount) {
  const gross = Number(grossAmount || 0)
  return Math.round(gross * (1 - ADMIN_COMMISSION_RATE) * 100) / 100
}

export function platformFeeAmount(grossAmount) {
  const gross = Number(grossAmount || 0)
  return Math.round(gross * ADMIN_COMMISSION_RATE * 100) / 100
}

export function refundFeeAmount(refundAmount) {
  const refund = Number(refundAmount || 0)
  return Math.round(refund * REFUND_FEE_RATE * 100) / 100
}

export function netRefundAmount(originalAmount) {
  const original = Number(originalAmount || 0)
  const fee = refundFeeAmount(original)
  return Math.round((original - fee) * 100) / 100
}

/**
 * Sum provider earnings from completed, paid bookings.
 * @param {Array<{ status: string, paymentStatus: string, amount: number, providerId: string }>} bookings
 * @param {string} providerId
 */
export function sumProviderEarnings(bookings, providerId) {
  return bookings
    .filter(
      (b) =>
        b.providerId === providerId
        && b.status === 'completed'
        && b.paymentStatus === 'paid',
    )
    .reduce((sum, b) => sum + providerNetAmount(b.amount), 0)
}
