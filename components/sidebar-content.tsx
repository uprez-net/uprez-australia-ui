"use client"

import { CommentsExtended } from "@/app/interface/interface"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"

interface SidebarContentProps {
  type: "comments" | "history" | "ai"
  comments: CommentsExtended[]
  versionHistory: Array<{
    version: string
    createdBy: string
    createdAt: string
    isCurrent?: boolean
  }>
}

export function SidebarContent({ type, comments, versionHistory }: SidebarContentProps) {
  switch (type) {
    case "comments":
      return (
        <div className="space-y-6">
          {comments.map((comment) => {
            const initials = comment.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)

            return (
              <Card key={comment.id} className="border-0 shadow-sm bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{comment.name}</div>
                      <div className="text-xs text-gray-500">{comment.role}</div>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      Resolve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <div className="border-t pt-4">
            <Textarea rows={3} placeholder="Add a comment or question..." />
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  @ Mention
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  📎 Attach
                </Button>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      )

    case "history":
      return (
        <div className="space-y-4">
          {versionHistory.map((v, i) => (
            <div
              key={i}
              className={`border-l-4 pl-4 py-2 ${
                v.isCurrent ? "border-green-600" : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">
                  {v.isCurrent ? "Current Version" : `Version ${v.version}`}
                </div>
                <Badge
                  className={v.isCurrent ? "bg-green-600" : "bg-gray-500"}
                  variant="secondary"
                >
                  v{v.version}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-4">
                <span>
                  {v.createdBy} •{" "}
                  {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                </span>
                <Button variant="link" size="sm" className="h-6 px-2 text-green-600">
                  View
                </Button>
                {!v.isCurrent && (
                  <Button variant="link" size="sm" className="h-6 px-2 text-green-600">
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )

    case "ai":
      return (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="font-bold text-sm mb-2">AI Suggestions</div>
              <div className="space-y-3">
                <Card className="border-green-200">
                  <CardContent className="p-3">
                    <div className="text-sm font-semibold mb-1">
                      Risk Disclosure Enhancement
                    </div>
                    <div className="text-xs text-gray-600">
                      Consider adding ESG risk factors to align with investor expectations.
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-emerald-200">
                  <CardContent className="p-3">
                    <div className="text-sm font-semibold mb-1">Financial Projections</div>
                    <div className="text-xs text-gray-600">
                      Revenue growth assumptions appear conservative given market trends.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-sm mb-3">Chat with AI</div>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto p-1">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">You</div>
                  <div className="text-sm text-gray-900">
                    How can I improve the risk disclosure section?
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">AI Assistant</div>
                  <div className="text-sm text-gray-900">
                    I recommend adding climate-related risks and cybersecurity threats. Would
                    you like me to generate enhanced risk language?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Ask AI anything..." />
                <Button className="bg-green-600 hover:bg-green-700">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )

    default:
      return null
  }
}
