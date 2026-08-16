import { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'

export const useServices = () => {
  const ctx = useContext(AppContext)

  return useMemo(() => {
    if (!ctx) {
      return {
        services: [],
        isLoading: false,
        error: '',
        fetchServices: () => Promise.resolve([]),
        setFilters: () => {},
        filters: { search: '', category: '', group: '' },
      }
    }

    return {
      services: ctx.services,
      isLoading: ctx.isLoadingServices,
      error: ctx.servicesError,
      fetchServices: ctx.fetchServices,
      setFilters: ctx.setFilters,
      filters: ctx.filters,
    }
  }, [
    ctx?.services,
    ctx?.isLoadingServices,
    ctx?.servicesError,
    ctx?.fetchServices,
    ctx?.setFilters,
    ctx?.filters,
  ])
}
