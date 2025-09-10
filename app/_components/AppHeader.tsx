import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import React from 'react'

function AppHeader() {
  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full bg-background border-b">
      {/* Left side: Sidebar trigger */}
      <SidebarTrigger />

      {/* Right side: Theme toggle */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </div>
  )
}

export default AppHeader
