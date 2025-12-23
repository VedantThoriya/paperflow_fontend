import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJobStore } from "@/store/useJobStore";
import { api } from "@/api";
const MIN_UPLOAD_SCREEN_TIME = 800;

export const UploadingPage = () => {
  const { files } = useJobStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0-100
  const [speed, setSpeed] = useState(0); // MB/s
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [statusText, setStatusText] = useState("UPLOADED");

  const lastLoadedRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const startTimeRef = useRef(Date.now());
  const uploadStartedRef = useRef(false);
  const tempFileIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (files.length === 0) {
      navigate("/");
      return;
    }

    if (uploadStartedRef.current) return;
    uploadStartedRef.current = true;

    const uploadFiles = async () => {
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        setProgress(0);
        setSpeed(0);
        setTimeLeft(0);
        lastLoadedRef.current = 0;
        lastTimeRef.current = Date.now();
        startTimeRef.current = Date.now();

        const file = files[i].file;

        try {
          const response = await api.uploadTempFile(file, (event) => {
            if (!event.total) return;

            const now = Date.now();
            const timeDiff = (now - lastTimeRef.current) / 1000; // seconds

            // Update stats every 500ms or on completion to avoid flicker
            if (timeDiff > 0.5 || event.loaded === event.total) {
              const loadedDiff = event.loaded - lastLoadedRef.current;
              const currentSpeed = loadedDiff / timeDiff / (1024 * 1024); // MB/s

              // Exponential moving average for smoother speed
              setSpeed((prev) =>
                prev === 0 ? currentSpeed : prev * 0.7 + currentSpeed * 0.3
              );

              const remainingBytes = event.total - event.loaded;
              const estimatedTime =
                currentSpeed > 0
                  ? remainingBytes / (currentSpeed * 1024 * 1024)
                  : 0;
              setTimeLeft(estimatedTime);

              lastLoadedRef.current = event.loaded;
              lastTimeRef.current = now;
            }

            setProgress(Math.round((event.loaded / event.total) * 100));
          });

          if (response.data && response.data.tempFileId) {
            tempFileIdsRef.current.push(response.data.tempFileId);
          }
        } catch (error) {
          console.error("Upload failed for file", file.name, error);
          // Handle error (maybe skip or show error)
        }
      }

      // All files uploaded
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(MIN_UPLOAD_SCREEN_TIME - elapsed, 0);

      setTimeout(async () => {
        if (location.state?.tool === "unlock") {
          setStatusText("CHECKING ENCRYPTION...");
          try {
            const response = await api.checkPDFEncryption(
              tempFileIdsRef.current
            );
            if (response.data.isEncrypted) {
              navigate("/unlock/password", {
                state: {
                  fileIds: tempFileIdsRef.current,
                  ...location.state,
                },
                replace: true,
              });
            } else {
              navigate("/processing", {
                state: {
                  fileIds: tempFileIdsRef.current,
                  jobType: "unlock",
                  ...location.state,
                },
                replace: true,
              });
            }
          } catch (error) {
            console.error("Encryption check failed", error);
            // Fallback or error handling? For now proceed to processing or show error
            navigate("/processing", {
              state: {
                fileIds: tempFileIdsRef.current,
                jobType: "unlock",
                ...location.state,
              },
              replace: true,
            });
          }
        } else {
          navigate("/processing", {
            state: {
              fileIds: tempFileIdsRef.current,
              ...location.state,
            },
            replace: true,
          });
        }
      }, remainingTime);
    };

    uploadFiles();
  }, [files, navigate, location.state]);

  if (files.length === 0) return null;

  const currentFile = files[currentFileIndex].file;
  const currentFileName = currentFile.name;
  const currentFileSizeMB = (currentFile.size / (1024 * 1024)).toFixed(2);
  const formattedSpeed = speed.toFixed(1);
  const formattedTimeLeft = Math.ceil(timeLeft);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F5F6] font-sans pb-20">
      <div className="flex flex-col items-center w-full max-w-4xl px-4">
        {/* Logo */}
        <Link to="/" className="mb-12">
          <img src="/ilovepdf.svg" alt="iLovePDF" className="h-8 md:h-10" />
        </Link>

        {/* Text Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-[28px] font-medium text-[#383E45] mb-2 leading-tight">
            Uploading file {currentFileIndex + 1} of {files.length}
          </h2>
          <p className="text-[#383E45] font-bold text-base md:text-lg">
            {currentFileName} ({currentFileSizeMB} MB)
          </p>
        </div>

        {/* Stats */}
        <div className="text-center mb-6">
          <p className="text-[#383E45] text-xs md:text-sm">
            <span className="font-bold">Time left</span> {formattedTimeLeft}{" "}
            SECONDS - <span className="font-bold">Upload speed</span>{" "}
            {formattedSpeed} MB/S
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl h-4 bg-white rounded-full overflow-hidden mb-6 shadow-sm">
          <div
            className="h-full bg-[#E5322D] transition-all duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Percentage Display */}
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-[#383E45] mb-2 font-display">
            {progress}%
          </h1>
          <p className="text-[#383E45] font-medium text-sm tracking-[0.2em] uppercase mb-12">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
};
