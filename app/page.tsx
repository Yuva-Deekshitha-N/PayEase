"use client"

import { ConnectGate } from "@/components/connect-gate"
import { LimitCard } from "@/components/limit-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <ConnectGate>
      <section className="space-y-4">
        <LimitCard />

        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/checkout", label: "Pay", desc: "Pay with PayEase" },
            { href: "/transactions", label: "History", desc: "View activity" },
            { href: "/limits", label: "Increase", desc: "Get more limit" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-2xl p-3 bg-card/40 border border-border/40 backdrop-blur-xl"
            >
              <div className="font-medium">{a.label}</div>
              <div className="text-xs text-foreground/70">{a.desc}</div>
            </Link>
          ))}
        </div>

        <div className="rounded-3xl p-4 bg-primary/10 border border-primary/20 backdrop-blur-xl">
          <div className="text-sm">Instant Checkout</div>
          <div className="mt-1 text-foreground/80 text-sm">Use your PayEase limit to pay on-chain</div>
          <Link href="/checkout">
            <Button className="mt-3 rounded-full">Pay with PayEase</Button>
          </Link>
        </div>
      </section>
    </ConnectGate>
  )
}
