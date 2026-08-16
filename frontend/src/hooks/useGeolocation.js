// // import { useState, useCallback } from 'react'

// // /**
// //  * Extracts the most specific area/town from address components
// //  * Priority: neighbourhood > suburb > town > city > village
// //  * Falls back to "Bahawalpur" if no specific area found
// //  */
// // const extractArea = (addressComponents) => {
// //   if (!addressComponents) return 'Bahawalpur'
  
// //   console.log('Extracting area from address components:', addressComponents)
  
// //   // Priority order for most specific area detection
// //   const areaCandidates = [
// //     addressComponents.neighbourhood,
// //     addressComponents.suburb,
// //     addressComponents.town,
// //     addressComponents.city,
// //     addressComponents.village,
// //     addressComponents.hamlet,
// //     addressComponents.residential,
// //     addressComponents.road // Sometimes specific roads indicate areas
// //   ]
  
// //   // Find the first non-empty area candidate
// //   for (const area of areaCandidates) {
// //     if (area && area.trim() && area.trim().length > 2) {
// //       const cleanArea = area.trim()
// //       console.log('Found area candidate:', cleanArea)
      
// //       // Filter out generic terms and keep specific areas
// //       if (!isGenericTerm(cleanArea)) {
// //         console.log('Returning specific area:', cleanArea)
// //         return cleanArea
// //       }
// //     }
// //   }
  
// //   // If still no specific area, try to extract from display_name
// //   if (addressComponents.display_name) {
// //     const displayNameArea = extractFromDisplayName(addressComponents.display_name)
// //     if (displayNameArea && displayNameArea !== 'Bahawalpur') {
// //       console.log('Extracted from display name:', displayNameArea)
// //       return displayNameArea
// //     }
// //   }
  
// //   console.log('No specific area found, defaulting to Bahawalpur')
// //   return 'Bahawalpur'
// // }

// // /**
// //  * Filters out generic geographic terms
// //  */
// // const isGenericTerm = (term) => {
// //   const genericTerms = [
// //     'bahawalpur', 'pakistan', 'punjab', 'district', 'tehsil',
// //     'road', 'street', 'highway', 'avenue', 'boulevard'
// //   ]
// //   return genericTerms.some(generic => term.toLowerCase().includes(generic))
// // }

// // /**
// //  * Extracts specific area from display name
// //  */
// // const extractFromDisplayName = (displayName) => {
// //   if (!displayName) return null
  
// //   const name = displayName.toLowerCase()
// //   console.log('Extracting from display name:', displayName)
  
// //   // Remove city name and extract specific area
// //   // Look for patterns like "University Chowk, Bahawalpur" → "University Chowk"
// //   const areaExtractionPatterns = [
// //     {
// //       pattern: /([^,]+?)\s*(?:chowk|colony|town|village|area|block)\s*(?:,\s*bahawalpur)?/i,
// //       clean: (match) => match[1]?.trim()
// //     },
// //     {
// //       pattern: /(mohajor colony|unichowk|riaz colony|model town|satellite town|muslim town|islamabad colony|shah shams colony|baghdad colony|dha bahawalpur|railway colony|ahmedpur east|yazman|khawaja ghulam|qasim bela|hasilpur|mansa|haroonabad|chishtian|fort abbas|minchinabad|liaquatpur|dunyapur|kotla musa khan|mubarakpur|jinnah colony|iqbal colony|sadiq colony|bilal colony|abu bakar colony|usman colony|ali colony|gulshan|gulberg|gulzar colony|rehman colony|shah nawaz colony|nawab colony|sadiqabad|zafar colony|ahmedpur west|ahmedpur road|bhawana|noorpur|tandlianwala|chechawatni|mochh|uch sharif|ahmedpur sharif|dera nawab|buchiana|kotla arab khan|kalurkot|makhdoompur|mauza mian khan|mauza ghanian|sheikhupur|samanabad|dhodiala)/i,
// //       clean: (match) => match[0]
// //     }
// //   ]
  
