import { ref, getMetadata, listAll, StorageReference, FullMetadata } from 'firebase/storage';
import { storage } from '@/firebase/config';
import { getStorageFileMetadata, formatFileSize, getFileCategory } from './fileMetadata';

export interface StorageUsageStats {
  totalFiles: number;
  totalSize: number;
  filesByType: {
    images: number;
    videos: number;
    audios: number;
    documents: number;
    others: number;
  };
  sizeByType: {
    images: number;
    videos: number;
    audios: number;
    documents: number;
    others: number;
  };
  averageFileSize: number;
  largestFile: {
    name: string;
    size: number;
    path: string;
  } | null;
  oldestFile: {
    name: string;
    created: string;
    path: string;
  } | null;
  newestFile: {
    name: string;
    created: string;
    path: string;
  } | null;
}

export interface UploadMetrics {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  successRate: number;
  averageUploadTime: number;
  totalUploadSize: number;
}

export interface DownloadMetrics {
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  successRate: number;
  averageDownloadTime: number;
  totalDownloadSize: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  recentErrors: Array<{
    timestamp: string;
    error: string;
    operation: 'upload' | 'download' | 'delete' | 'metadata';
    fileName?: string;
  }>;
}

export interface StorageAnalytics {
  usage: StorageUsageStats;
  uploads: UploadMetrics;
  downloads: DownloadMetrics;
  errors: ErrorMetrics;
  lastUpdated: string;
}

// Local storage keys for metrics
const STORAGE_KEYS = {
  UPLOAD_METRICS: 'firebase_storage_upload_metrics',
  DOWNLOAD_METRICS: 'firebase_storage_download_metrics',
  ERROR_METRICS: 'firebase_storage_error_metrics',
  ANALYTICS_CACHE: 'firebase_storage_analytics_cache'
};

/**
 * Get comprehensive storage usage statistics for a user
 */
export async function getUserStorageStats(userId: string): Promise<StorageUsageStats> {
  try {
    const userRef = ref(storage, `messages/${userId}`);
    const result = await listAll(userRef);
    
    const stats: StorageUsageStats = {
      totalFiles: 0,
      totalSize: 0,
      filesByType: {
        images: 0,
        videos: 0,
        audios: 0,
        documents: 0,
        others: 0
      },
      sizeByType: {
        images: 0,
        videos: 0,
        audios: 0,
        documents: 0,
        others: 0
      },
      averageFileSize: 0,
      largestFile: null,
      oldestFile: null,
      newestFile: null
    };

    // Process all files recursively
    const allFiles: Array<{ ref: StorageReference; metadata: FullMetadata }> = [];
    
    // Get files from all subdirectories
    for (const folderRef of result.prefixes) {
      const folderResult = await listAll(folderRef);
      for (const fileRef of folderResult.items) {
        try {
          const metadata = await getMetadata(fileRef);
          allFiles.push({ ref: fileRef, metadata });
        } catch (error) {
          console.warn(`Failed to get metadata for ${fileRef.fullPath}:`, error);
        }
      }
    }

    // Process direct files in user directory
    for (const fileRef of result.items) {
      try {
        const metadata = await getMetadata(fileRef);
        allFiles.push({ ref: fileRef, metadata });
      } catch (error) {
        console.warn(`Failed to get metadata for ${fileRef.fullPath}:`, error);
      }
    }

    // Analyze all files
    for (const { ref: fileRef, metadata } of allFiles) {
      const category = getFileCategory(metadata.contentType || '');
      const size = metadata.size || 0;
      const created = metadata.timeCreated;

      stats.totalFiles++;
      stats.totalSize += size;

      // Count by type
      switch (category) {
        case 'image':
          stats.filesByType.images++;
          stats.sizeByType.images += size;
          break;
        case 'video':
          stats.filesByType.videos++;
          stats.sizeByType.videos += size;
          break;
        case 'audio':
          stats.filesByType.audios++;
          stats.sizeByType.audios += size;
          break;
        case 'document':
          stats.filesByType.documents++;
          stats.sizeByType.documents += size;
          break;
        default:
          stats.filesByType.others++;
          stats.sizeByType.others += size;
      }

      // Track largest file
      if (!stats.largestFile || size > stats.largestFile.size) {
        stats.largestFile = {
          name: metadata.name,
          size,
          path: fileRef.fullPath
        };
      }

      // Track oldest file
      if (!stats.oldestFile || created < stats.oldestFile.created) {
        stats.oldestFile = {
          name: metadata.name,
          created,
          path: fileRef.fullPath
        };
      }

      // Track newest file
      if (!stats.newestFile || created > stats.newestFile.created) {
        stats.newestFile = {
          name: metadata.name,
          created,
          path: fileRef.fullPath
        };
      }
    }

    // Calculate average file size
    stats.averageFileSize = stats.totalFiles > 0 ? stats.totalSize / stats.totalFiles : 0;

    return stats;
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw new Error('Failed to get storage statistics');
  }
}

