import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const ENDPOINTS = {
  MERGE: "/merge",
  SPLIT: "/split",
  COMPRESS: "/compress",
  UPLOAD_TEMP: "/uploads/temp",
  JOB_STATUS: (id: string) => `/${id}`,
};

export const api = {
  uploadTempFile: async (
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post<{
      tempFileId: string;
      originalName: string;
      size: number;
    }>(ENDPOINTS.UPLOAD_TEMP, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },

  startMergeJob: async (files: string[]) => {
    return axiosInstance.post<{
      jobId: string;
      status: string;
      message: string;
    }>(ENDPOINTS.MERGE, {
      files,
    });
  },

  startSplitJob: async (
    files: string[],
    options: {
      ranges?: { start: number; end: number }[];
      fixedRange?: number;
      merge?: boolean;
    }
  ) => {
    return axiosInstance.post<{
      jobId: string;
      status: string;
      message: string;
    }>(ENDPOINTS.SPLIT, {
      files,
      ...options,
    });
  },

  startCompressJob: async (files: string[], compressionLevel: string) => {
    return axiosInstance.post<{
      jobId: string;
      status: string;
      message: string;
    }>(ENDPOINTS.COMPRESS, {
      files,
      compressionLevel,
    });
  },

  getJobStatus: async (jobId: string) => {
    return axiosInstance.get<{
      id: string;
      status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
      createdAt: string;
      type: string;
      result?: {
        url: string;
        originalSize?: number;
        compressedSize?: number;
      };
      completedAt?: string;
    }>(ENDPOINTS.JOB_STATUS(jobId));
  },
};