// //   // Try extraction patterns first
// //   for (const { pattern, clean } of areaExtractionPatterns) {
// //     if (name.match(pattern)) {
// //       const match = name.match(pattern)
// //       if (match && match[0]) {
// //         const area = clean(match)
// //         const formattedArea = area.split(' ').map(word => 
// //           word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
// //         ).join(' ')
// //         console.log('Extracted area using pattern:', formattedArea)
// //         return formattedArea
// //       }
// //     }
// //   }
  
// //   // Fallback to original patterns if extraction fails
// //   const fallbackPatterns = [
// //     /mohajor colony/i,
// //     /unichowk/i,
// //     /riaz colony/i,
// //     /model town/i,
// //     /satellite town/i,
// //     /muslim town/i,
// //     /islamabad colony/i,
// //     /shah shams colony/i,
// //     /baghdad colony/i,
// //     /dha bahawalpur/i,
// //     /railway colony/i,
// //     /ahmedpur east/i,
// //     /yazman/i,
// //     /khawaja ghulam/i,
// //     /qasim bela/i,
// //     /hasilpur/i,
// //     /mansa/i,
// //     /haroonabad/i,
// //     /chishtian/i,
// //     /fort abbas/i,
// //     /minchinabad/i,
// //     /liaquatpur/i,
// //     /dunyapur/i,
// //     /kotla musa khan/i,
// //     /mubarakpur/i,
// //     /jinnah colony/i,
// //     /iqbal colony/i,
// //     /sadiq colony/i,
// //     /bilal colony/i,
// //     /abu bakar colony/i,
// //     /usman colony/i,
// //     /ali colony/i,
// //     /gulshan/i,
// //     /gulberg/i,
// //     /gulzar colony/i,
// //     /rehman colony/i,
// //     /shah nawaz colony/i,
// //     /nawab colony/i,
// //     /sadiqabad/i,
// //     /zafar colony/i,
// //     /ahmedpur west/i,
// //     /ahmedpur road/i,
// //     /bhawana/i,
// //     /noorpur/i,
// //     /tandlianwala/i,
// //     /chechawatni/i,
// //     /mochh/i,
// //     /uch sharif/i,
// //     /ahmedpur sharif/i,
// //     /dera nawab/i,
// //     /buchiana/i,
// //     /kotla arab khan/i,
// //     /kalurkot/i,
// //     /makhdoompur/i,
// //     /mauza mian khan/i,
// //     /mauza ghanian/i,
// //     /sheikhupur/i,
// //     /samanabad/i,
// //     /dhodiala/i
// //   ]
  
// //   for (const pattern of fallbackPatterns) {
// //     if (name.match(pattern)) {
// //       const match = name.match(pattern)
// //       if (match && match[0]) {
// //         const area = match[0].split(' ').map(word => 
// //           word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
// //         ).join(' ')
// //         console.log('Extracted area using fallback pattern:', area)
// //         return area
// //       }
// //     }
// //   }
  
// //   console.log('No specific area found in display name')
// //   return null
// // }

// // /**
// //  * Converts coordinates to human-readable address using OpenStreetMap Nominatim API
// //  * FREE API - No API key required
// //  */
// // const reverseGeocode = async (lat, lng) => {
// //   try {
// //     const response = await fetch(
// //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=en`,
// //       {
// //         headers: {
// //           'User-Agent': 'ServiceHive/1.0 (Final Year Project)'
// //         }
// //       }
// //     )

// //     if (!response.ok) {
// //       throw new Error(`HTTP ${response.status}: Failed to fetch address`)
// //     }

// //     const data = await response.json()

// //     if (!data || data.error) {
// //       throw new Error(data?.error || 'Reverse geocoding failed')
// //     }