/**
 * Track upload metrics
 */
export function trackUpload(fileName: string, fileSize: number, startTime: number, success: boolean, error?: string) {
  try {
    const endTime = Date.now();
    const uploadTime = endTime - startTime;
    
    const stored = localStorage.getItem(STORAGE_KEYS.UPLOAD_METRICS);
    const metrics: UploadMetrics = stored ? JSON.parse(stored) : {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      successRate: 0,
      averageUploadTime: 0,
      totalUploadSize: 0
    };

    metrics.totalUploads++;
    metrics.totalUploadSize += fileSize;
    
    if (success) {
      metrics.successfulUploads++;
    } else {
      metrics.failedUploads++;
      if (error) {
        trackError('upload', error, fileName);
      }
    }

    metrics.successRate = (metrics.successfulUploads / metrics.totalUploads) * 100;
    metrics.averageUploadTime = ((metrics.averageUploadTime * (metrics.totalUploads - 1)) + uploadTime) / metrics.totalUploads;

    localStorage.setItem(STORAGE_KEYS.UPLOAD_METRICS, JSON.stringify(metrics));
  } catch (error) {
    console.warn('Failed to track upload metrics:', error);
  }
}

/**
 * Track download metrics
 */
export function trackDownload(fileName: string, fileSize: number, startTime: number, success: boolean, error?: string) {
  try {
    const endTime = Date.now();
    const downloadTime = endTime - startTime;
    
    const stored = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_METRICS);
    const metrics: DownloadMetrics = stored ? JSON.parse(stored) : {
      totalDownloads: 0,
      successfulDownloads: 0,
      failedDownloads: 0,
      successRate: 0,
      averageDownloadTime: 0,
      totalDownloadSize: 0
    };

    metrics.totalDownloads++;
    metrics.totalDownloadSize += fileSize;
    
    if (success) {
      metrics.successfulDownloads++;
    } else {
      metrics.failedDownloads++;
      if (error) {
        trackError('download', error, fileName);
      }
    }

    metrics.successRate = (metrics.successfulDownloads / metrics.totalDownloads) * 100;
    metrics.averageDownloadTime = ((metrics.averageDownloadTime * (metrics.totalDownloads - 1)) + downloadTime) / metrics.totalDownloads;

    localStorage.setItem(STORAGE_KEYS.DOWNLOAD_METRICS, JSON.stringify(metrics));
  } catch (error) {
    console.warn('Failed to track download metrics:', error);
  }
}

/**
 * Track errors
 */
export function trackError(operation: 'upload' | 'download' | 'delete' | 'metadata', error: string, fileName?: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ERROR_METRICS);
    const metrics: ErrorMetrics = stored ? JSON.parse(stored) : {
      totalErrors: 0,
      errorsByType: {},
      recentErrors: []
    };

    metrics.totalErrors++;
    metrics.errorsByType[operation] = (metrics.errorsByType[operation] || 0) + 1;
    
    metrics.recentErrors.unshift({
      timestamp: new Date().toISOString(),
      error,
      operation,
      fileName
    });

    // Keep only last 50 errors
    if (metrics.recentErrors.length > 50) {
      metrics.recentErrors = metrics.recentErrors.slice(0, 50);
    }

    localStorage.setItem(STORAGE_KEYS.ERROR_METRICS, JSON.stringify(metrics));
  } catch (error) {
    console.warn('Failed to track error metrics:', error);
  }
}

/**
 * Get upload metrics
 */
