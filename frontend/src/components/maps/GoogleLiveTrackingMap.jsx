import { useEffect, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { useRealtime } from '../../hooks/useRealtime'

const GOOGLE_MAPS_API_KEY = 'AIzaSyC2fWxeerzaACQnhahbU85T83o4fTTOszw'

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔄 Loading Google Maps...</div>
    case Status.FAILURE:
      return <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❌ Error loading Google Maps</div>
    case Status.SUCCESS:
      return <GoogleTrackingMap />
  }
}

const GoogleTrackingMap = ({ height = '360px' }) => {
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const { providerLocation, socketConnected } = useRealtime()

  // Initialize map
  useEffect(() => {
    const mapElement = document.getElementById('google-tracking-map')
    if (!mapElement) return

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: providerLocation ? { lat: providerLocation.lat, lng: providerLocation.lng } : { lat: 29.3943, lng: 71.6837 },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scrollwheel: false
    })

    setMap(mapInstance)

    return () => {
      if (marker) marker.setMap(null)
    }
  }, [])

  // Update provider location marker
  useEffect(() => {
    if (!map || !providerLocation) return

    // Remove existing marker
    if (marker) marker.setMap(null)

    const markerInstance = new window.google.maps.Marker({
      position: { lat: providerLocation.lat, lng: providerLocation.lng },
      map: map,
      title: 'Provider Location',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(32, 32)
      }
    })
    setMarker(markerInstance)

    // Center map on provider location with smooth animation
    map.panTo({ lat: providerLocation.lat, lng: providerLocation.lng })

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; min-width: 200px;">
          <strong>🚚 Provider Location</strong><br />
          <div style="margin: 4px 0; font-size: 12px; color: #666;">
            Status: ${socketConnected ? 
              '<span style="color: green;">🟢 Live Tracking</span>' : 
              '<span style="color: orange;">🟡 Simulation Mode</span>'}
          </div>
          <div style="font-size: 11px; color: #999; margin-top: 4px;">
            Lat: ${providerLocation.lat.toFixed(6)}<br />
            Lng: ${providerLocation.lng.toFixed(6)}
          </div>
        </div>
      `
    })

    // Show info window briefly
    setTimeout(() => {
      infoWindow.open(map, markerInstance)
      setTimeout(() => infoWindow.close(), 3000)
    }, 500)

  }, [map, providerLocation, socketConnected])

  return <div id="google-tracking-map" style={{ height, width: '100%' }} />
}

const GoogleLiveTrackingMap = (props) => {
  return (
    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} libraries={['geocoding']}>
      <GoogleTrackingMap {...props} />
    </Wrapper>
  )
}

export default GoogleLiveTrackingMap
