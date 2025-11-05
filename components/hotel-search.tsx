"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Hotel, MapPin, Star, Wifi, Car, Utensils, Loader2 } from 'lucide-react'
interface hotelimage{
  thumbnail:string;
  original_image:string;
}
interface Hotel {
  id: string
  name: string
  rating: number
  price: string
  images: hotelimage[]
  amenities: string[]
  location: string
  distance: string
}

export function HotelSearch() {
  const [destination, setDestination] = useState("")
  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")

  const searchHotels = async () => {
    if (!destination || !checkin || !checkout) return
    
    setIsLoading(true)
    setError("")
    setHasSearched(false)
    setHotels([])
    
    try {
      const backendUrl = `http://localhost:8080/api/hotels?destination=${encodeURIComponent(
        destination
      )}&checkin=${checkin}&checkout=${checkout}`

      const response = await fetch(backendUrl)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success === false) {
        setError(data.error || "Hotel search failed")
        setHotels([])
      } else {
        const hotelResults = data.hotels || []
        setHotels(hotelResults)
        setHasSearched(true)
        if (hotelResults.length === 0) {
          setError("No hotels found for the selected destination and dates")
        }
      }
    } catch (error) {
      console.error("Hotel search error:", error)
      if (error instanceof Error) {
        if (error.message.includes("JSON")) {
          setError("Server configuration error. Please try again later.")
        } else {
          setError("Hotel search service unavailable. Please try again.")
        }
      } else {
        setError("An unexpected error occurred during hotel search.")
      }
      setHotels([])
    } finally {
      setIsLoading(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-3 h-3" />
      case 'restaurant': return <Utensils className="w-3 h-3" />
      case 'pool': return <span className="text-xs">🏊</span>
      case 'gym': return <span className="text-xs">💪</span>
      case 'spa': return <span className="text-xs">🧘</span>
      case 'bar': return <span className="text-xs">🍸</span>
      case 'ac': return <span className="text-xs">❄️</span>
      default: return <span className="text-xs">✓</span>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hotel className="w-5 h-5" />
            <span>Search Hotels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="Hyderabad"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkin">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchHotels} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search Hotels"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm font-semibold mb-4">
              {error}
            </div>
          )}
          {hotels.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Hotels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels.map((hotel) => (
                  <Card key={hotel.id}>
                    <CardContent className="p-0">
                      <img
                        src={hotel.images.length ?(hotel.images[0].thumbnail || "/placeholder.svg"):"/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{hotel.name}</h4>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">{hotel.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{hotel.location}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{hotel.distance}</div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities && hotel.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs flex items-center space-x-1">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-green-600">{hotel.price}</div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}  