"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plane, CheckCircle, MapPin, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookingFlow } from "./booking-flow"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: string
  arrival: string
  duration: string
  price: string
  from: string
  to: string
  date: string
  stops: string
  aircraft: string
}

export function FlightSearch() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const searchFlights = async () => {
    if (!from.trim() || !to.trim() || !date) {
      setError("Please fill in all fields (From, To, and Date)")
      return
    }

    setIsLoading(true)
    setError("")
    setHasSearched(false)
    setFlights([])

    try {
      // ✅ Send data to Spring Boot backend
      const response = await fetch("http://localhost:8080/api/flights/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromLocation: from.trim(),
          toLocation: to.trim(),
          departureDate: date,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      console.log("✅ Flight search data saved successfully to backend")

      // ✈️ Simulated search results (for now)
      const simulatedFlights: Flight[] = [
        {
          id: "1",
          airline: "Air India",
          flightNumber: "AI-302",
          departure: "07:30",
          arrival: "09:50",
          duration: "2h 20m",
          price: "₹4,500",
          from,
          to,
          date,
          stops: "Non-stop",
          aircraft: "Airbus A320",
        },
        {
          id: "2",
          airline: "IndiGo",
          flightNumber: "6E-145",
          departure: "10:15",
          arrival: "12:40",
          duration: "2h 25m",
          price: "₹3,900",
          from,
          to,
          date,
          stops: "Non-stop",
          aircraft: "A321neo",
        },
      ]

      setFlights(simulatedFlights)
      setHasSearched(true)
    } catch (error) {
      console.error("❌ Error saving flight search:", error)
      setError("Failed to send search details to backend. Please check the connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowBooking(true)
  }

  const popularRoutes = [
    { from: "Delhi", to: "Mumbai", price: "₹4,200" },
    { from: "Bangalore", to: "Chennai", price: "₹3,800" },
    { from: "Hyderabad", to: "Pune", price: "₹5,100" },
    { from: "Kolkata", to: "Goa", price: "₹6,500" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>Search Domestic & International Flights</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Find the best deals on flights with real-time pricing from top airlines.
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>From</span>
              </Label>
              <Input
                id="from"
                placeholder="Delhi, Mumbai..."
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>To</span>
              </Label>
              <Input
                id="to"
                placeholder="Hyderabad, Chennai..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Departure Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={searchFlights}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <Plane className="w-4 h-4 mr-2" /> Search Flights
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Popular Routes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {popularRoutes.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFrom(route.from)
                    setTo(route.to)
                  }}
                >
                  {route.from} → {route.to} <span className="text-green-600 ml-2">{route.price}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show flight results */}
      {hasSearched && flights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">
              Found {flights.length} flights from {from} to {to}
            </h3>
          </div>

          {flights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6 flex justify-between">
                <div>
                  <p className="font-semibold text-lg">{flight.airline}</p>
                  <p>{flight.flightNumber}</p>
                  <p>{flight.departure} → {flight.arrival}</p>
                  <p>{flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 mb-2">{flight.price}</p>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => handleBookFlight(flight)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BookingFlow
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        bookingDetails={selectedFlight ? { type: "flight", item: selectedFlight } : null}
      />
    </div>
  )
}  