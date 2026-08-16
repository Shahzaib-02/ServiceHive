// // import { useEffect, useState } from 'react'
// // import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
// // import 'leaflet/dist/leaflet.css'
// // import L from 'leaflet'

// // // Fix for default markers in react-leaflet
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// // })

// // /**
// //  * Location Map Component with automatic centering and marker placement
// //  * Integrates with useGeolocation hook for seamless location detection
// //  */
// // const LocationMap = ({ 
// //   height = '400px',
// //   onLocationSelect,
// //   initialLocation,
// //   zoom = 15,
// //   editable = true 
// // }) => {
// //   const [markerPosition, setMarkerPosition] = useState(initialLocation ? [initialLocation.lat, initialLocation.lng] : null)
// //   const [mapCenter, setMapCenter] = useState(initialLocation ? [initialLocation.lat, initialLocation.lng] : [29.3943, 71.6837]) // Bahawalpur center

// //   // Handle map click events for manual location selection
// //   const MapClickHandler = () => {
// //     useMapEvents({
// //       click: editable ? (e) => {
// //         const { lat, lng } = e.latlng
// //         const newPosition = [lat, lng]
// //         setMarkerPosition(newPosition)
// //         setMapCenter(newPosition)
        
// //         // Notify parent component
// //         if (onLocationSelect) {
// //           onLocationSelect({
// //             lat,
// //             lng,
// //             source: 'manual'
// //           })
// //         }
// //       } : null
// //     })
// //     return null
// //   }

// //   // Update map when initial location changes
// //   useEffect(() => {
// //     if (initialLocation) {
// //       const newPosition = [initialLocation.lat, initialLocation.lng]
// //       setMarkerPosition(newPosition)
// //       setMapCenter(newPosition)
// //     }
// //   }, [initialLocation])

// //   return (
// //     <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
// //       <MapContainer
// //         center={mapCenter}
// //         zoom={zoom}
// //         style={{ height: '100%', width: '100%' }}
// //         scrollWheelZoom={true}
// //         zoomControl={true}
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />
        
// //         <MapClickHandler />
        
// //         {markerPosition && (
// //           <Marker position={markerPosition}>
// //             <Popup>
// //               <div style={{ minWidth: '200px' }}>
// //                 <strong>Selected Location</strong><br />
// //                 Latitude: {markerPosition[0].toFixed(6)}<br />
// //                 Longitude: {markerPosition[1].toFixed(6)}
// //               </div>
// //             </Popup>
// //           </Marker>
// //         )}
// //       </MapContainer>
// //     </div>
// //   )
// // }

// // export default LocationMap


// import { useEffect, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
// import L from 'leaflet'
// import { reverseGeocode, extractArea } from '../hooks/useGeolocation'

// // Fix marker icons
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// })

// const LocationMap = ({ onLocationSelect, initialLocation }) => {
//   const [marker, setMarker] = useState(
//     initialLocation ? [initialLocation.lat, initialLocation.lng] : null
//   )

//   const [center, setCenter] = useState(
//     initialLocation ? [initialLocation.lat, initialLocation.lng] : [29.3956, 71.6836]
//   )

//   /* =========================
//      MAP CLICK HANDLER
//   ========================= */
//   const MapClickHandler = () => {
//     useMapEvents({
//       click: async (e) => {
//         const { lat, lng } = e.latlng

//         setMarker([lat, lng])
//         setCenter([lat, lng])

//         try {
//           const geo = await reverseGeocode(lat, lng)
//           const area = extractArea(geo.address_components)

//           onLocationSelect({
//             lat,
//             lng,
//             fullAddress: geo.display_name,
//             detectedArea: area
//           })
//         } catch (err) {
//           console.log(err)
//         }
//       }
//     })
//     return null
//   }

//   useEffect(() => {
//     if (initialLocation) {
//       const pos = [initialLocation.lat, initialLocation.lng]
//       setMarker(pos)
//       setCenter(pos)
//     }
//   }, [initialLocation])

//   return (
//     <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       <MapClickHandler />

//       {marker && (
//         <Marker position={marker}>
//           <Popup>
//             📍 Selected Location <br />
//             Lat: {marker[0]} <br />
//             Lng: {marker[1]}
//           </Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   )
// }

// export default LocationMap