"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { AIChatInterface } from "@/components/ai-chat-interface";
import { convertMarkdownToPDFDownload } from "@/utils/convertMarkdownToPDF";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface ComplianceFindingItemProps {
  id: string;
  title: string;
  description: string;
  status: "non-compliant" | "partially-compliant" | "compliant";
  rule: string;
  reasoning: string;
  recommendation: string;
  category: string;
  priority: "high" | "medium" | "low";
  report: string; // Complete report data Markdown
  userNotes?: string;
  expertVerified?: boolean;
  isExpertRole?: boolean;
  generationId: string;
}

export function ComplianceFindingItem({
  id,
  title,
  description,
  status,
  rule,
  reasoning,
  recommendation,
  category,
  priority,
  userNotes = "",
  report,
  expertVerified = false,
  isExpertRole = true,
  generationId,
}: ComplianceFindingItemProps) {
  const [notes, setNotes] = useState(userNotes);
  const [verified, setVerified] = useState(expertVerified);
  const [chatOpen, setChatOpen] = useState(false);

  const { clientData } = useSelector((state: RootState) => state.client);

  // Helper function to get status badge
  const getStatusBadge = () => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 hover:bg-green-200">
            <CheckCircle className="h-3 w-3" /> Compliant
          </Badge>
        );
      case "partially-compliant":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1 hover:bg-amber-200">
            <AlertTriangle className="h-3 w-3" /> Partially Compliant
          </Badge>
        );
      case "non-compliant":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 hover:bg-red-200">
            <XCircle className="h-3 w-3" /> Non-Compliant
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get priority badge
  const getPriorityBadge = () => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-white text-red-800 border-red-300"
          >
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-white text-amber-800 border-amber-300"
          >
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-white text-green-800 border-green-300"
          >
            Low Priority
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get background color based on status
  const getBackgroundColor = () => {
    switch (status) {
      case "compliant":
        return "bg-green-50 border-green-200";
      case "partially-compliant":
        return "bg-amber-50 border-amber-200";
      case "non-compliant":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Prepare context for AI chat
  const prepareAIContext = () => {
    return {
      findingId: id,
      title,
      description,
      status,
      rule,
      reasoning,
      recommendation,
      category,
      priority,
      userNotes: notes,
    };
  };

  return (
    <div className={`p-4 border rounded-md ${getBackgroundColor()}`}>
      <div className="space-y-4">
        {/* Header with title and status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {getPriorityBadge()}
            <Button
              onClick={() =>
                convertMarkdownToPDFDownload(report, `${title}.pdf`)
              }
              variant="ghost"
              size="sm"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700">
          {description !== "NA" && description !== "N/A"
            ? description
            : "No Critical Components Available"}
        </p>

        {/* Rule/Requirement */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-3 rounded border">
          <span className="text-sm font-medium text-gray-700">
            Rule/Requirement:
          </span>
          <span className="text-sm text-gray-600">{rule}</span>
        </div>

        {/* Accordion for Details & Recommendations */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 hover:no-underline">
              <span className="text-sm font-medium">
                Details & Recommendations
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                {/* System Reasoning/Evidence */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    System Reasoning/Evidence:
                  </h5>
                  <div className="bg-white p-3 rounded border text-sm text-gray-600">
                    <ol className="list-decimal pl-5 space-y-1">
                      {reasoning.split(";").map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {item.trim().charAt(0).toUpperCase() +
                            item.trim().slice(1)}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Automated Recommendation */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Automated Recommendation:
                  </h5>
                  <div className="bg-white p-3 rounded border text-sm text-gray-600">
                    <ol className="list-decimal pl-5 space-y-1">
                      {recommendation.split(";").map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {item.trim().charAt(0).toUpperCase() +
                            item.trim().slice(1)}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <Separator />

                {/* User Notes/Justification */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    User Notes/Justification:
                  </h5>
                  <Textarea
                    placeholder="Add your notes or justification here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Expert Verification */}
                {isExpertRole && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`expert-verified-${id}`}
                      checked={verified}
                      onCheckedChange={(checked) =>
                        setVerified(checked === true)
                      }
                    />
                    <label
                      htmlFor={`expert-verified-${id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Expert Verified
                    </label>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Sheet open={chatOpen} onOpenChange={setChatOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Ask AI
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[1200px] overflow-hidden flex flex-col">
                      <SheetHeader>
                        <SheetTitle>AI Assistant - Compliance Help</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-hidden">
                        <AIChatInterface
                          context={prepareAIContext()}
                          generationId={generationId!}
                          documentId={id}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button size="sm" className="bg-[#027055] hover:bg-[#025a44]">
                    Save Notes
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
