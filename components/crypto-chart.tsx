"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

interface ChartData {
  date: string
  price: number
  timestamp: number
}

interface ChartAPIResponse {
  data: ChartData[]
  cached: boolean
  error?: string
  lastUpdated: string
}

interface CryptoChartProps {
  coinId: string
  days?: string
}

export function CryptoChart({ coinId, days = "7" }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<{
    isLive: boolean
    error?: string
  }>({ isLive: true })

  useEffect(() => {
    fetchChartData()
  }, [coinId, days])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      setApiStatus({ isLive: true })

      const response = await fetch(`/api/crypto-chart?coinId=${coinId}&days=${days}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ChartAPIResponse = await response.json()
      setChartData(result.data)

      setApiStatus({
        isLive: !result.cached && !result.error,
        error: result.error,
      })
    } catch (error) {
      console.error("Error fetching chart data:", error)
      setApiStatus({
        isLive: false,
        error: "Failed to load chart data",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Chart status indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          {apiStatus.isLive ? (
            <Wifi className="w-3 h-3 text-green-400" />
          ) : (
            <WifiOff className="w-3 h-3 text-yellow-400" />
          )}
          <span className={apiStatus.isLive ? "text-green-400" : "text-yellow-400"}>
            {apiStatus.isLive ? "Live Data" : "Simulated Data"}
          </span>
        </div>
        {apiStatus.error && (
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs">{apiStatus.error}</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#000" tick={{ fill: "#000" }} fontSize={12} />
            <YAxis
              stroke="#000"
              tick={{ fill: "#000" }}
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#gradient)"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
