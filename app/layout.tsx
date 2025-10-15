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
  title: "PayEase — Crypto PayLater",
  description: "Android-first Algorand PayLater MVP",
  generator: "v0.app",
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


