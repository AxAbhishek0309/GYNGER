import { NextResponse } from "next/server"

const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || "YOUR_API_KEY_HERE"
const CRYPTOCOMPARE_API_BASE = "https://min-api.cryptocompare.com"

const SUPPORTED_SYMBOLS: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  "usd-coin": "USDC",
}

const FALLBACK_HISTORICAL = {
  bitcoin: { "1d": 42800, "1w": 41200, "1m": 38500, "1y": 16800 },
  ethereum: { "1d": 2680, "1w": 2520, "1m": 2200, "1y": 1200 },
  solana: { "1d": 95.2, "1w": 88.3, "1m": 75.6, "1y": 22.5 },
  "usd-coin": { "1d": 1.0, "1w": 1.0, "1m": 1.0, "1y": 1.0 },
}

const CACHE_DURATION = 7200000 // 2 hours in ms
const historicalCache = new Map<string, { data: any; timestamp: number }>()

function getUnixTimestampDaysAgo(daysAgo: number): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor(now.getTime() / 1000) - daysAgo * 86400
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get("coinId") || "bitcoin"
    const symbol = SUPPORTED_SYMBOLS[coinId] || "BTC"
    const cacheKey = coinId
    const now = Date.now()

    // Check cache first
    const cached = historicalCache.get(cacheKey)
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        lastUpdated: new Date(cached.timestamp).toISOString(),
      })
    }

    // Periods and how many days ago
    const periods: Record<'1d' | '1w' | '1m' | '1y', number> = {
      "1d": 1,
      "1w": 7,
      "1m": 30,
      "1y": 365,
    }

    // Fetch up to 365 days of daily closes
    const url = `${CRYPTOCOMPARE_API_BASE}/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=365&aggregate=1`
    const response = await fetch(url, {
      headers: {
        Authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
      },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    if (!data.Data || !data.Data.Data) throw new Error("Malformed response from CryptoCompare")
    const history = data.Data.Data // Array of { time, close, ... }

    // Map period to price
    const historicalPrices: Record<'1d' | '1w' | '1m' | '1y', number> = {
      '1d': 0,
      '1w': 0,
      '1m': 0,
      '1y': 0,
    }
    for (const key of Object.keys(periods) as Array<'1d' | '1w' | '1m' | '1y'>) {
      const daysAgo = periods[key]
      const targetTimestamp = getUnixTimestampDaysAgo(daysAgo)
      const entry = history.find((h: any) => h.time >= targetTimestamp) || history[0]
      historicalPrices[key] = entry.close
    }

    // Fallback for any missing
    const fallbackData = FALLBACK_HISTORICAL[coinId as keyof typeof FALLBACK_HISTORICAL] || FALLBACK_HISTORICAL.bitcoin
    for (const key of Object.keys(periods) as Array<'1d' | '1w' | '1m' | '1y'>) {
      if (!historicalPrices[key] || historicalPrices[key] <= 0) {
        historicalPrices[key] = fallbackData[key]
      }
    }

    // Cache
    historicalCache.set(cacheKey, { data: historicalPrices, timestamp: now })

    return NextResponse.json({
      data: historicalPrices,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching historical data:", error)
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get("coinId") || "bitcoin"
    const fallbackData = FALLBACK_HISTORICAL[coinId as keyof typeof FALLBACK_HISTORICAL] || FALLBACK_HISTORICAL.bitcoin
    return NextResponse.json({
      data: fallbackData,
      cached: false,
      error: "Using fallback historical data",
      lastUpdated: new Date().toISOString(),
    })
  }
}
