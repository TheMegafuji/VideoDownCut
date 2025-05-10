'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslations } from 'next-intl';

interface PlayerStreamingChunksProps {
  videoId: string;
  backendUrl: string;
  onLoaded?: () => void;
  onTimeUpdate?: () => void;
}

const PlayerStreamingChunks = forwardRef<HTMLVideoElement, PlayerStreamingChunksProps>(
  ({ videoId, backendUrl, onLoaded, onTimeUpdate }, ref) => {
    const t = useTranslations('common');
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
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

    useEffect(() => {
      if (!videoId || !internalVideoRef.current) return;

      const controller = new AbortController();

      // Streaming endpoint URL
      const url = `${backendUrl}/api/videos/stream/${videoId}`;

      const setupMediaSource = async () => {
        try {
          if (!isMounted.current) return;
          setLoading(true);
          setError(null);

          // Use MediaSource API for streaming
          const mediaSource = new MediaSource();
          mediaSource.addEventListener('sourceopen', async () => {
            try {
              // Fetch video information (like content type)
              const headResponse = await fetch(url, {
                method: 'HEAD',
                headers: {
                  'Cache-Control': 'no-cache',
                  Pragma: 'no-cache',
                  'ngrok-skip-browser-warning': 'true',
                },
                signal: controller.signal,
              });

              const contentType = headResponse.headers.get('Content-Type') || 'video/mp4';
              const contentLength = parseInt(headResponse.headers.get('Content-Length') || '0', 10);

              if (!contentLength) {
                throw new Error('Content length not available');
              }

              // Create a buffer for the video
              const sourceBuffer = mediaSource.addSourceBuffer(contentType);
              let sourceBufferReady = true;

              // Define the size of each chunk - using a larger chunk size to reduce requests
              const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk instead of 1MB
              let position = 0;

              // Function to download a chunk of the video
              const fetchChunk = async (start: number, end: number) => {
                if (!isMounted.current) return null;
                try {
                  const response = await fetch(url, {
                    headers: {
                      Range: `bytes=${start}-${end}`,
                      'Cache-Control': 'no-cache',
                      Pragma: 'no-cache',
                      Accept: 'video/mp4,video/*;q=0.9,*/*;q=0.8',
                      'ngrok-skip-browser-warning': 'true',
                    },
                    signal: controller.signal,
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  return await response.arrayBuffer();
                } catch (err: any) {
                  if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return null;
                  }
                  console.error('Error fetching chunk:', err);
                  throw err;
                }
              };

              // Wait until the buffer is ready to receive new data
              const waitForSourceBuffer = () => {
                return new Promise<void>((resolve) => {
                  if (sourceBufferReady) {
                    sourceBufferReady = false;
                    resolve();
                  } else {
                    const checkReady = () => {
                      if (sourceBufferReady) {
                        sourceBufferReady = false;
                        resolve();
                      } else {
                        setTimeout(checkReady, 50);
                      }
                    };
                    setTimeout(checkReady, 50);
                  }
                });
              };

              // Function to fetch all chunks
              const fetchChunks = async () => {
                if (!isMounted.current) return;

                try {
                  // Load only first few chunks to start playback quickly
                  const initialChunks = Math.min(3, Math.ceil(contentLength / CHUNK_SIZE));
                  let loadedChunks = 0;

                  // Load initial segments
                  while (position < initialChunks * CHUNK_SIZE && position < contentLength) {
                    const end = Math.min(position + CHUNK_SIZE - 1, contentLength - 1);
                    const data = await fetchChunk(position, end);

                    if (!data || !isMounted.current) return;

                    await waitForSourceBuffer();
                    sourceBuffer.appendBuffer(data);

                    // Update progress
                    const newProgress = Math.round((end / contentLength) * 100);
                    setProgress(newProgress);

                    // Signal buffer ready for more
                    await new Promise<void>((resolve) => {
                      const updateEndHandler = () => {
                        sourceBufferReady = true;
                        sourceBuffer.removeEventListener('updateend', updateEndHandler);
                        resolve();
                      };
                      sourceBuffer.addEventListener('updateend', updateEndHandler);
                    });

                    position = end + 1;
                    loadedChunks++;

                    // Start playback after the first chunk
                    if (loadedChunks === 1 && isMounted.current) {
                      setLoading(false);
                      if (onLoaded && internalVideoRef.current) {
                        onLoaded();
                      }
                    }
                  }

                  // After initial chunks are loaded, start playback and load the rest
                  if (isMounted.current) {
                    setLoading(false);
                    if (onLoaded && internalVideoRef.current) {
                      onLoaded();
                    }

                    // Load remaining chunks in the background
                    while (position < contentLength && isMounted.current) {
                      const end = Math.min(position + CHUNK_SIZE - 1, contentLength - 1);
                      const data = await fetchChunk(position, end);

                      if (!data || !isMounted.current) return;

                      await waitForSourceBuffer();
                      sourceBuffer.appendBuffer(data);

                      // Update progress
                      const newProgress = Math.round((end / contentLength) * 100);
                      setProgress(newProgress);

                      // Signal buffer ready for more
                      await new Promise<void>((resolve) => {
                        const updateEndHandler = () => {
                          sourceBufferReady = true;
                          sourceBuffer.removeEventListener('updateend', updateEndHandler);
                          resolve();
                        };
                        sourceBuffer.addEventListener('updateend', updateEndHandler);
                      });

                      position = end + 1;
                    }

                    // When all chunks have been loaded
                    if (isMounted.current) {
                      mediaSource.endOfStream();
                    }
                  }
                } catch (err) {
                  if (isMounted.current) {
                    const errorMessage =
                      err instanceof Error ? err.message : 'Unknown error loading chunks';
                    console.error('Error loading chunks:', err);
                    setError(errorMessage);
                    setLoading(false);
                  }
                }
              };

              // Start downloading chunks
              fetchChunks();
            } catch (err) {
              if (isMounted.current) {
                const errorMessage =
                  err instanceof Error ? err.message : 'Unknown error during streaming setup';
                console.error('Error during streaming setup:', err);
                setError(errorMessage);
                setLoading(false);
              }
            }
          });

          // Set video source to the MediaSource URL
          const videoUrl = URL.createObjectURL(mediaSource);
          if (internalVideoRef.current) {
            internalVideoRef.current.src = videoUrl;
          }
        } catch (err) {
          if (isMounted.current) {
            const errorMessage =
              err instanceof Error ? err.message : 'Unknown error creating media source';
            console.error('Error creating media source:', err);
            setError(errorMessage);
            setLoading(false);
          }
        }
      };

      setupMediaSource();

      return () => {
        controller.abort();
        if (internalVideoRef.current) {
          internalVideoRef.current.src = '';
        }
      };
    }, [videoId, backendUrl, retryCount, onLoaded]);

    const handleRetry = () => {
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
      }
    };

    const handleTimeUpdate = () => {
      if (onTimeUpdate && internalVideoRef.current) {
        onTimeUpdate();
      }
    };

    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
            <svg
              className="animate-spin h-10 w-10 text-white mb-2"
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
            <div className="text-white text-sm mb-1">
              {t('processing')}: {progress}%
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
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
        )}

        <video
          ref={internalVideoRef}
          className="w-full h-full object-contain max-h-[70vh]"
          controls
          playsInline
          onTimeUpdate={handleTimeUpdate}
          crossOrigin="anonymous"
        />
      </div>
    );
  }
);

PlayerStreamingChunks.displayName = 'PlayerStreamingChunks';

export default PlayerStreamingChunks;
