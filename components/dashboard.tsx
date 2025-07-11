"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { motion } from "framer-motion"
import { CryptoChart } from "@/components/crypto-chart"
import { useToast } from "@/hooks/use-toast"

interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
}

interface APIResponse {
  data: CryptoData[]
  cached: boolean
  error?: string
  lastUpdated: string
}

export function Dashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [apiStatus, setApiStatus] = useState<{
    isLive: boolean
    error?: string
    lastUpdated?: string
  }>({ isLive: true })
  const { toast } = useToast()

  useEffect(() => {
    fetchCryptoData()

    const interval = setInterval(
      () => {
        fetchCryptoData(true)
      },
      15 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  const fetchCryptoData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await fetch("/api/crypto-data", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: APIResponse = await response.json()
      setCryptoData(result.data)

      setApiStatus({
        isLive: !result.cached && !result.error,
        error: result.error,
        lastUpdated: result.lastUpdated,
      })

      if (isRefresh) {
        if (result.error) {
          toast({
            title: "OOPS! Using Backup Data! 🔧",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "BOOM! Data Updated! 💥",
            description: result.cached ? "Showing cached data" : "Fresh live data loaded!",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error)
      setApiStatus({
        isLive: false,
        error: "Failed to fetch data",
      })

      toast({
        title: "OH NO! Update Failed! 😱",
        description: "Unable to fetch latest data. Try again later!",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchCryptoData(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="sound-effect text-4xl comic-loading">LOADING SUPER DATA...</div>
        </div>
        <div className="responsive-grid">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="comic-card comic-panel-1 animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-6 bg-black/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-black/20 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-black/20 rounded w-full mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-black/20 rounded w-full"></div>
                  <div className="h-4 bg-black/20 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with API status and refresh button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-3xl lg:text-4xl font-bold comic-title text-white comic-glow">MARKET WATCH!</h2>
            <div className="flex items-center gap-2">
              {apiStatus.isLive ? (
                <Wifi className="w-6 h-6 text-green-400 zap-effect" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <Badge
                className={`comic-badge text-sm px-3 py-1 ${apiStatus.isLive ? "bg-green-500" : "bg-red-500"} text-white`}
              >
                {apiStatus.isLive ? "LIVE!" : "CACHED!"}
              </Badge>
            </div>
          </div>
          {apiStatus.lastUpdated && (
            <p className="text-white font-bold text-sm lg:text-base comic-text-shadow">
              Last updated: {new Date(apiStatus.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="comic-button comic-panel-1 text-black font-bold text-sm lg:text-base px-4 py-2 lg:px-6 lg:py-3 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "UPDATING..." : "REFRESH!"}
        </Button>
      </div>

      {/* API Status message */}
      {apiStatus.error && (
        <Card className="comic-card comic-panel-1">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 lg:w-8 lg:h-8 text-black flex-shrink-0 mt-1" />
              <div className="speech-bubble flex-1">
                <p className="text-black font-bold text-sm lg:text-base">{apiStatus.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Overview - Responsive Tilted Crypto Cards */}
      <div className="responsive-grid">
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="pow-effect"
          >
            <Card
              className={`comic-card crypto-card comic-panel-${(index % 5) + 1} hover:comic-panel-2 transition-all h-full`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 lg:border-3 border-black overflow-hidden flex-shrink-0">
                      <img
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=56&width=56"
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-black text-base lg:text-lg font-bold comic-title truncate">
                        {crypto.name}
                      </CardTitle>
                      <CardDescription className="text-gray-800 font-bold text-sm comic-text-shadow">
                        {crypto.symbol.toUpperCase()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={`comic-badge text-white font-bold text-xs lg:text-sm px-2 py-1 flex-shrink-0 ${
                      crypto.price_change_percentage_24h >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-black comic-title break-all">
                    {formatPrice(crypto.current_price)}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm lg:text-base">
                    <span className="text-gray-800 font-bold">Market Cap</span>
                    <span className="text-black font-bold comic-text-shadow">{formatMarketCap(crypto.market_cap)}</span>
                  </div>
                  <div className="flex justify-between text-sm lg:text-base">
                    <span className="text-gray-800 font-bold">Volume 24h</span>
                    <span className="text-black font-bold comic-text-shadow">
                      {formatMarketCap(crypto.total_volume)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <Card className="comic-card comic-panel-2">
          <CardHeader className="zigzag-border pb-4">
            <CardTitle className="text-black flex items-center comic-title text-xl lg:text-2xl">
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">BITCOIN POWER CHART!</span>
            </CardTitle>
            <CardDescription className="text-black font-bold text-sm lg:text-base comic-text-shadow">
              7-day price adventure! 🚀💰
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CryptoChart coinId="bitcoin" />
          </CardContent>
        </Card>

        <Card className="comic-card comic-panel-3">
          <CardHeader className="zigzag-border pb-4">
            <CardTitle className="text-black flex items-center comic-title text-xl lg:text-2xl">
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 flex-shrink-0" />
              <span className="truncate">ETHEREUM MEGA CHART!</span>
            </CardTitle>
            <CardDescription className="text-black font-bold text-sm lg:text-base comic-text-shadow">
              7-day price journey! ⚡💎
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CryptoChart coinId="ethereum" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
