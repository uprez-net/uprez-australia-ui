"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface GenerationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GenerationModal({ isOpen, onClose }: GenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true)
      const timer = setTimeout(() => {
        setIsGenerating(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl p-10 text-center">
        {isGenerating ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900">AI Generation in Progress</DialogTitle>
              <DialogDescription className="text-gray-600 leading-relaxed mt-2">
                Our AI is drafting all sections, ensuring regulatory compliance and professional quality.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 my-8">
              <div className="text-sm font-semibold text-gray-500 mb-2">SERVICE LEVEL AGREEMENT</div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                2 Hours
              </div>
              <div className="text-xs text-gray-500">Estimated completion time</div>
            </div>

            <div className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4">
              <p>The document is locked for editing. You'll be notified upon completion.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900">Generation Complete!</DialogTitle>
              <DialogDescription className="text-gray-600 leading-relaxed mt-2">
                All sections have been successfully generated.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 my-8">
              <div className="text-sm font-semibold text-gray-500 mb-2">COMPLETION TIME</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                1h 23m
              </div>
              <div className="text-xs text-gray-500">Faster than estimated 2-hour SLA</div>
            </div>

            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              Review Generated Content
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