export function getUploadMetrics(): UploadMetrics {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.UPLOAD_METRICS);
    return stored ? JSON.parse(stored) : {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      successRate: 0,
      averageUploadTime: 0,
      totalUploadSize: 0
    };
  } catch (error) {
    console.warn('Failed to get upload metrics:', error);
    return {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      successRate: 0,
      averageUploadTime: 0,
      totalUploadSize: 0
    };
  }
}

/**
 * Get download metrics
 */
export function getDownloadMetrics(): DownloadMetrics {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_METRICS);
    return stored ? JSON.parse(stored) : {
      totalDownloads: 0,
      successfulDownloads: 0,
      failedDownloads: 0,
      successRate: 0,
      averageDownloadTime: 0,
      totalDownloadSize: 0
    };
  } catch (error) {
    console.warn('Failed to get download metrics:', error);
    return {
      totalDownloads: 0,
      successfulDownloads: 0,
      failedDownloads: 0,
      successRate: 0,
      averageDownloadTime: 0,
      totalDownloadSize: 0
    };
  }
}

/**
 * Get error metrics
 */
export function getErrorMetrics(): ErrorMetrics {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ERROR_METRICS);
    return stored ? JSON.parse(stored) : {
      totalErrors: 0,
      errorsByType: {},
      recentErrors: []
    };
  } catch (error) {
    console.warn('Failed to get error metrics:', error);
    return {
      totalErrors: 0,
      errorsByType: {},
      recentErrors: []
    };
  }
}

/**
 * Get comprehensive storage analytics
 */
export async function getStorageAnalytics(userId: string, useCache: boolean = true): Promise<StorageAnalytics> {
  try {
    // Check cache first
    if (useCache) {
      const cached = localStorage.getItem(STORAGE_KEYS.ANALYTICS_CACHE);
      if (cached) {
        const cachedData = JSON.parse(cached);
        const cacheAge = Date.now() - new Date(cachedData.lastUpdated).getTime();
        // Use cache if less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          return cachedData;
        }
      }
    }

    const [usage, uploads, downloads, errors] = await Promise.all([
      getUserStorageStats(userId),
      Promise.resolve(getUploadMetrics()),
      Promise.resolve(getDownloadMetrics()),
      Promise.resolve(getErrorMetrics())
    ]);

    const analytics: StorageAnalytics = {
      usage,
      uploads,
      downloads,
      errors,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CACHE, JSON.stringify(analytics));

    return analytics;
  } catch (error) {
    console.error('Error getting storage analytics:', error);
    throw new Error('Failed to get storage analytics');
  }
}

/**
 * Clear all metrics
 */
export function clearMetrics() {
  try {
    localStorage.removeItem(STORAGE_KEYS.UPLOAD_METRICS);
    localStorage.removeItem(STORAGE_KEYS.DOWNLOAD_METRICS);
    localStorage.removeItem(STORAGE_KEYS.ERROR_METRICS);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS_CACHE);
  } catch (error) {
    console.warn('Failed to clear metrics:', error);
  }
}

/**
 * Format metrics for display
 */
export function formatMetricsForDisplay(analytics: StorageAnalytics) {
  return {
    usage: {
      totalFiles: analytics.usage.totalFiles.toLocaleString(),
      totalSize: formatFileSize(analytics.usage.totalSize),
      averageFileSize: formatFileSize(analytics.usage.averageFileSize),
      largestFile: analytics.usage.largestFile ? {
        ...analytics.usage.largestFile,
        size: formatFileSize(analytics.usage.largestFile.size)
      } : null
    },
    uploads: {
      ...analytics.uploads,
      successRate: `${analytics.uploads.successRate.toFixed(1)}%`,
      averageUploadTime: `${(analytics.uploads.averageUploadTime / 1000).toFixed(1)}s`,
      totalUploadSize: formatFileSize(analytics.uploads.totalUploadSize)
    },
    downloads: {
      ...analytics.downloads,
      successRate: `${analytics.downloads.successRate.toFixed(1)}%`,
      averageDownloadTime: `${(analytics.downloads.averageDownloadTime / 1000).toFixed(1)}s`,
      totalDownloadSize: formatFileSize(analytics.downloads.totalDownloadSize)
    },
    errors: analytics.errors
  };
}