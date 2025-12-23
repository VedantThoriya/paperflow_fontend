import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { useNavigate } from "react-router-dom";
import { WorkspaceLayout } from "@/components/Workspace/WorkspaceLayout";
import { SplitSidebar, type SplitOptions } from "./SplitPdf/SplitSidebar";
import { SplitMainContent } from "./SplitPdf/SplitMainContent";
import { getPdfPageCount } from "@/utils/pdfUtils";

export const SplitPdf = () => {
  const { files } = useJobStore();
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [options, setOptions] = useState<SplitOptions>({
    mode: "custom",
    ranges: [{ id: crypto.randomUUID(), from: 1, to: 1 }],
    fixedRange: 1,
    mergeOutput: false,
  });
  const [hoveredRangeId, setHoveredRangeId] = useState<string | null>(null);

  useEffect(() => {
    const loadPageCount = async () => {
      if (files.length > 0) {
        const count = await getPdfPageCount(files[0].file);
        setTotalPages(count);
        // Initialize range if not set or invalid
        setOptions((prev) => ({
          ...prev,
          ranges: [{ id: crypto.randomUUID(), from: 1, to: count }],
        }));
      }
    };
    loadPageCount();
  }, [files]);

  const handleSplit = () => {
    // Process split job
    // Ideally map ranges to string format expected by backend if needed, or just pass options
    navigate("/uploading", {
      state: {
        jobType: "split",
        splitOptions: options,
      },
    });
  };

  return (
    <WorkspaceLayout
      title="Split PDF"
      description="Separate one page or a whole set for easy conversion into independent PDF files."
      mainContent={
        files.length > 0 ? (
          <SplitMainContent
            options={options}
            setOptions={setOptions}
            totalPages={totalPages}
            hoveredRangeId={hoveredRangeId}
          />
        ) : undefined
      }
      sidebarContent={
        <SplitSidebar
          options={options}
          setOptions={setOptions}
          totalPages={totalPages}
          setHoveredRangeId={setHoveredRangeId}
        />
      }
      actionButton={
        <button
          onClick={handleSplit}
          disabled={files.length === 0}
          className="w-full bg-[#E5322D] hover:bg-[#d6201b] text-white text-xl font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>Split PDF</span>
          <ArrowRight size={24} />
        </button>
      }
    />
  );
};
