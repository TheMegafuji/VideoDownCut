'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslations } from 'next-intl';

interface DirectUrlPlayerProps {
  url: string;
  onLoaded?: () => void;
  onTimeUpdate?: () => void;
}

const DirectUrlPlayer = forwardRef<HTMLVideoElement, DirectUrlPlayerProps>(
  ({ url, onLoaded, onTimeUpdate }, ref) => {
    const t = useTranslations('common');
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 2;

    // Forward the internal ref to the parent component
    useImperativeHandle(ref, () => internalVideoRef.current as HTMLVideoElement);

    // Dedicated ref to track if component is mounted to prevent state updates after unmount
    const isMounted = useRef(true);

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    // Use fetch with proper headers and create a blob URL
    useEffect(() => {
      if (!url) return;

      const controller = new AbortController();
      const signal = controller.signal;

      const loadVideo = async () => {
        try {
          if (!isMounted.current) return;
          setLoading(true);
          setError(null);

          // Add a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const urlWithTimestamp = `${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;

          // Fetch the video with specific headers to bypass ngrok warning
          const response = await fetch(urlWithTimestamp, {
            method: 'GET',
            headers: {
              // This header bypasses the ngrok warning page
              'ngrok-skip-browser-warning': 'true',
              // Other important headers
              Range: 'bytes=0-',
              Accept: 'video/mp4,video/*;q=0.9,*/*;q=0.8',
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Error fetching video: ${response.status} ${response.statusText}`);
          }

          // Convert response to blob and create URL
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          if (isMounted.current) {
            setVideoUrl(blobUrl);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error loading video:', err);
          if (isMounted.current) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setLoading(false);
          }
        }
      };

      loadVideo();

      return () => {
        controller.abort();
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
      };
    }, [url, retryCount]);

    const handleRetry = () => {
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
      }
    };

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      console.error('Video error:', e);
      setError(t('videoLoadError') || 'Error loading video');
      setLoading(false);
    };

    const handleVideoLoaded = () => {
      if (onLoaded && internalVideoRef.current) {
        setLoading(false);
        onLoaded();
      }
    };

    const handleTimeUpdate = () => {
      if (onTimeUpdate && internalVideoRef.current) {
        onTimeUpdate();
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 bg-black">
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
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="mb-3">{error}</div>
          {retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {t('retry')}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="video-container">
        {videoUrl && (
          <video
            ref={internalVideoRef}
            src={videoUrl}
            className="w-full h-full object-contain max-h-[70vh]"
            controls
            autoPlay
            onLoadedMetadata={handleVideoLoaded}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            crossOrigin="anonymous"
            playsInline
          />
        )}
      </div>
    );
  }
);

DirectUrlPlayer.displayName = 'DirectUrlPlayer';

export default DirectUrlPlayer;
