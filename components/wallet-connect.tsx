"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useWallet } from "@/components/wallet-context"
import React from "react"

export function WalletConnect() {
  const {
    connected,
    address,
    balance,
    network,
    type,
    connectMetaMask,
    connectPhantom,
    disconnect,
  } = useWallet()

  const [isConnecting, setIsConnecting] = React.useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      // Optionally, show a toast here if you want
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (connected) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="comic-card bg-gradient-to-br from-green-300 to-blue-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black flex items-center comic-title text-xl">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                WALLET CONNECTED!
              </CardTitle>
              <Badge
                className={`comic-badge text-white ${type === "metamask" ? "bg-orange-500" : "bg-purple-500"}`}
              >
                {type === "metamask" ? "🦊 METAMASK" : "👻 PHANTOM"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="speech-bubble">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-black font-bold mb-1">WALLET ADDRESS</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-black bg-white border-2 border-black px-3 py-2 rounded font-bold">
                      {formatAddress(address)}
                    </code>
                    <Button
                      size="sm"
                      onClick={copyAddress}
                      className="comic-button bg-yellow-400 hover:bg-yellow-300 text-black"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-black font-bold mb-1">BALANCE</p>
                  <p className="text-black font-bold text-lg">
                    {balance} {type === "metamask" ? "ETH ⚡" : "SOL ☀️"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-black font-bold mb-1">NETWORK</p>
                  <p className="text-black font-bold">{network}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={disconnect}
              className="comic-button w-full bg-red-500 hover:bg-red-400 text-white font-bold"
            >
              DISCONNECT WALLET! 🔌
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="comic-card bg-gradient-to-br from-orange-300 to-red-400 hover:from-orange-400 hover:to-red-500 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-black flex items-center comic-title text-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-3 border-3 border-black">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                METAMASK! 🦊
              </CardTitle>
              <CardDescription className="text-black font-bold text-lg">
                Connect your Ethereum super wallet!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={async () => {
                  setIsConnecting(true)
                  await connectMetaMask()
                  setIsConnecting(false)
                }}
                disabled={isConnecting}
                className="comic-button w-full bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg h-12"
              >
                {isConnecting ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    CONNECTING...
                  </>
                ) : (
                  "CONNECT METAMASK! 🚀"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="comic-card bg-gradient-to-br from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="text-black flex items-center comic-title text-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-3 border-3 border-black">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                PHANTOM! 👻
              </CardTitle>
              <CardDescription className="text-black font-bold text-lg">
                Connect your Solana mega wallet!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={async () => {
                  setIsConnecting(true)
                  await connectPhantom()
                  setIsConnecting(false)
                }}
                disabled={isConnecting}
                className="comic-button w-full bg-purple-500 hover:bg-purple-400 text-white font-bold text-lg h-12"
              >
                {isConnecting ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    CONNECTING...
                  </>
                ) : (
                  "CONNECT PHANTOM! ⚡"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
