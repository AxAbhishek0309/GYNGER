import { NextResponse } from "next/server"
import { apiQueue } from "@/lib/api-queue"

const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || "YOUR_API_KEY_HERE"
const CRYPTOCOMPARE_API_BASE = "https://min-api.cryptocompare.com"

const COIN_SYMBOLS: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  "usd-coin": "USDC",
}

const chartCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 900000 // 15 minutes in ms

function generateFallbackData(coinId: string, days: string) {
  const basePrice = coinId === "bitcoin" ? 43000 : coinId === "ethereum" ? 2600 : coinId === "solana" ? 98 : 1
  const numDays = Number.parseInt(days) || 7
  const data = []
  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const trend = Math.sin((i / numDays) * Math.PI) * 0.1
    const noise = (Math.random() - 0.5) * 0.05
    const price = basePrice * (1 + trend + noise)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Math.round(price * 100) / 100,
      timestamp: date.getTime(),
    })
  }
  return data
}

async function fetchChartData(coinId: string, days: string) {
  const symbol = COIN_SYMBOLS[coinId] || "BTC"
  const url = `${CRYPTOCOMPARE_API_BASE}/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=${days}`
  const response = await fetch(url, {
      headers: {
      Authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
    },
  })
  if (!response.ok) {
    if (response.status === 429) throw new Error("RATE_LIMITED")
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get("coinId") || "bitcoin"
    const days = searchParams.get("days") || "7"
    const cacheKey = `${coinId}-${days}`
    const now = Date.now()
    const cached = chartCache.get(cacheKey)
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        lastUpdated: new Date(cached.timestamp).toISOString(),
      })
    }
    const apiData = await apiQueue.add(() => fetchChartData(coinId, days))
    // Transform CryptoCompare data
    const chartData = (apiData.Data?.Data || []).map((entry: any) => ({
      date: new Date(entry.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Math.round(entry.close * 100) / 100,
      timestamp: entry.time * 1000,
    }))
    chartCache.set(cacheKey, { data: chartData, timestamp: now })
    return NextResponse.json({
      data: chartData,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get("coinId") || "bitcoin"
    const days = searchParams.get("days") || "7"
    const cacheKey = `${coinId}-${days}`
    const cached = chartCache.get(cacheKey)
    if (cached) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        error: "API temporarily unavailable, showing cached data",
        lastUpdated: new Date(cached.timestamp).toISOString(),
      })
    }
    const fallbackData = generateFallbackData(coinId, days)
    return NextResponse.json({
      data: fallbackData,
      cached: false,
      error:
        error instanceof Error && error.message === "RATE_LIMITED"
          ? "Rate limited by API, showing simulated data"
          : "API unavailable, showing simulated data",
      lastUpdated: new Date().toISOString(),
    })
  }
}
