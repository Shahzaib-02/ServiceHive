import { apiRequest } from './client'

export const fetchServicesRequest = ({
  search = '',
  category = '',
  group = '',
  providerId = '',
  isApproved = '',
} = {}) => {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (group) params.set('group', group)
  if (providerId) params.set('providerId', providerId)
  if (isApproved === true || isApproved === 'true') params.set('isApproved', 'true')

  const queryString = params.toString()
  return apiRequest({
    path: `/api/services${queryString ? `?${queryString}` : ''}`,
  })
}

export const normalizeServicesList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.services)) return data.services
  return []
}

export const createServiceRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/services',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })

export const fetchServiceByIdRequest = (serviceId, { rawImages = false } = {}) =>
  apiRequest({
    path: `/api/services/${serviceId}${rawImages ? '?rawImages=true' : ''}`,
  })

export const updateServiceRequest = (serviceId, payload, authHeaders) =>
  apiRequest({
    path: `/api/services/${serviceId}`,
    method: 'PUT',
    data: payload,
    headers: authHeaders,
  })

export const deleteServiceRequest = (serviceId, authHeaders) =>
  apiRequest({
    path: `/api/services/${serviceId}`,
    method: 'DELETE',
    headers: authHeaders,
  })

export const approveServiceRequest = (serviceId, payload, authHeaders) =>
  apiRequest({
    path: `/api/services/${serviceId}/approve`,
    method: 'PATCH',
    data: { isApproved: true, ...payload },
    headers: authHeaders,
  })

export const rejectServiceRequest = (serviceId, payload, authHeaders) =>
  apiRequest({
    path: `/api/services/${serviceId}/reject`,
    method: 'PATCH',
    data: { status: 'rejected', isApproved: false, ...payload },
    headers: authHeaders,
  })
