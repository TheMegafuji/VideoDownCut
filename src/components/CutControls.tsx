'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { VideoInfo, CutOptions } from '@/lib/types';
import RangeSlider from './RangeSlider';
import { formatTime, formatTimeForApi } from '@/lib/utils';
import CustomPlayer from './CustomPlayer';
import DirectUrlPlayer from './DirectUrlPlayer';
import PlayerStreamingChunks from './PlayerStreamingChunks'; // Uncomment if you want to use the streaming version

// Get backend URL from environment variable or use fallback
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

interface CutControlsProps {
  videoInfo: VideoInfo;
  filePath: string;
  onCutComplete: (_downloadUrl: string, _outputType?: 'video' | 'audio') => void;
}

export default function CutControls({ videoInfo, filePath, onCutComplete }: CutControlsProps) {
  const t = useTranslations('cutControls');
  const commonT = useTranslations('common');
  const [mounted, setMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(videoInfo.duration || 0);
  const [format, setFormat] = useState('mp4');
  const [outputType, setOutputType] = useState<'video' | 'audio'>('video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoDuration, setVideoDuration] = useState(videoInfo.duration || 0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [processedDownloadUrl, setProcessedDownloadUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string | null>(null);

  // Extract video ID from the stream URL
  const extractVideoIdFromUrl = (url: string): string => {
    // If URL ends with a format extension (like .mp4), remove it
    const lastPart = url.split('/').pop() || '';
    const idWithoutExt = lastPart.split('.')[0];

    // If we have a valid-looking ID, return it
    if (idWithoutExt && idWithoutExt.length > 0) {
      return idWithoutExt;
    }

    // Try to extract from the path
    const matches = url.match(/\/api\/videos\/stream\/([^/?&]+)/);
    if (matches && matches[1]) {
      return matches[1];
    }

    // Fallback - just use the videoId from original file
    return typeof filePath === 'string'
      ? filePath.split('/').pop()?.split('.')[0] || 'video'
      : 'video';
  };

  // Mount component on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // When video is loaded, update the actual duration
  const handleVideoLoaded = () => {
    if (videoRef.current && videoRef.current.duration) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setEndTime(duration);
    }
    setLoading(false);
  };

  // Effect to monitor changes in videoInfo
  useEffect(() => {
    if (videoInfo && videoInfo.duration) {
      setVideoDuration(videoInfo.duration);
      setEndTime(videoInfo.duration);
    }
  }, [videoInfo]);

  // Effect to reset state when a new video is loaded
  useEffect(() => {
    // Reset processing states and results
    setStartTime(0);
    setEndTime(videoInfo.duration || 0);
    setFormat('mp4');
    setOutputType('video');
    setIsProcessing(false);
    setCurrentTime(0);
    setLoading(true);
    setError('');
    setVideoDuration(videoInfo.duration || 0);
    setProcessedVideoUrl(null);
    setProcessedDownloadUrl(null);
    setProcessedFileName(null);
  }, [videoInfo, filePath]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setProcessedVideoUrl(null);
    setProcessedDownloadUrl(null);
    setProcessedFileName(null);

    try {
      // Format times as HH:MM:SS strings for the API
      const formattedStartTime = formatTimeForApi(startTime);
      const formattedEndTime = formatTimeForApi(endTime);

      const cutOptions: CutOptions = {
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        format,
      };

      // Extract the videoId directly
      const videoId =
        typeof filePath === 'string'
          ? filePath.split('/').pop()?.split('.')[0] || filePath
          : filePath;

      let response;

      if (outputType === 'audio') {
        // Use the API for MP3 conversion
        response = await fetch(
          `${BACKEND_URL}/api/videos/mp3/${videoId}?startTime=${formattedStartTime}&endTime=${formattedEndTime}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Use the dedicated backend endpoint for video cutting
        response = await fetch(`${BACKEND_URL}/api/videos/cut/${videoId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cutOptions,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();

        // Try to extract detailed error messages
        let errorMessage = errorData.error || errorData.message || 'Failed to process the video';

        // Check if there are validation details
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details
            .map((detail: any) => detail.msg || detail.message)
            .filter(Boolean)
            .join('; ');

          if (validationErrors) {
            errorMessage += `: ${validationErrors}`;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      let streamUrl = '';
      let downloadUrl = '';
      let fileName = '';

      // If it's an MP3 response, trigger the download automatically
      if (outputType === 'audio' && data.success && data.data && data.data.downloadUrl) {
        const fullDownloadUrl = `${BACKEND_URL}${data.data.downloadUrl}`;
        // Trigger automatic download
        const link = document.createElement('a');
        link.href = fullDownloadUrl;
        link.download = data.data.outputPath.split('/').pop() || 'audio.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // We still need to configure the variables for the rest of the function
        downloadUrl = fullDownloadUrl;
        streamUrl = fullDownloadUrl; // MP3 doesn't have separate streaming
        fileName = data.data.outputPath.split('/').pop() || 'audio.mp3';
      }
      // The response format is { data: { streamUrl, downloadUrl } }
      else if (data.data && data.data.streamUrl) {
        // Remove "undefined/" from the path, if it exists
        const cleanStreamUrl = data.data.streamUrl.replace('/undefined/', '/');
        const cleanDownloadUrl = data.data.downloadUrl.replace('/undefined/', '/');

        streamUrl = `${BACKEND_URL}${cleanStreamUrl}`;
        downloadUrl = `${BACKEND_URL}${cleanDownloadUrl}`;
        fileName = cleanStreamUrl.split('/').pop() || `video_${videoId}.${format}`;
      } else {
        setError('Unexpected response format from server');
        console.error('Unexpected response format:', data);
        return;
      }

      // Store the processed video URL and filename
      setProcessedVideoUrl(streamUrl);
      setProcessedDownloadUrl(downloadUrl);
      setProcessedFileName(fileName);

      // Call the callback function with the download URL, not the streaming URL
      onCutComplete(downloadUrl, outputType);
    } catch (error) {
      console.error('Video cutting error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleRangeChange = (start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  };

  // Extract the videoId from the path
  const videoId =
    typeof filePath === 'string' ? filePath.split('/').pop()?.split('.')[0] || filePath : filePath;

  // Use only the videoId for stream as recommended
  // const videoSrc = `${BACKEND_URL}/api/videos/stream/${encodeURIComponent(videoId)}`;

  // If not mounted yet, return an empty div with similar structure
  if (!mounted) {
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        style={{ visibility: 'hidden' }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{t('title')}</h2>
        <p className="text-indigo-100 mt-1">{videoInfo.title}</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {processedVideoUrl ? (
          <div className="mb-6">
            <div className="text-lg font-medium text-gray-900 mb-2">
              {outputType === 'audio' ? t('processedAudio') : t('processedVideo')}
            </div>

            {outputType === 'audio' ? (
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="text-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">{processedFileName}</h3>
                </div>

                <audio className="w-full" src={processedVideoUrl} controls autoPlay />

                <p className="text-sm text-gray-500 mt-2 text-center">{t('mp3SuccessMessage')}</p>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-4">
                <PlayerStreamingChunks
                  videoId={extractVideoIdFromUrl(processedVideoUrl || '')}
                  backendUrl={BACKEND_URL}
                  onLoaded={() => {}}
                  onTimeUpdate={() => {}}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-3">
              {outputType === 'audio' ? (
                <a
                  href={processedDownloadUrl || '#'}
                  download={processedFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {commonT('downloadMP3')}
                </a>
              ) : (
                <>
                  <a
                    href={processedVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    {t('openInWindow')}
                  </a>

                  <a
                    href={processedDownloadUrl || '#'}
                    download={processedFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t('downloadDirectly')}
                  </a>
                </>
              )}

              <button
                onClick={() => {
                  setProcessedVideoUrl(null);
                  setProcessedDownloadUrl(null);
                  setProcessedFileName(null);
                }}
                className="py-2 px-4 bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                {t('returnToEditing')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-6">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="animate-spin h-10 w-10 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              <CustomPlayer
                videoId={videoId}
                backendUrl={BACKEND_URL}
                onLoaded={handleVideoLoaded}
                onTimeUpdate={handleTimeUpdate}
                ref={videoRef}
                useStreamingMode={true}
              />
              {/* Usar o PlayerStreamingChunks para streaming em chunks */}
              {/* <PlayerStreamingChunks
                videoId={videoId}
                backendUrl={BACKEND_URL}
                onLoaded={handleVideoLoaded}
                onTimeUpdate={handleTimeUpdate}
              /> */}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="text-sm text-gray-700 font-medium mb-2">{t('selectSegment')}</div>

                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-gray-500">
                    {t('currentTime')}: {formatTime(currentTime)}
                  </span>
                  <span className="text-gray-500">
                    {t('totalDuration')}: {formatTime(videoDuration)}
                  </span>
                </div>

                <RangeSlider
                  min={0}
                  max={videoDuration}
                  startValue={startTime}
                  endValue={endTime}
                  step={0.1}
                  disabled={isProcessing}
                  formatValue={formatTime}
                  onChange={handleRangeChange}
                />

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    type="button"
                    className="py-1 px-3 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 flex items-center transition-colors"
                    onClick={() => {
                      if (videoRef.current) {
                        setStartTime(videoRef.current.currentTime);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t('markStart')}
                  </button>
                  <button
                    type="button"
                    className="py-1 px-3 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 flex items-center transition-colors"
                    onClick={() => {
                      if (videoRef.current) {
                        setEndTime(videoRef.current.currentTime);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t('markEnd')}
                  </button>
                </div>
              </div>

              <div className="mb-6 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-indigo-800">
                      {t('fullVideoDownloadTitle')}
                    </h3>
                    <p className="text-xs text-indigo-600 mt-1">{t('fullVideoDownloadSubtitle')}</p>
                  </div>
                  <a
                    href={`${BACKEND_URL}/api/videos/download/${videoId}`}
                    download
                    className="flex items-center py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t('downloadFull')}
                  </a>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('outputType')}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="outputType"
                        value="video"
                        checked={outputType === 'video'}
                        onChange={() => setOutputType('video')}
                        disabled={isProcessing}
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('videoOption')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="outputType"
                        value="audio"
                        checked={outputType === 'audio'}
                        onChange={() => setOutputType('audio')}
                        disabled={isProcessing}
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('audioOption')}</span>
                    </label>
                  </div>
                </div>

                {outputType === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('videoFormat')}
                    </label>
                    <div className="relative">
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={isProcessing}
                      >
                        <option value="mp4">{t('mp4Option')}</option>
                        <option value="webm">{t('webmOption')}</option>
                        <option value="mkv">{t('mkvOption')}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('processing')}
                  </div>
                ) : outputType === 'audio' ? (
                  t('extractMp3Button')
                ) : (
                  t('cutVideoButton')
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
