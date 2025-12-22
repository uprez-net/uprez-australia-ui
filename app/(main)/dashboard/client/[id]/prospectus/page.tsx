"use client";

import { useState, useEffect, useMemo } from "react";
import { NavigationSidebar } from "@/components/navigation-sidebar";
import { TopNavigation } from "@/components/top-navigation";
import { DocumentViewer } from "@/components/document-viewer";
import { RichTextEditor } from "@/components/rich-text-editor";
import { UploadBriefModal } from "@/components/upload-brief-modal";
import { SidebarPanel } from "@/components/sidebar-panel";
import { GenerationModal } from "@/components/generation-modal";
import { SidebarContent } from "@/components/sidebar-content";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ProspectusSubsection } from "@/app/interface/interface";
import { getYear, format } from "date-fns";
import { australianStates } from "@/components/business-details-form";
import { useAppDispatch } from "@/app/redux/use-dispatch";
import {
  addNewSubsection,
  clearProspectusData,
  loadProspectusData,
  saveProgress,
  setEditingSubsectionId,
} from "@/app/redux/prospectusSlice";
import { toast } from "sonner";
import { AddSubsectionModal } from "@/components/add-subsection-dialog";
import { ProspectusWorkflowVisualizer } from "@/components/prospectus-timeline";
import { CircleCheck, CircleX, RefreshCcw } from "lucide-react";
import { ProspectusEditorSkeleton } from "@/components/ProspectusEditorSkeleton";

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
  const [addingSubsectionTo, setAddingSubsectionTo] = useState<string | null>(
    null
  );
  const {
    clientData,
    isLoading: clientLoading,
    error: clientError,
  } = useSelector((state: RootState) => state.client);
  const {
    prospectusData,
    activeProspectusId,
    isLoading: prospectusLoading,
    error: prospectusError,
    locked,
  } = useSelector((state: RootState) => state.prospectus);
  const dispatch = useAppDispatch();
  const activeProspectus = useMemo(
    () =>
      prospectusData &&
      prospectusData.find((p) => p.id === activeProspectusId)!,
    [prospectusData, activeProspectusId]
  );

  useEffect(() => {
    let mounted = true;
    const fetchData = async (clientId: string) => {
      const toastId = toast.loading("Loading prospectus data...");
      try {
        const res = await dispatch(loadProspectusData({ clientId }));
        if (loadProspectusData.rejected.match(res)) {
          throw new Error(res.payload as string);
        }
        if (mounted) {
          toast.success("Prospectus data loaded", {
            icon: <CircleCheck className="notification-icon" />
          });
        }
      } catch (error) {
        toast.error("Error fetching prospectus data", {
          icon: <CircleX className="notification-icon" />,
        });
        console.error("Error fetching prospectus data:", error);
      } finally {
        toast.dismiss(toastId);
      }
    };

    if (!clientData) return;
    fetchData(clientData.id);

    return () => {
      mounted = false;
      dispatch(clearProspectusData());
    };
  }, [clientData?.id]);

  useEffect(() => {
    const container = document.querySelector<HTMLDivElement>(
      "#document-container .overflow-y-auto"
    );
    if (!container) {
      console.warn("⚠️ No container found!");
      return;
    }
    if (!activeProspectus) {
      console.warn("⚠️ No active prospectus found!");
      return;
    }

    const sections = activeProspectus.sections.flatMap((section) =>
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

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [activeProspectus, clientLoading, prospectusLoading]);

  const handleSectionClick = (sectionId: string) => {
    console.log("[v0] Section clicked:", sectionId);
    setActiveSection(sectionId);
    // Find the first subsection of this section to scroll to
    const section = activeProspectus.sections.find((s) => s.id === sectionId);
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
    // console.log("[v0] Subsection clicked:", subsectionId);
    // Find which section this subsection belongs to
    const parentSection = activeProspectus.sections.find((section) =>
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

      // console.log(
      //   "[v0] Scrolling to subsection:",
      //   subsectionId,
      //   "position:",
      //   scrollTop
      // );
      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  const handleEditSection = (subsection: ProspectusSubsection | null) => {
    dispatch(setEditingSubsectionId(subsection?.id || undefined));
    setEditingSubsection(subsection);
  };

  const handleSaveSection = async (content: string) => {
    if (editingSubsection) {
      console.log("Saving content for", editingSubsection.id, content);
      const toastId = toast.loading("Saving section...");
      try {
        const updatedProspectus = activeProspectus.sections.map((section) => ({
          ...section,
          subsections: section.subsections.map((sub) =>
            sub.id === editingSubsection.id ? { ...sub, content } : sub
          ),
        }));
        const res = await dispatch(
          saveProgress({
            clientId: clientData!.id,
            content: updatedProspectus,
          })
        );
        if (saveProgress.rejected.match(res)) {
          throw new Error(res.payload as string);
        }
        toast.success("Section saved successfully", {
          icon: <CircleCheck className="notification-icon" />
        });
        setEditingSubsection(null);
      } catch (error) {
        toast.error("Error saving section", {
          icon: <CircleX className="notification-icon" />
        });
        console.error("Error saving section:", error);
      } finally {
        toast.dismiss(toastId);
      }
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
    for (const section of activeProspectus.sections) {
      const subsection = section.subsections.find(
        (sub) => sub.id === subsectionId
      );
      if (subsection) return subsection.title;
    }
    return "Unknown Section";
  };

  if (
    clientLoading ||
    prospectusLoading ||
    clientData === null ||
    clientError !== null ||
    prospectusError !== null
  ) {
    console.log(
      `Client loading: ${clientLoading}, Prospectus loading: ${prospectusLoading}`
    );
    return (
      <ProspectusEditorSkeleton />
    );
  }

  if (clientError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Client Data
            </h3>
            <p className="text-red-600 text-sm">{clientError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (prospectusError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
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
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Prospectus Data
            </h3>
            <p className="text-red-600 text-sm">{prospectusError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProspectusWorkflowVisualizer currentStage={"collaboration"} />
      <div className="flex h-screen bg-gray-50">
        {/* Left Navigation Sidebar - Fixed */}
        <div className="w-80 flex-shrink-0">
          <NavigationSidebar
            key={activeSubsection} // Force remount to reset expanded state
            activeSection={activeSection}
            activeSubsection={activeSubsection}
            prospectusData={activeProspectus}
            onSectionClick={handleSectionClick}
            onSubsectionClick={handleSubsectionClick}
            openAddDialog={(sectionId) => setAddingSubsectionTo(sectionId)}
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
              editingSubsection={editingSubsection}
              onEditSection={handleEditSection}
              onUploadBrief={handleUploadBrief}
              onGenerateAll={handleGenerateAll}
              handleSaveSection={handleSaveSection}
              companyData={{
                name: clientData!.companyName,
                acn: clientData!.acn ?? "N/A",
                industry: clientData!.industrySector ?? "N/A",
                employees: "50-100", // Placeholder
                markets: "Australia", // Placeholder
                founded: clientData!.incorporationDate
                  ? getYear(clientData!.incorporationDate).toString()
                  : "N/A",
                headquarters:
                  australianStates.find(
                    (state) => state.value === clientData?.stateOfRegistration
                  )?.label ?? "N/A",
                businessAddress: "N/A", // Placeholder
                lodgeDate: format(new Date(), "dd/MM/yyyy"),
                companyLogo: clientData!.companyLogo ?? undefined,
              }}
              prospectusData={activeProspectus}
              disabled={locked}
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
          {sidebarType && (
            <SidebarContent
              type={sidebarType}
              comments={prospectusData.flatMap((p) => p.comments)}
              versionHistory={prospectusData.map((p) => ({
                version: p.version.toString(),
                createdBy: p.createdBy,
                createdAt: p.createdAt,
                isCurrent: p.id === activeProspectusId,
                id: p.id,
              }))}
            />
          )}
        </SidebarPanel>

        {/* Upload/Brief Modal */}
        <UploadBriefModal
          isOpen={uploadBriefSubsection !== null}
          onClose={() => setUploadBriefSubsection(null)}
          onSubmit={handleUploadBriefSubmit}
          sectionTitle={
            uploadBriefSubsection
              ? getSubsectionTitle(uploadBriefSubsection)
              : ""
          }
        />

        {/* Generation Modal */}
        <GenerationModal
          isOpen={showGenerationModal}
          onClose={() => setShowGenerationModal(false)}
        />

        <AddSubsectionModal
          isOpen={addingSubsectionTo !== null}
          onClose={() => setAddingSubsectionTo(null)}
          sectionName={
            activeProspectus.sections.find((s) => s.id === addingSubsectionTo)
              ?.title || ""
          }
          onConfirm={({ title, type }) => {
            console.log("Add subsection to", addingSubsectionTo, {
              title,
              type,
            });
            const newSubsection: ProspectusSubsection = {
              id: title.toLowerCase().replace(/\s+/g, "-"),
              title,
              contentType: type as "text" | "table" | "chart" | "list",
              content: `New ${type} subsection. Click edit to add content.`,
            };
            dispatch(
              addNewSubsection({
                sectionId: addingSubsectionTo!,
                subsection: newSubsection,
              })
            );
            dispatch(saveProgress({ clientId: clientData?.id! }));
          }}
        />
      </div>
    </>
  );
}
