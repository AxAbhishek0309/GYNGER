// API request queue to handle rate limiting
class APIQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private lastRequestTime = 0
  private readonly minInterval = 1200 // 1.2 seconds between requests (50 requests per minute max)

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime

      if (timeSinceLastRequest < this.minInterval) {
        await new Promise((resolve) => setTimeout(resolve, this.minInterval - timeSinceLastRequest))
      }

      const request = this.queue.shift()
      if (request) {
        this.lastRequestTime = Date.now()
        try {
          await request()
        } catch (error) {
          console.error("Queue request failed:", error)
        }
      }
    }

    this.processing = false
  }
}

export const apiQueue = new APIQueue()
