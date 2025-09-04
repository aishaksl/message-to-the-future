import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a file to Firebase Storage with size validation
export const uploadFile = async (file: File, path: string): Promise<{ url: string | null; error: string | null }> => {
    try {
        // Check file size (60MB limit)
        const maxSize = 60 * 1024 * 1024; // 60MB in bytes
        if (file.size > maxSize) {
            return {
                url: null,
                error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 60MB limit`
            };
        }

        // Create a reference to the file location
        const storageRef = ref(storage, path);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { url: downloadURL, error: null };
    } catch (error: any) {
        console.error('Error uploading file:', error);
        return { url: null, error: error.message };
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
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return { error: error.message };
    }
};