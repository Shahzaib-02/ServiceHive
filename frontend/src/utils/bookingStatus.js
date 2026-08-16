/** Canonical booking lifecycle (frontend simulation). */
export const BOOKING_STATUS = {
  CREATED: 'created',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_SUCCESSFUL: 'payment_successful',
  PENDING_PROVIDER: 'pending_provider',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUND: 'refund',
}

export const bookingStatusLabel = {
  [BOOKING_STATUS.CREATED]: 'Created',
  [BOOKING_STATUS.PAYMENT_PENDING]: 'Payment pending',
  [BOOKING_STATUS.PAYMENT_SUCCESSFUL]: 'Payment successful',
  [BOOKING_STATUS.PENDING_PROVIDER]: 'Pending provider',
  [BOOKING_STATUS.ACCEPTED]: 'Accepted',
  [BOOKING_STATUS.REJECTED]: 'Rejected',
  [BOOKING_STATUS.IN_PROGRESS]: 'In progress',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.REFUND]: 'Refund',
}

export const paymentStatusLabel = {
  unpaid: 'Unpaid',
  paid: 'Paid',
  refund_pending: 'Refund pending',
  refunded: 'Refunded',
}

export function labelForBookingStatus(status) {
  return bookingStatusLabel[status] || String(status || '').replace(/_/g, ' ') || 'Unknown'
}

export function customerCanTrack(status) {
  return status === BOOKING_STATUS.ACCEPTED || status === BOOKING_STATUS.IN_PROGRESS
}

export function customerCanChat(status) {
  return customerCanTrack(status)
}

export function customerCanReviewBooking(booking) {
  return booking?.status === BOOKING_STATUS.COMPLETED
}

export function providerPendingStatuses() {
  return [BOOKING_STATUS.PENDING_PROVIDER]
}

export function providerActiveJobStatuses() {
  return [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS]
}
