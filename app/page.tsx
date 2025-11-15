"use client"

import { ConnectGate } from "@/components/connect-gate"
import { LimitCard } from "@/components/limit-card"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Our Partners</h3>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
              {[
                { name: "Zomato", logo: "/logos/zomato.svg" },
                { name: "Swiggy", logo: "/logos/swiggy.png" },
                { name: "Uber", logo: "/logos/uber.svg" },
                { name: "Netflix", logo: "/logos/netflix.svg" },
                { name: "Spotify", logo: "/logos/spotify.svg" },
                { name: "Google", logo: "/logos/google.svg" },
                { name: "Microsoft", logo: "/logos/microsoft.svg" },
                { name: "Amazon", logo: "/logos/amazon.svg" },
                { name: "Apple", logo: "/logos/apple.png" },
                { name: "Discord", logo: "/logos/discord.svg" },
                { name: "GitHub", logo: "/logos/github.svg" },
                { name: "Adobe", logo: "/logos/adobe.svg" },
                { name: "Figma", logo: "/logos/figma.svg" },
              ].map((partner) => (
                <div key={partner.name} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/40 border border-border/40 min-w-[80px]">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    width={32} 
                    height={32} 
                    className="rounded-lg"
                    unoptimized
                  />
                  <span className="text-xs font-medium text-center">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ConnectGate>
  )
}
