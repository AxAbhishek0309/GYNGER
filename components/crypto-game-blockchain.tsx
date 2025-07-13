"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, Trophy, Zap, Star, Target, Wallet, CircleDollarSign, Sun } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GameState {
  balance: string
  tokenBalance: string
  totalWins: number
  totalGames: number
  streak: number
  isPlaying: boolean
  lastResult: "win" | "lose" | null
}

interface Reward {
  token: string
  amount: number
  icon: string
}

type Blockchain = "ethereum" | "solana"

export function CryptoGameBlockchain() {
  const [gameState, setGameState] = useState<GameState>({
    balance: "0",
    tokenBalance: "0",
    totalWins: 0,
    totalGames: 0,
    streak: 0,
    isPlaying: false,
    lastResult: null,
  })

  const [selectedBlockchain, setSelectedBlockchain] = useState<Blockchain>("ethereum")
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null)
  const [betAmount, setBetAmount] = useState("100")
  const [purchaseAmount, setPurchaseAmount] = useState("0.001")
  const [coinFlip, setCoinFlip] = useState<"heads" | "tails" | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const { toast } = useToast()

  const tokens = [
    { name: "SOL", icon: "☀️", multiplier: 1 },
    { name: "USDC", icon: "💵", multiplier: 1 },
    { name: "ETH", icon: "💎", multiplier: 2 },
    { name: "BTC", icon: "🪙", multiplier: 3 },
  ]

  // Simulated blockchain integration
  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      const mockAddress = selectedBlockchain === "ethereum" 
        ? "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
        : "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
      
      setWalletAddress(mockAddress)
      setIsWalletConnected(true)
      
      // Simulate balance fetch
      setGameState(prev => ({
        ...prev,
        balance: selectedBlockchain === "ethereum" ? "0.5" : "2.5",
        tokenBalance: "1000",
      }))

      toast({
        title: "Wallet Connected! 🎉",
        description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsWalletConnected(false)
    setGameState(prev => ({
      ...prev,
      balance: "0",
      tokenBalance: "0",
    }))
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet.",
    })
  }

  const purchaseTokens = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    try {
      const amount = parseFloat(purchaseAmount)
      if (amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to purchase.",
          variant: "destructive",
        })
        return
      }

      // Simulate blockchain transaction
      toast({
        title: "Transaction Sent! 🚀",
        description: "Your token purchase is being processed...",
      })

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const tokensToMint = amount * 1000 // 1 SOL/ETH = 1000 tokens
      const newTokenBalance = parseFloat(gameState.tokenBalance) + tokensToMint
      const newBalance = parseFloat(gameState.balance) - amount

      setGameState(prev => ({
        ...prev,
        balance: newBalance.toFixed(4),
        tokenBalance: newTokenBalance.toFixed(4),
      }))

      toast({
        title: "Tokens Purchased! 🎉",
        description: `Successfully purchased ${tokensToMint.toFixed(4)} tokens!`,
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const playGame = async () => {
    if (!selectedSide || !isWalletConnected) return

    const betAmountNum = parseFloat(betAmount)
    const tokenBalanceNum = parseFloat(gameState.tokenBalance)

    if (betAmountNum > tokenBalanceNum) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough tokens to place this bet.",
        variant: "destructive",
      })
      return
    }

    setGameState((prev) => ({ ...prev, isPlaying: true }))

    // Simulate blockchain transaction
    toast({
      title: "Game Transaction Sent! 🎮",
      description: "Your game transaction is being processed...",
    })

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const result = Math.random() < 0.6
      ? selectedSide
      : (selectedSide === "heads" ? "tails" : "heads")
    setCoinFlip(result)

    setTimeout(() => {
      const won = result === selectedSide
      const winAmount = won ? betAmountNum * 2 : 0
      const newTokenBalance = tokenBalanceNum - betAmountNum + winAmount

      setGameState((prev) => ({
        ...prev,
        tokenBalance: newTokenBalance.toFixed(4),
        totalWins: won ? prev.totalWins + 1 : prev.totalWins,
        totalGames: prev.totalGames + 1,
        streak: won ? prev.streak + 1 : 0,
        isPlaying: false,
        lastResult: won ? "win" : "lose",
      }))

      if (won) {
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)]
        const rewardAmount = (betAmountNum / 100) * randomToken.multiplier

        const newReward: Reward = {
          token: randomToken.name,
          amount: rewardAmount,
          icon: randomToken.icon,
        }

        setRewards((prev) => [newReward, ...prev.slice(0, 4)])

        toast({
          title: "KAPOW! YOU WON! 🎉💥",
          description: `Won ${winAmount.toFixed(4)} tokens + ${rewardAmount.toFixed(4)} ${randomToken.name}!`,
        })
      } else {
        toast({
          title: "OUCH! You Lost! 😵",
          description: `Lost ${betAmountNum.toFixed(4)} tokens. Try again, hero!`,
          variant: "destructive",
        })
      }

      setShowResult(true)
      setTimeout(() => {
        setShowResult(false)
        setCoinFlip(null)
        setSelectedSide(null)
      }, 3000)
    }, 2000)
  }

  const resetGame = () => {
    setGameState({
      balance: "0",
      tokenBalance: "0",
      totalWins: 0,
      totalGames: 0,
      streak: 0,
      isPlaying: false,
      lastResult: null,
    })
    setRewards([])
    toast({
      title: "RESET! Fresh Start! 🔄",
      description: "Starting fresh! Let's go!",
    })
  }

  const winRate = gameState.totalGames > 0 ? ((gameState.totalWins / gameState.totalGames) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Blockchain Selection */}
      <Card className="comic-card bg-gradient-to-br from-blue-300 to-purple-400">
        <CardHeader>
          <CardTitle className="text-black flex items-center comic-title text-2xl">
            <Wallet className="w-6 h-6 mr-2" />
            BLOCKCHAIN GAMING!
          </CardTitle>
          <CardDescription className="text-black font-bold">
            Choose your blockchain and connect your wallet to start playing! 🚀
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedBlockchain} onValueChange={(value: Blockchain) => setSelectedBlockchain(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">
                  <div className="flex items-center">
                    <CircleDollarSign className="w-4 h-4 mr-2" />
                    Ethereum
                  </div>
                </SelectItem>
                <SelectItem value="solana">
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 mr-2" />
                    Solana
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {!isWalletConnected ? (
              <Button onClick={connectWallet} className="comic-button bg-green-500 hover:bg-green-400">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge className="comic-badge bg-green-500 text-white">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </Badge>
                <Button onClick={disconnectWallet} variant="outline" className="comic-button">
                  Disconnect
                </Button>
              </div>
            )}
          </div>

          {isWalletConnected && (
            <div className="grid grid-cols-2 gap-4">
              <div className="comic-card bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-black font-bold">
                    {selectedBlockchain === "ethereum" ? "ETH" : "SOL"} Balance
                  </span>
                  <Badge className="comic-badge bg-blue-500 text-white">
                    {gameState.balance} {selectedBlockchain === "ethereum" ? "ETH" : "SOL"}
                  </Badge>
                </div>
              </div>
              <div className="comic-card bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-black font-bold">Token Balance</span>
                  <Badge className="comic-badge bg-purple-500 text-white">
                    {gameState.tokenBalance} GYNGER
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Purchase */}
      {isWalletConnected && (
        <Card className="comic-card bg-gradient-to-br from-green-300 to-blue-400">
          <CardHeader>
            <CardTitle className="text-black flex items-center comic-title text-xl">
              <Coins className="w-5 h-5 mr-2" />
              PURCHASE TOKENS!
            </CardTitle>
            <CardDescription className="text-black font-bold">
              Buy GYNGER tokens with {selectedBlockchain === "ethereum" ? "ETH" : "SOL"} to play!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="flex-1"
              />
              <Button onClick={purchaseTokens} className="comic-button bg-green-500 hover:bg-green-400">
                Buy Tokens
              </Button>
            </div>
            <div className="text-sm text-black font-bold">
              Price: 1 {selectedBlockchain === "ethereum" ? "ETH" : "SOL"} = 1000 GYNGER tokens
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="comic-card bg-gradient-to-br from-yellow-300 to-orange-400">
            <CardHeader className="zigzag-border">
              <CardTitle className="text-black flex items-center comic-title text-2xl">
                <Trophy className="w-6 h-6 mr-2" />
                HERO STATS!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Token Balance</span>
                  <Badge className="comic-badge bg-green-500 text-white text-lg px-3 py-1">
                    {gameState.tokenBalance} 🪙
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Win Rate</span>
                  <Badge className="comic-badge bg-blue-500 text-white">{winRate}% 📊</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Streak</span>
                  <Badge className="comic-badge bg-purple-500 text-white">{gameState.streak} 🔥</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black font-bold">Total Games</span>
                  <Badge className="comic-badge bg-red-500 text-white">{gameState.totalGames} 🎮</Badge>
                </div>
              </div>
              <Button
                onClick={resetGame}
                className="comic-button w-full bg-red-500 hover:bg-red-400 text-white font-bold"
              >
                RESET GAME! 🔄
              </Button>
            </CardContent>
          </Card>

          {/* Recent Rewards */}
          <Card className="comic-card bg-gradient-to-br from-green-300 to-blue-400">
            <CardHeader>
              <CardTitle className="text-black flex items-center comic-title text-xl">
                <Star className="w-5 h-5 mr-2" />
                EPIC REWARDS!
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rewards.length === 0 ? (
                <div className="speech-bubble">
                  <p className="text-black font-bold">No rewards yet! Start playing to earn epic loot! 🎁</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rewards.map((reward, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="comic-card bg-white p-3 flex items-center justify-between"
                    >
                      <span className="text-2xl">{reward.icon}</span>
                      <span className="text-black font-bold">
                        +{reward.amount.toFixed(4)} {reward.token}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Game */}
        <div className="lg:col-span-2">
          <Card className="comic-card bg-gradient-to-br from-purple-300 to-pink-400">
            <CardHeader className="zigzag-border">
              <CardTitle className="text-black flex items-center comic-title text-3xl">
                <Coins className="w-8 h-8 mr-3" />
                BLOCKCHAIN COIN FLIP!
              </CardTitle>
              <CardDescription className="text-black font-bold text-lg">
                Choose your side, place your bet, and win AMAZING crypto rewards on-chain! 💥
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Coin Animation */}
              <div className="flex justify-center">
                <div className="relative">
                  <AnimatePresence>
                    {coinFlip && (
                      <motion.div
                        key={coinFlip}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 1800 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-6xl border-4 border-black comic-card"
                      >
                        {coinFlip === "heads" ? "👑" : "🪙"}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!coinFlip && (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-6xl border-4 border-black comic-card">
                      <Coins className="w-20 h-20 text-black" />
                    </div>
                  )}
                </div>
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <div className="speech-bubble inline-block">
                      <div
                        className={`text-4xl font-bold comic-title ${
                          gameState.lastResult === "win" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {gameState.lastResult === "win" ? "KAPOW! YOU WON! 🎉" : "OUCH! YOU LOST! 😵"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Controls */}
              <div className="space-y-6">
                <div>
                  <label className="text-black text-xl font-bold comic-title mb-4 block">CHOOSE YOUR SIDE!</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={selectedSide === "heads" ? "default" : "outline"}
                      onClick={() => setSelectedSide("heads")}
                      disabled={gameState.isPlaying || !isWalletConnected}
                      className={`comic-button h-16 text-xl font-bold ${
                        selectedSide === "heads"
                          ? "bg-blue-500 hover:bg-blue-400 text-white"
                          : "bg-white hover:bg-gray-100 text-black"
                      }`}
                    >
                      👑 HEADS
                    </Button>
                    <Button
                      variant={selectedSide === "tails" ? "default" : "outline"}
                      onClick={() => setSelectedSide("tails")}
                      disabled={gameState.isPlaying || !isWalletConnected}
                      className={`comic-button h-16 text-xl font-bold ${
                        selectedSide === "tails"
                          ? "bg-red-500 hover:bg-red-400 text-white"
                          : "bg-white hover:bg-gray-100 text-black"
                      }`}
                    >
                      🪙 TAILS
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-black text-xl font-bold comic-title mb-4 block">BET AMOUNT!</label>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[50, 100, 250, 500].map((amount) => (
                      <Button
                        key={amount}
                        variant={betAmount === amount.toString() ? "default" : "outline"}
                        onClick={() => setBetAmount(amount.toString())}
                        disabled={gameState.isPlaying || amount > parseFloat(gameState.tokenBalance)}
                        className={`comic-button font-bold ${
                          betAmount === amount.toString()
                            ? "bg-green-500 hover:bg-green-400 text-white"
                            : "bg-white hover:bg-gray-100 text-black"
                        }`}
                      >
                        {amount} 🪙
                      </Button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="10"
                    max={Math.min(parseFloat(gameState.tokenBalance), 1000)}
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    disabled={gameState.isPlaying || !isWalletConnected}
                    className="w-full h-3 bg-yellow-400 rounded-lg appearance-none cursor-pointer border-2 border-black"
                  />
                  <div className="flex justify-between text-lg font-bold text-black mt-2">
                    <span>10 🪙</span>
                    <Badge className="comic-badge bg-purple-500 text-white text-lg px-4 py-2">
                      {betAmount} TOKENS! 💰
                    </Badge>
                    <span>{Math.min(parseFloat(gameState.tokenBalance), 1000)} 🪙</span>
                  </div>
                </div>

                <Button
                  onClick={playGame}
                  disabled={!selectedSide || parseFloat(betAmount) > parseFloat(gameState.tokenBalance) || gameState.isPlaying || !isWalletConnected}
                  className="comic-button w-full h-16 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white text-2xl font-bold"
                >
                  {gameState.isPlaying ? (
                    <>
                      <Zap className="w-6 h-6 mr-3 animate-spin" />
                      FLIPPING... ⚡
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6 mr-3" />
                      FLIP COIN! ({betAmount} tokens) 🎯
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}