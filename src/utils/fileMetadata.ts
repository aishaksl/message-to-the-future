import { getMetadata } from 'firebase/storage';
import { ref } from 'firebase/storage';
import { storage } from '@/firebase/config';

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  md5Hash?: string;
  cacheControl?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  contentLanguage?: string;
  customMetadata?: Record<string, string>;
}

export interface ImageMetadata extends FileMetadata {
  width?: number;
  height?: number;
  orientation?: number;
  camera?: {
    make?: string;
    model?: string;
    software?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  dateTime?: {
    original?: string;
    digitized?: string;
    modified?: string;
  };
  exposure?: {
    time?: string;
    fNumber?: string;
    iso?: number;
    flash?: boolean;
  };
}

export interface VideoMetadata extends FileMetadata {
  duration?: number;
  width?: number;
  height?: number;
  frameRate?: number;
  bitrate?: number;
  codec?: string;
  creationTime?: string;
}

export interface AudioMetadata extends FileMetadata {
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string;
}

/**
 * Get basic metadata from Firebase Storage
 */
export async function getStorageFileMetadata(filePath: string): Promise<FileMetadata> {
  try {
    const fileRef = ref(storage, filePath);
    const metadata = await getMetadata(fileRef);
    
    return {
      name: metadata.name,
      size: metadata.size,
      contentType: metadata.contentType || 'application/octet-stream',
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
      md5Hash: metadata.md5Hash,
      cacheControl: metadata.cacheControl,
      contentDisposition: metadata.contentDisposition,
      contentEncoding: metadata.contentEncoding,
      contentLanguage: metadata.contentLanguage,
      customMetadata: metadata.customMetadata,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error(`Failed to get metadata for file: ${filePath}`);
  }
}

/**
 * Extract EXIF data from image files
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const dataView = new DataView(arrayBuffer);
        
        const metadata: ImageMetadata = {
          name: file.name,
          size: file.size,
          contentType: file.type,
          timeCreated: new Date().toISOString(),
          updated: new Date().toISOString(),
        };

        // Check for JPEG EXIF data
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          const exifData = extractJPEGExif(dataView);
          Object.assign(metadata, exifData);
        }

        // For other image types, try to get basic dimensions
        const img = new Image();
        img.onload = () => {
          metadata.width = img.width;
          metadata.height = img.height;
          resolve(metadata);
        };
        img.onerror = () => resolve(metadata);
        img.src = URL.createObjectURL(file);
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract metadata from video files
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const metadata: VideoMetadata = {
        name: file.name,
        size: file.size,
        contentType: file.type,
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = url;
  });
}

/**
 * Extract metadata from audio files
 */
export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      const metadata: AudioMetadata = {
        name: file.name,
        size: file.size,
        contentType: file.type,
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        duration: audio.duration,
      };
      
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio metadata'));
    };
    
    audio.src = url;
  });
}

/**
 * Extract metadata based on file type
 */
export async function extractFileMetadata(file: File): Promise<FileMetadata | ImageMetadata | VideoMetadata | AudioMetadata> {
  const fileType = file.type.toLowerCase();
  
  if (fileType.startsWith('image/')) {
    return extractImageMetadata(file);
  } else if (fileType.startsWith('video/')) {
    return extractVideoMetadata(file);
  } else if (fileType.startsWith('audio/')) {
    return extractAudioMetadata(file);
  } else {
    // Return basic file metadata
    return {
      name: file.name,
      size: file.size,
      contentType: file.type,
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
  }
}

/**
 * Extract JPEG EXIF data (simplified implementation)
 */
function extractJPEGExif(dataView: DataView): Partial<ImageMetadata> {
  const metadata: Partial<ImageMetadata> = {};
  
  try {
    // Check for JPEG signature
    if (dataView.getUint16(0) !== 0xFFD8) {
      return metadata;
    }
    
    let offset = 2;
    
    // Look for EXIF marker (0xFFE1)
    while (offset < dataView.byteLength - 4) {
      const marker = dataView.getUint16(offset);
      
      if (marker === 0xFFE1) {
        const length = dataView.getUint16(offset + 2);
        const exifHeader = dataView.getUint32(offset + 4);
        
        // Check for "Exif" header
        if (exifHeader === 0x45786966) {
          // Basic EXIF parsing would go here
          // This is a simplified implementation
          // For full EXIF support, consider using a library like exif-js
          break;
        }
      }
      
      if (marker === 0xFFDA) break; // Start of scan
      
      const segmentLength = dataView.getUint16(offset + 2);
      offset += 2 + segmentLength;
    }
  } catch (error) {
    console.warn('Error parsing EXIF data:', error);
  }
  
  return metadata;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Get file type category
 */
export function getFileCategory(contentType: string): 'image' | 'video' | 'audio' | 'document' | 'other' {
  const type = contentType.toLowerCase();
  
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
  
  return 'other';
}