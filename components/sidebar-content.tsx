"use client"

interface SidebarContentProps {
  type: "comments" | "history" | "ai"
}

export function SidebarContent({ type }: SidebarContentProps) {
  switch (type) {
    case "comments":
      return (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">SC</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">Sarah Chen</div>
                <div className="text-xs text-gray-500">Legal Advisor</div>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">2h ago</div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              The risk disclosure section looks comprehensive. Should we consider adding more specific language about
              data privacy regulations and GDPR compliance risks for the international expansion?
            </p>
            <div className="mt-3 flex items-center space-x-3 text-xs text-gray-500">
              <button className="hover:text-green-600">Reply</button>
              <button className="hover:text-green-600">Resolve</button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">MR</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">Michael Roberts</div>
                <div className="text-xs text-gray-500">CFO</div>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">5h ago</div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Financial projections look solid. The EBITDA growth trajectory aligns well with our strategic plan.
            </p>
            <div className="mt-2 inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
              ✓ Resolved
            </div>
          </div>

          <div className="border-t pt-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl text-sm resize-none"
              rows={3}
              placeholder="Add a comment or question..."
            />
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <button className="hover:text-green-600">@ Mention</button>
                <button className="hover:text-green-600">📎 Attach</button>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )

    case "history":
      return (
        <div className="space-y-4">
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">Current Version</div>
              <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">v2.1</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Updated financial projections and risk factors</div>
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span>John Doe • 15 minutes ago</span>
              <button className="text-green-600 hover:text-green-800">View</button>
            </div>
          </div>

          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">Previous</div>
              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">v2.0</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Added climate risk disclosures</div>
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span>Sarah Chen • 3 hours ago</span>
              <button className="text-green-600 hover:text-green-800">View</button>
              <button className="text-green-600 hover:text-green-800">Restore</button>
            </div>
          </div>

          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">Major Update</div>
              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">v1.5</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Comprehensive review and ASIC compliance check</div>
            <div className="text-xs text-gray-500 flex items-center space-x-4">
              <span>Michael Roberts • 1 day ago</span>
              <button className="text-green-600 hover:text-green-800">View</button>
            </div>
          </div>

          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">Initial Draft</div>
              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">v1.0</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Document created with AI assistance</div>
            <div className="text-xs text-gray-500">AI Assistant • 3 days ago</div>
          </div>
        </div>
      )

    case "ai":
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">AI Suggestions</div>
                <div className="text-xs text-gray-500">Based on current market conditions</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-sm font-semibold text-gray-900 mb-1">Risk Disclosure Enhancement</div>
                <div className="text-xs text-gray-600">
                  Consider adding ESG risk factors to align with current investor expectations
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-emerald-200">
                <div className="text-sm font-semibold text-gray-900 mb-1">Financial Projections</div>
                <div className="text-xs text-gray-600">
                  Revenue growth assumptions appear conservative given market trends
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-sm text-gray-900">Chat with AI</span>
            </div>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto p-1">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">You</div>
                <div className="text-sm text-gray-900">How can I improve the risk disclosure section?</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">AI Assistant</div>
                <div className="text-sm text-gray-900">
                  I recommend adding specific climate-related risks and cybersecurity threats. Would you like me to
                  generate enhanced risk language?
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask AI anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                Send
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold text-sm text-gray-900">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-green-50 transition-colors">
                Generate Section
              </button>
              <button className="p-2 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-green-50 transition-colors">
                Review Compliance
              </button>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
