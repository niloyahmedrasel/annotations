"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import type React from "react" // Added import for React
import { cn } from "@/lib/utils"

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", isSidebarCollapsed ? "pl-16" : "pl-64")}>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

