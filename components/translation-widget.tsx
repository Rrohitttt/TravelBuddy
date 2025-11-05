"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages, Volume2, Copy, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TranslationWidget() {
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [fromLang, setFromLang] = useState("en")
  const [toLang, setToLang] = useState("hi")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // 🌍 Supported Languages
  const SUPPORTED_LANGUAGES = [
      { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "bg", name: "Bulgarian", native: "Български" },
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
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
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

  // 🧠 Handle Translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setIsTranslating(true)
    setError("")
    setSuccess(false)

    try {
      // Using MyMemory Translation API
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLang}|${toLang}`
      )

      const data = response.data?.responseData
      if (data?.translatedText) {
        setTranslatedText(data.translatedText)
        setSuccess(true)

        // 💾 Save translation to your Spring Boot backend
        await axios.post("http://localhost:8080/api/translations/save", {
          text: inputText,
          fromLanguage: fromLang,
          toLanguage: toLang,
          translatedText: data.translatedText
        })
      } else {
        setError("Translation failed. Try again.")
      }
    } catch (err) {
      console.error("Translation error:", err)
      setError("Translation service unavailable. Please try again later.")
    } finally {
      setIsTranslating(false)
    }
  }

  // 🔊 Text-to-speech
  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window && text) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "en" ? "en-US" : `${lang}-${lang.toUpperCase()}`
      speechSynthesis.speak(utterance)
    }
  }

  // 📋 Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  const commonPhrases = ["Hello", "Thank you", "How are you?", "Where is the hotel?", "I need help"]

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="w-5 h-5" />
            <span>Live Translation</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Translation completed and saved successfully!</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Section */}
            <div className="space-y-2">
              <Select value={fromLang} onValueChange={setFromLang}>
                <SelectTrigger>
                  <SelectValue placeholder="From Language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  setError("")
                }}
                className="min-h-[120px]"
              />

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speakText(inputText, fromLang)}
                  disabled={!inputText}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(inputText)}
                  disabled={!inputText}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-2">
              <Select value={toLang} onValueChange={setToLang}>
                <SelectTrigger>
                  <SelectValue placeholder="To Language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="min-h-[120px] p-3 border rounded-md bg-gray-50">
                {isTranslating ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Translating...</span>
                  </div>
                ) : (
                  <p className={translatedText ? "text-gray-900" : "text-gray-500 italic"}>
                    {translatedText || "Translation will appear here..."}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speakText(translatedText, toLang)}
                  disabled={!translatedText}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(translatedText)}
                  disabled={!translatedText}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Translate Button */}
          <Button onClick={handleTranslate} className="w-full" disabled={!inputText.trim() || isTranslating}>
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4 mr-2" />
                Translate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Phrases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Phrases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonPhrases.map((phrase) => (
              <Button
                key={phrase}
                variant="outline"
                size="sm"
                onClick={() => setInputText(phrase)}
                className="text-xs"
              >
                {phrase}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
