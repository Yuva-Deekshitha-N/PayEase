import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppHeader } from "@/components/header"
import { Providers } from "@/components/providers"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "PayEase - Crypto PayLater | Buy Now Pay Later with Cryptocurrency | Algorand DeFi",
  description: "PayEase revolutionizes crypto payments with instant buy now pay later (BNPL) solutions on Algorand blockchain. Secure, fast, and decentralized crypto lending platform for digital payments.",
  keywords: "crypto paylater, buy now pay later crypto, algorand defi, cryptocurrency lending, crypto BNPL, blockchain payments, decentralized finance, crypto loans, digital wallet, algorand dapp",
  authors: [{ name: "PayEase Team" }],
  creator: "PayEase",
  publisher: "PayEase",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pay-ease-9zmcbr56a-yuva-deekshitha-ns-projects.vercel.app",
    title: "PayEase - Revolutionary Crypto PayLater Platform",
    description: "Experience the future of crypto payments with PayEase. Instant buy now pay later solutions on Algorand blockchain with zero collateral requirements.",
    siteName: "PayEase",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PayEase - Crypto PayLater Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayEase - Crypto PayLater Revolution",
    description: "Buy now, pay later with cryptocurrency. Secure Algorand-based DeFi lending platform.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://pay-ease-9zmcbr56a-yuva-deekshitha-ns-projects.vercel.app",
  },
  category: "Finance",
  verification: {
    google: "qunZFiuiU4IBtDRbA8VGYphVxLKloOpUIvI2R7sUZks",
  },
}


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-dvh bg-background`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <div className="mx-auto w-full md:max-w-3xl lg:max-w-4xl">
              <AppHeader />
              <main className="px-3 pb-24">{children}</main>
            </div>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}


