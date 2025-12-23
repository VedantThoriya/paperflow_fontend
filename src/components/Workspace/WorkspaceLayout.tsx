import { type ReactNode, useEffect } from "react";
import { useJobStore } from "@/store/useJobStore";
import { FileUploader } from "./FileUploader";
import { FilePreviewGrid } from "./FilePreviewGrid";
import { Sidebar } from "./Sidebar";

interface WorkspaceLayoutProps {
  title: string;
  description?: string;
  sidebarContent: ReactNode;
  actionButton: ReactNode;
  mainContent?: ReactNode;
}

export const WorkspaceLayout = ({
  title,
  description,
  sidebarContent,
  actionButton,
  mainContent,
}: WorkspaceLayoutProps) => {
  const { files, reset } = useJobStore();
  const hasFiles = files.length > 0;

  // Clear files/state when entering the workspace
  useEffect(() => {
    reset();
  }, [reset]);

  if (!hasFiles) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center px-4">
        {/* Header Section */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <FileUploader />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Main Content / Workspace Area (Scrolls) */}
      <div className="flex-1 overflow-y-auto relative h-full bg-[#f3f3f5] custom-scrollbar">
        <div className="flex justify-between items-center mb-6 lg:hidden p-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Centered Canvas Container */}
        <div className="min-h-full flex flex-col items-center justify-start py-12 px-4 md:px-8">
          <div className="w-full max-w-[1000px] flex-1 flex flex-col">
            {mainContent || (
              <FilePreviewGrid
                enableDnD={
                  title.toLowerCase().includes("merge") || files.length > 1
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar (Fixed sibling) */}
      <Sidebar title={title}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {sidebarContent}
          </div>
          <div className="mt-auto px-0 pt-6 pb-2 border-t border-gray-100 bg-white sticky bottom-0 z-20">
            {actionButton}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
