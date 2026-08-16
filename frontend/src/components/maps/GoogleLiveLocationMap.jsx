import { useEffect, useState, useCallback } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { reverseGeocode, extractArea } from '../../hooks/useGeolocation'

const GOOGLE_MAPS_API_KEY = 'AIzaSyC2fWxeerzaACQnhahbU85T83o4fTTOszw'

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄 Loading Google Maps...</div>
    case Status.FAILURE:
      return <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❌ Error loading Google Maps</div>
    case Status.SUCCESS:
      return <GoogleLiveMap />
  }
}

const GoogleLiveMap = ({ 
  customerLocation = null, 
  providerLocation = null,
  onLocationSelect = null,
  height = '400px',
  showCustomerLocation = true,
  showProviderLocation = false,
  isEditable = false 
}) => {
  const [map, setMap] = useState(null)
  const [customerMarker, setCustomerMarker] = useState(null)
  const [providerMarker, setProviderMarker] = useState(null)
  const [customerAddress, setCustomerAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize map
  useEffect(() => {
    const mapElement = document.getElementById('google-live-map')
    if (!mapElement) return

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: customerLocation ? { lat: customerLocation.lat, lng: customerLocation.lng } : { lat: 29.3943, lng: 71.6837 },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    })

    setMap(mapInstance)

    return () => {
      if (customerMarker) customerMarker.setMap(null)
      if (providerMarker) providerMarker.setMap(null)
    }
  }, [])

  // Update customer location marker
  useEffect(() => {
    if (!map || !showCustomerLocation) return

    // Remove existing marker
    if (customerMarker) customerMarker.setMap(null)

    if (customerLocation) {
      const markerInstance = new window.google.maps.Marker({
        position: { lat: customerLocation.lat, lng: customerLocation.lng },
        map: map,
        title: 'Customer Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      })
      setCustomerMarker(markerInstance)
      
      // Get address for customer location
      if (customerLocation.fullAddress) {
        setCustomerAddress(customerLocation.fullAddress)
      } else {
        getAddressFromCoordinates(customerLocation.lat, customerLocation.lng)
      }

      // Center map on customer location
      map.panTo({ lat: customerLocation.lat, lng: customerLocation.lng })
    }
  }, [map, customerLocation, showCustomerLocation])

  // Update provider location marker
  useEffect(() => {
    if (!map || !showProviderLocation || !providerLocation) return

    // Remove existing marker
    if (providerMarker) providerMarker.setMap(null)

    const markerInstance = new window.google.maps.Marker({
      position: { lat: providerLocation.lat, lng: providerLocation.lng },
      map: map,
      title: 'Provider Location',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(32, 32)
      }
    })
    setProviderMarker(markerInstance)
  }, [map, providerLocation, showProviderLocation])

  // Handle map clicks for editable maps
  useEffect(() => {
    if (!map || !isEditable) return

    const clickHandler = map.addListener('click', async (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      
      setIsLoading(true)
      setCustomerAddress('Detecting address...')

      // Remove existing customer marker
      if (customerMarker) customerMarker.setMap(null)

      // Add new customer marker
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: 'Service Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        animation: window.google.maps.Animation.DROP
      })
      setCustomerMarker(newMarker)

      try {
        // Get address from coordinates
        const address = await getAddressFromCoordinates(lat, lng)
        setCustomerAddress(address)
        
        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="min-width: 250px; padding: 8px;">
              <strong>📍 Service Location</strong><br />
              <div style="margin: 8px 0;">
                <strong>Address:</strong><br />
                <span style="font-size: 12px; color: #666;">
                  ${address || 'Address not available'}
                </span>
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 8px;">
                Lat: ${lat.toFixed(6)}<br />
                Lng: ${lng.toFixed(6)}
              </div>
            </div>
          `
        })
        
        infoWindow.open(map, newMarker)

        // Notify parent component
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            fullAddress: address,
            detectedArea: extractAreaFromAddress(address)
          })
        }

      } catch (error) {
        console.error('Address detection failed:', error)
        setCustomerAddress('Address not found')
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      if (clickHandler) clickHandler.remove()
    }
  }, [map, isEditable, customerMarker])

  // Draw line between customer and provider
  useEffect(() => {
    if (!map || !showCustomerLocation || !showProviderLocation || !customerLocation || !providerLocation) return

    const line = new window.google.maps.Polyline({
      path: [
        { lat: customerLocation.lat, lng: customerLocation.lng },
        { lat: providerLocation.lat, lng: providerLocation.lng }
      ],
      geodesic: true,
      strokeColor: '#00FF00',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })

    line.setMap(map)

    return () => {
      line.setMap(null)
    }
  }, [map, customerLocation, providerLocation, showCustomerLocation, showProviderLocation])

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder()
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
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

  return <div id="google-live-map" style={{ height, width: '100%', borderRadius: '0.75rem' }} />
}

const GoogleLiveLocationMap = (props) => {
  return (
    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} libraries={['geocoding']}>
      <GoogleLiveMap {...props} />
    </Wrapper>
  )
}

export default GoogleLiveLocationMap
