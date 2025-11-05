"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRightLeft, Loader2 } from 'lucide-react'
import { API_ENDPOINTS, getCurrencyLiveDataApiLink } from "@/lib/api-clients"
import axios from "axios"

interface CurrencyRate {
  [key: string]: number
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("INR")
  const [toCurrency, setToCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError]=useState("")
  const [rates, setRates] = useState<CurrencyRate>({})

const currencies = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "CZK", name: "Czech Republic Koruna", symbol: "Kč" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", name: "Israeli New Sheqel", symbol: "₪" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "ZAR", name: "South African Rand", symbol: "R" }
];


  // 🔹 Input Validation Function
  const validateAmount = (): boolean => {
    if (!amount) {
      setError("Please enter an amount.")
      return false
    }
    const num = parseFloat(amount)
    if (isNaN(num)) {
      setError("Amount must be a valid number.")
      return false
    }
    if (num <= 0) {
      setError("Amount must be greater than zero.")
      return false
    }
    setError("")
    return true
  }

  const convertCurrency = async () => {
    if (!validateAmount()) return  // 🔹 Stop if invalid

    setIsLoading(true)
    try {
      const response = await axios.get(getCurrencyLiveDataApiLink(fromCurrency, toCurrency))
      const data = response.data.data

      if (data && data[toCurrency]) {
        const converted = parseFloat(amount) * data[toCurrency]
        const formatted = converted.toFixed(2)
        setConvertedAmount(formatted)

        // ✅ Save conversion to backend (no changes here)
        await axios.post("http://localhost:8080/api/currency/save", {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
          convertedAmount: parseFloat(formatted),
        })
      } else {
        setError("Conversion failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Conversion error:", error)
      setError("Error connecting to server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setConvertedAmount("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5" />
          <span>Currency Converter</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Currency */}
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
            {/* 🔹 Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-3 border rounded-md bg-gray-50 min-h-[40px] flex items-center">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="font-semibold">
                  {convertedAmount
                    ? `${currencies.find(c => c.code === toCurrency)?.symbol}${convertedAmount}`
                    : "Converted amount"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <Button onClick={convertCurrency} className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>
          <Button variant="outline" onClick={swapCurrencies}>
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Exchange rates are updated in real-time
        </div>
      </CardContent>
    </Card>
  )
}