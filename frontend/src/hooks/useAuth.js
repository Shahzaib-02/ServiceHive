// import { useContext, useMemo } from 'react'
// import { AppContext } from '../context/AppContext'

// export const useAuth = () => {
//   const ctx = useContext(AppContext)
//   return useMemo(() => ({
//     user: ctx.user,
//     token: ctx.token,
//     role: ctx.role,
//     isAuthenticated: ctx.isAuthenticated,
//     isLoading: ctx.isLoading,
//     error: ctx.error,
//     login: ctx.login,
//     register: ctx.register,
//     logout: ctx.logout,
//     updateProfile: ctx.updateProfile,
//     bumpDb: ctx.bumpDb,
//   }), [
//     ctx.user,
//     ctx.token,
//     ctx.role,
//     ctx.isAuthenticated,
//     ctx.isLoading,
//     ctx.error,
//     ctx.login,
//     ctx.register,
//     ctx.logout,
//     ctx.updateProfile,
//     ctx.bumpDb,
//   ])
// }

import { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'

const FALLBACK_AUTH = {
  user: null,
  token: '',
  role: 'guest',
  isAuthenticated: false,
  isLoading: false,
  error: '',
  login: () => Promise.reject(new Error('Auth not initialized')),
  register: () => Promise.reject(new Error('Auth not initialized')),
  logout: () => {},
  updateProfile: () => Promise.reject(new Error('Auth not initialized')),
}

export const useAuth = () => {
  const ctx = useContext(AppContext)

  return useMemo(() => {
    if (!ctx) return FALLBACK_AUTH

    return {
      user: ctx.user,
      token: ctx.token,
      role: ctx.role,
      isAuthenticated: ctx.isAuthenticated,
      isLoading: ctx.isLoading,
      error: ctx.error,
      login: ctx.login,
      register: ctx.register,
      logout: ctx.logout,
      updateProfile: ctx.updateProfile,
    }
  }, [
    ctx?.user,
    ctx?.token,
    ctx?.role,
    ctx?.isAuthenticated,
    ctx?.isLoading,
    ctx?.error,
    ctx?.login,
    ctx?.register,
    ctx?.logout,
    ctx?.updateProfile,
  ])
}