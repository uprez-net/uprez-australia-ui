"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, User, Send, RefreshCw } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { DefaultChatTransport } from "ai";

interface AIChatInterfaceProps {
  context: {
    findingId: string;
    title: string;
    description: string;
    status: string;
    rule: string;
    reasoning: string;
    recommendation: string;
    category: string;
    priority: string;
    userNotes: string;
  };
  generationId: string;
  documentId: string;
}

export function AIChatInterface({
  context,
  generationId,
  documentId,
}: AIChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat?generationId=${encodeURIComponent(
        generationId
      )}&documentId=${encodeURIComponent(documentId)}`,
    }),
  });

  const [input, setInput] = useState("");

  // Auto-initialize with a system message when context changes
  useEffect(() => {
    setMessages([
      {
        id: "system-initial",
        role: "system",
        parts: [
          {
            type: "text",
            text: `You're currently reviewing a compliance finding related to:
- **Title:** ${context.title}
- **Status:** ${context.status}
- **Category:** ${context.category}

I'm here to help you understand what this means, why it matters, or what steps you might take next.  
Just ask if you'd like clarification on the rule, the reasoning behind the finding, or how to address it.`,
          },
        ],
      },
    ]);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <ScrollArea className="flex-1 p-4 bg-gray-50 rounded-md">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user"
                    ? "bg-[#027055] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                    : "bg-white border rounded-tl-lg rounded-tr-lg rounded-br-lg"
                } p-3 shadow-sm`}
              >
                <div className="flex-shrink-0 mr-2 mt-1">
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                        );
                      case "tool-findRules":
                      case "tool-getComplianceReport":
                        return part.state === "output-available" ? (
                          <span className="text-green-600 italic">
                            ✅ Successfully called tool:{" "}
                            {part.type.split("-")[1]}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">
                            Calling tool: {part.type.split("-")[1]}...
                          </span>
                        );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3 shadow-sm flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={() => {
          sendMessage({ text: input.trim()})
          setInput("");
        }}
        className="p-3 border-t mt-auto"
      >
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this compliance finding..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage({ text: input.trim() });
                setInput("");
              }
            }}
          />
          <Button
            type="submit"
            disabled={
              ["submitted", "streaming"].includes(status) || input.trim() === ""
            }
            className="bg-[#027055] hover:bg-[#025a44]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