// //     return {
// //       display_name: data.display_name || 'Address not found',
// //       address_components: {
// //         neighbourhood: data.address?.neighbourhood,
// //         suburb: data.address?.suburb,
// //         residential: data.address?.residential,
// //         quarter: data.address?.quarter,
// //         city_district: data.address?.city_district,
// //         municipality: data.address?.municipality,
// //         town: data.address?.town,
// //         village: data.address?.village,
// //         city: data.address?.city || data.address?.town || 'Bahawalpur',
// //         state: data.address?.state,
// //         country: data.address?.country,
// //         display_name: data.display_name
// //       },
// //       lat: Number(lat),
// //       lng: Number(lng)
// //     }
// //   } catch (error) {
// //     console.error('Reverse geocoding failed:', error)
// //     throw error
// //   }
// // }

// // /**
// //  * Production-ready React hook for location detection
// //  * Uses browser Geolocation API + OpenStreetMap Nominatim
// //  * 
// //  * @returns {Object} Location data and state management
// //  */
// // export const useGeolocation = () => {
// //   const [location, setLocation] = useState(null)
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState(null)

// //   /**
// //    * Gets user's current location and performs reverse geocoding
// //    * Automatically detects specific area/town from address components
// //    */
// //   const getCurrentLocation = useCallback(async () => {
// //     if (!navigator.geolocation) {
// //       setError('Geolocation is not supported by your browser')
// //       return
// //     }

// //     setLoading(true)
// //     setError(null)

// //     try {
// //       // Get GPS coordinates
// //       const position = await new Promise((resolve, reject) => {
// //         navigator.geolocation.getCurrentPosition(
// //           resolve,
// //           reject,
// //           {
// //             enableHighAccuracy: true,
// //             timeout: 15000,
// //             maximumAge: 30000 // 30 seconds cache
// //           }
// //         )
// //       })

// //       const { latitude, longitude } = position.coords
      
// //       // Perform reverse geocoding
// //       const geocodedData = await reverseGeocode(latitude, longitude)
      
// //       // Extract specific area/town dynamically
// //       const detectedArea = extractArea(geocodedData.address_components)
      
// //       // Build comprehensive location object
// //       const locationData = {
// //         lat: geocodedData.lat,
// //         lng: geocodedData.lng,
// //         fullAddress: geocodedData.display_name,
// //         detectedArea: detectedArea,
// //         city: 'Bahawalpur', // Default as required
// //         addressComponents: geocodedData.address_components
// //       }
      
// //       console.log('=== LOCATION DETECTION SUMMARY ===')
// //       console.log('Coordinates:', geocodedData.lat, geocodedData.lng)
// //       console.log('Full Address:', geocodedData.display_name)
// //       console.log('Address Components:', geocodedData.address_components)
// //       console.log('Detected Area:', detectedArea)
// //       console.log('City:', 'Bahawalpur')
// //       console.log('Final Location Data:', locationData)
// //       console.log('=== END SUMMARY ===')
      
// //       setLocation(locationData)
      
// //     } catch (error) {
// //       const errorMessage = error.message || 'Failed to detect location'
// //       setError(errorMessage)
// //       console.error('Location detection error:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [])

// //   return {
// //     location,
// //     loading,
// //     error,
// //     getCurrentLocation
// //   }
// // }

// // /**
// //  * Utility function for manual address geocoding (optional)
// //  * Can be used for search functionality
// //  */
// // export const geocodeAddress = async (address) => {
// //   try {
// //     const response = await fetch(
// //       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
// //       {
// //         headers: {
// //           'User-Agent': 'ServiceHive/1.0'
// //         }
// //       }
// //     )
    
// //     if (!response.ok) {
// //       throw new Error('Failed to geocode address')
// //     }
    
// //     const data = await response.json()
    
// //     if (!data || data.length === 0) {
// //       throw new Error('Address not found')
// //     }
    
// //     const result = data[0]
// //     return {
// //       lat: parseFloat(result.lat),
// //       lng: parseFloat(result.lon),
// //       display_name: result.display_name,
// //       address_components: result.address || {}
// //     }
// //   } catch (error) {
// //     console.error('Address geocoding failed:', error)
// //     throw error
// //   }
// // }
import { useState, useCallback } from 'react'

