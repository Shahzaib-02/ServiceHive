// import { useEffect, useRef, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
// import { reverseGeocode, extractArea } from '../../hooks/useGeolocation'

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// })

// // Bahawalpur city coordinates
// const BAHAWALNUR_CENTER = [29.3943, 71.6837]
// const DEFAULT_ZOOM = 13

// // Component to handle map events and location updates with real-time address detection
// function LocationMarker({ position, setPosition, isEditable = false, onLocationSelect }) {
//   const [address, setAddress] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
  
//   const map = useMapEvents({
//     click: isEditable ? async (e) => {
//       const { lat, lng } = e.latlng
//       const newPosition = [lat, lng]
      
//       setPosition(newPosition)
//       setIsLoading(true)
//       setAddress('Detecting address...')

//       try {
//         // Real-time reverse geocoding
//         const geocodedData = await reverseGeocode(lat, lng)
//         const detectedArea = extractArea(geocodedData.address_components)
        
//         const locationData = {
//           lat,
//           lng,
//           fullAddress: geocodedData.display_name,
//           detectedArea: detectedArea,
//           addressComponents: geocodedData.address_components
//         }
        
//         setAddress(geocodedData.display_name)
        
//         // Notify parent component with complete address data
//         if (onLocationSelect) {
//           onLocationSelect(locationData)
//         }
        
//       } catch (error) {
//         console.error('Address detection failed:', error)
//         setAddress('Address not found')
//       } finally {
//         setIsLoading(false)
//       }
//     } : null,
//   })

//   useEffect(() => {
//     if (position) {
//       map.setView(position, DEFAULT_ZOOM)
//     }
//   }, [position, map])
  
//   // Auto-center map on user's current location when available
//   useEffect(() => {
//     if (navigator.geolocation && isEditable) {
//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           const userLocation = [pos.coords.latitude, pos.coords.longitude]
//           setPosition(userLocation)
//           map.setView(userLocation, DEFAULT_ZOOM)
          
//           // Get address for current location
//           try {
//             const geocodedData = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
//             setAddress(geocodedData.display_name)
//           } catch (error) {
//             console.error('Current location address detection failed:', error)
//           }
//         },
//         (error) => {
//           console.log('Could not get current location:', error)
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000
//         }
//       )
//     }
//   }, [isEditable, setPosition, map])

//   return position ? (
//     <Marker position={position}>
//       <Popup>
//         <div style={{ minWidth: '250px' }}>
//           <strong>📍 {isEditable ? 'Service Location' : 'Customer Location'}</strong><br />
//           <div style={{ margin: '8px 0' }}>
//             {isLoading ? (
//               <span>🔄 Detecting address...</span>
//             ) : (
//               <div>
//                 <strong>Address:</strong><br />
//                 <span style={{ fontSize: '12px', color: '#666' }}>
//                   {address || 'Address not available'}
//                 </span>
//               </div>
//             )}
//           </div>
//           <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
//             Lat: {position[0].toFixed(6)}<br />
//             Lng: {position[1].toFixed(6)}
//           </div>
//         </div>
//       </Popup>
//     </Marker>
//   ) : null
// }

// export function LiveLocationMap({ 
//   customerLocation = null, 
//   providerLocation = null,
//   onLocationSelect = null,
//   height = '400px',
//   showCustomerLocation = true,
//   showProviderLocation = false,
//   isEditable = false 
// }) {
//   const [position, setPosition] = useState(customerLocation || BAHAWALNUR_CENTER)
//   const mapRef = useRef(null)

//   useEffect(() => {
//     if (customerLocation) {
//       setPosition(customerLocation)
//     }
//   }, [customerLocation])

//   const handleLocationSelect = (newPosition) => {
//     setPosition(newPosition)
//     if (onLocationSelect) {
//       onLocationSelect(newPosition)
//     }
//   }

//   return (
//     <div style={{ height, width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}>
//       <MapContainer
//         center={position}
//         zoom={DEFAULT_ZOOM}
//         style={{ height: '100%', width: '100%' }}
//         ref={mapRef}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
        
//         {/* Customer Location Marker */}
//         {showCustomerLocation && (
//           <LocationMarker 
//             position={customerLocation || position} 
//             setPosition={isEditable ? handleLocationSelect : () => {}}
//             isEditable={isEditable}
//             onLocationSelect={onLocationSelect}
//           />
//         )}
        
//         {/* Provider Location Marker */}
//         {showProviderLocation && providerLocation && (
//           <Marker position={providerLocation}>
//             <Popup>
//               Provider Location
//             </Popup>
//           </Marker>
//         )}

//         {/* Route line between customer and provider */}
//         {showCustomerLocation && showProviderLocation && customerLocation && providerLocation && (
//           <Polyline 
//             positions={[customerLocation, providerLocation]}
//             color="cyan"
//             weight={3}
//             opacity={0.7}
//           />
//         )}
//       </MapContainer>
//     </div>
//   )
// }

// // Hook for getting user's current location
// export function useGeolocation() {
//   const [location, setLocation] = useState(null)
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const getCurrentLocation = () => {
//     setLoading(true)
//     setError(null)

//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser')
//       setLoading(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         })
//         setLoading(false)
//       },
//       (error) => {
//         setError(error.message)
//         setLoading(false)
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     )
//   }

//   return { location, error, loading, getCurrentLocation }
// }

// // Export the LiveLocationMap component as default
// export default LiveLocationMap
