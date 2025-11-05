"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, Star, Users, Loader2 } from 'lucide-react'

interface BusRoute {
  id: string
  operator: string
  busType: string
  departure: string
  arrival: string
  duration: string
  price: string
  seatsAvailable: number
  rating: number
  from: string
  to: string
}

export function BusSearch() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [buses, setBuses] = useState<BusRoute[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")

  const searchBuses = async () => {
    if (!from || !to || !date) return
    
    setIsLoading(true)
    setError("")
    setHasSearched(false)
    setBuses([])
    
    try {
      const response = await fetch(`/api/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`)
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success === false) {
        setError(data.error || "Bus search failed")
        setBuses([])
      } else {
        const busResults = data.buses || []
        setBuses(busResults)
        setHasSearched(true)
        if (busResults.length === 0) {
          setError("No buses found for the selected route and date")
        }
      }
    } catch (error) {
      console.error('Bus search error:', error)
      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          setError("Server configuration error. Please try again later.")
        } else {
          setError("Bus search service unavailable. Please try again.")
        }
      } else {
        setError("An unexpected error occurred during bus search.")
      }
      setBuses([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bus className="w-5 h-5" />
            <span>Search Buses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                placeholder="Hyderabad"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="Bangalore"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Travel Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchBuses} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search Buses"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {hasSearched && buses.length === 0 && !error && (
        <div className="text-gray-600 text-sm">
          No buses found for the selected route and date.
        </div>
      )}

      {buses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Buses</h3>
          {buses.map((bus) => (
            <Card key={bus.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{bus.departure}</div>
                      <div className="text-sm text-gray-500">{bus.from}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bus className="w-5 h-5 text-blue-500" />
                      <div className="text-xs text-gray-500">{bus.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{bus.arrival}</div>
                      <div className="text-sm text-gray-500">{bus.to}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{bus.price}</div>
                    <div className="text-sm text-gray-600 mb-1">{bus.operator}</div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{bus.busType}</Badge>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs ml-1">{bus.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{bus.seatsAvailable} seats available</span>
                    </div>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}  