import { useEffect, useState, useRef } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

const GOOGLE_MAPS_API_KEY = 'AIzaSyC2fWxeerzaACQnhahbU85T83o4fTTOszw'

const GoogleMap = ({ 
  height = '400px',
  onLocationSelect,
  initialLocation,
  zoom = 15,
  editable = true 
}) => {
  const [map, setMap] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const markerRef = useRef(null)
  const mapContainerRef = useRef(null)

  const getAddressFromCoordinates = async (coordLat, coordLng) => {
    try {
      const geocoder = new window.google.maps.Geocoder()
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat: coordLat, lng: coordLng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0])
          } else {
            reject(new Error('Geocoding failed'))
          }
        })
      })
      return result.formatted_address
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  const extractAreaFromAddress = (address) => {
    if (!address) return 'Unknown'

    const addressLower = address.toLowerCase()
    const areaPatterns = [
      'university chowk', 'mohajor colony', 'unichowk', 'riaz colony',
      'model town', 'satellite town', 'muslim town', 'islamabad colony',
      'shah shams colony', 'baghdad colony', 'dha bahawalpur', 'railway colony'
    ]

    for (const pattern of areaPatterns) {
      if (addressLower.includes(pattern)) {
        return pattern.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      }
    }

    return 'Unknown'
  }

  // Initialize map (once per mount)
  useEffect(() => {
    const mapElement = mapContainerRef.current
    if (!mapElement || !window.google?.maps) return

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: initialLocation
        ? { lat: initialLocation.lat, lng: initialLocation.lng }
        : { lat: 29.3943, lng: 71.6837 },
      zoom: zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    })

    setMap(mapInstance)

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [zoom])

  const lat = initialLocation?.lat
  const lng = initialLocation?.lng
  const addressLabel = initialLocation?.fullAddress || initialLocation?.address || ''

  // Sync marker when initial location coordinates change
  useEffect(() => {
    if (!map || lat == null || lng == null) return

    if (markerRef.current) markerRef.current.setMap(null)

    const markerInstance = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Selected Location',
      animation: window.google.maps.Animation.DROP
    })
    markerRef.current = markerInstance

    map.panTo({ lat, lng })

    if (addressLabel) {
      setSelectedAddress(addressLabel)
    } else {
      getAddressFromCoordinates(lat, lng).then((address) => {
        if (address) setSelectedAddress(address)
      })
    }
  }, [map, lat, lng, addressLabel])

  // Handle map clicks
  useEffect(() => {
    if (!map || !editable) return

    const clickHandler = map.addListener('click', async (event) => {
      const clickLat = event.latLng.lat()
      const clickLng = event.latLng.lng()
      
      setIsLoading(true)
      setSelectedAddress('Detecting address...')

      if (markerRef.current) markerRef.current.setMap(null)

      const newMarker = new window.google.maps.Marker({
        position: { lat: clickLat, lng: clickLng },
        map: map,
        title: 'Selected Location',
        animation: window.google.maps.Animation.DROP
      })
      markerRef.current = newMarker

      try {
        const address = await getAddressFromCoordinates(clickLat, clickLng)
        setSelectedAddress(address)
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="min-width: 250px; padding: 8px;">
              <strong>📍 Selected Location</strong><br />
              <div style="margin: 8px 0;">
                <strong>Address:</strong><br />
                <span style="font-size: 12px; color: #666;">
                  ${address || 'Address not available'}
                </span>
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 8px;">
                Lat: ${clickLat.toFixed(6)}<br />
                Lng: ${clickLng.toFixed(6)}
              </div>
            </div>
          `
        })
        
        infoWindow.open(map, newMarker)

        // Notify parent component
        if (onLocationSelect) {
          onLocationSelect({
            lat: clickLat,
            lng: clickLng,
            fullAddress: address,
            detectedArea: extractAreaFromAddress(address)
          })
        }

      } catch (error) {
        console.error('Address detection failed:', error)
        setSelectedAddress('Address not found')
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      if (clickHandler) clickHandler.remove()
    }
  }, [map, editable, onLocationSelect])

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%', borderRadius: '8px' }}
    />
  )
}

const GoogleLocationMap = (props) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div style={{ height: props.height || '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading Google Maps...
          </div>
        )
      case Status.FAILURE:
        return (
          <div style={{ height: props.height || '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Error loading Google Maps
          </div>
        )
      case Status.SUCCESS:
        return <GoogleMap {...props} />
      default:
        return null
    }
  }

  return (
    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} libraries={['geocoding']} />
  )
}

export default GoogleLocationMap
