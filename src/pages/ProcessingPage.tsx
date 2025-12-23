import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useJobStore } from "@/store/useJobStore";

export const ProcessingPage = () => {
  const { reset } = useJobStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [jobStatus, setJobStatus] = useState("Initializing...");
  const processedRef = useRef(false);

  // Manual back button handling removed

  useEffect(() => {
    const fileIds = location.state?.fileIds;
    if (!fileIds || fileIds.length === 0) {
      // If no IDs, maybe redirect back or show error
      console.warn("No file IDs found in state");
      // navigate("/"); // Uncomment to enforce flow
      return;
    }

    if (processedRef.current) return;
    processedRef.current = true;

    const processJob = async () => {
      try {
        let startResponse;
        const jobType = location.state?.jobType || "merge";

        if (jobType === "compress") {
          setJobStatus("Compressing PDF...");
          startResponse = await api.startCompressJob(
            fileIds,
            location.state?.compressionLevel
          );
        } else if (jobType === "split") {
          setJobStatus("Splitting PDF...");
          const splitOptions = location.state?.splitOptions;
          // Map options to API expectation
          const apiOptions = {
            merge: splitOptions?.mergeOutput,
            fixedRange:
              splitOptions?.mode === "fixed"
                ? splitOptions.fixedRange
                : undefined,
            ranges:
              splitOptions?.mode === "custom"
                ? splitOptions.ranges.map((r: any) => ({
                    start: r.from,
                    end: r.to,
                  }))
                : undefined,
          };
          startResponse = await api.startSplitJob(fileIds, apiOptions);
        } else {
          setJobStatus("Merging PDFs...");
          startResponse = await api.startMergeJob(fileIds);
        }

        const jobId = startResponse.data.jobId;

        console.log("Job Started:", jobId);

        // Poll every 3 seconds
        const interval = setInterval(async () => {
          try {
            const statusResponse = await api.getJobStatus(jobId);
            const status = statusResponse.data.status;
            console.log("Job Status:", status);

            if (status === "COMPLETED") {
              clearInterval(interval);
              navigate("/download", {
                state: {
                  downloadUrl: statusResponse.data.result?.url,
                  tool: jobType,
                  originalSize: statusResponse.data.result?.originalSize,
                  compressedSize: statusResponse.data.result?.compressedSize,
                },
                replace: true,
              });
            } else if (status === "FAILED") {
              clearInterval(interval);
              setJobStatus("Job Failed.");
            }
          } catch (pollError) {
            console.error("Polling error", pollError);
          }
        }, 3000);
      } catch (error) {
        console.error("Failed to start job", error);
        setJobStatus("Error starting job.");
      }
    };

    processJob();
  }, [location.state, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F5F6] font-sans pb-20">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Link to="/" className="mb-12">
          <img src="/ilovepdf.svg" alt="iLovePDF" className="h-8 md:h-10" />
        </Link>

        {/* Text */}
        <h2 className="text-2xl font-medium text-[#383E45] mb-6">
          {jobStatus}
        </h2>

        {/* Custom Spinner */}
        <div className="relative w-16 h-16">
          {/* Background Circle */}
          <div className="absolute inset-0 border-[5px] border-gray-200 rounded-full"></div>
          {/* Spinning Segment */}
          <div className="absolute inset-0 border-[5px] border-transparent border-t-[#E5322D] rounded-full animate-spin"></div>
        </div>

        {/* Warning Text */}
        <p className="mt-8 text-gray-500 text-sm max-w-md text-center leading-relaxed">
          Do not close your browser. Wait until your files are uploaded and
          processed! This might take a few minutes. :)
        </p>
      </div>
    </div>
  );
};
