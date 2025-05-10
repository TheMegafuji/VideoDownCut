export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Helper function for time formatting for the API (HH:MM:SS)
export function formatTimeForApi(seconds: number): string {
  return formatTime(seconds);
}

export function getRandomString(length: number = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export function getUniqueFilename(prefix: string = 'file'): string {
  const timestamp = Date.now();
  const randomStr = getRandomString();
  return `${prefix}_${timestamp}_${randomStr}`;
}

// Content type helper
export function getContentType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.mp4':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.mkv':
      return 'video/x-matroska';
    case '.mov':
      return 'video/quicktime';
    case '.avi':
      return 'video/x-msvideo';
    case '.mp3':
      return 'audio/mpeg';
    case '.wav':
      return 'audio/wav';
    case '.ogg':
      return 'audio/ogg';
    case '.m4a':
      return 'audio/mp4';
    default:
      return 'application/octet-stream';
  }
}
