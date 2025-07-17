import { NextResponse } from "next/server"

// Cache duration in seconds (reduced to ensure fresh data)
const CACHE_DURATION = 15

// In-memory cache (this was the issue - Vercel serverless functions don't persist memory between invocations)
// We'll use a different approach for production
let cachedData: any = null
let lastFetchTime = 0

// Fallback data in case API fails
const FALLBACK_DATA = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 43250.5,
    price_change_percentage_24h: 2.45,
    market_cap: 847000000000,
    total_volume: 15600000000,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    current_price: 2650.75,
    price_change_percentage_24h: -1.23,
    market_cap: 318000000000,
    total_volume: 8900000000,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    current_price: 98.45,
    price_change_percentage_24h: 5.67,
    market_cap: 42000000000,
    total_volume: 1200000000,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    id: "usd-coin",
    name: "USD Coin",
    symbol: "usdc",
    current_price: 1.0,
    price_change_percentage_24h: 0.01,
    market_cap: 24000000000,
    total_volume: 3400000000,
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  },
]

// CryptoCompare API key from environment
const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY

async function fetchCryptoData() {
  // CryptoCompare symbols
  const symbols = ["BTC", "ETH", "SOL", "USDC"]
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join(",")}&tsyms=USD`
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
    },
    // Force fresh data - no caching at fetch level
    cache: 'no-store',
  })
  
  if (!response.ok) {
    const text = await response.text()
    console.error("CryptoCompare API error:", response.status, text)
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  try {
    const data = await response.json()
    
    // Map CryptoCompare data to your expected format
    return symbols.map((symbol) => {
      const info = data.RAW[symbol]?.USD
      return {
        id: symbol.toLowerCase() === "btc" ? "bitcoin" : symbol.toLowerCase() === "eth" ? "ethereum" : symbol.toLowerCase() === "sol" ? "solana" : "usd-coin",
        name: symbol === "BTC" ? "Bitcoin" : symbol === "ETH" ? "Ethereum" : symbol === "SOL" ? "Solana" : "USD Coin",
        symbol: symbol.toLowerCase(),
        current_price: info?.PRICE ?? 0,
        price_change_percentage_24h: info?.CHANGEPCT24HOUR ?? 0,
        market_cap: info?.MKTCAP ?? 0,
        total_volume: info?.TOTALVOLUME24H ?? 0,
        image: `https://www.cryptocompare.com${info?.IMAGEURL ?? ''}`,
      }
    })
  } catch (err) {
    const text = await response.text()
    console.error("Failed to parse CryptoCompare JSON:", text)
    throw err
  }
}

export async function GET() {
  try {
    console.log("Fetching fresh crypto data at:", new Date().toISOString())
    
    // Always fetch fresh data - no serverless-unfriendly caching
    const data = await fetchCryptoData()

    return NextResponse.json({
      data,
      cached: false,
      lastUpdated: new Date().toISOString(),
    }, {
      // Add cache headers to prevent browser/CDN caching
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // Return fallback data with error indication
    return NextResponse.json({
      data: FALLBACK_DATA,
      cached: false,
      error: "API unavailable, showing fallback data",
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  }
}
