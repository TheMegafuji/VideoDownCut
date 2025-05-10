export default {
  common: {
    download: 'Download',
    downloadVideo: 'Download Video',
    downloadOriginalVideo: 'Download Original Video',
    downloadMP3: 'Download MP3',
    processing: 'Processing...',
    error: 'An error occurred',
    success: 'Success',
    retry: 'Retry',
    videoLoadError: 'Error loading video. The connection might be unstable.',
  },
  home: {
    title: 'Download and Cut Your Videos',
    subtitle: 'Online tool for downloading and editing videos from any platform',
  },
  videoForm: {
    title: 'Download Video',
    subtitle: 'Paste the video URL below to get started',
    urlLabel: 'Video URL',
    urlPlaceholder: 'https://www.youtube.com/watch?v=example',
    supportedPlatforms: 'Supports YouTube, Vimeo, Twitter, and many other platforms.',
    invalidUrl: 'Please enter a valid URL',
    downloadFailure: 'Failed to download the video',
    unexpectedError: 'An unexpected error occurred',
  },
  videoStatus: {
    downloading: 'Downloading video from {url}',
    downloadComplete: 'Download completed successfully!',
    incompleteResponse: 'Incomplete server response. Check the console for details.',
  },
  originalVideo: {
    title: 'Original Video',
    subtitle: 'Download the complete video without editing',
  },
  processedMedia: {
    videoReady: 'Your video is ready!',
    videoProcessed: 'The video has been cut successfully and is ready for download.',
    audioReady: 'Your audio is ready!',
    audioProcessed: 'The MP3 has been extracted successfully and is ready for download.',
  },
  navigation: {
    backToHome: '← Back to Home',
  },
  footer: {
    termsLink: 'Terms of Use',
    privacyLink: 'Privacy Policy',
    disclaimer:
      'This tool should only be used for content you own rights to or that is in the public domain. We are not responsible for misuse that violates copyright or platform terms of service.',
    copyright: '© {year} VideoDownCut -',
    licensedUnder: ' Licensed under ',
    mitLicense: 'MIT License',
  },
  cutControls: {
    title: 'Cut Video',
    selectSegment: 'Select the video segment to cut:',
    currentTime: 'Current time:',
    totalDuration: 'Total duration:',
    markStart: 'Mark Start',
    markEnd: 'Mark End',
    fullVideoDownloadTitle: 'Download full video',
    fullVideoDownloadSubtitle: 'Prefer the original video without edits? Download the full file.',
    downloadFull: 'Download Full',
    outputType: 'Output Type',
    videoOption: 'Video',
    audioOption: 'Audio (MP3)',
    videoFormat: 'Video Format',
    mp4Option: 'MP4 - Most compatible format',
    webmOption: 'WebM - Best for web',
    mkvOption: 'MKV - Highest quality',
    processing: 'Processing...',
    cutVideoButton: 'Cut Video',
    extractMp3Button: 'Extract MP3',
    processedVideo: 'Processed Video:',
    processedAudio: 'Processed Audio:',
    mp3SuccessMessage:
      'Your MP3 file was extracted successfully! You can play above or download directly.',
    openInWindow: 'Open in New Window',
    downloadDirectly: 'Download Directly',
    returnToEditing: 'Return to Editing',
  },
  terms: {
    title: 'Terms of Use',
    intro: 'By using VideoDownCut, you agree to the following terms and conditions:',
    contentOwnership: {
      title: '1. Content Ownership',
      text: 'You must only download and modify videos that you have the legal rights to access and modify, or those that are in the public domain. VideoDownCut is not responsible for any copyright infringement resulting from your use of the service.',
    },
    usageLimitations: {
      title: '2. Usage Limitations',
      text: 'VideoDownCut is provided "as is" without warranty of any kind. The service may have usage limitations based on server capacity, and we reserve the right to modify or discontinue the service at any time without notice.',
    },
    prohibitedActivities: {
      title: '3. Prohibited Activities',
      text: 'You may not use VideoDownCut for any illegal purposes or to download content that violates the terms of service of the source platforms. We do not store videos permanently on our servers - all processed videos are temporarily stored and automatically deleted after a short period.',
    },
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy describes how VideoDownCut collects, uses, and protects the information you provide when using our service.',
    infoCollection: {
      title: '1. Information Collection',
      text: 'When using VideoDownCut, we only collect the minimum information necessary to provide our service, which includes:',
      items: [
        'The URLs of videos you submit for downloading/processing',
        'Temporary video files during processing',
        'Standard server logs including IP addresses and browser information',
      ],
    },
    infoUsage: {
      title: '2. Information Usage',
      text: 'The information we collect is used exclusively to:',
      items: [
        'Process your video requests',
        'Improve our service functionality',
        'Troubleshoot technical issues',
      ],
      additional:
        'We do not share your personal information with third parties. All video files are automatically deleted from our servers shortly after processing.',
    },
    cookies: {
      title: '3. Cookies and Tracking',
      text: 'VideoDownCut uses minimal cookies for essential functionality only. We do not use tracking cookies or analytics that identify individual users.',
    },
  },
};
