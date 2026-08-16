import { apiRequest } from './client'

export const fetchAdminOverviewRequest = (authHeaders) =>
  apiRequest({
    path: '/api/admin/overview',
    headers: authHeaders,
  })

export const fetchAdminUsersRequest = (authHeaders) =>
  apiRequest({
    path: '/api/admin/users',
    headers: authHeaders,
  })

export const updateAdminUserRequest = (userId, payload, authHeaders) =>
  apiRequest({
    path: `/api/admin/users/${userId}`,
    method: 'PATCH',
    data: payload,
    headers: authHeaders,
  })

export const updateAdminServiceRequest = (serviceId, payload, authHeaders) =>
  apiRequest({
    path: `/api/services/${serviceId}/approve`,
    method: 'PATCH',
    data: payload,
    headers: authHeaders,
  })

export const deleteAdminServiceRequest = (serviceId, authHeaders) =>
  apiRequest({
    path: `/api/admin/services/${serviceId}`,
    method: 'DELETE',
    headers: authHeaders,
  })

export const deleteAdminUserRequest = (userId, authHeaders) =>
  apiRequest({
    path: `/api/admin/users/${userId}`,
    method: 'DELETE',
    headers: authHeaders,
  })

export const createAdminUserRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/admin/users',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })
