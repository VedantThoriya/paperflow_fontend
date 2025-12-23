import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";

export const FileUploader = () => {
  const addFiles = useJobStore((state) => state.addFiles);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        addFiles(acceptedFiles);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`bg-white p-12 rounded-xl shadow-lg border-2 border-dashed border-gray-300 w-full max-w-2xl mx-auto flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer ${
        isDragActive ? "bg-gray-50 border-red-400" : ""
      }`}
    >
      <input {...getInputProps()} />

      <div className="text-red-500 mb-4">
        <Upload size={64} strokeWidth={1.5} />
      </div>

      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all shadow-md hover:scale-105 pointer-events-none transform">
        Select PDF files
      </button>

      <p className="mt-4 text-gray-400">or drop PDFs here</p>
    </div>
  );
};
