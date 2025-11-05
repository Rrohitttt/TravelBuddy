import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')
    
    if (!from || !to || !date) {
      return NextResponse.json({ 
        error: 'Missing required parameters: from, to, date',
        flights: [],
        success: false
      }, { status: 400 })
    }
    
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Enhanced mock flight data with more realistic information
    const mockFlights = [
      {
        id: '1',
        airline: 'IndiGo',
        flightNumber: '6E-123',
        departure: '06:00',
        arrival: '08:30',
        duration: '2h 30m',
        price: '₹4,500',
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: date,
        stops: 'Non-stop',
        aircraft: 'A320',
        departureTerminal: 'T1',
        arrivalTerminal: 'T2'
      },
      {
        id: '2',
        airline: 'SpiceJet',
        flightNumber: 'SG-456',
        departure: '14:15',
        arrival: '16:45',
        duration: '2h 30m',
        price: '₹3,800',
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: date,
        stops: 'Non-stop',
        aircraft: 'B737',
        departureTerminal: 'T1',
        arrivalTerminal: 'T2'
      },
      {
        id: '3',
        airline: 'Air India',
        flightNumber: 'AI-789',
        departure: '20:30',
        arrival: '23:00',
        duration: '2h 30m',
        price: '₹5,200',
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: date,
        stops: 'Non-stop',
        aircraft: 'A321',
        departureTerminal: 'T3',
        arrivalTerminal: 'T1'
      },
      {
        id: '4',
        airline: 'Vistara',
        flightNumber: 'UK-234',
        departure: '11:30',
        arrival: '14:00',
        duration: '2h 30m',
        price: '₹6,800',
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: date,
        stops: 'Non-stop',
        aircraft: 'A320neo',
        departureTerminal: 'T3',
        arrivalTerminal: 'T1'
      },
      {
        id: '5',
        airline: 'GoAir',
        flightNumber: 'G8-567',
        departure: '09:45',
        arrival: '12:15',
        duration: '2h 30m',
        price: '₹3,200',
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date: date,
        stops: 'Non-stop',
        aircraft: 'A320',
        departureTerminal: 'T1',
        arrivalTerminal: 'T2'
      }
    ]
    
    return NextResponse.json({
      flights: mockFlights,
      success: true,
      searchParams: { from, to, date },
      totalResults: mockFlights.length
    })
    
  } catch (error) {
    console.error('Flight API error:', error)
    return NextResponse.json({ 
      error: 'Flight search service temporarily unavailable',
      flights: [],
      success: false
    }, { status: 500 })
  }
}
