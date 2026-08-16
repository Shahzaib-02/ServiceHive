// import React, { useEffect } from 'react'
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
// import L from 'leaflet'
// import { useRealtime } from '../../hooks/useRealtime'

// const markerIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// })

// function MapRecenter({ position }) {
//   const map = useMap()
//   useEffect(() => {
//     map.setView(position, map.getZoom(), { animate: true })
//   }, [map, position[0], position[1]])
//   return null
// }

// const LiveTrackingMap = ({ height = '360px' }) => {
//   const { providerLocation, socketConnected } = useRealtime()
//   const position = [providerLocation.lat, providerLocation.lng]

//   return (
//     <div className="overflow-hidden rounded-[1.75rem] border border-white/10" style={{ height }}>
//       <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
//         <MapRecenter position={position} />
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position} icon={markerIcon}>
//           <Popup>
//             Provider location is updating {socketConnected ? 'live' : 'in simulation mode'}.
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   )
// }

// export default LiveTrackingMap