/* =========================
   AREA EXTRACTION
========================= */
export const extractArea = (addr) => {
  if (!addr) return 'Bahawalpur'

  console.log('Extracting area from address components:', addr)

  const candidates = [
    addr.neighbourhood,
    addr.suburb,
    addr.residential,
    addr.quarter,
    addr.city_district,
    addr.town,
    addr.village,
    addr.road,
    addr.hamlet,
    addr.allotments,
    addr.city_district
  ]

  for (let area of candidates) {
    if (area && area.length > 2) {
      const lower = area.toLowerCase()
      console.log('Checking area candidate:', area)

      // skip generic names
      if (
        !lower.includes('bahawalpur') &&
        !lower.includes('punjab') &&
        !lower.includes('pakistan') &&
        !lower.includes('district') &&
        !lower.includes('tehsil') &&
        !lower.includes('division') &&
        !lower.includes('city') &&
        !lower.includes('postal code')
      ) {
        console.log('Found specific area:', area)
        return area
      }
    }
  }

  // Try to extract from road name if it's specific
  if (addr.road && addr.road.length > 2) {
    const roadLower = addr.road.toLowerCase()
    if (
      !roadLower.includes('highway') &&
      !roadLower.includes('road') &&
      !roadLower.includes('street') &&
      !roadLower.includes('bahawalpur')
    ) {
      console.log('Using road name as area:', addr.road)
      return addr.road
    }
  }

  console.log('No specific area found, defaulting to Bahawalpur')
  return 'Bahawalpur'
}

/* =========================
   REVERSE GEOCODING
========================= */
export const reverseGeocode = async (lat, lng) => {
  console.log(`reverseGeocode called for coordinates: ${lat}, ${lng}`)
  
  try {
    // Use Google Maps Geocoding API instead of OpenStreetMap
    const geocoder = new window.google.maps.Geocoder()
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0])
        } else {
          reject(new Error(`Google Maps geocoding failed: ${status}`))
        }
      })
    })

    console.log('Google Maps geocoding result:', result)

    // Convert Google Maps result to our expected format
    const addressComponents = {}
    if (result.address_components) {
      result.address_components.forEach(component => {
        if (component.types.includes('neighborhood')) {
          addressComponents.neighbourhood = component.long_name
        }
        if (component.types.includes('sublocality')) {
          addressComponents.suburb = component.long_name
        }
        if (component.types.includes('locality')) {
          addressComponents.city = component.long_name
        }
        if (component.types.includes('administrative_area_level_2')) {
          addressComponents.county = component.long_name
        }
        if (component.types.includes('administrative_area_level_1')) {
          addressComponents.state = component.long_name
        }
        if (component.types.includes('country')) {
          addressComponents.country = component.long_name
        }
        if (component.types.includes('route')) {
          addressComponents.road = component.long_name
        }
      })
    }

    return {
      display_name: result.formatted_address,
      address_components: addressComponents,
      lat,
      lng
    }
  } catch (error) {
    console.error('Google Maps geocoding error:', error)
    throw error
  }
}

/* =========================
   HOOK
========================= */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = useCallback(async () => {
    console.log('getCurrentLocation called')
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    setLoading(true)

    try {
      console.log('Getting GPS position...')
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000
        })
      })

      const { latitude, longitude } = position.coords
      console.log('GPS coordinates obtained:', { latitude, longitude })

      console.log('Starting reverse geocoding...')
      const geo = await reverseGeocode(latitude, longitude)
      console.log('Reverse geocoding result:', geo)
      
      console.log('Extracting area from address components...')
      const area = extractArea(geo.address_components)
      console.log('Extracted area:', area)

      const finalData = {
        lat: latitude,
        lng: longitude,
        fullAddress: geo.display_name,
        detectedArea: area,
        city: 'Bahawalpur' // Default city as required
      }

      console.log('Final location data:', finalData)
      setLocation(finalData)
    } catch (err) {
      console.error('Error in getCurrentLocation:', err)
      setError(err.message)
    }

    setLoading(false)
  }, [])

  return { location, loading, error, getCurrentLocation }
}