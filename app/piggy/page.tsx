"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PiggyBank, Plus } from "lucide-react"
import { useState } from "react"



const supportedApps = [
  { name: "Zomato", logo: "🍔", category: "Food Delivery" },
  { name: "Google", logo: "🔍", category: "Cloud Services" },
  { name: "Microsoft", logo: "💻", category: "Software" },
  { name: "Netflix", logo: "🎬", category: "Streaming" },
  { name: "Spotify", logo: "🎵", category: "Music" },
  { name: "Amazon", logo: "📦", category: "E-commerce" },
  { name: "Uber", logo: "🚗", category: "Transportation" },
  { name: "Swiggy", logo: "🍕", category: "Food Delivery" },
  { name: "Apple", logo: "🍎", category: "Technology" },
  { name: "Discord", logo: "💬", category: "Communication" },
  { name: "GitHub", logo: "🐙", category: "Development" },
  { name: "Figma", logo: "🎯", category: "Design" },
]

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
                <span className="text-2xl">{app.logo}</span>
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