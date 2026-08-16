/**
 * Commission and fee rates for ServiceHive platform
 */

/** Platform commission rate (8%) */
export const ADMIN_COMMISSION_RATE = 0.08;

/** Refund processing fee rate (6%) */
export const REFUND_FEE_RATE = 0.06;

/**
 * Calculate admin commission amount
 * @param {number} amount - Total amount
 * @returns {number} Admin commission amount
 */
export function calculateAdminCommission(amount) {
  const total = Number(amount || 0);
  return Math.round(total * ADMIN_COMMISSION_RATE * 100) / 100;
}

/**
 * Calculate provider net amount after commission
 * @param {number} amount - Total amount
 * @returns {number} Provider net amount
 */
export function calculateProviderNetAmount(amount) {
  const total = Number(amount || 0);
  const commission = calculateAdminCommission(total);
  return Math.round((total - commission) * 100) / 100;
}

/**
 * Calculate refund processing fee
 * @param {number} refundAmount - Refund amount
 * @returns {number} Refund fee amount
 */
export function calculateRefundFee(refundAmount) {
  const refund = Number(refundAmount || 0);
  return Math.round(refund * REFUND_FEE_RATE * 100) / 100;
}

/**
 * Calculate net refund amount after processing fee
 * @param {number} originalAmount - Original refund amount
 * @returns {number} Net refund amount
 */
export function calculateNetRefundAmount(originalAmount) {
  const original = Number(originalAmount || 0);
  const fee = calculateRefundFee(original);
  return Math.round((original - fee) * 100) / 100;
}
