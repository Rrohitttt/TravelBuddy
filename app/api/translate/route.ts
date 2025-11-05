import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, fromLang, toLang } = body
    
    if (!text || !fromLang || !toLang) {
      return NextResponse.json({
        error: 'Missing required parameters',
        success: false
      }, { status: 400 })
    }
    
    // Enhanced translation mappings for better coverage
    const translationMappings: Record<string, Record<string, string>> = {
      'Hello': {
        'hi': 'नमस्ते',
        'te': 'నమస్కారం',
        'ta': 'வணக்கம்',
        'kn': 'ನಮಸ್ಕಾರ',
        'ml': 'നമസ്കാരം',
        'bn': 'নমস্কার',
        'gu': 'નમસ્તે',
        'mr': 'नमस्कार',
        'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ'
      },
      'Thank you': {
        'hi': 'धन्यवाद',
        'te': 'ధన్యవాదాలు',
        'ta': 'நன்றி',
        'kn': 'ಧನ್ಯವಾದಗಳು',
        'ml': 'നന്ദി',
        'bn': 'ধন্যবাদ',
        'gu': 'આભાર',
        'mr': 'धन्यवाद',
        'pa': 'ਧੰਨਵਾਦ'
      },
      'How are you?': {
        'hi': 'आप कैसे हैं?',
        'te': 'మీరు ఎలా ఉన్నారు?',
        'ta': 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
        'kn': 'ನೀವು ಹೇಗಿದ್ದೀರಿ?',
        'ml': 'നിങ്ങൾ എങ്ങനെയുണ്ട്?',
        'bn': 'আপনি কেমন আছেন?',
        'gu': 'તમે કેમ છો?',
        'mr': 'तुम्ही कसे आहात?',
        'pa': 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?'
      },
      'Where is the hotel?': {
        'hi': 'होटल कहाँ है?',
        'te': 'హోటల్ ఎక్కడ ఉంది?',
        'ta': 'ஹோட்டல் எங்கே இருக்கிறது?',
        'kn': 'ಹೋಟೆಲ್ ಎಲ್ಲಿದೆ?',
        'ml': 'ഹോട്ടൽ എവിടെയാണ്?',
        'bn': 'হোটেল কোথায়?',
        'gu': 'હોટેલ ક્યાં છે?',
        'mr': 'हॉटेल कुठे आहे?',
        'pa': 'ਹੋਟਲ ਕਿੱਥੇ ਹੈ?'
      },
      'How much does this cost?': {
        'hi': 'इसकी कीमत कितनी है?',
        'te': 'దీని ధర ఎంత?',
        'ta': 'இதன் விலை எவ்வளவு?',
        'kn': 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
        'ml': 'ഇതിന്റെ വില എത്രയാണ്?',
        'bn': 'এর দাম কত?',
        'gu': 'આની કિંમત કેટલી છે?',
        'mr': 'याची किंमत किती आहे?',
        'pa': 'ਇਸਦੀ ਕੀਮਤ ਕਿੰਨੀ ਹੈ?'
      },
      'I need help': {
        'hi': 'मुझे मदद चाहिए',
        'te': 'నాకు సహాయం కావాలి',
        'ta': 'எனக்கு உதவி வேண்டும்',
        'kn': 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
        'ml': 'എനിക്ക് സഹായം വേണം',
        'bn': 'আমার সাহায্য দরকার',
        'gu': 'મને મદદ જોઈએ',
        'mr': 'मला मदत हवी',
        'pa': 'ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ'
      },
      'Can you help me?': {
        'hi': 'क्या आप मेरी मदद कर सकते हैं?',
        'te': 'మీరు నాకు సహాయం చేయగలరా?',
        'ta': 'நீங்கள் எனக்கு உதவ முடியுமா?',
        'kn': 'ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?',
        'ml': 'നിങ്ങൾക്ക് എന്നെ സഹായിക്കാൻ കഴിയുമോ?',
        'bn': 'আপনি কি আমাকে সাহায্য করতে পারেন?',
        'gu': 'શું તમે મને મદદ કરી શકો છો?',
        'mr': 'तुम्ही माझी मदत करू शकता का?',
        'pa': 'ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?'
      },
      'Where is the bathroom?': {
        'hi': 'बाथरूम कहाँ है?',
        'te': 'బాత్రూమ్ ఎక్కడ ఉంది?',
        'ta': 'குளியலறை எங்கே இருக்கிறது?',
        'kn': 'ಸ್ನಾನಗೃಹ ಎಲ್ಲಿದೆ?',
        'ml': 'കുളിമുറി എവിടെയാണ്?',
        'bn': 'বাথরুম কোথায়?',
        'gu': 'બાથરૂમ ક્યાં છે?',
        'mr': 'बाथरूम कुठे आहे?',
        'pa': 'ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?'
      }
    }
    
    // Try to find exact match first
    let translatedText = translationMappings[text]?.[toLang]
    
    // If no exact match, try case-insensitive search
    if (!translatedText) {
      const lowerText = text.toLowerCase()
      for (const [key, translations] of Object.entries(translationMappings)) {
        if (key.toLowerCase() === lowerText) {
          translatedText = translations[toLang]
          break
        }
      }
    }
    
    // If still no match, provide a formatted fallback
    if (!translatedText) {
      const langNames: Record<string, string> = {
        'hi': 'Hindi',
        'te': 'Telugu', 
        'ta': 'Tamil',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'bn': 'Bengali',
        'gu': 'Gujarati',
        'mr': 'Marathi',
        'pa': 'Punjabi'
      }
      
      translatedText = `[${langNames[toLang] || toLang.toUpperCase()}] ${text}`
    }
    
    return NextResponse.json({
      translatedText,
      success: true,
      source: fromLang,
      target: toLang
    })
    
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json({
      error: 'Translation service temporarily unavailable',
      success: false
    }, { status: 500 })
  }
}
