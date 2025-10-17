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
                { name: "Zomato", logo: "https://logo.clearbit.com/zomato.com" },
                { name: "Google", logo: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" },
                { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
                { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
                { name: "Spotify", logo: "https://logo.clearbit.com/spotify.com" },
                { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
                { name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
                { name: "Airbnb", logo: "https://logo.clearbit.com/airbnb.com" },
                { name: "Swiggy", logo: "https://logo.clearbit.com/swiggy.com" },
                { name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
                { name: "Steam", logo: "https://logo.clearbit.com/steampowered.com" },
                { name: "Discord", logo: "https://logo.clearbit.com/discord.com" },
                { name: "Adobe", logo: "https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg" },
                { name: "Dropbox", logo: "https://logo.clearbit.com/dropbox.com" },
                { name: "GitHub", logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" },
                { name: "Figma", logo: "https://logo.clearbit.com/figma.com" },
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
