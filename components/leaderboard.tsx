"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Star } from "lucide-react"
import { motion } from "framer-motion"

interface Player {
  id: string
  username: string
  avatar: string
  totalWins: number
  totalGames: number
  winRate: number
  streak: number
  totalEarnings: number
  rank: number
}

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all")

  useEffect(() => {
    // Mock leaderboard data
    const mockPlayers: Player[] = [
      {
        id: "1",
        username: "CryptoKing",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 156,
        totalGames: 200,
        winRate: 78,
        streak: 12,
        totalEarnings: 45600,
        rank: 1,
      },
      {
        id: "2",
        username: "DiamondHands",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 134,
        totalGames: 180,
        winRate: 74.4,
        streak: 8,
        totalEarnings: 38900,
        rank: 2,
      },
      {
        id: "3",
        username: "MoonShot",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 98,
        totalGames: 140,
        winRate: 70,
        streak: 15,
        totalEarnings: 32100,
        rank: 3,
      },
      {
        id: "4",
        username: "HODLer",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 87,
        totalGames: 130,
        winRate: 66.9,
        streak: 5,
        totalEarnings: 28700,
        rank: 4,
      },
      {
        id: "5",
        username: "DegenTrader",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 76,
        totalGames: 120,
        winRate: 63.3,
        streak: 3,
        totalEarnings: 24500,
        rank: 5,
      },
      {
        id: "6",
        username: "SatoshiFan",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 65,
        totalGames: 110,
        winRate: 59.1,
        streak: 7,
        totalEarnings: 21200,
        rank: 6,
      },
      {
        id: "7",
        username: "EthereumMax",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 54,
        totalGames: 95,
        winRate: 56.8,
        streak: 2,
        totalEarnings: 18900,
        rank: 7,
      },
      {
        id: "8",
        username: "SolanaSpeed",
        avatar: "/placeholder.svg?height=40&width=40",
        totalWins: 43,
        totalGames: 80,
        winRate: 53.8,
        streak: 1,
        totalEarnings: 15600,
        rank: 8,
      },
    ]

    setPlayers(mockPlayers)
  }, [timeFilter])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Trophy className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <Award className="w-5 h-5 text-gray-400" />
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case 2:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      case 3:
        return "bg-amber-600/20 text-amber-400 border-amber-600/30"
      default:
        return "bg-white/10 text-white border-white/20"
    }
  }

  const formatEarnings = (earnings: number) => {
    if (earnings >= 1000000) {
      return `$${(earnings / 1000000).toFixed(1)}M`
    } else if (earnings >= 1000) {
      return `$${(earnings / 1000).toFixed(1)}K`
    }
    return `$${earnings.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {players.slice(0, 3).map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`${index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}`}
          >
            <Card
              className={`bg-white/5 backdrop-blur-md border-white/10 relative overflow-hidden ${
                player.rank === 1 ? "ring-2 ring-yellow-400/50" : ""
              }`}
            >
              {player.rank === 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              )}
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-16 h-16 mx-auto border-2 border-white/20">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.username} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                      {player.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">{getRankIcon(player.rank)}</div>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{player.username}</h3>

                <Badge className={`mb-3 ${getRankBadgeColor(player.rank)}`}>#{player.rank}</Badge>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white font-bold">{player.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Streak</span>
                    <span className="text-white">{player.streak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Earnings</span>
                    <span className="text-green-400 font-bold">{formatEarnings(player.totalEarnings)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </CardTitle>
              <CardDescription className="text-gray-300">Top players ranked by performance</CardDescription>
            </div>
            <div className="flex space-x-2">
              {["all", "week", "month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter as any)}
                  className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                    timeFilter === filter
                      ? "bg-white/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {filter === "all" ? "All Time" : `This ${filter}`}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(player.rank)}
                    <span className="text-white font-bold text-lg">#{player.rank}</span>
                  </div>

                  <Avatar className="w-10 h-10 border border-white/20">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.username} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm">
                      {player.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="text-white font-semibold">{player.username}</h4>
                    <p className="text-gray-400 text-sm">
                      {player.totalWins}/{player.totalGames} games
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Win Rate</p>
                    <p className="text-white font-bold">{player.winRate}%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-400">Streak</p>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-white font-bold">{player.streak}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-400">Earnings</p>
                    <p className="text-green-400 font-bold">{formatEarnings(player.totalEarnings)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
