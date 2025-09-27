"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface SidebarPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function SidebarPanel({ isOpen, onClose, title, children }: SidebarPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-auto sm:max-w-[800px]">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <SheetTitle className="text-lg font-bold text-gray-900">{title}</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="p-4 overflow-y-auto h-[calc(100vh-5rem)]">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
