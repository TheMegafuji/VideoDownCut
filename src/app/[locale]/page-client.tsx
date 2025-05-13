'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import VideoForm from '@/components/VideoForm';
import Loading from '@/components/Loading';
import CutControls from '@/components/CutControls';
import { DownloadStatus } from '@/lib/types';

export default function HomeClient() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    status: 'idle',
    message: '',
    videoInfo: null,
    downloadedPath: '',
    downloadUrl: '',
    sourceUrl: '',
  });
  const [showCutControls, setShowCutControls] = useState(false);

  // Fix hydration issues by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadComplete = (data: any) => {
    // Check if we received the necessary data
    if (!data.videoInfo) {
      console.error('Error: videoInfo not found in response', data);
      setDownloadStatus({
        status: 'error',
        message: t('videoStatus.incompleteResponse'),
        videoInfo: null,
        downloadedPath: '',
        downloadUrl: '',
        sourceUrl: downloadStatus.sourceUrl,
      });
      return;
    }

    setDownloadStatus({
      status: 'success',
      message: t('videoStatus.downloadComplete'),
      videoInfo: data.videoInfo,
      downloadedPath: data.filePath,
      downloadUrl: data.downloadUrl || '',
      sourceUrl: downloadStatus.sourceUrl,
      originalVideo: true,
    });

    setShowCutControls(true);
  };

  const handleDownloadStart = (url: string) => {
    // Reset the interface state when a new video is loaded
    setDownloadStatus({
      status: 'loading',
      message: t('videoStatus.downloading', { url }),
      videoInfo: null,
      downloadedPath: '',
      downloadUrl: '',
      sourceUrl: url,
    });

    // Reset the cut controls when a new video is loaded
    setShowCutControls(false);
  };

  // If not mounted yet, return an empty div with similar structure
  if (!mounted) {
    return (
      <div className="space-y-8" style={{ visibility: 'hidden' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('home.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
          <VideoForm
            onDownloadStart={(url) => handleDownloadStart(url)}
            onDownloadComplete={handleDownloadComplete}
            onError={(error) =>
              setDownloadStatus({ ...downloadStatus, status: 'error', message: error })
            }
          />
        </div>

        {downloadStatus.status === 'loading' && (
          <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
            <Loading message={downloadStatus.message} />
          </div>
        )}

        {showCutControls && downloadStatus.videoInfo && (
          <>
            <div className="col-span-1">
              {downloadStatus.downloadUrl && downloadStatus.originalVideo && (
                <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">{t('originalVideo.title')}</h2>
                    <p className="text-blue-100 mt-1">{t('originalVideo.subtitle')}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-center">
                      <a
                        href={downloadStatus.downloadUrl}
                        download
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="-ml-1 mr-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t('common.downloadOriginalVideo')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <CutControls
                videoInfo={downloadStatus.videoInfo}
                filePath={downloadStatus.downloadedPath}
                onCutComplete={(downloadUrl, outputType) => {
                  setDownloadStatus({
                    ...downloadStatus,
                    downloadUrl,
                    outputType: outputType || 'video',
                    originalVideo: false,
                  });
                }}
              />
            </div>
          </>
        )}

        {downloadStatus.status === 'error' && (
          <div className="col-span-1 bg-red-50 border border-red-200 rounded-lg p-4">
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
                <h3 className="text-sm font-medium text-red-800">{t('common.error')}</h3>
                <p className="mt-2 text-sm text-red-700">{downloadStatus.message}</p>
              </div>
            </div>
          </div>
        )}

        {downloadStatus.downloadUrl && (
          <div className="col-span-1 bg-green-50 border border-green-200 rounded-lg shadow overflow-hidden">
            <div className="p-6 flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {downloadStatus.outputType === 'audio' ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {t('processedMedia.audioReady')}
                  </h2>
                  <p className="text-gray-600 mb-6 text-center">
                    {t('processedMedia.audioProcessed')}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {t('processedMedia.videoReady')}
                  </h2>
                  <p className="text-gray-600 mb-6 text-center">
                    {t('processedMedia.videoProcessed')}
                  </p>
                </>
              )}
              <a
                href={downloadStatus.downloadUrl}
                download
                data-ngrok-skip-browser-warning="true"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {downloadStatus.outputType === 'audio'
                  ? t('common.downloadMP3')
                  : t('common.downloadVideo')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
