import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { bookingType, bookingDetails, passengerDetails, paymentMethod } = await request.json()
    
    // Simulate MakeMyTrip API integration
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock booking confirmation
    const bookingId = `MMT${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    return NextResponse.json({
      success: true,
      bookingId,
      status: 'confirmed',
      paymentStatus: 'completed',
      bookingDetails: {
        ...bookingDetails,
        bookingId,
        passengerName: passengerDetails.name,
        email: passengerDetails.email,
        phone: passengerDetails.phone,
        paymentMethod,
        totalAmount: parseInt(bookingDetails.price.replace('₹', '').replace(',', '')) + 200,
        bookingDate: new Date().toISOString(),
        confirmationNumber: `TB${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }
    })
    
  } catch (error) {
    console.error('MakeMyTrip API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Booking failed. Please try again.'
    }, { status: 500 })
  }
}
