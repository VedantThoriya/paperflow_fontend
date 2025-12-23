import { WorkspaceLayout } from "@/components/Workspace/WorkspaceLayout";
import { ArrowRight } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { useNavigate } from "react-router-dom";

export const MergePdf = () => {
  const { files } = useJobStore();

  const canMerge = files.length >= 2;

  const navigate = useNavigate();

  const handleMerge = () => {
    if (canMerge) {
      navigate("/uploading", { state: { jobType: "merge" } });
    }
  };

  return (
    <WorkspaceLayout
      title="Merge PDF"
      description="Combine PDFs in the order you want with the easiest PDF merger available."
      sidebarContent={
        <div className="text-sm text-[#33333b] space-y-4 text-center">
          {canMerge ? (
            <div className="bg-[#e1f0fc] p-4 rounded text-left">
              To change the order of your PDFs, drag and drop the files as you
              want.
            </div>
          ) : (
            <div className="bg-[#e1f0fc] p-4 rounded text-left leading-relaxed">
              Please, select more PDF files by clicking again on 'Select PDF
              files'.
              <br />
              Select multiple files by maintaining pressed 'Ctrl'
            </div>
          )}
        </div>
      }
      actionButton={
        <div className="relative group w-full">
          <button
            onClick={handleMerge}
            disabled={!canMerge}
            className={`w-full text-white text-xl font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3
                    ${
                      canMerge
                        ? "bg-[#e5322d] hover:bg-[#d6201b] hover:scale-105 cursor-pointer"
                        : "bg-[#ff9c99] cursor-default shadow-none pointer-events-none" // pointer-events-none might block hover on button, so wrapper handles hover
                    }
                `}
          >
            <span>Merge PDF</span>
            {canMerge && <ArrowRight size={24} />}
          </button>
          {/* Tooltip for disabled state */}
          {!canMerge && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#383e45] text-white text-xs text-center py-2 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-[#383e45]">
              Please, select more PDF files
            </div>
          )}
        </div>
      }
    />
  );
};
