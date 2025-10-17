"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PiggyBank, Plus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"


const supportedApps = [
  { name: "Zomato", logo: "https://logo.clearbit.com/zomato.com", category: "Food Delivery" },
  { name: "Swiggy", logo: "https://logo.clearbit.com/swiggy.com", category: "Food Delivery" },
  { name: "Uber", logo: "https://logo.clearbit.com/uber.com", category: "Transportation" },
  { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com", category: "Streaming" },
  { name: "Spotify", logo: "https://logo.clearbit.com/spotify.com", category: "Music" },
  { name: "Google", logo: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg", category: "Cloud Services" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com", category: "Software" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", category: "E-commerce" },
  { name: "Apple", logo: "https://logo.clearbit.com/apple.com", category: "Technology" },
  { name: "Discord", logo: "https://logo.clearbit.com/discord.com", category: "Communication" },
  { name: "GitHub", logo: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png", category: "Development" },
  { name: "Adobe", logo: "https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg", category: "Creative" },
  { name: "Figma", logo: "https://logo.clearbit.com/figma.com", category: "Design" },
];


export default function PiggyBankPage() {
  const [deposits, setDeposits] = useState([
    { id: 1, amount: "50.00", currency: "USDC", date: "2024-01-15", status: "Active" },
    { id: 2, amount: "25.50", currency: "USDC", date: "2024-01-10", status: "Active" },
    { id: 3, amount: "100.00", currency: "USDC", date: "2024-01-05", status: "Withdrawn" },
  ])
  const [amount, setAmount] = useState("")
  const [open, setOpen] = useState(false)

  const handleAddDeposit = () => {
    if (amount && parseFloat(amount) > 0) {
      const newDeposit = {
        id: deposits.length + 1,
        amount: parseFloat(amount).toFixed(2),
        currency: "USDC",
        date: new Date().toISOString().split('T')[0],
        status: "Active"
      }
      setDeposits([newDeposit, ...deposits])
      setAmount("")
      setOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PiggyBank className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Piggy Bank</h1>
      </div>

      {/* Deposits Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Deposits</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Deposit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (USDC)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddDeposit} className="w-full">
                  Add Deposit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-semibold">{deposit.amount} {deposit.currency}</p>
                  <p className="text-sm text-muted-foreground">{deposit.date}</p>
                </div>
                <Badge variant={deposit.status === "Active" ? "default" : "secondary"}>
                  {deposit.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Apps Section */}
      <Card>
        <CardHeader>
          <CardTitle>Partners</CardTitle>
          <p className="text-sm text-muted-foreground">
            Use PayEase to pay for products and services across these platforms
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {supportedApps.map((app) => (
              <div key={app.name} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <Image 
                  src={app.logo} 
                  alt={app.name} 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                  unoptimized
                />
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}