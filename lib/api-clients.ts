// API client configurations and helper functions
export const GOOGLE_AI_STUDIO_API_KEY='AIzaSyC64MHIl-uXu3fxUvX_trqWUnAeNlNjzWY';
export const API_ENDPOINTS = {
  // Translation API (LibreTranslate - Free)
  TRANSLATE: 'https://api.mymemory.translated.net/get',

  GENARATE_ITENARY:'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',

  LIVE_CURRENCY:'https://api.freecurrencyapi.com/v1/latest',
  
  // Flight API (Amadeus - Free tier)
  FLIGHTS: '/api/flights',
  
  // Hotel API (Booking.com via RapidAPI - Free tier)
  HOTELS: '/api/hotels',
  
  // Bus API (RedBus via RapidAPI - Free tier)
  BUSES: '/api/buses',
  
  // Weather API (OpenWeatherMap - Free)
  WEATHER: '/api/weather'
}
export const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
export const SUPPORTED_LANGUAGES = [
{ code: "af", name: "Afrikaans", native: "Afrikaans" },
{ code: "ar", name: "Arabic", native: "العربية" },
{ code: "bg", name: "Bulgarian", native: "български" },
{ code: "bn", name: "Bengali", native: "বাংলা" },
{ code: "ca", name: "Catalan", native: "Català" },
{ code: "cs", name: "Czech", native: "Čeština" },
{ code: "da", name: "Danish", native: "Dansk" },
{ code: "de", name: "German", native: "Deutsch" },
{ code: "el", name: "Greek", native: "Ελληνικά" },
{ code: "en", name: "English", native: "English" },
{ code: "es", name: "Spanish", native: "Español" },
{ code: "et", name: "Estonian", native: "Eesti" },
{ code: "fa", name: "Persian", native: "فارسی" },
{ code: "fi", name: "Finnish", native: "Suomi" },
{ code: "fr", name: "French", native: "Français" },
{ code: "gu", name: "Gujarati", native: "ગુજરાતી" },
{ code: "he", name: "Hebrew", native: "עברית" },
{ code: "hi", name: "Hindi", native: "हिन्दी" },
{ code: "hr", name: "Croatian", native: "Hrvatski" },
{ code: "hu", name: "Hungarian", native: "Magyar" },
{ code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
{ code: "it", name: "Italian", native: "Italiano" },
{ code: "ja", name: "Japanese", native: "日本語" },
{ code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
{ code: "ko", name: "Korean", native: "한국어" },
{ code: "lt", name: "Lithuanian", native: "Lietuvių" },
{ code: "lv", name: "Latvian", native: "Latviešu" },
{ code: "ml", name: "Malayalam", native: "മലയാളം" },
{ code: "mr", name: "Marathi", native: "मराठी" },
{ code: "ms", name: "Malay", native: "Bahasa Melayu" },
{ code: "nl", name: "Dutch", native: "Nederlands" },
{ code: "no", name: "Norwegian", native: "Norsk" },
{ code: "pl", name: "Polish", native: "Polski" },
{ code: "pt", name: "Portuguese", native: "Português" },
{ code: "ro", name: "Romanian", native: "Română" },
{ code: "ru", name: "Russian", native: "Русский" },
{ code: "sk", name: "Slovak", native: "Slovenčina" },
{ code: "sl", name: "Slovenian", native: "Slovenščina" },
{ code: "sr", name: "Serbian", native: "Српски" },
{ code: "sv", name: "Swedish", native: "Svenska" },
{ code: "sw", name: "Swahili", native: "Kiswahili" },
{ code: "ta", name: "Tamil", native: "தமிழ்" },
{ code: "te", name: "Telugu", native: "తెలుగు" },
{ code: "th", name: "Thai", native: "ไทย" },
{ code: "tr", name: "Turkish", native: "Türkçe" },
{ code: "uk", name: "Ukrainian", native: "Українська" },
{ code: "ur", name: "Urdu", native: "اردو" },
{ code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
{ code: "zh", name: "Chinese", native: "中文" }
]

// Translation function
export async function translateText(text: string, fromLang: string, toLang: string) {
  try {
    const response = await fetch(API_ENDPOINTS.TRANSLATE+`?q=${text}&langpair=${fromLang}|${toLang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      
    })
    
    if (!response.ok) throw new Error('Translation failed')
    
    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text if translation fails
  }
}

// Flight search function
export async function searchFlights(from: string, to: string, date: string) {
  try {
    const response = await fetch(`${API_ENDPOINTS.FLIGHTS}?from=${from}&to=${to}&date=${date}`)
    if (!response.ok) throw new Error('Flight search failed')
    return await response.json()
  } catch (error) {
    console.error('Flight search error:', error)
    return []
  }
}

// Hotel search function
export async function searchHotels(destination: string, checkin: string, checkout: string) {
  try {
    const response = await fetch(`${API_ENDPOINTS.HOTELS}?destination=${destination}&checkin=${checkin}&checkout=${checkout}`)
    if (!response.ok) throw new Error('Hotel search failed')
    return await response.json()
  } catch (error) {
    console.error('Hotel search error:', error)
    return []
  }
}

// Bus search function
export async function searchBuses(from: string, to: string, date: string) {
  try {
    const response = await fetch(`${API_ENDPOINTS.BUSES}?from=${from}&to=${to}&date=${date}`)
    if (!response.ok) throw new Error('Bus search failed')
    return await response.json()
  } catch (error) {
    console.error('Bus search error:', error)
    return []
  }
}

//
export function getCurrencyLiveDataApiLink(from: string,to: string){
    return `${API_ENDPOINTS.LIVE_CURRENCY}?base_currency=${from}&amount=1000
&apikey=fca_live_68Bo9R893sBEbj0mRVnQmpbOTty6KYISsT1baXCJ&currencies=${to}`
}

export function getItenaryprompt(city:string,days:string,budget:string){
  return `
Please provide a comprehensive ${days}-day itinerary for exploring ${city} with in budget of ${budget} and its surrounding areas. Present the information in a structured JSON format, similar to the example below:

    
const itinerary = {
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
    activities: [
      {
        location: string,
        day: number,
        cost: number,
        morning: string,
        afternoon: string,
        evening: string,
        notes: string,
      }
    ],
    safetyRating: 0,
    localGuides: 0,
    bestTimeToVisit: "",
    localTips: []
}

    

    
Please fill in all the fields with relevant and up-to-date information for ${city}. Include popular attractions, cultural experiences, and local cuisine recommendations. Ensure the budget breakdown is realistic and the activities are varied and representative of ${city}'s rich culture and history. Also, provide useful local tips that would enhance a visitor's experience in the city.
`
}
export function getItenaryrequestpayload(text:string){
  return {
    "contents": [
      {
        "parts": [
          {
            "text": text
          }
        ]
      }
    ]
  }
}
export function convertJSONStringToJson(responseString:string) {
    try {
        // Remove the "json\n" prefix and any extra quotes at the start and end
        const cleanedString = responseString.replace(/```json\n|\n```/g, '');
        
        // Parse the cleaned string into a JSON object
        const jsonObject = JSON.parse(cleanedString);
        console.log('json value', jsonObject);
        return jsonObject;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}