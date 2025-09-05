import { ref, uploadBytes, getDownloadURL, deleteObject, getBlob, getMetadata } from 'firebase/storage';
import { storage } from './config';
import { 
  extractFileMetadata, 
  getStorageFileMetadata, 
  FileMetadata, 
  ImageMetadata, 
  VideoMetadata, 
  AudioMetadata 
} from '@/utils/fileMetadata';
import { trackUpload, trackDownload, trackError } from '@/utils/storageMonitoring';



// Upload a file to Firebase Storage with size validation
export const uploadFile = async (
  file: File, 
  path: string
): Promise<{ url: string | null; error: string | null }> => {
    const startTime = Date.now();
    
    try {
        // Check file size (60MB limit)
        const maxSize = 60 * 1024 * 1024; // 60MB in bytes
        if (file.size > maxSize) {
            const error = `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 60MB limit`;
            trackUpload(file.name, file.size, startTime, false, error);
            return {
                url: null,
                error
            };
        }

        // Create a reference to the file location
        const storageRef = ref(storage, path);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // DEBUG: Log the generated URL
        console.log('🔍 DEBUG uploadFile - Generated URL:', downloadURL);
        console.log('🔍 DEBUG uploadFile - Is download URL:', downloadURL.includes('firebasestorage.googleapis.com'));
        console.log('🔍 DEBUG uploadFile - File path:', path);

        trackUpload(file.name, file.size, startTime, true);
        return { url: downloadURL, error: null };
    } catch (error: unknown) {
        console.error('Error uploading file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        trackUpload(file.name, file.size, startTime, false, errorMessage);
        return { url: null, error: errorMessage };
    }
};

// Upload multiple files with total size validation
export const uploadMultipleFiles = async (
    files: File[],
    basePath: string
): Promise<{ urls: string[]; errors: string[] }> => {
    const urls: string[] = [];
    const errors: string[] = [];

    // Check total size of all files
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 60 * 1024 * 1024; // 60MB total limit

    if (totalSize > maxTotalSize) {
        return {
            urls: [],
            errors: [`Total file size (${(totalSize / (1024 * 1024)).toFixed(1)}MB) exceeds the 60MB limit`]
        };
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${i}_${file.name}`;
        const filePath = `${basePath}/${fileName}`;

        const result = await uploadFile(file, filePath);

        if (result.url) {
            urls.push(result.url);
        } else {
            errors.push(result.error || 'Unknown error');
        }
    }

    return { urls, errors };
};

// Delete a file from Firebase Storage
export const deleteFile = async (url: string): Promise<{ error: string | null }> => {
    try {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
        return { error: null };
    } catch (error: unknown) {
        console.error('Error deleting file:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Download a file from Firebase Storage
export const downloadFile = async (
    url: string, 
    fileName?: string
): Promise<{ success: boolean; error: string | null }> => {
    const startTime = Date.now();
    const displayName = fileName || 'download';
    
    try {
        const fileRef = ref(storage, url);
        const blob = await getBlob(fileRef);
        
        // Create a download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = displayName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(downloadUrl);
        
        trackDownload(displayName, blob.size, startTime, true);
        return { success: true, error: null };
    } catch (error: unknown) {
        console.error('Error downloading file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        trackDownload(displayName, 0, startTime, false, errorMessage);
        return { success: false, error: errorMessage };
    }
};

// Download multiple files as a ZIP
export const downloadMultipleFiles = async (
    urls: string[], 
    fileNames: string[], 
    zipFileName: string = 'files.zip'
): Promise<{ success: boolean; error: string | null }> => {
    try {
        // Note: This requires a ZIP library like JSZip
        // For now, we'll download files individually
        const results = await Promise.all(
            urls.map((url, index) => 
                downloadFile(url, fileNames[index] || `file_${index}`)
            )
        );
        
        const errors = results.filter(result => !result.success);
        if (errors.length > 0) {
            return { 
                success: false, 
                error: `Failed to download ${errors.length} files` 
            };
        }
        
        return { success: true, error: null };
    } catch (error: unknown) {
        console.error('Error downloading multiple files:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Get file metadata
export const getFileMetadata = async (
    url: string
): Promise<{ metadata: FileMetadata | null; error: string | null }> => {
    try {
        const fileRef = ref(storage, url);
        const metadata = await getMetadata(fileRef);
        
        return {
            metadata: {
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
            },
            error: null
        };
    } catch (error: unknown) {
        console.error('Error getting file metadata:', error);
        return { metadata: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Extract detailed metadata from file before upload
 */
export const extractDetailedMetadata = async (
    file: File
): Promise<{ metadata: FileMetadata | ImageMetadata | VideoMetadata | AudioMetadata | null; error: string | null }> => {
    try {
        const metadata = await extractFileMetadata(file);
        return { metadata, error: null };
    } catch (error: unknown) {
        console.error('Error extracting file metadata:', error);
        return { metadata: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

/**
 * Upload file with metadata extraction
 */
export const uploadFileWithMetadata = async (
    file: File, 
    path: string
): Promise<{ url: string | null; metadata: FileMetadata | ImageMetadata | VideoMetadata | AudioMetadata | null; error: string | null }> => {
    try {
        // Extract metadata before upload
        const { metadata: extractedMetadata, error: metadataError } = await extractDetailedMetadata(file);
        
        if (metadataError) {
            console.warn('Failed to extract metadata:', metadataError);
        }
        
        // Upload the file
        const { url, error: uploadError } = await uploadFile(file, path);
        
        if (uploadError) {
            return { url: null, metadata: null, error: uploadError };
        }
        
        return { url, metadata: extractedMetadata, error: null };
    } catch (error: unknown) {
        console.error('Error uploading file with metadata:', error);
        return { url: null, metadata: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Get file as blob for preview
export const getFileBlob = async (
    url: string
): Promise<{ blob: Blob | null; error: string | null }> => {
    try {
        const fileRef = ref(storage, url);
        const blob = await getBlob(fileRef);
        return { blob, error: null };
    } catch (error: unknown) {
        console.error('Error getting file blob:', error);
        return { blob: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Upload with progress tracking
export const uploadFileWithProgress = async (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
): Promise<{ url: string | null; error: string | null }> => {
    try {
        // Check file size (60MB limit)
        const maxSize = 60 * 1024 * 1024; // 60MB in bytes
        if (file.size > maxSize) {
            return {
                url: null,
                error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 60MB limit`
            };
        }

        const storageRef = ref(storage, path);
        
        // Simulate upload progress (Firebase doesn't provide upload progress in v9)
        if (onProgress) {
            const intervals = [25, 50, 75, 90];
            for (const progress of intervals) {
                setTimeout(() => onProgress(progress), (progress / 90) * 1000);
            }
        }
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        if (onProgress) {
            onProgress(100);
        }
        
        return { url: downloadURL, error: null };
    } catch (error: unknown) {
        console.error('Error uploading file with progress:', error);
        return { url: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};