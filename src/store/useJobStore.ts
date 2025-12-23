import { create } from "zustand";
import { type JobState, JobStatus, type JobStore } from "@/types";
// import { api } from "@/api";

const initialState: JobState = {
  jobId: null,
  status: JobStatus.IDLE,
  files: [],
  result: null,
  error: null,
};

export const useJobStore = create<JobStore>((set, get) => ({
  ...initialState,

  files: [],

  addFiles: async (newFiles) => {
    // Generate IDs and initial objects immediately
    const jobFiles = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: null, // Initial placeholder
      name: file.name,
    }));

    set((state) => ({
      files: [...state.files, ...jobFiles],
      status: JobStatus.IDLE,
    }));

    // Generate thumbnails asynchronously
    const { generateThumbnail } = await import("@/utils/pdfUtils"); // Lazy import to avoid circular dep issues during init

    // We update state as thumbnails become available
    jobFiles.forEach(async (jobFile) => {
      const thumb = await generateThumbnail(jobFile.file);
      set((state) => ({
        files: state.files.map((f) =>
          f.id === jobFile.id ? { ...f, previewUrl: thumb } : f
        ),
      }));
    });
  },

  removeFile: (id) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  reorderFiles: (oldIndex, newIndex) => {
    set((state) => {
      const newFiles = [...state.files];
      const [movedItem] = newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, movedItem);
      return { files: newFiles };
    });
  },

  startJob: async (type) => {
    // Removed `files` param as it's now in state
    try {
      const { files } = get();
      if (files.length === 0) return;

      set({ status: JobStatus.UPLOADING, error: null });
      // Stub: Simulate API call
      console.log(
        "Starting job:",
        type,
        files.map((f) => f.name)
      );

      // In real implementation:
      // const response = await api.startJob(type, files.map(f => f.file));

      // Mocking success for now
      setTimeout(() => {
        set({ status: JobStatus.PROCESSING, jobId: "mock-job-id" });
        get().pollJob();
      }, 1000);
    } catch (error) {
      set({ status: JobStatus.ERROR, error: "Failed to start job" });
      console.error(error);
    }
  },

  pollJob: async () => {
    const { jobId } = get();
    if (!jobId) return;

    // Stub: Simulate polling
    console.log("Polling job:", jobId);

    setTimeout(() => {
      set({
        status: JobStatus.RESULT,
        result: "https://example.com/download.pdf",
      });
    }, 2000);
  },

  reset: () => {
    set(initialState);
  },
}));
