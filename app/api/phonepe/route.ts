import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, merchantTransactionId, merchantUserId } = await request.json()
    
    // Simulate PhonePe API integration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock PhonePe response
    const transactionId = `T${Date.now()}${Math.random().toString(36).substr(2, 5)}`
    
    return NextResponse.json({
      success: true,
      code: 'PAYMENT_SUCCESS',
      message: 'Payment completed successfully',
      data: {
        merchantId: 'TRAVELBUDDY',
        merchantTransactionId,
        transactionId,
        amount: amount * 100, // PhonePe uses paisa
        state: 'COMPLETED',
        responseCode: 'SUCCESS',
        paymentInstrument: {
          type: 'UPI',
          utr: `${Date.now()}${Math.random().toString(36).substr(2, 6)}`
        }
      }
    })
    
  } catch (error) {
    console.error('PhonePe API error:', error)
    return NextResponse.json({
      success: false,
      code: 'PAYMENT_ERROR',
      message: 'Payment failed. Please try again.'
    }, { status: 500 })
  }
}
