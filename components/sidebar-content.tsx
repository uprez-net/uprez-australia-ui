"use client";

import { CommentNode, CommentsExtended } from "@/app/interface/interface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { toast } from "sonner";
import { addComment, loadProspectusData, setActiveProspectusId } from "@/app/redux/prospectusSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ChevronDown, CornerDownRight, X } from "lucide-react";
import { AIChatInterface } from "./ai-chat-interface";

interface SidebarContentProps {
  type: "comments" | "history" | "ai";
  comments: CommentsExtended[];
  versionHistory: Array<{
    id: string;
    version: string;
    createdBy: string;
    createdAt: string;
    isCurrent?: boolean;
  }>;
}

function buildCommentTree(comments: CommentsExtended[]): CommentNode[] {
  const map = new Map<string, CommentNode>();

  // Initialize map with empty replies
  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));

  const roots: CommentNode[] = [];

  map.forEach((c) => {
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) parent.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

type CommentItemProps = {
  comment: CommentNode;
  setReplyTo: (comment: CommentNode) => void;
};

function CommentItem({ comment, setReplyTo }: CommentItemProps) {
  const initials = comment.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="mb-4">
      <Card className="border-0 shadow-sm bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">
                {comment.name}
              </div>
              <div className="text-xs text-gray-500">{comment.role}</div>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {comment.content}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => setReplyTo(comment)}
            >
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              Resolve
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Render replies */}
      {comment.replies.length > 0 && (
        <div className="ml-8 mt-3 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              setReplyTo={setReplyTo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarContent({
  type,
  comments,
  versionHistory,
}: SidebarContentProps) {
  const dispatch = useAppDispatch();
  const { activeProspectusId, hasMore, offset } = useSelector(
    (state: RootState) => state.prospectus
  );
  const { clientData } = useSelector(
    (state: RootState) => state.client
  );
  switch (type) {
    case "comments":
      const commentTree = buildCommentTree(comments);
      const [replyTo, setReplyTo] = useState<CommentNode | null>(null);
      const [commentContent, setCommentContent] = useState("");

      const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;
        const toastId = toast.loading("Posting comment...");
        try {
          const res = await dispatch(
            addComment({
              prospectusId: activeProspectusId!,
              content: commentContent,
              parentId: replyTo?.id ?? undefined,
            })
          );
          if (addComment.rejected.match(res)) {
            throw new Error(res.payload || "Failed to post comment");
          }
          toast.success("Comment posted!");
        } catch (error) {
          toast.error(
            `Failed to post comment: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
          console.error("Error posting comment:", error);
        } finally {
          setCommentContent("");
          setReplyTo(null);
          toast.dismiss(toastId);
        }
      };
      return (
        <div className="space-y-6">
          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              setReplyTo={(commentId) => setReplyTo(commentId)}
            />
          ))}

          <div className="border-t pt-4">
            {replyTo && (
              <div className="mb-3 p-2 bg-gray-100 rounded-md border text-xs text-gray-600 flex justify-between items-start gap-2">
                <div className="flex items-start gap-2">
                  <CornerDownRight className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-medium">{replyTo.name}:</span>{" "}
                    {replyTo.content.slice(0, 150)}
                    {replyTo.content.length > 150 && "..."}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-red-500"
                  onClick={() => setReplyTo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Textarea
              rows={3}
              placeholder="Add a comment or question..."
              onChange={(e) => setCommentContent(e.target.value)}
              value={commentContent}
            />
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Button variant="ghost" size="sm" className="h-6 px-2" disabled>
                  @ Mention
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2" disabled>
                  📎 Attach
                </Button>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={!commentContent.trim()}
                onClick={handleCommentSubmit}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      );

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
                  {formatDistanceToNow(new Date(v.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-6 px-2 text-green-600"
                  onClick={() => dispatch(setActiveProspectusId(v.id))}
                >
                  View
                </Button>
                {!v.isCurrent && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-6 px-2 text-green-600"
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Load More button */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => dispatch(loadProspectusData({ clientId: clientData!.id, offset }))}
              >
                <ChevronDown className="h-4 w-4" />
                Load More
              </Button>
            </div>
          )}
        </div>
      );

    case "ai":
      return (
        <div className="overflow-hidden flex-1 h-full">
          <AIChatInterface
            clientId={clientData!.id}
          />
        </div>
      );

    default:
      return null;
  }
}
