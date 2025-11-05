"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, User, Mail, Phone, CreditCard, Smartphone, QrCode, CheckCircle, Loader2 } from 'lucide-react'

interface BookingFlowProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    type: 'flight' | 'hotel' | 'bus'
    item: any
  } | null
}

export function BookingFlow({ isOpen, onClose, bookingDetails }: BookingFlowProps) {
  const [step, setStep] = useState(1)
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    age: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const handlePassengerSubmit = () => {
    if (passengerDetails.name && passengerDetails.email && passengerDetails.phone) {
      setStep(2)
    }
  }

  const handlePayment = async (method: string) => {
    setPaymentMethod(method)
    setIsProcessing(true)

    if (method === 'phonepe' || method === 'gpay') {
      setShowQRCode(true)
      // Simulate QR code payment process
      setTimeout(() => {
        setShowQRCode(false)
        setBookingConfirmed(true)
        setStep(3)
        setIsProcessing(false)
      }, 5000)
    } else {
      // Simulate other payment methods
      setTimeout(() => {
        setBookingConfirmed(true)
        setStep(3)
        setIsProcessing(false)
      }, 3000)
    }
  }

  const resetBooking = () => {
    setStep(1)
    setPassengerDetails({ name: "", email: "", phone: "", age: "" })
    setPaymentMethod("")
    setIsProcessing(false)
    setBookingConfirmed(false)
    setShowQRCode(false)
    onClose()
  }

  if (!bookingDetails) return null

  const { type, item } = bookingDetails

  return (
    <Dialog open={isOpen} onOpenChange={resetBooking}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'flight' && <Plane className="w-5 h-5" />}
            {type === 'hotel' && <span className="text-lg">🏨</span>}
            {type === 'bus' && <span className="text-lg">🚌</span>}
            <span>Book Your {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </DialogTitle>
          <DialogDescription>
            Complete your booking in just a few simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Booking Summary */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {type === 'flight' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.airline} {item.flightNumber}</span>
                  <Badge variant="secondary">{item.aircraft}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>{item.from} → {item.to}</span>
                  <span>{item.departure} - {item.arrival}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration: {item.duration}</span>
                  <span className="font-bold text-green-600">{item.price}</span>
                </div>
              </div>
            )}
            {type === 'hotel' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.name}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{item.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{item.location}</div>
                <div className="flex justify-between">
                  <span>Per night</span>
                  <span className="font-bold text-green-600">{item.price}</span>
                </div>
              </div>
            )}
            {type === 'bus' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{item.operator}</span>
                  <Badge variant="secondary">{item.busType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>{item.from} → {item.to}</span>
                  <span>{item.departure} - {item.arrival}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration: {item.duration}</span>
                  <span className="font-bold text-green-600">{item.price}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 1: Passenger Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Passenger Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={passengerDetails.age}
                    onChange={(e) => setPassengerDetails({...passengerDetails, age: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handlePassengerSubmit} className="w-full">
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment */}
        {step === 2 && !showQRCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Choose Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => handlePayment('phonepe')}
                  disabled={isProcessing}
                >
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Pe</span>
                  </div>
                  <span className="text-xs">PhonePe</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => handlePayment('gpay')}
                  disabled={isProcessing}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span className="text-xs">Google Pay</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => handlePayment('paytm')}
                  disabled={isProcessing}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="text-xs">Paytm</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center space-y-2"
                  onClick={() => handlePayment('card')}
                  disabled={isProcessing}
                >
                  <CreditCard className="w-8 h-8 text-gray-600" />
                  <span className="text-xs">Debit/Credit</span>
                </Button>
              </div>

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)} Fare</span>
                    <span>{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>₹150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹50</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹{parseInt(item.price.replace('₹', '').replace(',', '')) + 200}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Payment */}
        {showQRCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Scan QR Code to Pay</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">QR Code</p>
                    <p className="text-xs text-gray-500">Scan with {paymentMethod}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Amount: ₹{parseInt(item.price.replace('₹', '').replace(',', '')) + 200}</p>
                <p className="text-sm text-gray-600">Open {paymentMethod} app and scan the QR code</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waiting for payment confirmation...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && bookingConfirmed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Booking Confirmed!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono">TB{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passenger</span>
                    <span>{passengerDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{passengerDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid</span>
                    <span>₹{parseInt(item.price.replace('₹', '').replace(',', '')) + 200}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">Download Ticket</Button>
                <Button variant="outline" className="flex-1">Share Booking</Button>
              </div>

              <Button variant="ghost" onClick={resetBooking} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
