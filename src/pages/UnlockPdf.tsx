import { useState } from "react";
import { WorkspaceLayout } from "@/components/Workspace/WorkspaceLayout";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "@/store/useJobStore";

export const UnlockPdf = () => {
  const navigate = useNavigate();
  const { files } = useJobStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUnlock = async () => {
    // Navigate to uploading page
    navigate("/uploading", { state: { tool: "unlock" } });
  };

  return (
    <WorkspaceLayout
      title="Unlock PDF"
      showAddMore={false}
      description="Remove PDF password security, giving you the freedom to use your PDFs as you want."
      sidebarContent={
        <div className="w-full px-2 pt-2">
          <div className="bg-[#e1f0fc] text-[#000000] p-5 rounded text-[14px] leading-relaxed text-left">
            Just press the unlock button.
          </div>
        </div>
      }
      actionButton={
        <button
          onClick={handleUnlock}
          disabled={files.length === 0 || isProcessing}
          className="w-full bg-[#E5322D] text-white py-4 rounded-xl text-xl font-bold hover:bg-[#d6201b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? "Unlocking..." : "Unlock PDF"}
          {!isProcessing && <ArrowRight size={24} />}
        </button>
      }
    />
  );
};
