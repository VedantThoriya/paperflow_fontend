import { useState, useEffect } from "react";
import { WorkspaceLayout } from "@/components/Workspace/WorkspaceLayout";
import { ArrowRight, Check } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { useNavigate } from "react-router-dom";

type CompressionLevel = "extreme" | "recommended" | "less";

export const CompressPdf = () => {
  const { files, reset } = useJobStore();
  const navigate = useNavigate();
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>("recommended");

  // Reset store on mount
  useEffect(() => {
    reset();
  }, [reset]);

  const canCompress = files.length > 0;

  const handleCompress = () => {
    if (!canCompress) return;

    navigate("/uploading", {
      state: {
        jobType: "compress",
        compressionLevel,
      },
    });
  };

  const options: { id: CompressionLevel; title: string; desc: string }[] = [
    {
      id: "extreme",
      title: "EXTREME COMPRESSION",
      desc: "Less quality, high compression",
    },
    {
      id: "recommended",
      title: "RECOMMENDED COMPRESSION",
      desc: "Good quality, good compression",
    },
    {
      id: "less",
      title: "LESS COMPRESSION",
      desc: "High quality, less compression",
    },
  ];

  return (
    <WorkspaceLayout
      title="Compress PDF file"
      description="Reduce file size while optimizing for maximal PDF quality."
      sidebarContent={
        <div className="w-full">
          <h3 className="text-xl font-bold text-[#383E45] mb-4 text-center pb-4 border-b border-gray-200">
            Compression level
          </h3>

          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => setCompressionLevel(option.id)}
                className={`relative p-4 rounded-lg cursor-pointer transition-all border
                                    ${
                                      compressionLevel === option.id
                                        ? "bg-[#f3f3f3] border-gray-200"
                                        : "bg-white border-transparent hover:bg-gray-50"
                                    }
                                `}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="text-[#E5322D] font-medium text-sm mb-1 uppercase tracking-wide">
                      {option.title}
                    </h4>
                    <p className="text-[#383E45] text-sm">{option.desc}</p>
                  </div>

                  {compressionLevel === option.id && (
                    <div className="ml-3 flex-shrink-0">
                      <div className="w-6 h-6 bg-[#2ecc71] rounded-full flex items-center justify-center text-white">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      actionButton={
        <div className="relative group w-full">
          <button
            onClick={handleCompress}
            disabled={!canCompress}
            className={`w-full text-white text-xl font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3
                            ${
                              canCompress
                                ? "bg-[#e5322D] hover:bg-[#d6201b] hover:scale-105 cursor-pointer"
                                : "bg-[#ff9c99] cursor-default shadow-none pointer-events-none"
                            }
                        `}
          >
            <span>Compress PDF</span>
            {canCompress && <ArrowRight size={24} />}
          </button>
          {/* Tooltip for disabled state */}
          {!canCompress && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#383e45] text-white text-xs text-center py-2 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-[#383e45]">
              Please, select a PDF file
            </div>
          )}
        </div>
      }
    />
  );
};
