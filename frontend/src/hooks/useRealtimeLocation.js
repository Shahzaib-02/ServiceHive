import { useState, useEffect, useCallback, useRef } from 'react'

export function useRealtimeLocation(bookingId, isActive = false) {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState(null)
  const watchId = useRef(null)

  const startTracking = useCallback(() => {
    if (!navigator.geolocation || !isActive) {
      setError('Geolocation not supported or booking not active')
      return
    }

    setIsTracking(true)
    setError(null)

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }
        setCurrentLocation(newLocation)
        
        // Here you would typically send this to your backend
        // For now, we'll just update local state
        console.log('Location update for booking:', bookingId, newLocation)
      },
      (error) => {
        setError(error.message)
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000, // Accept locations that are up to 5 seconds old
      }
    )
  }, [bookingId, isActive])

  const stopTracking = useCallback(() => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    setIsTracking(false)
  }, [])

  useEffect(() => {
    if (isActive && !isTracking) {
      startTracking()
    } else if (!isActive && isTracking) {
      stopTracking()
    }

    return () => {
      stopTracking()
    }
  }, [isActive, isTracking, startTracking, stopTracking])

  return {
    currentLocation,
    isTracking,
    error,
    startTracking,
    stopTracking,
  }
}

// Hook for providers to track customer location
export function useCustomerLocationTracking(bookingId) {
  const [customerLocation, setCustomerLocation] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    if (!bookingId) return

    // In a real app, this would subscribe to WebSocket or real-time updates
    // For now, we'll simulate with polling
    const interval = setInterval(() => {
      // Simulate receiving location updates
      // In production, this would be: websocket.on('location_update', (data) => {...})
      console.log('Checking for location updates for booking:', bookingId)
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [bookingId])

  const updateCustomerLocation = useCallback((location) => {
    setCustomerLocation(location)
    setLastUpdate(new Date())
  }, [])

  return {
    customerLocation,
    lastUpdate,
    updateCustomerLocation,
  }
}
