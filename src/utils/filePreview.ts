// File preview and thumbnail generation utilities

// Generate thumbnail for video files
export const generateVideoThumbnail = (
  file: File,
  timeOffset: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.addEventListener('loadeddata', () => {
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to specified time or 1/4 of video duration
      video.currentTime = Math.min(timeOffset, video.duration / 4);
    });

    video.addEventListener('seeked', () => {
      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
      } catch (error) {
        reject(error);
      } finally {
        // Clean up
        URL.revokeObjectURL(video.src);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    });

    // Set video source
    video.src = URL.createObjectURL(file);
  });
};

// Generate thumbnail for image files with resizing
export const generateImageThumbnail = (
  file: File,
  maxWidth: number = 300,
  maxHeight: number = 300,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const thumbnailUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(thumbnailUrl);
      } catch (error) {
        reject(error);
      } finally {
        // Clean up
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    // Set image source
    img.src = URL.createObjectURL(file);
  });
};

// Generate audio waveform visualization
export const generateAudioWaveform = (
  file: File,
  width: number = 300,
  height: number = 100
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const data = audioBuffer.getChannelData(0);
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        // Clear canvas
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);

        // Draw waveform
        ctx.fillStyle = '#3b82f6';
        for (let i = 0; i < width; i++) {
          let min = 1.0;
          let max = -1.0;
          
          for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }
          
          const barHeight = (max - min) * amp;
          ctx.fillRect(i, amp - (barHeight / 2), 1, barHeight);
        }

        const waveformUrl = canvas.toDataURL('image/png');
        resolve(waveformUrl);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read audio file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Get file preview URL based on file type
export const getFilePreview = async (
  file: File,
  options: {
    thumbnailSize?: { width: number; height: number };
    quality?: number;
    videoTimeOffset?: number;
  } = {}
): Promise<string> => {
  const { 
    thumbnailSize = { width: 300, height: 300 },
    quality = 0.8,
    videoTimeOffset = 1
  } = options;

  if (file.type.startsWith('image/')) {
    return generateImageThumbnail(file, thumbnailSize.width, thumbnailSize.height, quality);
  } else if (file.type.startsWith('video/')) {
    return generateVideoThumbnail(file, videoTimeOffset);
  } else if (file.type.startsWith('audio/')) {
    return generateAudioWaveform(file, thumbnailSize.width, thumbnailSize.height);
  } else {
    // For other file types, return a default icon or file info
    return Promise.resolve('data:image/svg+xml;base64,' + btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#e5e7eb"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="#6b7280">
          ${file.type.split('/')[1]?.toUpperCase() || 'FILE'}
        </text>
      </svg>
    `));
  }
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type icon
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('text')) return '📝';
  return '📁';
};