"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { CryptoGame } from "@/components/crypto-game"
import { Dashboard } from "@/components/dashboard"
import { ROICalculator } from "@/components/roi-calculator"
import { Leaderboard } from "@/components/leaderboard"
import { Wallet, TrendingUp, Gamepad2, Calculator, Trophy, Star, Zap } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen comic-panel-1 relative overflow-hidden">
      {/* Comic book background elements - Subtle */}
      <div className="fixed inset-0 pointer-events-none halftone-bg opacity-20"></div>

      {/* Floating comic elements - Reduced on mobile */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="hidden lg:block absolute top-20 left-20 w-24 h-24 bg-yellow-400 rounded-full opacity-30 animate-pulse border-2 border-black"></div>
        <div className="hidden lg:block absolute top-40 right-32 w-20 h-20 bg-red-500 rounded-full opacity-35 animate-bounce border-2 border-black"></div>
        <div className="hidden lg:block absolute bottom-32 left-40 w-22 h-22 bg-green-400 rounded-full opacity-30 animate-pulse border-2 border-black"></div>

        {/* Comic sound effects - Hidden on mobile */}
        <div className="hidden lg:block absolute top-32 right-20 sound-effect">POW!</div>
        <div className="hidden lg:block absolute bottom-40 right-60 sound-effect">BOOM!</div>
        <div className="hidden lg:block absolute top-60 left-32 sound-effect">ZAP!</div>
      </div>

      <div className="relative z-10">
        {/* Header - Responsive */}
        <header className="border-b-4 lg:border-b-6 border-black gynger-primary action-lines">
          <div className="container mx-auto px-4 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 lg:gap-4"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 gynger-secondary rounded-xl flex items-center justify-center border-3 border-black comic-card">
                  <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold comic-title text-white comic-glow">
                    GYNGER!
                  </h1>
                  <p className="text-sm lg:text-lg font-bold text-black comic-text-shadow">SUPER DEFI POWERS!</p>
                </div>
              </motion.div>
              <div className="w-full sm:w-auto">
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Responsive */}
        <section className="py-8 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="speech-bubble max-w-4xl mx-auto mb-8 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold comic-title text-black mb-3 lg:mb-6">
                  UNLEASH YOUR CRYPTO SUPERPOWERS! 💥
                </h2>
                <p className="text-sm sm:text-base lg:text-xl text-black font-bold">
                  Connect wallets! Play EPIC games! Earn MEGA rewards! Track crypto like a SUPERHERO! 🚀⚡🦸‍♂️
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 lg:gap-6 mt-6 lg:mt-12">
                <Badge className="comic-badge bg-red-500 text-white text-sm lg:text-lg px-3 py-2 lg:px-4 lg:py-2">
                  <Wallet className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  MULTI-WALLET!
                </Badge>
                <Badge className="comic-badge bg-blue-500 text-white text-sm lg:text-lg px-3 py-2 lg:px-4 lg:py-2">
                  <Gamepad2 className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  PLAY & EARN!
                </Badge>
                <Badge className="comic-badge bg-green-500 text-white text-sm lg:text-lg px-3 py-2 lg:px-4 lg:py-2">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  LIVE DATA!
                </Badge>
                <Badge className="comic-badge bg-purple-500 text-white text-sm lg:text-lg px-3 py-2 lg:px-4 lg:py-2">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  AWESOME!
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content - Responsive */}
        <section className="py-6 lg:py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white border-3 lg:border-6 border-black comic-card h-14 lg:h-20 mb-6 lg:mb-8 gap-1">
                <TabsTrigger
                  value="dashboard"
                  className="comic-button comic-panel-1 hover:comic-panel-2 data-[state=active]:comic-panel-2 text-black font-bold text-xs lg:text-base h-full px-1 lg:px-3"
                >
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                  <span className="hidden sm:inline">DASHBOARD!</span>
                  <span className="sm:hidden">DASH!</span>
                </TabsTrigger>
                <TabsTrigger
                  value="game"
                  className="comic-button comic-panel-3 hover:comic-panel-4 data-[state=active]:comic-panel-4 text-black font-bold text-xs lg:text-base h-full px-1 lg:px-3"
                >
                  <Gamepad2 className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                  <span className="hidden sm:inline">GAME!</span>
                  <span className="sm:hidden">PLAY!</span>
                </TabsTrigger>
                <TabsTrigger
                  value="calculator"
                  className="comic-button comic-panel-5 hover:comic-panel-1 data-[state=active]:comic-panel-1 text-black font-bold text-xs lg:text-base h-full px-1 lg:px-3"
                >
                  <Calculator className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                  <span className="hidden sm:inline">CALC!</span>
                  <span className="sm:hidden">ROI!</span>
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="comic-button comic-panel-2 hover:comic-panel-3 data-[state=active]:comic-panel-3 text-black font-bold text-xs lg:text-base h-full px-1 lg:px-3"
                >
                  <Trophy className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                  <span className="hidden sm:inline">HEROES!</span>
                  <span className="sm:hidden">TOP!</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  className="comic-button comic-panel-4 hover:comic-panel-5 data-[state=active]:comic-panel-5 text-black font-bold text-xs lg:text-base h-full px-1 lg:px-3"
                >
                  <Wallet className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-2" />
                  <span className="hidden sm:inline">WALLET!</span>
                  <span className="sm:hidden">💰</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6 lg:mt-8">
                <Dashboard />
              </TabsContent>

              <TabsContent value="game" className="mt-6 lg:mt-8">
                <CryptoGame />
              </TabsContent>

              <TabsContent value="calculator" className="mt-6 lg:mt-8">
                <ROICalculator />
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6 lg:mt-8">
                <Leaderboard />
              </TabsContent>

              <TabsContent value="wallet" className="mt-6 lg:mt-8">
                <Card className="comic-card comic-panel-2">
                  <CardHeader className="zigzag-border">
                    <CardTitle className="comic-title text-black text-2xl lg:text-3xl">
                      WALLET COMMAND CENTER! 🚀
                    </CardTitle>
                    <CardDescription className="text-black font-bold text-base lg:text-lg comic-text-shadow">
                      Connect and manage your SUPER crypto wallets! 🦸‍♂️💪
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <WalletConnect />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Footer - Responsive */}
        <footer className="border-t-4 lg:border-t-6 border-black comic-panel-3 py-6 lg:py-8 mt-8 lg:mt-16">
          <div className="container mx-auto px-4 text-center">
            <div className="thought-bubble inline-block">
              <p className="text-black font-bold text-lg lg:text-xl comic-title">
                © 2025 GYNGER!
                <br />
                <span className="text-sm lg:text-base">Built with SUPER POWERS! 💪⚡🚀</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
