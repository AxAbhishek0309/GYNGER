import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GYNGER - The Future of DeFi",
  description:
    "Connect your wallet, play games, earn rewards, and track your crypto portfolio in one beautiful interface.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletProvider>
        {children}
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}
