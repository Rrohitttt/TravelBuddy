"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, DollarSign, Cloud, Users, Shield, Phone, Star, Plane, Bus, Hotel, Camera, Utensils, Mountain, Waves, Sun, AlertTriangle, CreditCard, Languages, Calculator } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TranslationWidget } from "@/components/translation-widget"
import { FlightSearch } from "@/components/flight-search"
import { HotelSearch } from "@/components/hotel-search"
import { BusSearch } from "@/components/bus-search"
import { Loader2 } from "lucide-react";
import { CurrencyConverter } from "@/components/currency-converter"
import axios from "axios"

import { API_ENDPOINTS, convertJSONStringToJson, getItenaryprompt, getItenaryrequestpayload, GOOGLE_AI_STUDIO_API_KEY } from "@/lib/api-clients"

export default function TravelBuddy() {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("")
  const [budget, setBudget] = useState("")
  const [showItinerary, setShowItinerary] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("English")
  const [showTranslator, setShowTranslator] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState("");
  const [sampleItinerary, setSampleIternary] = useState({
    destination: "",
    duration: "",
    budget: "",
    weather: "",
    events: "",
    breakdown: {
      stay: "",
      travel: "",
      food: "",
      activities: ""
    },
    activities: [],
    safetyRating: 0,
    localGuides: 0,
    bestTimeToVisit: "",
    localTips: []
  })
const generateItinerary = async () => {
  setLoading(true);
  try {
    const response = await axios.post(
      API_ENDPOINTS.GENARATE_ITENARY,
      getItenaryrequestpayload(getItenaryprompt(destination, duration, budget)),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GOOGLE_AI_STUDIO_API_KEY
        }
      }
    );

    console.log('response', response.data);
    const jsonresponse = response.data.candidates[0].content.parts[0].text;
    const convertedJSONvalue = convertJSONStringToJson(jsonresponse);
    setSampleIternary(convertedJSONvalue);
    setApiResponse(response.data);
    setShowItinerary(true);

    // ✅ Save itinerary to backend
    await axios.post("http://localhost:8080/api/itineraries/save", {
      destination,
      duration,
      budget,
      experience: selectedExperience
    });

    console.log("Itinerary saved successfully!");
  } catch (e) {
    console.error("Error generating itinerary or saving:", e);
  } finally {
    setLoading(false);
  }
};





  // const sampleItinerary = {

  //   destination: "Hyderabad, Telangana",
  //   duration: "3 nights, 4 days",
  //   budget: "₹8,500",
  //   weather: "Sunny, 28°C - Perfect for sightseeing",
  //   events: "Hyderabad Food Festival on Aug 21-23, Charminar Light Show every evening",
  //   breakdown: {
  //     stay: "₹2,500",
  //     travel: "₹3,000",
  //     food: "₹2,000",
  //     activities: "₹1,000"
  //   },
  //   activities: ["Historic Charminar visit", "Authentic Hyderabadi Biriyani tasting", "Ramoji Film City tour", "Hussain Sagar Lake boating", "Golconda Fort exploration"],
  //   safetyRating: 4.2,
  //   localGuides: 12,
  //   bestTimeToVisit: "October to March for pleasant weather",
  //   localTips: [
  //     "Try the famous Hyderabadi Biriyani at Paradise Restaurant",
  //     "Visit Charminar early morning to avoid crowds",
  //     "Bargain at Laad Bazaar for pearls and bangles",
  //     "Use Uber/Ola for convenient city travel"
  //   ]
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Travel Buddy</h1>
                <p className="text-xs text-gray-500">Your AI Travel Companion</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Dialog open={showTranslator} onOpenChange={setShowTranslator}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Languages className="w-5 h-5" />
                      <span>Real-time Translation</span>
                    </DialogTitle>
                    <DialogDescription>
                      Translate text between multiple Indian languages instantly
                    </DialogDescription>
                  </DialogHeader>
                  <TranslationWidget />
                </DialogContent>
              </Dialog>
              {/* <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <Shield className="w-4 h-4 mr-2" />
                Emergency SOS
              </Button> */}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Intelligent Travel Assistant</h2>
          <p className="text-xl text-gray-600 mb-6">AI-powered personalized itinerary planning with real-time booking and instant language translation</p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              ✓ Real-time Flight & Hotel Data
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              ✓ Live Currency Conversion
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1">
              ✓ Multi-language Support
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1">
              ✓ Secure Payment Gateway
            </Badge>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg inline-block">
            <p className="font-semibold">🎉 Special Offer: Book now and save up to 40% on your next trip!</p>
          </div>
        </div>

        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="planner">AI Planner</TabsTrigger>
            <TabsTrigger value="search">Search & Book</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="guides">Local Guides</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>AI-Powered Smart Itinerary Planner</span>
                </CardTitle>
                <CardDescription>
                  Tell us your preferences and let our advanced AI create the perfect travel plan with real-time data,
                  local insights, weather forecasts, and cultural recommendations tailored just for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="destination">Dream Destination</Label>
    <Input
      id="destination"
      placeholder="Where do you want to explore? (e.g., Goa, Kerala, Rajasthan)"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="budget">Total Budget (₹)</Label>
    <Input
      id="budget"
      placeholder="Your comfortable budget range"
      value={budget}
      onChange={(e) => setBudget(e.target.value)}
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="duration">Trip Duration</Label>
    <Input
      id="duration"
      placeholder="How long is your adventure?"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="interests">Travel Experience</Label>
    <Select onValueChange={(value) => setSelectedExperience(value)}>
      <SelectTrigger>
        <SelectValue placeholder="What excites you most?" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="adventure">Adventure & Thrill</SelectItem>
        <SelectItem value="cultural">Cultural & Heritage</SelectItem>
        <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
        <SelectItem value="food">Food & Culinary Tours</SelectItem>
        <SelectItem value="nature">Nature & Wildlife</SelectItem>
        <SelectItem value="photography">Photography & Scenic</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>


                <Button
                  onClick={generateItinerary}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating your itinerary...
                    </>
                  ) : (
                    "✨ Generate My Perfect Itinerary"
                  )}
                </Button>

              </CardContent>
            </Card>

            {showItinerary && (
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Personalized Travel Itinerary</span>
                    <Badge variant="secondary" className="flex items-center space-x-1 bg-green-100 text-green-800">
                      <Star className="w-3 h-3" />
                      <span>AI Generated with Live Data</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-blue-500" />
                        <div>
                          <span className="font-semibold text-lg">Destination:</span>
                          <p className="text-gray-700">{sampleItinerary.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-green-500" />
                        <div>
                          <span className="font-semibold text-lg">Duration:</span>
                          <p className="text-gray-700">{sampleItinerary.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-6 h-6 text-yellow-500" />
                        <div>
                          <span className="font-semibold text-lg">Total Budget:</span>
                          <p className="text-gray-700">{sampleItinerary.budget}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Cloud className="w-6 h-6 text-blue-400" />
                        <div>
                          <span className="font-semibold text-lg">Weather:</span>
                          <p className="text-gray-700">{sampleItinerary.weather}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-purple-500" />
                        <div>
                          <span className="font-semibold text-lg">Local Events:</span>
                          <p className="text-gray-700">{sampleItinerary.events}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Smart Budget Breakdown:</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span>🏨 Accommodation:</span>
                            <span className="font-semibold">{sampleItinerary.breakdown.stay}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span>🚗 Transportation:</span>
                            <span className="font-semibold">{sampleItinerary.breakdown.travel}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <span>🍽️ Food & Dining:</span>
                            <span className="font-semibold">{sampleItinerary.breakdown.food}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                            <span>🎯 Activities & Tours:</span>
                            <span className="font-semibold">{sampleItinerary.breakdown.activities}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold text-lg mb-4">🎯 Recommended Experiences:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                      {sampleItinerary.activities.map((activity, index) => (
                        <span key={index}>
                        {/* <Badge key={index} variant="outline" className="justify-center p-3 text-sm">
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span><b>Location</b> - {activity.location}<br></br></span>
                            <span>Cost - {activity.cost}</span>
                          </div>
                          <span><b>Morning - </b>{activity.morning}</span>
                          <span><b>Afternoon - </b>{activity.afternoon}</span>
                          <span><b>Evening - </b>{activity.evening}</span>
                        </Badge> */}
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span><b>Location</b> - {activity.location}<br></br></span>
                            <span>Cost - {activity.cost}</span>
                          </div>
                          <span><b>Morning - </b>{activity.morning}</span>
                          <span><b>Afternoon - </b>{activity.afternoon}</span>
                          <span><b>Evening - </b>{activity.evening}</span>
                        </div>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold text-lg mb-4">💡 Local Insider Tips:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sampleItinerary.localTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-500 font-bold">•</span>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className="mt-8 flex space-x-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      🎫 Book This Complete Package
                    </Button>
                    <Button variant="outline" className="flex-1">
                      ✏️ Customize My Trip
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flights">✈️ Flights</TabsTrigger>
                <TabsTrigger value="hotels">🏨 Hotels</TabsTrigger>
                <TabsTrigger value="buses">🚌 Buses</TabsTrigger>
              </TabsList>

              <TabsContent value="flights">
                <FlightSearch />
              </TabsContent>

              <TabsContent value="hotels">
                <HotelSearch />
              </TabsContent>

              <TabsContent value="buses">
                <BusSearch />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="currency" className="space-y-6">
            <CurrencyConverter />

            <Card>
              <CardHeader>
                <CardTitle>💰 Travel Money Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">💳 Payment Methods in India</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• UPI (PhonePe, GPay, Paytm) - Most widely accepted</li>
                      <li>• Credit/Debit Cards - Major cities and hotels</li>
                      <li>• Cash - Essential for local markets and street food</li>
                      <li>• Digital Wallets - Convenient for online bookings</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">🏧 ATM & Banking</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• ATMs available in all major cities</li>
                      <li>• International cards accepted at most ATMs</li>
                      <li>• Notify your bank before traveling</li>
                      <li>• Keep some cash for rural areas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <Shield className="w-5 h-5" />
                    <span>Emergency SOS</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    🚨 Emergency Call
                  </Button>
                  <div className="space-y-3">
                    <p className="font-semibold">📞 Emergency Numbers:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-red-50 rounded">Police: <strong>100</strong></div>
                      <div className="p-2 bg-red-50 rounded">Ambulance: <strong>108</strong></div>
                      <div className="p-2 bg-red-50 rounded">Fire: <strong>101</strong></div>
                      <div className="p-2 bg-red-50 rounded">Tourist Helpline: <strong>1363</strong></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Safety Rating & Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Area Safety Score:</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                        <span className="ml-2 font-bold">4.2/5</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Low Crime Rate
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        ✓ Tourist Friendly
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        ⚠️ Crowded Areas
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Connect with Verified Local Guides</span>
                </CardTitle>
                <CardDescription>
                  Get authentic local experiences, real-time help, and insider recommendations from trusted local experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((guide) => (
                    <Card key={guide} className="border-2 border-blue-100">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback className="bg-blue-100">G{guide}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">Rajesh Kumar</h4>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm ml-1">4.8 (127 reviews)</span>
                            </div>
                            <p className="text-xs text-gray-500">5+ years experience</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Specialized in heritage tours, food experiences, and cultural immersion. Fluent in Hindi, Telugu, and English.
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">Food Tours</Badge>
                          <Badge variant="outline" className="text-xs">Heritage</Badge>
                          <Badge variant="outline" className="text-xs">Photography</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">Connect</Button>
                          <Button size="sm" variant="outline">View Profile</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌐 Multi-Language Guide Support</CardTitle>
                <CardDescription>Our verified guides speak multiple local languages for seamless communication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { lang: "Hindi", native: "हिंदी", guides: 45 },
                    { lang: "Telugu", native: "తెలుగు", guides: 32 },
                    { lang: "Tamil", native: "தமிழ்", guides: 28 },
                    { lang: "Kannada", native: "ಕನ್ನಡ", guides: 25 },
                    { lang: "Malayalam", native: "മലയാളം", guides: 18 }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg hover:bg-blue-50">
                      <div className="text-lg font-semibold">{item.native}</div>
                      <div className="text-xs text-gray-500">{item.lang}</div>
                      <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-800">
                        {item.guides} guides
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">✓ Real-time translation support:</span> Chat with guides in your preferred language using our built-in translation feature
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Secure Payment Gateway</span>
                </CardTitle>
                <CardDescription>
                  Multiple payment options with bank-level security and instant confirmation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 hover:bg-purple-50 border-purple-200">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">Pe</span>
                    </div>
                    <span className="text-sm font-semibold">PhonePe</span>
                    <span className="text-xs text-gray-500">UPI Payment</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 hover:bg-blue-50 border-blue-200">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">G</span>
                    </div>
                    <span className="text-sm font-semibold">Google Pay</span>
                    <span className="text-xs text-gray-500">Quick Pay</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 hover:bg-blue-50 border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                    <span className="text-sm font-semibold">Paytm</span>
                    <span className="text-xs text-gray-500">Wallet</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 hover:bg-gray-50">
                    <CreditCard className="w-10 h-10 text-gray-600" />
                    <span className="text-sm font-semibold">Cards</span>
                    <span className="text-xs text-gray-500">Visa/Master</span>
                  </Button>
                </div>

                <div className="border rounded-lg p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                  <h4 className="font-semibold mb-4 text-lg">💳 Sample Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <span>✈️</span>
                        <span>Flight Booking (Delhi → Hyderabad)</span>
                      </span>
                      <span className="font-semibold">₹5,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <span>🏨</span>
                        <span>Hotel Booking (2 nights)</span>
                      </span>
                      <span className="font-semibold">₹2,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Activities & Tours</span>
                      </span>
                      <span className="font-semibold">₹1,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Taxes & Service Charges</span>
                      <span>₹200</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹8,900</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔒 Payment Security Features</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 256-bit SSL encryption for all transactions</li>
                    <li>• PCI DSS compliant payment processing</li>
                    <li>• Instant payment confirmation via SMS & Email</li>
                    <li>• 24/7 fraud monitoring and protection</li>
                    <li>• Full refund protection with easy cancellation</li>
                  </ul>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700" size="lg">
                  💳 Proceed to Secure Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
