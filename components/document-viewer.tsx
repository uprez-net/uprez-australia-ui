"use client";

import {
  // prospectusData,
  // companyInfo,
  offerDetails,
  financialData,
} from "@/lib/prospectus-data";
import { Button } from "./ui/button";
import { Bot, Pencil, Upload } from "lucide-react";
import {
  CompanyInfo,
  Prospectus,
  ProspectusSubsection,
} from "@/app/interface/interface";
import { RichTextEditor } from "./rich-text-editor";
import { cn } from "@/lib/utils";
import SlateToHtmlBlock from "./slate-to-html";

interface DocumentViewerProps {
  editingSubsection: ProspectusSubsection | null;
  companyData: CompanyInfo;
  prospectusData: Prospectus;
  onEditSection: (subsection: ProspectusSubsection | null) => void;
  onUploadBrief: (subsectionId: string) => void;
  onGenerateAll: () => void;
  handleSaveSection: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function DocumentViewer({
  editingSubsection,
  companyData: companyInfo,
  prospectusData,
  onEditSection,
  // onUploadBrief,
  onGenerateAll,
  handleSaveSection,
  disabled,
}: DocumentViewerProps) {
  const renderSubsectionContent = (subsection: ProspectusSubsection) => {
    // For demo purposes, we'll render some sample content based on the subsection
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {subsection.title}
        </h3>
        {subsection.id === editingSubsection?.id ? (
          <RichTextEditor
            isOpen={editingSubsection !== null}
            content={editingSubsection.content}
            onSave={handleSaveSection}
            onCancel={() => onEditSection(null)}
          />
        ) : (
          <div className="prose prose-gray max-w-none">
            <SlateToHtmlBlock content={subsection.content} />
            {/* <p className="text-gray-700 leading-relaxed">
              {subsection.content}
            </p> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document Viewer - Scrollable */}
      <div
        className={cn(
          "flex-1 overflow-y-auto bg-gray-50",
          "[&::-webkit-scrollbar]:h-[1px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400/30",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:hover:bg-gray-400/50"
        )}
        id="document-container"
      >
        {/* Floating Generate All Button */}
        <div className="sticky top-6 z-20 flex justify-center mb-8">
          <button
            onClick={onGenerateAll}
            className="floating-action px-8 py-4 rounded-2xl hover-lift"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-900">
                Generate All Sections
              </span>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                AI Powered
              </div>
            </div>
          </button>
        </div>

        {/* PDF-like Document Pages */}
        <div
          className={cn(
            "max-w-5xl mx-auto px-6 pb-12 space-y-8",
            disabled && "filter blur-sm pointer-events-none select-none"
          )}
        >
          {prospectusData.sections.map((section) => (
            <div
              key={section.id}
              className="pdf-page rounded-2xl p-12 relative content-section"
              id={section.id}
            >
              <div className="section-badge">
                <div className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
                  {/* SVG Icon */}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={section.icon}
                    />
                  </svg>
                  {section.title}
                </div>
              </div>

              {/* Document Header for first section */}
              {section.id === "important-notices" && (
                <div className="text-center mb-12 pb-8 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 mb-3">
                    {companyInfo.name}
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Initial Public Offering Prospectus
                  </h2>
                  <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-5 8V9a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2h2m-4 0V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4"
                        />
                      </svg>
                      <span>ASIC Lodged: {companyInfo.lodgeDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{companyInfo.headquarters}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Title for non-first sections */}
              {section.id !== "important-notices" && (
                <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  {/* SVG Icon */}
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={section.icon}
                    />
                  </svg>
                  {section.title}
                </h1>
              )}

              {/* Subsections */}
              {section.subsections.map((subsection) => (
                <div
                  key={subsection.id}
                  id={subsection.id}
                  className="content-section mb-10 relative group"
                >
                  <div className="absolute top-0 right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit Section"
                      onClick={() => onEditSection(subsection)}
                      className="h-8 w-8 bg-green-50 text-green-600 hover:bg-green-100"
                      disabled={disabled}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* <Button
                      variant="outline"
                      size="icon"
                      title="Upload/Brief"
                      onClick={() => onUploadBrief(subsection.id)}
                      className="h-8 w-8 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      <Upload className="h-4 w-4" />
                    </Button> */}

                    {/* <Button
                      variant="outline"
                      size="icon"
                      title="Request AI Rewrite"
                      onClick={() => onUploadBrief(subsection.id)}
                      className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <Bot className="h-4 w-4" />
                    </Button> */}
                  </div>
                  {renderSubsectionContent(subsection)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
