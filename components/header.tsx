"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { SidebarDrawer } from "./sidebar-drawer"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { LogOut } from "lucide-react"

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/limits", label: "Limits" },
  { href: "/checkout", label: "Checkout" },
  { href: "/transactions", label: "Transactions" },
  { href: "/settings", label: "Settings" },
]

export function AppHeader() {
  const pathname = usePathname()
  const { activeAccount, wallets } = useWallet()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Auto-open refer popup once per session
    const key = "payease:refer:shown"
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1")
      setTimeout(() => setOpen(true), 400) // small delay after first paint
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full pt-3 pb-2 ">
      <div
        className="grid grid-cols-[auto_1fr_auto] items-center rounded-none sm:rounded-2xl bg-primary/10 border-x-0 sm:border-x border-y border-primary/20 backdrop-blur-xl px-3 py-2"
        role="navigation"
        aria-label="Main"
      >
        {/* Left: menu icon + logo */}
        <div className="flex items-center gap-2">
          <SidebarDrawer open={open} onOpenChange={setOpen} />
          <Link href="/" className="font-semibold tracking-wide">
            <span className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="PayEase Logo" width={28} height={28 } className="h-6 w-6" />
              PayEase
            </span>
          </Link>
        </div>

        {/* Center: nav, centered horizontally */}
        <nav className="hidden sm:flex items-center justify-center gap-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-xl px-3 py-1 text-sm transition-colors",
                pathname === n.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:text-foreground hover:bg-primary/15",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right: wallet actions */}
        <div className="flex items-center justify-end gap-2">
          {activeAccount ? (
            <>
              <span className="hidden sm:inline text-xs bg-primary/15 px-2 py-1 rounded-full">
                {shortAddress(activeAccount.address)}
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={async () => {
                  for (const w of wallets) {
                    if (w.isConnected) {
                      await w.disconnect()
                    }
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Disconnect
              </Button>
            </>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </div>
    </header>
  )
}

function shortAddress(a: string) {
  return a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a
}
