import { NextResponse } from "next/server"
import { apiQueue } from "@/lib/api-queue"

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

// Cache for chart data - longer cache for chart data
const chartCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 900000 // 15 minutes in milliseconds

// Fallback chart data generator
function generateFallbackData(coinId: string, days: string) {
  const basePrice = coinId === "bitcoin" ? 43000 : coinId === "ethereum" ? 2600 : coinId === "solana" ? 98 : 1
  const numDays = Number.parseInt(days) || 7
  const data = []

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Generate more realistic price movement
    const trend = Math.sin((i / numDays) * Math.PI) * 0.1 // Overall trend
    const noise = (Math.random() - 0.5) * 0.05 // Daily noise
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
  const response = await fetch(
    `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "CryptoVault/1.0",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    },
  )

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMITED")
    }
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

    // Check cache first
    const cached = chartCache.get(cacheKey)
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        lastUpdated: new Date(cached.timestamp).toISOString(),
      })
    }

    // Use API queue to manage rate limiting
    const apiData = await apiQueue.add(() => fetchChartData(coinId, days))

    // Transform data for chart
    const chartData =
      apiData.prices?.map((price: [number, number]) => ({
        date: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: Math.round(price[1] * 100) / 100,
        timestamp: price[0],
      })) || []

    // Cache the transformed data
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

    // Check if we have any cached data, even if expired
    const cached = chartCache.get(cacheKey)
    if (cached) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        error: "API temporarily unavailable, showing cached data",
        lastUpdated: new Date(cached.timestamp).toISOString(),
      })
    }

    // Generate fallback data
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
