export interface Address {
  line1: string
  line2: string
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      reject(new Error('Geolocation is not supported by this browser.'))
    }
  })
}

async function fetchLocation(lat: number, lon: number): Promise<Address> {
  const API_KEY = 'be669b3d2f4d4c8ea1159c413ac1da78'
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API_KEY}`)
    const data = await response.json()
    const { address_line1, address_line2 } = data.features[0].properties
    return {
      line1: address_line1,
      line2: address_line2
    }
  } catch (error: any) {
    throw new Error(error.toString())
  }
}

export async function getAddress(): Promise<Address> {
  const {
    coords: { latitude, longitude }
  } = await getCurrentPosition()
  return await fetchLocation(latitude, longitude)
}
