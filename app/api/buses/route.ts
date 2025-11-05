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
        buses: [],
        success: false
      }, { status: 400 })
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockBuses = [
      {
        id: '1',
        operator: 'TSRTC Volvo',
        busType: 'AC Sleeper',
        departure: '22:00',
        arrival: '06:00',
        duration: '8h 0m',
        price: '₹1,200',
        seatsAvailable: 15,
        rating: 4.2,
        from: from,
        to: to,
        date: date,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Water Bottle']
      },
      {
        id: '2',
        operator: 'Orange Travels',
        busType: 'AC Semi Sleeper',
        departure: '23:30',
        arrival: '07:30',
        duration: '8h 0m',
        price: '₹900',
        seatsAvailable: 8,
        rating: 4.0,
        from: from,
        to: to,
        date: date,
        amenities: ['AC', 'Charging Point', 'Blanket']
      },
      {
        id: '3',
        operator: 'SRS Travels',
        busType: 'Non-AC Sleeper',
        departure: '21:00',
        arrival: '05:30',
        duration: '8h 30m',
        price: '₹650',
        seatsAvailable: 22,
        rating: 3.8,
        from: from,
        to: to,
        date: date,
        amenities: ['Charging Point', 'Water Bottle']
      },
      {
        id: '4',
        operator: 'VRL Travels',
        busType: 'AC Sleeper',
        departure: '20:30',
        arrival: '05:00',
        duration: '8h 30m',
        price: '₹1,100',
        seatsAvailable: 12,
        rating: 4.1,
        from: from,
        to: to,
        date: date,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Snacks']
      }
    ]
    
    return NextResponse.json({
      buses: mockBuses,
      success: true,
      searchParams: { from, to, date },
      totalResults: mockBuses.length
    })
    
  } catch (error) {
    console.error('Bus API error:', error)
    return NextResponse.json({ 
      error: 'Bus search service temporarily unavailable',
      buses: [],
      success: false
    }, { status: 500 })
  }
}
