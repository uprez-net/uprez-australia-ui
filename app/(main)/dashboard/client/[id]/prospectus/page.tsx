"use client";

import { useState, useEffect } from "react";
import { NavigationSidebar } from "@/components/navigation-sidebar";
import { TopNavigation } from "@/components/top-navigation";
import { DocumentViewer } from "@/components/document-viewer";
import { RichTextEditor } from "@/components/rich-text-editor";
import { UploadBriefModal } from "@/components/upload-brief-modal";
import { SidebarPanel } from "@/components/sidebar-panel";
import { GenerationModal } from "@/components/generation-modal";
import { SidebarContent } from "@/components/sidebar-content";
import {
  prospectusData,
  type ProspectusSubsection,
} from "@/lib/prospectus-data";

export default function ProspectusEditor() {
  const [activeSection, setActiveSection] = useState("important-notices");
  const [activeSubsection, setActiveSubsection] = useState("disclaimer");
  const [editingSubsection, setEditingSubsection] =
    useState<ProspectusSubsection | null>(null);
  const [uploadBriefSubsection, setUploadBriefSubsection] = useState<
    string | null
  >(null);
  const [sidebarType, setSidebarType] = useState<
    "comments" | "history" | "ai" | null
  >(null);
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  useEffect(() => {
    const container = document.querySelector<HTMLDivElement>(
      "#document-container .overflow-y-auto"
    );
    if (!container) return;

    const sections = prospectusData.flatMap((section) =>
      section.subsections.map((sub) => ({
        id: sub.id,
        sectionId: section.id,
      }))
    );

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();

      let currentActive: { id: string; sectionId: string } | null = null;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - containerRect.top;
        const elementBottom = rect.bottom - containerRect.top;

        // Pick the first section that's in view
        if (elementTop <= 200 && elementBottom > 200) {
          currentActive = section;
          break;
        }
      }

      if (currentActive) {
        setActiveSubsection(currentActive.id);
        setActiveSection(currentActive.sectionId);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    console.log("[v0] Section clicked:", sectionId);
    setActiveSection(sectionId);
    // Find the first subsection of this section to scroll to
    const section = prospectusData.find((s) => s.id === sectionId);
    if (section && section.subsections.length > 0) {
      const firstSubsectionId = section.subsections[0].id;
      setActiveSubsection(firstSubsectionId);
      const element = document.getElementById(firstSubsectionId);
      const container = document.querySelector(
        "#document-container .overflow-y-auto"
      );
      if (element && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop =
          container.scrollTop + (elementRect.top - containerRect.top) - 100;

        console.log(
          "[v0] Scrolling to section:",
          firstSubsectionId,
          "position:",
          scrollTop
        );
        container.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }
  };

  const handleSubsectionClick = (subsectionId: string) => {
    console.log("[v0] Subsection clicked:", subsectionId);
    // Find which section this subsection belongs to
    const parentSection = prospectusData.find((section) =>
      section.subsections.some((sub) => sub.id === subsectionId)
    );
    if (parentSection) {
      setActiveSection(parentSection.id);
    }
    setActiveSubsection(subsectionId);

    const element = document.getElementById(subsectionId);
    const container = document.querySelector(
      "#document-container .overflow-y-auto"
    );
    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop =
        container.scrollTop + (elementRect.top - containerRect.top) - 100;

      console.log(
        "[v0] Scrolling to subsection:",
        subsectionId,
        "position:",
        scrollTop
      );
      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  const handleEditSection = (subsection: ProspectusSubsection) => {
    setEditingSubsection(subsection);
  };

  const handleSaveSection = (content: string) => {
    if (editingSubsection) {
      // In a real app, this would update the data store
      console.log("Saving content for", editingSubsection.id, content);
      setEditingSubsection(null);
    }
  };

  const handleUploadBrief = (subsectionId: string) => {
    setUploadBriefSubsection(subsectionId);
  };

  const handleUploadBriefSubmit = (data: { file?: File; brief?: string }) => {
    console.log("Upload/Brief submitted for", uploadBriefSubsection, data);
    setUploadBriefSubsection(null);
  };

  const handleGenerateAll = () => {
    setShowGenerationModal(true);
  };

  const handleSidebarOpen = (type: "comments" | "history" | "ai") => {
    setSidebarType(type);
  };

  const handleSidebarClose = () => {
    setSidebarType(null);
  };

  const getSubsectionTitle = (subsectionId: string) => {
    for (const section of prospectusData) {
      const subsection = section.subsections.find(
        (sub) => sub.id === subsectionId
      );
      if (subsection) return subsection.title;
    }
    return "Unknown Section";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation Sidebar - Fixed */}
      <div className="w-80 flex-shrink-0">
        <NavigationSidebar
          key={activeSubsection} // Force remount to reset expanded state
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          onSectionClick={handleSectionClick}
          onSubsectionClick={handleSubsectionClick}
        />
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar - Fixed */}
        <div className="flex-shrink-0">
          <TopNavigation
            onCommentsClick={() => handleSidebarOpen("comments")}
            onHistoryClick={() => handleSidebarOpen("history")}
            onAiClick={() => handleSidebarOpen("ai")}
          />
        </div>

        {/* Document Viewer - Scrollable */}
        <div className="flex-1 overflow-hidden" id="document-container">
          <DocumentViewer
            onEditSection={handleEditSection}
            onUploadBrief={handleUploadBrief}
            onGenerateAll={handleGenerateAll}
          />
        </div>
      </div>

      {/* Right Sidebar Panel */}
      <SidebarPanel
        isOpen={sidebarType !== null}
        onClose={handleSidebarClose}
        title={
          sidebarType === "comments"
            ? "Comments & Collaboration"
            : sidebarType === "history"
            ? "Version History"
            : sidebarType === "ai"
            ? "AI Assistant"
            : ""
        }
      >
        {sidebarType && <SidebarContent type={sidebarType} />}
      </SidebarPanel>

      {/* Rich Text Editor Modal */}
      {editingSubsection && (
        <RichTextEditor
          isOpen={editingSubsection !== null}
          content={editingSubsection.content}
          title={editingSubsection.title}
          onSave={handleSaveSection}
          onCancel={() => setEditingSubsection(null)}
        />
      )}

      {/* Upload/Brief Modal */}
      <UploadBriefModal
        isOpen={uploadBriefSubsection !== null}
        onClose={() => setUploadBriefSubsection(null)}
        onSubmit={handleUploadBriefSubmit}
        sectionTitle={
          uploadBriefSubsection ? getSubsectionTitle(uploadBriefSubsection) : ""
        }
      />

      {/* Generation Modal */}
      <GenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
      />
    </div>
  );
}
