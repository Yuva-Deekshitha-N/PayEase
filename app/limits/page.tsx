"use client"

import { ConnectGate } from "@/components/connect-gate"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { ReclaimVerificationModal } from "@/components/reclaim-verification-modal"
import type { VerificationOption } from "@/lib/reclaim-types"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"

const fetcher = (u: string) => fetch(u).then((r) => r.json())

const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Verify your GitHub account",
    algoReward: 10,
    icon: "🐙",
    providerId: "github-provider-id",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Verify your Gmail account",
    algoReward: 50,
    icon: "📧",
    providerId: "gmail-provider-id",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Verify your LinkedIn account",
    algoReward: 50,
    icon: "💼",
    providerId: "linkedin-provider-id",
  },
]

export default function LimitsPage() {
  const { data, mutate } = useSWR("/api/limits", fetcher)
  const { data: verificationsData } = useSWR("/api/user-verifications", fetcher)

  const score = data?.creditScore ?? 610
  const totalAlgoEarned = data?.verifications?.totalAlgoEarned ?? 0
  const limitIncrease = data?.verifications?.limitIncrease ?? 0

  const [selectedProvider, setSelectedProvider] = useState<VerificationOption | null>(null)
  const [verifiedProviders, setVerifiedProviders] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (verificationsData?.verifiedProviders) {
      setVerifiedProviders(new Set(verificationsData.verifiedProviders))
    }
  }, [verificationsData])

  const handleVerificationSuccess = (algoReward: number) => {
    if (selectedProvider) {
      setVerifiedProviders((prev) => new Set(prev).add(selectedProvider.id))
      toast.success(`Verification successful! You've earned ${algoReward} ALGO`, {
        description: "Your limit has been increased.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      })
      // Refresh limits data
      mutate()
    }
  }

  return (
    <ConnectGate>
      <div className="space-y-4">
        <div className="rounded-3xl p-5 bg-card/40 border border-border/40 backdrop-blur-xl">
          <h1 className="text-lg font-semibold">Increase Your Limit</h1>
          <p className="text-sm text-foreground/70 mt-1">
            Verify your accounts to unlock higher limits and earn ALGO rewards.
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="text-sm">
              Your Score: <span className="font-medium">{score}</span>
            </div>
            {totalAlgoEarned > 0 && (
              <div className="text-sm">
                Total ALGO Earned: <span className="font-medium text-primary">{totalAlgoEarned} ALGO</span>
              </div>
            )}
            {limitIncrease > 0 && (
              <div className="text-sm">
                Limit Increase: <span className="font-medium text-green-600">+${limitIncrease.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/80 px-1">Verify Your Accounts</h2>
          {VERIFICATION_OPTIONS.map((option) => {
            const isVerified = verifiedProviders.has(option.id)
            return (
              <div
                key={option.id}
                className="rounded-3xl p-5 bg-card/40 border border-border/40 backdrop-blur-xl hover:bg-card/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl mt-0.5">{option.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{option.name}</h3>
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70 mt-0.5">{option.description}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <span>+{option.algoReward} ALGO</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedProvider(option)}
                    disabled={isVerified}
                    className="rounded-full shrink-0"
                    size="sm"
                  >
                    {isVerified ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedProvider && (
        <ReclaimVerificationModal
          open={!!selectedProvider}
          onOpenChange={(open) => !open && setSelectedProvider(null)}
          provider={selectedProvider}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </ConnectGate>
  )
}
