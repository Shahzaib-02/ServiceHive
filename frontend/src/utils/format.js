export const formatMoney = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export const formatStatus = (value) => String(value || 'pending').replace(/_/g, ' ')

export const buildAuthHeaders = (token, user) => ({
  Authorization: `Bearer ${token}`,
  'x-user-id': user?.id || '',
})
