import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')
    const checkin = searchParams.get('checkin')
    const checkout = searchParams.get('checkout')
    
    if (!destination || !checkin || !checkout) {
      return NextResponse.json({ 
        error: 'Missing required parameters: destination, checkin, checkout',
        hotels: [],
        success: false
      }, { status: 400 })
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const mockHotels = [
      {
        id: '1',
        name: 'Taj Krishna',
        rating: 4.5,
        price: '₹8,500',
        image: '/placeholder.svg?height=200&width=300&text=Taj+Krishna',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        location: 'Banjara Hills, ' + destination,
        distance: '2.1 km from city center',
        reviews: 1250,
        description: 'Luxury hotel with world-class amenities'
      },
      {
        id: '2',
        name: 'ITC Kohenur',
        rating: 4.3,
        price: '₹7,200',
        image: '/placeholder.svg?height=200&width=300&text=ITC+Kohenur',
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Business Center'],
        location: 'HITEC City, ' + destination,
        distance: '15 km from city center',
        reviews: 980,
        description: 'Modern business hotel with excellent facilities'
      },
      {
        id: '3',
        name: 'Hotel Sitara Grand',
        rating: 4.0,
        price: '₹3,500',
        image: '/placeholder.svg?height=200&width=300&text=Sitara+Grand',
        amenities: ['WiFi', 'Restaurant', 'AC', 'Room Service'],
        location: 'Secunderabad, ' + destination,
        distance: '8 km from city center',
        reviews: 650,
        description: 'Comfortable stay with good value for money'
      },
      {
        id: '4',
        name: 'Radisson Blu Plaza',
        rating: 4.4,
        price: '₹6,800',
        image: '/placeholder.svg?height=200&width=300&text=Radisson+Blu',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym'],
        location: 'Banjara Hills, ' + destination,
        distance: '3.5 km from city center',
        reviews: 1100,
        description: 'Premium hotel with excellent service'
      }
    ]
    
    return NextResponse.json({
      hotels: mockHotels,
      success: true,
      searchParams: { destination, checkin, checkout },
      totalResults: mockHotels.length
    })
    
  } catch (error) {
    console.error('Hotel API error:', error)
    return NextResponse.json({ 
      error: 'Hotel search service temporarily unavailable',
      hotels: [],
      success: false
    }, { status: 500 })
  }
}
