"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useSelector } from "react-redux"
import { RootState } from "@/app/redux/store"
import { useAppDispatch } from "@/app/redux/use-dispatch"
import { generateProspectus } from "@/app/redux/prospectusSlice"
import { toast } from "sonner"
import { CircleCheck } from "lucide-react"

interface GenerationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GenerationModal({ isOpen, onClose }: GenerationModalProps) {
  const { locked } = useSelector((state: RootState) => state.prospectus)
  const { clientData } = useSelector((state: RootState) => state.client)
  const dispatch = useAppDispatch()
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Reset confirmation state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(true)
      setIsGenerating(false)
    }
  }, [isOpen])

  const handleConfirmGeneration = async () => {
    setShowConfirmation(false)
    setIsGenerating(true)
    
    try {
      const clientId = clientData?.id!
      const res = await dispatch(generateProspectus({ clientId }))
      if (generateProspectus.rejected.match(res)) {
        throw new Error(res.payload as string)
      }
      toast.success("AI Generation completed successfully!", {
        icon: <CircleCheck className="notification-icon" />
      })
    } catch (error) {
      console.error("Generation failed:", error)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(true)
    setIsGenerating(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl p-10 text-center">
        {showConfirmation && !isGenerating ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900">Start AI Generation?</DialogTitle>
              <DialogDescription className="text-gray-600 leading-relaxed mt-2">
                This will generate all sections using AI. The document will be locked during generation.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 my-8">
              <div className="text-sm font-semibold text-gray-500 mb-2">ESTIMATED TIME</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                ~ 5-10 minutes
              </div>
              <div className="text-xs text-gray-500">AI will ensure compliance and quality</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGeneration}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                Start Generation
              </button>
            </div>
          </>
        ) : locked || isGenerating ? (
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

            <div className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-4 mt-8">
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

            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors mt-8"
            >
              Review Generated Content
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}