// Utility functions for CoinGecko API integration
export const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

export interface CoinGeckoMarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any
  last_updated: string
}

export interface CoinGeckoHistoricalData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Rate limiting helper
class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests = 10 // CoinGecko free tier: 10-50 requests per minute
  private readonly timeWindow = 60000 // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter((time) => now - time < this.timeWindow)

    if (this.requests.length >= this.maxRequests) {
      return false
    }

    this.requests.push(now)
    return true
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0
    const oldestRequest = Math.min(...this.requests)
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest))
  }
}

export const rateLimiter = new RateLimiter()

// Error handling for API responses
export class CoinGeckoError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
  ) {
    super(message)
    this.name = "CoinGeckoError"
  }
}

export async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      // Check rate limiting
      if (!rateLimiter.canMakeRequest()) {
        const waitTime = rateLimiter.getWaitTime()
        if (waitTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          ...options.headers,
        },
      })

      if (response.ok) {
        return response
      }

      // Handle specific HTTP errors
      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : 60000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      if (response.status >= 500) {
        // Server error - retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }

      // Client error - don't retry
      throw new CoinGeckoError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        await response.text(),
      )
    } catch (error) {
      lastError = error as Error
      if (i === maxRetries) break

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  throw lastError!
}

// Supported cryptocurrencies with their CoinGecko IDs
export const SUPPORTED_COINS = {
  bitcoin: { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  ethereum: { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  solana: { id: "solana", symbol: "SOL", name: "Solana" },
  "usd-coin": { id: "usd-coin", symbol: "USDC", name: "USD Coin" },
  "binance-coin": { id: "binancecoin", symbol: "BNB", name: "BNB" },
  cardano: { id: "cardano", symbol: "ADA", name: "Cardano" },
  dogecoin: { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  polygon: { id: "matic-network", symbol: "MATIC", name: "Polygon" },
  chainlink: { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  avalanche: { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
} as const

export type SupportedCoinId = keyof typeof SUPPORTED_COINS
