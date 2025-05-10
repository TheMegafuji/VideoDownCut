import { VideoInfo, BackendVideoResponse } from './types';

/**
 * Adapters to make backend responses compatible with the frontend
 */

/**
 * Adapts the backend download response to the format expected by the frontend
 */
export function adaptDownloadResponse(backendResponse: BackendVideoResponse) {
  // Case 1: If the response is already in the expected format
  if (backendResponse.videoInfo && backendResponse.filePath) {
    return backendResponse;
  }

  // Case 2: If the data is inside a "data" object (current backend format)
  if (backendResponse.success && backendResponse.data) {
    return {
      videoInfo: {
        title: backendResponse.data.title || 'Video without title',
        duration: backendResponse.data.duration || 0,
        formats: backendResponse.data.formats || [],
        thumbnailUrl: backendResponse.data.thumbnail || '',
      },
      filePath: backendResponse.data.videoId || '', // Use videoId as filePath
    };
  }

  // Case 3: When the backend returns in video.id, video.path, etc. format
  if (backendResponse.video) {
    return {
      videoInfo: {
        title: backendResponse.video.title,
        duration: backendResponse.video.duration,
        formats: [],
        thumbnailUrl: backendResponse.video.thumbnailUrl || '',
      },
      filePath: backendResponse.video.path,
    };
  }

  // Case 4: Original application format (maintain compatibility)
  return {
    videoInfo: {
      title: backendResponse.title || 'Video without title',
      duration: backendResponse.duration || 0,
      formats: [],
      thumbnailUrl: '',
    },
    filePath: backendResponse.filePath || backendResponse.path || '',
  };
}
