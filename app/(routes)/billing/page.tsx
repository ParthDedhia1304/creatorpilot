"use client"

import { PricingTable } from "@clerk/nextjs"
import React from "react"

function Billing() {
  return (
    <div className="flex flex-col items-center px-6">
      <h2 className="font-bold text-3xl my-6">Billing</h2>

      <div className="w-full max-w-4xl">
        {/* Wrapper to fix dark mode look */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-lg p-6 transition-colors">
          <PricingTable
            appearance={{
              variables: {
                colorBackground: "hsl(var(--card))",
                colorText: "hsl(var(--card-foreground))",
                colorPrimary: "hsl(var(--primary))",
                colorTextSecondary: "hsl(var(--muted-foreground))",
                borderRadius: "1rem",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Billing
