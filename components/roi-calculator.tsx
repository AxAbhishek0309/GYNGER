"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface ROIResult {
  invested: number
  currentValue: number
  profit: number
  roi: number
  period: string
  dateUsed: string
  historicalPrice: number
  currentPrice: number
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  current_price: number
}

export function ROICalculator() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("")
  const [investmentAmount, setInvestmentAmount] = useState<string>("1000")
  const [results, setResults] = useState<ROIResult[]>([])
  const [calculating, setCalculating] = useState(false)
  const [cryptoOptions] = useState<CryptoOption[]>([
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 0 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 0 },
    { id: "solana", name: "Solana", symbol: "SOL", current_price: 0 },
    { id: "usd-coin", name: "USD Coin", symbol: "USDC", current_price: 0 },
  ])
  const { toast } = useToast()

  const calculateROI = async () => {
    if (!selectedCrypto || !investmentAmount) return

    setCalculating(true)

    try {
      const investment = Number.parseFloat(investmentAmount)
      if (isNaN(investment) || investment <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid investment amount",
          variant: "destructive",
        })
        return
      }

      // Fetch current price and historical data
      const [cryptoResponse, historicalResponse] = await Promise.all([
        fetch("/api/crypto-data"),
        fetch(`/api/crypto-historical?coinId=${selectedCrypto}`),
      ])

      if (!cryptoResponse.ok || !historicalResponse.ok) {
        console.error("API fetch failed:", { cryptoStatus: cryptoResponse.status, historicalStatus: historicalResponse.status })
        throw new Error("Failed to fetch data")
      }

      const cryptoData = await cryptoResponse.json()
      const historicalPricesResponse = await historicalResponse.json()
      console.log("[ROI DEBUG] /api/crypto-data response:", cryptoData)
      console.log("[ROI DEBUG] /api/crypto-historical response:", historicalPricesResponse)
      const prices = historicalPricesResponse.data || {}

      // Find current crypto data (fix: use cryptoData.data)
      const cryptoList = cryptoData.data || []
      if (!Array.isArray(cryptoList)) {
        console.error("[ROI DEBUG] cryptoData.data is not an array", cryptoData)
        throw new Error("Malformed crypto data from API")
      }
      const crypto = cryptoList.find((c: any) => c.id === selectedCrypto)
      if (!crypto) {
        console.error("[ROI DEBUG] Cryptocurrency not found in data", { selectedCrypto, cryptoList })
        throw new Error("Cryptocurrency not found")
      }

      const periods = [
        { key: "1d", label: "1 Day" },
        { key: "1w", label: "1 Week" },
        { key: "1m", label: "1 Month" },
        { key: "1y", label: "1 Year" },
      ]

      const newResults: ROIResult[] = periods.map((period) => {
        // Use the new structure for historical price
        const historicalPrice = prices[period.key] || crypto.current_price

        // Calculate the date used for this period
        let dateUsed = new Date()
        if (period.key === '1d') dateUsed = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        if (period.key === '1w') dateUsed = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        if (period.key === '1m') dateUsed = new Date(new Date().setMonth(new Date().getMonth() - 1))
        if (period.key === '1y') dateUsed = new Date(new Date().setFullYear(new Date().getFullYear() - 1))

        // Debug log for transparency
        console.log(`[ROI DEBUG] Period: ${period.label}, Date Used: ${dateUsed.toISOString().slice(0,10)}, Historical Price: ${historicalPrice}, Current Price: ${crypto.current_price}`)

        // Handle case where historical price is 0 or invalid
        if (!historicalPrice || historicalPrice <= 0) {
          console.warn(`[ROI DEBUG] Invalid historical price for period ${period.key}:`, historicalPrice)
          return {
            invested: investment,
            currentValue: investment,
            profit: 0,
            roi: 0,
            period: period.label,
            dateUsed: dateUsed.toISOString().slice(0,10),
            historicalPrice,
            currentPrice: crypto.current_price,
          } as any
        }

        const tokensOwned = investment / historicalPrice
        const currentValue = tokensOwned * crypto.current_price
        const profit = currentValue - investment
        const roi = ((currentValue - investment) / investment) * 100

        return {
          invested: investment,
          currentValue,
          profit,
          roi,
          period: period.label,
          dateUsed: dateUsed.toISOString().slice(0,10),
          historicalPrice,
          currentPrice: crypto.current_price,
        } as any
      })
      setResults(newResults)

      toast({
        title: "ROI Calculated",
        description: "Your investment returns have been calculated successfully",
      })
    } catch (error) {
      console.error("[ROI DEBUG] Error calculating ROI:", error)
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Unable to calculate ROI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCalculating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
      {/* Calculator Input */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            ROI Calculator
          </CardTitle>
          <CardDescription className="text-gray-700">
            Calculate your returns if you invested in crypto at different time periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="crypto-select" className="text-black">
              Select Cryptocurrency
            </Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-white/5 border-white/10 text-black">
                <SelectValue placeholder="Choose a cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {cryptoOptions.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id} className="text-black">
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="investment-amount" className="text-black">
              Investment Amount (USD)
            </Label>
            <Input
              id="investment-amount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter amount in USD"
              className="bg-white/5 border-white/10 text-black placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[100, 500, 1000, 5000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => setInvestmentAmount(amount.toString())}
                className="border-white/10 text-white hover:bg-white/10"
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
          </div>

          <Button
            onClick={calculateROI}
            disabled={!selectedCrypto || !investmentAmount || calculating}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-black"
          >
            {calculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate ROI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-black flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            ROI Results
          </CardTitle>
          <CardDescription className="text-gray-700">
            Your potential returns across different time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Select a cryptocurrency and investment amount to see ROI calculations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.period}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-black font-semibold">{result.period} Ago</h3>
                        <Badge
                          variant={result.roi >= 0 ? "default" : "destructive"}
                          className={result.roi >= 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                        >
                          {result.roi >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {formatPercentage(result.roi)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Invested</p>
                          <p className="text-black font-mono">{formatCurrency(result.invested)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Current Value</p>
                          <p className="text-black font-mono">{formatCurrency(result.currentValue)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400">Profit/Loss</p>
                          <p
                            className={`font-mono font-bold ${result.profit >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {result.profit >= 0 ? "+" : ""}
                            {formatCurrency(result.profit)}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          <div>Date Used: {result.dateUsed}</div>
                          <div>Historical Price: ${result.historicalPrice?.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                          <div>Current Price: ${result.currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
