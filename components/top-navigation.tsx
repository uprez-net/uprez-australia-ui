"use client"

import { companyInfo } from "@/lib/prospectus-data"

interface TopNavigationProps {
  onCommentsClick: () => void
  onHistoryClick: () => void
  onAiClick: () => void
}

export function TopNavigation({ onCommentsClick, onHistoryClick, onAiClick }: TopNavigationProps) {
  return (
    <div className="h-16 glass-effect border-b border-white/20 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold text-gray-900">{companyInfo.name} IPO Prospectus</h2>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">John Doe</div>
            <div className="text-gray-500 text-xs">Legal Counsel</div>
          </div>
        </div>
      </div>

      {/* Top Navigation Icons */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">Live Draft</span>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <button
          onClick={onCommentsClick}
          className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all hover-lift"
          title="Comments & Collaboration"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        <button
          onClick={onHistoryClick}
          className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all hover-lift"
          title="Version History"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <button
          onClick={onAiClick}
          className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all hover-lift"
          title="AI Assistant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
