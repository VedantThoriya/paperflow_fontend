export enum JobStatus {
  IDLE = "IDLE",
  UPLOADING = "UPLOADING",
  PROCESSING = "PROCESSING",
  RESULT = "RESULT",
  ERROR = "ERROR",
}

export interface JobFile {
  id: string;
  file: File;
  previewUrl: string | null;
  name: string;
}

export interface JobState {
  jobId: string | null;
  status: JobStatus;
  files: JobFile[];
  result: string | null;
  error: string | null;
}

export interface JobStore extends JobState {
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (oldIndex: number, newIndex: number) => void;
  startJob: (type: string) => Promise<void>;
  pollJob: () => Promise<void>;
  reset: () => void;
}
