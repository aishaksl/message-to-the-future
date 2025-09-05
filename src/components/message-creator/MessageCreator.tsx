import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Mic } from "lucide-react";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  createMessage,
  updateMessage,
  deleteMessage,
} from "@/firebase/firestore";
import { uploadMultipleFiles, uploadFile, uploadFileWithMetadata, extractDetailedMetadata, getFileBlob } from "@/firebase/storage";
import { getDownloadURL, ref, getBlob } from "firebase/storage";
import { storage } from "@/firebase/config";
import { FileMetadata, ImageMetadata, VideoMetadata, AudioMetadata } from "@/utils/fileMetadata";

// Import new components
import { RecipientSelector } from "./RecipientSelector";
import { DeliveryMethodSelector } from "./DeliveryMethodSelector";
import { MessageTypeSelector } from "./MessageTypeSelector";
import { MessageContentCreator } from "./MessageContentCreator";
import { DateSelector } from "./DateSelector";
import { MessagePreview } from "./MessagePreview";
import { DesktopLayout } from "./DesktopLayout";

interface Message {
  id: string;
  subject: string;
  content: string;
  type: string;
  deliveryDate: Date | undefined;
  recipientType: "self" | "other";
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  deliveryMethod: "email" | "whatsapp" | "both";
  status: string;
  createdAt: Date;
  isSurprise: boolean;
  preview: string;
  mediaUrls?: string[];
  mediaFiles?: {
    image?: File[];
    video?: File[];
    audio?: File[];
    images?: string[];
    videos?: string[];
    audios?: string[];
  };
}

interface MessageCreatorProps {
  editingMessage?: Message | null;
}

