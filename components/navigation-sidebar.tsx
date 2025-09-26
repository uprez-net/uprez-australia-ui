"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Prospectus } from "@/app/interface/interface";
import { prospectusData } from "@/lib/prospectus-data";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import { deleteSubsection, saveProgress } from "@/app/redux/prospectusSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface NavigationSidebarProps {
  activeSection: string;
  activeSubsection: string;
  prospectusData: Prospectus;
  onSectionClick: (sectionId: string) => void;
  onSubsectionClick: (subsectionId: string) => void;
  openAddDialog: (sectionId: string) => void;
}

// Utility to check if a subsection is additional
const isAdditionalSubSection = (subSectionId: string) => {
  return !prospectusData.some((section) =>
    section.subsections.some((sub) => sub.id === subSectionId)
  );
};

export function NavigationSidebar({
  activeSection,
  activeSubsection,
  prospectusData,
  onSectionClick,
  onSubsectionClick,
  openAddDialog,
}: NavigationSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([activeSection])
  );
  const dispatch = useAppDispatch();
  const { clientData } = useSelector((state: RootState) => state.client);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    if (!expandedSections.has(sectionId)) {
      onSectionClick(sectionId);
    }
  };

  const handleAddSubsection = (sectionId: string) => {
    // This will be implemented in the section management task
    console.log("Add subsection to:", sectionId);
    openAddDialog(sectionId);
  };

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Brand Header - Fixed */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Prospectus Suite
            </h1>
            <p className="text-xs font-medium text-gray-500">
              IPO Document Editor
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections - Scrollable */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {prospectusData.sections.map((section) => (
            <div key={section.id} className="section-container">
              <div
                className={cn(
                  "nav-section group flex items-center justify-between p-3 rounded-xl cursor-pointer",
                  activeSection === section.id && "active"
                )}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className={cn(
                      "w-4 h-4 expand-btn section-icon text-green-600 transition-transform",
                      expandedSections.has(section.id) && "rotated",
                      activeSection === section.id && "text-white"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="font-semibold text-sm">{section.title}</span>
                </div>
                <button
                  className="add-section-btn opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-400 hover:text-green-600 transition-all"
                  title="Add New Subsection"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSubsection(section.id);
                  }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>

              {/* Subsections */}
              {expandedSections.has(section.id) && (
                <div className="subsections-container ml-7 mt-1 space-y-1">
                  {section.subsections.map((subsection) => (
                    <div
                      key={subsection.id}
                      className={cn(
                        "nav-subsection group flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer",
                        activeSubsection === subsection.id && "active"
                      )}
                      onClick={() => onSubsectionClick(subsection.id)}
                    >
                      <span>{subsection.title}</span>

                      {isAdditionalSubSection(subsection.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering subsection click
                            dispatch(deleteSubsection({ sectionId: section.id, subsectionId: subsection.id }));
                            dispatch(saveProgress({clientId: clientData?.id! }));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
