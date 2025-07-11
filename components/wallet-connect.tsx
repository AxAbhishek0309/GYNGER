"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface WalletState {
  connected: boolean
  address: string
  balance: string
  network: string
  type: "metamask" | "phantom" | null
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balance: "0",
    network: "",
    type: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const connectMetaMask = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const balance = await (window as any).ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })

          const network = await (window as any).ethereum.request({
            method: "net_version",
          })

          setWallet({
            connected: true,
            address: accounts[0],
            balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
            network: network === "1" ? "Ethereum Mainnet" : "Ethereum Testnet",
            type: "metamask",
          })

          toast({
            title: "BOOM! MetaMask Connected! 🦊",
            description: "Your wallet is now connected and ready for action!",
          })
        }
      } else {
        toast({
          title: "OOPS! MetaMask Not Found! 😱",
          description: "Please install MetaMask extension to continue!",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("MetaMask connection error:", error)
      toast({
        title: "OH NO! Connection Failed! 💥",
        description: "Failed to connect to MetaMask. Try again!",
        variant: "destructive",
      })
    }
    setIsConnecting(false)
  }

  const connectPhantom = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && (window as any).solana) {
        const response = await (window as any).solana.connect()

        setWallet({
          connected: true,
          address: response.publicKey.toString(),
          balance: "0.0000",
          network: "Solana Mainnet",
          type: "phantom",
        })

        toast({
          title: "KAPOW! Phantom Connected! 👻",
          description: "Your Solana wallet is ready to rock!",
        })
      } else {
        toast({
          title: "WHOOPS! Phantom Not Found! 👻",
          description: "Please install Phantom wallet extension!",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Phantom connection error:", error)
      toast({
        title: "YIKES! Connection Failed! ⚡",
        description: "Failed to connect to Phantom wallet. Try again!",
        variant: "destructive",
      })
    }
    setIsConnecting(false)
  }

  const disconnect = () => {
    setWallet({
      connected: false,
      address: "",
      balance: "0",
      network: "",
      type: null,
    })
    toast({
      title: "BYE! Wallet Disconnected! 👋",
      description: "Your wallet has been safely disconnected!",
    })
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    toast({
      title: "COPIED! Address Saved! 📋",
      description: "Wallet address copied to clipboard!",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (wallet.connected) {
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
                className={`comic-badge text-white ${wallet.type === "metamask" ? "bg-orange-500" : "bg-purple-500"}`}
              >
                {wallet.type === "metamask" ? "🦊 METAMASK" : "👻 PHANTOM"}
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
                      {formatAddress(wallet.address)}
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
                    {wallet.balance} {wallet.type === "metamask" ? "ETH ⚡" : "SOL ☀️"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-black font-bold mb-1">NETWORK</p>
                  <p className="text-black font-bold">{wallet.network}</p>
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
                onClick={connectMetaMask}
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
                onClick={connectPhantom}
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
