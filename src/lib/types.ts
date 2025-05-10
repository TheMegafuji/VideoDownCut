export interface VideoInfo {
  title: string;
  duration: number;
  formats?: Array<{
    formatId: string;
    formatNote: string;
    ext: string;
    resolution: string;
    filesize: number;
  }>;
  thumbnailUrl: string;
}

export interface VideoFormat {
  formatId: string;
  formatNote: string;
  ext: string;
  resolution: string;
  filesize: number;
}

export interface CutOptions {
  startTime: string | number;
  endTime: string | number;
  format: string;
}

export interface DownloadStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  videoInfo: VideoInfo | null;
  downloadedPath: string;
  downloadUrl: string;
  sourceUrl: string;
  outputType?: 'video' | 'audio';
  originalVideo?: boolean;
}

export interface BackendVideoResponse {
  success?: boolean;
  video?: {
    id: string;
    title: string;
    path: string;
    duration: number;
    thumbnailUrl?: string;
    format?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  data?: {
    videoId: string;
    title: string;
    duration: number;
    thumbnail: string;
    formats?: Array<{
      formatId: string;
      extension: string;
      resolution: string;
      filesize?: number;
    }>;
  };
  videoInfo?: VideoInfo;
  filePath?: string;
  path?: string;
  title?: string;
  duration?: number;
  downloadUrl?: string;
}

export interface BackendCutResponse {
  success?: boolean;
  outputPath?: string;
  downloadUrl: string;
  error?: string;
}