export const MessageCreator = ({ editingMessage }: MessageCreatorProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [messageText, setMessageText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<
    ("text" | "image" | "video" | "audio")[]
  >([]);
  const [subject, setSubject] = useState("");
  const [recipientType, setRecipientType] = useState<"self" | "other">("self");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "email" | "whatsapp" | "both"
  >("email");
  const [isSurpriseMode, setIsSurpriseMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    currentFile: '',
    percentage: 0,
    isUploading: false
  });
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Her message type için ayrı dosya listesi
  const [selectedFiles, setSelectedFiles] = useState<{
    image: File[];
    video: File[];
    audio: File[];
  }>({
    image: [],
    video: [],
    audio: [],
  });

  // Modal state for file preview
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Calculate total file size
  const getTotalFileSize = () => {
    const allFiles = [
      ...selectedFiles.image,
      ...selectedFiles.video,
      ...selectedFiles.audio,
    ];
    return allFiles.reduce((sum, file) => sum + file.size, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Handle navigation after successful message creation
  useEffect(() => {
    if (shouldNavigate) {
      navigate("/?view=dashboard");
      setShouldNavigate(false);
    }
  }, [shouldNavigate, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle navigation after message is saved
  useEffect(() => {
    if (shouldNavigate) {
      // Get the message ID from localStorage to scroll to it
      const messageId = localStorage.getItem("newMessageId");
      // Use window.location to ensure proper navigation with message fragment
      window.location.href = messageId
        ? `/?view=dashboard#message-${messageId}`
        : "/?view=dashboard";
      setShouldNavigate(false);
    }
  }, [shouldNavigate, navigate]);

  // Function to convert Firebase Storage URL to File object
  const urlToFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      console.log('🔄 Converting Firebase Storage URL to File:', url);

      let storageRef;

      // Check if URL is a storage path (not a download URL)
      if (!url.includes('firebasestorage.googleapis.com') && !url.includes('storage.googleapis.com')) {
        console.log('📍 URL is storage path, using direct storage reference...');
        storageRef = ref(storage, url);
      } else {
        console.log('📍 URL is download URL, extracting storage path...');

        // For Firebase Storage URLs, try to extract the file path
        try {
          const urlObj = new URL(url);
          let storagePath = '';

          // Check for different Firebase Storage URL patterns
          if (urlObj.hostname.includes('firebasestorage.googleapis.com')) {
            // Pattern: https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Ffile.ext?alt=media&token=...
            const pathMatch = urlObj.pathname.match(/\/v0\/b\/[^/]+\/o\/(.+)/);
            if (pathMatch) {
              storagePath = decodeURIComponent(pathMatch[1]);
              console.log('📍 Extracted storage path from firebasestorage.googleapis.com:', storagePath);
            }
          } else if (urlObj.hostname.includes('storage.googleapis.com')) {
            // Pattern: https://storage.googleapis.com/bucket/path/to/file.ext
            const pathSegments = urlObj.pathname.split('/');
            if (pathSegments.length > 2) {
              // Remove empty first element and bucket name
              storagePath = pathSegments.slice(2).join('/');
              console.log('📍 Extracted storage path from storage.googleapis.com:', storagePath);
            }
          }

          // Fallback: try to get from 'name' query parameter
          if (!storagePath) {
            const nameParam = urlObj.searchParams.get('name');
            if (nameParam) {
              storagePath = nameParam;
              console.log('📍 Using name parameter as storage path:', storagePath);
            }
          }

          if (!storagePath) {
            console.error('❌ Could not extract storage path from URL:', url);
            console.log('URL hostname:', urlObj.hostname);
            console.log('URL pathname:', urlObj.pathname);
            console.log('URL search params:', urlObj.searchParams.toString());
            return null;
          }

          storageRef = ref(storage, storagePath);
        } catch (urlError) {
          console.error('❌ Error parsing URL:', urlError);
          return null;
        }
      }

      console.log('📥 Getting blob from Firebase Storage...');

      try {
        // First try using Firebase SDK's getBlob (should avoid CORS)
        const blob = await getBlob(storageRef);
        console.log('✅ Successfully got blob via getBlob:', blob.type, blob.size, 'bytes');

        const file = new File([blob], filename, { type: blob.type });
        console.log('✅ Created File object:', file.name, file.type, file.size, 'bytes');
        return file;
      } catch (blobError) {
        console.warn('⚠️ getBlob failed, trying alternative method:', blobError);

        // Fallback: try getting download URL and fetch with proper headers
        try {
          const downloadURL = await getDownloadURL(storageRef);
          console.log('📥 Got download URL, fetching with CORS headers...');

          const response = await fetch(downloadURL, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Accept': '*/*',
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          console.log('✅ Successfully got blob via fetch:', blob.type, blob.size, 'bytes');

          const file = new File([blob], filename, { type: blob.type });
          console.log('✅ Created File object:', file.name, file.type, file.size, 'bytes');
          return file;
        } catch (fetchError) {
          console.error('❌ Fetch also failed:', fetchError);
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('❌ Error converting URL to File:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        url,
        filename
      });
      return null;
    }
  };

  // Load saved form state on component mount or populate from editing message
  useEffect(() => {
    if (editingMessage) {
      // Pre-populate form with editing message data
      setRecipientType(editingMessage.recipientType || "self");
      setRecipientName(
        editingMessage.recipientName === "Future Me"
          ? ""
          : editingMessage.recipientName
      );
      setRecipientEmail(editingMessage.recipientEmail || "");
      setRecipientPhone(editingMessage.recipientPhone || "");
      setDeliveryMethod(editingMessage.deliveryMethod);
      setIsSurpriseMode(editingMessage.isSurprise);
      // selectedTypes will be set after media files are loaded
      setSubject(editingMessage.subject);
      setMessageText(editingMessage.content);
      setCurrentStep(1); // Start from first step when editing

      // Set delivery date
      if (editingMessage.deliveryDate) {
        setSelectedDate(new Date(editingMessage.deliveryDate));
      }

      // Handle media files if they exist
      const loadMediaFiles = async () => {
        const newSelectedFiles = {
          image: [] as File[],
          video: [] as File[],
          audio: [] as File[],
        };

        console.log('Loading media files for editing...', {
          mediaUrls: editingMessage.mediaUrls,
          mediaFiles: editingMessage.mediaFiles
        });

        // DEBUG: Log actual URL format
        if (editingMessage.mediaUrls && editingMessage.mediaUrls.length > 0) {
          console.log('🔍 DEBUG: Actual mediaUrls format:');
          editingMessage.mediaUrls.forEach((url, index) => {
            console.log(`  [${index}]:`, url);
            console.log(`  Is download URL:`, url.includes('firebasestorage.googleapis.com'));
            console.log(`  Is storage path:`, url.startsWith('messages/'));
          });
        }

        // Handle new mediaUrls format (Firebase Storage URLs)
        if (editingMessage.mediaUrls && editingMessage.mediaUrls.length > 0) {
          console.log('Loading from mediaUrls:', editingMessage.mediaUrls);
          for (const url of editingMessage.mediaUrls) {
            try {
              // Determine file type from URL path and file extension
              let type: 'image' | 'video' | 'audio' = 'image';
              let filename = 'media_file';

              // First check by folder path
              if (url.includes('/videos/')) {
                type = 'video';
                filename = url.split('/').pop()?.split('?')[0] || 'video_file';
              } else if (url.includes('/audios/')) {
                type = 'audio';
                filename = url.split('/').pop()?.split('?')[0] || 'audio_file';
              } else if (url.includes('/images/')) {
                type = 'image';
                filename = url.split('/').pop()?.split('?')[0] || 'image_file';
              } else {
                // Fallback: check by file extension
                const urlLower = url.toLowerCase();
                filename = url.split('/').pop()?.split('?')[0] || 'media_file';

                if (urlLower.includes('.mp4') || urlLower.includes('.webm') || urlLower.includes('.mov') || urlLower.includes('.avi') || urlLower.includes('.mkv')) {
                  type = 'video';
                } else if (urlLower.includes('.mp3') || urlLower.includes('.wav') || urlLower.includes('.ogg') || urlLower.includes('.m4a') || urlLower.includes('.aac')) {
                  type = 'audio';
                } else if (urlLower.includes('.jpg') || urlLower.includes('.jpeg') || urlLower.includes('.png') || urlLower.includes('.gif') || urlLower.includes('.webp')) {
                  type = 'image';
                }
              }

              console.log(`Converting URL to File: ${url} -> ${type}/${filename}`);
              const file = await urlToFile(url, filename);
              if (file) {
                newSelectedFiles[type].push(file);
                console.log(`Successfully loaded ${type} file:`, file.name);
              }
            } catch (error) {
              console.error('Error loading media file:', error);
            }
          }
        }

        // Handle legacy mediaFiles format (for backward compatibility)
        if (editingMessage.mediaFiles) {
          console.log('Loading from legacy mediaFiles:', editingMessage.mediaFiles);
          const { images, videos, audios } = editingMessage.mediaFiles;

          if (images) {
            console.log('Loading legacy images:', images);
            for (const url of images) {
              try {
                const filename = url.split('/').pop()?.split('?')[0] || 'image_file';
                console.log(`Converting legacy image URL to File: ${url} -> ${filename}`);
                const file = await urlToFile(url, filename);
                if (file) {
                  newSelectedFiles.image.push(file);
                  console.log(`Successfully loaded legacy image file:`, file.name);
                }
              } catch (error) {
                console.error('Error loading image file:', error);
              }
            }
          }

          if (videos) {
            for (const url of videos) {
              try {
                const filename = url.split('/').pop()?.split('?')[0] || 'video_file';
                const file = await urlToFile(url, filename);
                if (file) {
                  newSelectedFiles.video.push(file);
                }
              } catch (error) {
                console.error('Error loading video file:', error);
              }
            }
          }

          if (audios) {
            for (const url of audios) {
              try {
                const filename = url.split('/').pop()?.split('?')[0] || 'audio_file';
                const file = await urlToFile(url, filename);
                if (file) {
                  newSelectedFiles.audio.push(file);
                }
              } catch (error) {
                console.error('Error loading audio file:', error);
              }
            }
          }
        }

        console.log('Final selectedFiles to be set:', newSelectedFiles);
        setSelectedFiles(newSelectedFiles);

        // Update selectedTypes based on loaded media files
        const typesWithContent = [];
        if (editingMessage.content && editingMessage.content.trim()) {
          typesWithContent.push('text');
        }
        if (newSelectedFiles.image.length > 0) {
          typesWithContent.push('image');
        }
        if (newSelectedFiles.video.length > 0) {
          typesWithContent.push('video');
        }
        if (newSelectedFiles.audio.length > 0) {
          typesWithContent.push('audio');
        }

        console.log('Setting selectedTypes based on content:', typesWithContent);
        setSelectedTypes(typesWithContent as ("text" | "image" | "video" | "audio")[]);
      };

      loadMediaFiles();

      toast({
        title: "Editing message",
        description: "Message data has been loaded for editing.",
      });
    } else {
      // Load saved form state from localStorage (for payment flow)
      const savedFormState = localStorage.getItem("messageFormState");
      if (savedFormState) {
        try {
          const formState = JSON.parse(savedFormState);

          // Restore all form fields
          setRecipientType(formState.recipientType || "self");
          setRecipientName(formState.recipientName || "");
          setRecipientEmail(formState.recipientEmail || "");
          setRecipientPhone(formState.recipientPhone || "");
          setDeliveryMethod(formState.deliveryMethod || "email");
          setIsSurpriseMode(formState.isSurpriseMode || false);
          setSelectedTypes(formState.selectedTypes || []);
          setSubject(formState.subject || "");
          setMessageText(formState.messageText || "");
          setCurrentStep(formState.currentStep || 1);

          // Restore selected date
          if (formState.selectedDate) {
            setSelectedDate(new Date(formState.selectedDate));
          }

          // Clear the saved state after restoring
          localStorage.removeItem("messageFormState");

          toast({
            title: "Form restored",
            description: "Your previous form data has been restored.",
          });
        } catch (error) {
          console.error("Error restoring form state:", error);
          localStorage.removeItem("messageFormState");
        }
      }
    }
  }, [editingMessage, toast]);

  const totalSteps = 6;

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setIsDatePickerOpen(false);

      const daysFromNow = differenceInDays(date, new Date());
      if (daysFromNow > 365) {
        // Save current form state before navigating to payment
        const formState = {
          recipientType,
          recipientName,
          recipientEmail,
          recipientPhone,
          deliveryMethod,
          isSurpriseMode,
          selectedTypes,
          subject,
          messageText,
          selectedDate: date,
          currentStep,
        };
        localStorage.setItem("messageFormState", JSON.stringify(formState));
        navigate("/payment");
        return;
      }
    }
    setSelectedDate(date);
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return recipientType === "self" || recipientName;
      case 3:
        if (recipientType === "other") {
          if (deliveryMethod === "email" || deliveryMethod === "both") {
            return recipientEmail && recipientEmail.includes("@");
          }
          if (deliveryMethod === "whatsapp" || deliveryMethod === "both") {
            return recipientPhone;
          }
        }
        if (
          recipientType === "self" &&
          (deliveryMethod === "whatsapp" || deliveryMethod === "both")
        ) {
          return recipientPhone;
        }
        return true;
      case 4:
        return selectedTypes.length > 0;
      case 5:
        return subject && (selectedTypes.includes("text") ? messageText : true);
      case 6:
        return selectedDate;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const expandFile = (file: File) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };



  const handleDelete = async () => {
    if (!editingMessage || !user) return;

    try {
      const { error } = await deleteMessage(editingMessage.id!);

      if (error) {
        toast({
          title: "Error deleting message",
          description: error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message deleted successfully!",
        description: "Redirecting to dashboard...",
      });

      // Trigger a custom event to notify dashboard of deleted message
      window.dispatchEvent(
        new CustomEvent("newMessageCreated", {
          detail: { messageId: editingMessage.id },
        })
      );

      // Navigate back to dashboard
      navigate("/?view=dashboard");
    } catch (error) {
      toast({
        title: "Error deleting message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create messages.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check total file size limit (60MB)
    const MAX_TOTAL_SIZE = 60 * 1024 * 1024; // 60MB in bytes
    const allFiles = [
      ...selectedFiles.image,
      ...selectedFiles.video,
      ...selectedFiles.audio,
    ];

    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
      toast({
        title: "Content too large",
        description: `Total content size is ${totalSizeMB}MB. Maximum allowed is 60MB.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Upload media files to Firebase Storage with progress tracking
    const mediaUrls: string[] = [];
    const fileMetadata: (FileMetadata | ImageMetadata | VideoMetadata | AudioMetadata)[] = [];
    const totalFiles = allFiles.length;
    let uploadedFiles = 0;

    if (totalFiles > 0) {
      setUploadProgress({
        current: 0,
        total: totalFiles,
        currentFile: '',
        percentage: 0,
        isUploading: true
      });
    }

    try {
      console.log("Uploading files to Firebase Storage...");

      // Upload images with progress tracking
      if (selectedFiles.image.length > 0) {
        console.log("Uploading images...", selectedFiles.image.length);

        for (const file of selectedFiles.image) {
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles + 1,
            currentFile: file.name,
            percentage: Math.round(((uploadedFiles + 0.5) / totalFiles) * 100)
          }));

          const fileName = `${Date.now()}_${uploadedFiles}_${file.name}`;
          const filePath = `messages/${user.uid}/images/${fileName}`;

          const result = await uploadFileWithMetadata(file, filePath);

          if (result.url) {
            mediaUrls.push(result.url);
            if (result.metadata) {
              fileMetadata.push(result.metadata);
            }
          } else {
            throw new Error(`Image upload failed: ${result.error}`);
          }

          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100)
          }));
        }
      }

      // Upload videos with progress tracking
      if (selectedFiles.video.length > 0) {
        console.log("Uploading videos...", selectedFiles.video.length);

        for (const file of selectedFiles.video) {
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles + 1,
            currentFile: file.name,
            percentage: Math.round(((uploadedFiles + 0.5) / totalFiles) * 100)
          }));

          const fileName = `${Date.now()}_${uploadedFiles}_${file.name}`;
          const filePath = `messages/${user.uid}/videos/${fileName}`;

          const result = await uploadFileWithMetadata(file, filePath);

          if (result.url) {
            mediaUrls.push(result.url);
            if (result.metadata) {
              fileMetadata.push(result.metadata);
            }
          } else {
            throw new Error(`Video upload failed: ${result.error}`);
          }

          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100)
          }));
        }
      }

      // Upload audio files with progress tracking
      if (selectedFiles.audio.length > 0) {
        console.log("Uploading audio files...", selectedFiles.audio.length);

        for (const file of selectedFiles.audio) {
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles + 1,
            currentFile: file.name,
            percentage: Math.round(((uploadedFiles + 0.5) / totalFiles) * 100)
          }));

          const fileName = `${Date.now()}_${uploadedFiles}_${file.name}`;
          const filePath = `messages/${user.uid}/audios/${fileName}`;

          const result = await uploadFileWithMetadata(file, filePath);

          if (result.url) {
            mediaUrls.push(result.url);
            if (result.metadata) {
              fileMetadata.push(result.metadata);
            }
          } else {
            throw new Error(`Audio upload failed: ${result.error}`);
          }

          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            current: uploadedFiles,
            percentage: Math.round((uploadedFiles / totalFiles) * 100)
          }));
        }
      }

      // Upload completed
      setUploadProgress(prev => ({
        ...prev,
        isUploading: false,
        percentage: 100
      }));

      console.log(
        "All files uploaded successfully. Total URLs:",
        mediaUrls.length
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "File Upload Error",
        description: error instanceof Error ? error.message : "An error occurred while uploading files. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const messageData = {
      senderId: user.uid,
      recipientEmail:
        recipientType === "self" ? user.email || "" : recipientEmail,
      recipientName: recipientType === "self" ? "Future Me" : recipientName,
      recipientType,
      subject,
      content: messageText,
      type: (selectedTypes.length > 0 ? selectedTypes[0] : "text") as
        | "text"
        | "image"
        | "video"
        | "audio",
      deliveryDate: selectedDate || new Date(),
      deliveryMethod,
      status: "scheduled" as const,
      isSurprise: isSurpriseMode,
      ...(recipientType === "self" && { recipientId: user.uid }),
      ...(recipientPhone && recipientPhone.trim() && { recipientPhone }),
      ...(mediaUrls.length > 0 && { mediaUrls }),
      ...(fileMetadata.length > 0 && { fileMetadata })
    };

    console.log("🔍 DEBUG: Message creation started");
    console.log("📝 Message Text:", messageText);
    console.log("📋 Subject:", subject);
    console.log("🎯 Selected Types:", selectedTypes);
    console.log("📦 Message Data:", messageData);
    console.log("👤 User:", user?.uid, user?.email);

    let result;
    if (editingMessage) {
      // Update existing message
      console.log("✏️ Updating existing message:", editingMessage.id);
      result = await updateMessage(editingMessage.id!, messageData);
    } else {
      // Create new message
      console.log("🆕 Creating new message");
      result = await createMessage(messageData);
    }

    console.log("📤 Firestore result:", result);

    if (result.error) {
      toast({
        title: "Error saving message",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const messageId = result.id || editingMessage?.id;
    localStorage.setItem("newMessageId", messageId || "");

    setIsLoading(false);

    toast({
      title: editingMessage
        ? "Message updated successfully!"
        : "Message scheduled successfully!",
      description: "Redirecting to dashboard...",
    });

    // Trigger a custom event to notify dashboard of new/updated message
    window.dispatchEvent(
      new CustomEvent("newMessageCreated", {
        detail: { messageId },
      })
    );

    // Trigger navigation using state
    setShouldNavigate(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RecipientSelector
            recipientType={recipientType}
            setRecipientType={setRecipientType}
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            isSurpriseMode={isSurpriseMode}
            setIsSurpriseMode={setIsSurpriseMode}
          />
        );

      case 2:
        return (
          <DeliveryMethodSelector
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            recipientType={recipientType}
            recipientEmail={recipientEmail}
            setRecipientEmail={setRecipientEmail}
            recipientPhone={recipientPhone}
            setRecipientPhone={setRecipientPhone}
          />
        );

      case 3:
        return (
          <MessageTypeSelector
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            messageText={messageText}
            selectedFiles={selectedFiles}
          />
        );

      case 4:
        return (
          <div className="space-y-6">
            {selectedTypes.map((type) => (
              <MessageContentCreator
                key={type}
                messageType={type}
                subject={subject}
                setSubject={setSubject}
                messageText={messageText}
                setMessageText={setMessageText}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onExpandFile={expandFile}
                onExpandText={() => {
                  setPreviewFile(
                    new File([messageText], "message.txt", {
                      type: "text/plain",
                    })
                  );
                  setIsPreviewOpen(true);
                }}
                recipientType={recipientType}
                recipientName={recipientName}
                totalFileSize={getTotalFileSize()}
                maxFileSize={60 * 1024 * 1024}
              />
            ))}
          </div>
        );

      case 5:
        return (
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
          />
        );

      case 6:
        return (
          <MessagePreview
            recipientType={recipientType}
            recipientName={recipientName}
            isSurpriseMode={isSurpriseMode}
            deliveryMethod={deliveryMethod}
            recipientEmail={recipientEmail}
            recipientPhone={recipientPhone}
            selectedTypes={selectedTypes}
            subject={subject}
            messageText={messageText}
            selectedFiles={selectedFiles}
            selectedDate={selectedDate}
            isLoading={isLoading}
            onComplete={handleComplete}
            onExpandFile={expandFile}
            onExpandText={() => {
              setPreviewFile(
                new File([messageText], "message.txt", {
                  type: "text/plain",
                })
              );
              setIsPreviewOpen(true);
            }}
            editingMessage={editingMessage}
            onDelete={editingMessage ? handleDelete : undefined}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4  sm:pt-16 relative overflow-hidden">
      {/* Decorative Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large bubbles */}
        <div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 top-10 left-10"
          style={{ borderRadius: "50% 30% 70% 40%" }}
        ></div>
        <div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-300/20 to-purple-400/20 top-32 right-16"
          style={{ borderRadius: "60% 40% 30% 70%" }}
        ></div>
        <div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-300/15 to-blue-400/15 bottom-20 left-20"
          style={{ borderRadius: "40% 60% 70% 30%" }}
        ></div>
        <div
          className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-violet-300/18 to-purple-500/18 top-16 right-1/3"
          style={{ borderRadius: "45% 55% 65% 35%" }}
        ></div>

        {/* Medium bubbles */}
        <div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-300/30 bottom-1/3 right-10"
          style={{ borderRadius: "30% 70% 40% 60%" }}
        ></div>
        <div
          className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-amber-300/22 to-yellow-400/22 top-2/3 left-1/2"
          style={{ borderRadius: "55% 45% 35% 65%" }}
        ></div>
        <div
          className="absolute w-22 h-22 rounded-full bg-gradient-to-br from-sky-300/20 to-cyan-400/20 bottom-1/2 right-1/3"
          style={{ borderRadius: "40% 60% 50% 50%" }}
        ></div>
      </div>

      <div
        className={cn(
          "mx-auto relative z-10",
          isMobile ? "max-w-md" : "max-w-4xl"
        )}
      >
        {/* Both Mobile and Desktop: Use same layout */}
        <DesktopLayout
          recipientType={recipientType}
          setRecipientType={setRecipientType}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          isSurpriseMode={isSurpriseMode}
          setIsSurpriseMode={setIsSurpriseMode}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          recipientEmail={recipientEmail}
          setRecipientEmail={setRecipientEmail}
          recipientPhone={recipientPhone}
          setRecipientPhone={setRecipientPhone}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          subject={subject}
          setSubject={setSubject}
          messageText={messageText}
          setMessageText={setMessageText}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onExpandFile={expandFile}
          onExpandText={() => {
            setPreviewFile(
              new File([messageText], "message.txt", {
                type: "text/plain",
              })
            );
            setIsPreviewOpen(true);
          }}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          isDatePickerOpen={isDatePickerOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
          isLoading={isLoading}
          onComplete={handleComplete}
          editingMessage={editingMessage}
          isMobile={isMobile}
        />

        {/* Loading overlay with upload progress */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              {uploadProgress.isUploading ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-700 font-medium">
                      Uploading files...
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>File {uploadProgress.current} of {uploadProgress.total}</span>
                      <span>{uploadProgress.percentage}%</span>
                    </div>
                    <Progress value={uploadProgress.percentage} className="w-full" />
                    {uploadProgress.currentFile && (
                      <p className="text-xs text-gray-500 truncate">
                        {uploadProgress.currentFile}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-700">
                    {editingMessage ? "Updating message..." : "Creating message..."}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {previewFile?.type.startsWith("image/")
                  ? "Your Image"
                  : previewFile?.type.startsWith("video/")
                    ? "Your Video"
                    : previewFile?.type.startsWith("audio/")
                      ? "Your Audio"
                      : previewFile?.type === "text/plain"
                        ? "Your Text"
                        : "File Preview"}
              </DialogTitle>
            </DialogHeader>
            {previewFile && (
              <div className="space-y-4">
                {previewFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(previewFile)}
                    alt={previewFile.name}
                    className="w-full h-[70vh] object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() =>
                      window.open(URL.createObjectURL(previewFile), "_blank")
                    }
                  />
                ) : previewFile.type.startsWith("video/") ? (
                  <div
                    className="w-full h-[70vh] rounded-lg overflow-hidden flex items-center justify-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <video
                      src={URL.createObjectURL(previewFile)}
                      controls
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                    />
                  </div>
                ) : previewFile.type.startsWith("audio/") ? (
                  <div className="w-full h-[70vh] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex flex-col items-center justify-center gap-8 p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <Mic className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Audio File
                        </h3>
                        <p className="text-gray-600 text-sm truncate max-w-md">
                          {previewFile.name}
                        </p>
                      </div>
                    </div>
                    <div className="w-full max-w-lg">
                      <audio
                        src={URL.createObjectURL(previewFile)}
                        controls
                        className="w-full h-12 rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                ) : previewFile.type === "text/plain" ? (
                  <div className="w-full h-[70vh] bg-white rounded-lg border border-gray-200">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full h-full resize-none border-none outline-none text-base leading-relaxed text-gray-800 bg-transparent overflow-y-auto p-4"
                      placeholder="Start typing your message..."
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p>Preview not available for this file type</p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>File:</strong> {previewFile.name}
                  </p>
                  {previewFile.type !== "text/plain" && (
                    <p>
                      <strong>Size:</strong>{" "}
                      {(previewFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
