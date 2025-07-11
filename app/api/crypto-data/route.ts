import { NextResponse } from "next/server"
import { apiQueue } from "@/lib/api-queue"

// Replace CoinGecko API with CoinCap API
const COINCAP_API_BASE = "https://api.coincap.io/v2"

// Cache duration in seconds (10 minutes to reduce API calls)
const CACHE_DURATION = 15

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

// Replace with your CryptoCompare API key
const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || "YOUR_API_KEY_HERE";

async function fetchCryptoData() {
  // CryptoCompare symbols
  const symbols = ["BTC", "ETH", "SOL", "USDC"];
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join(",")}&tsyms=USD`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("Non-OK response from CryptoCompare:", response.status, text);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  try {
    const data = await response.json();
    // Map CryptoCompare data to your expected format
    return symbols.map((symbol) => {
      const info = data.RAW[symbol]?.USD;
      return {
        id: symbol.toLowerCase() === "btc" ? "bitcoin" : symbol.toLowerCase() === "eth" ? "ethereum" : symbol.toLowerCase() === "sol" ? "solana" : "usd-coin",
        name: symbol === "BTC" ? "Bitcoin" : symbol === "ETH" ? "Ethereum" : symbol === "SOL" ? "Solana" : "USD Coin",
        symbol: symbol.toLowerCase(),
        current_price: info?.PRICE ?? 0,
        price_change_percentage_24h: info?.CHANGEPCT24HOUR ?? 0,
        market_cap: info?.MKTCAP ?? 0,
        total_volume: info?.TOTALVOLUME24H ?? 0,
        image: `https://www.cryptocompare.com${info?.IMAGEURL ?? ''}`,
      };
    });
  } catch (err) {
    const text = await response.text();
    console.error("Failed to parse JSON from CryptoCompare:", text);
    throw err;
  }
}

export async function GET() {
  try {
    const now = Date.now()

    // Return cached data if it's still fresh
    if (cachedData && now - lastFetchTime < CACHE_DURATION * 1000) {
      return NextResponse.json({
        data: cachedData,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      })
    }

    // Use API queue to manage rate limiting
    const data = await apiQueue.add(() => fetchCryptoData())

    // Cache the data
    cachedData = data
    lastFetchTime = now

    return NextResponse.json({
      data,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // If we have cached data, return it even if expired
    if (cachedData) {
      return NextResponse.json({
        data: cachedData,
        cached: true,
        error: "API temporarily unavailable, showing cached data",
        lastUpdated: new Date(lastFetchTime).toISOString(),
      })
    }

    // Return fallback data with error indication
    return NextResponse.json({
      data: FALLBACK_DATA,
      cached: false,
      error:
        error instanceof Error && error.message === "RATE_LIMITED"
          ? "Rate limited by API, showing fallback data"
          : "API unavailable, showing fallback data",
      lastUpdated: new Date().toISOString(),
    })
  }
}
