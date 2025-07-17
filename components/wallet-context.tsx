"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type WalletType = "metamask" | "phantom" | null

export interface WalletState {
  connected: boolean
  address: string
  balance: string
  network: string
  type: WalletType
}

interface WalletContextProps extends WalletState {
  connectMetaMask: () => Promise<void>
  connectPhantom: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider")
  return ctx
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balance: "0",
    network: "",
    type: null,
  })

  // Helper to fetch ETH balance
  const fetchEthBalance = async (address: string) => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const balance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      return (Number.parseInt(balance, 16) / 1e18).toFixed(4)
    }
    return "0"
  }

  // Helper to fetch network name
  const getEthNetworkName = (networkId: string) => {
    switch (networkId) {
      case "1": return "Ethereum Mainnet"
      case "11155111": return "Sepolia Testnet"
      case "31337": return "Hardhat Localhost"
      default: return `Ethereum Network #${networkId}`
    }
  }

  // Connect MetaMask
  const connectMetaMask = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          const address = accounts[0]
          const balance = await fetchEthBalance(address)
          const network = await (window as any).ethereum.request({ method: "net_version" })
          setWallet({
            connected: true,
            address,
            balance,
            network: getEthNetworkName(network),
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
  }

  // Connect Phantom
  const connectPhantom = async () => {
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
  }

  // Disconnect wallet
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

  // Refresh balance (ETH only)
  const refreshBalance = async () => {
    if (wallet.connected && wallet.type === "metamask" && wallet.address) {
      const balance = await fetchEthBalance(wallet.address)
      setWallet((prev) => ({ ...prev, balance }))
    }
  }

  // Listen for account/network changes (MetaMask)
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          const address = accounts[0]
          const balance = await fetchEthBalance(address)
          const network = await ethereum.request({ method: "net_version" })
          setWallet({
            connected: true,
            address,
            balance,
            network: getEthNetworkName(network),
            type: "metamask",
          })
        }
      }
      const handleChainChanged = async (networkId: string) => {
        if (wallet.connected && wallet.type === "metamask" && wallet.address) {
          const balance = await fetchEthBalance(wallet.address)
          setWallet((prev) => ({
            ...prev,
            network: getEthNetworkName(networkId),
            balance,
          }))
        }
      }
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("chainChanged", handleChainChanged)
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [wallet.connected, wallet.type, wallet.address])

  return (
    <WalletContext.Provider
      value={{
        ...wallet,
        connectMetaMask,
        connectPhantom,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
} 