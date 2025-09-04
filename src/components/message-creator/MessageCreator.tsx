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
import { uploadMultipleFiles } from "@/firebase/storage";

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
  mediaFiles?: {
    image?: File[];
    video?: File[];
    audio?: File[];
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
      setSelectedTypes([
        editingMessage.type as "text" | "image" | "video" | "audio",
      ]);
      setSubject(editingMessage.subject);
      setMessageText(editingMessage.content);
      setCurrentStep(1); // Start from first step when editing

      // Set delivery date
      if (editingMessage.deliveryDate) {
        setSelectedDate(new Date(editingMessage.deliveryDate));
      }

      // Handle media files if they exist
      if (editingMessage.mediaFiles) {
        // Note: We can't restore actual File objects from base64,
        // but we can show that media exists in the preview
        // This is a limitation of the current implementation
      }

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

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("Converting file to base64:", file.name, file.size);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("File conversion successful:", file.name);
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("File conversion failed:", file.name, error);
        reject(error);
      };
    });
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

    // Upload media files to Firebase Storage (requires Blaze plan)
    const mediaUrls: string[] = [];

    try {
      console.log("Uploading files to Firebase Storage...");

      // Upload images
      if (selectedFiles.image.length > 0) {
        console.log("Uploading images...", selectedFiles.image.length);
        const { urls, errors } = await uploadMultipleFiles(
          selectedFiles.image,
          `messages/${user.uid}/images`
        );
        mediaUrls.push(...urls);

        if (errors.length > 0) {
          throw new Error(`Image upload failed: ${errors.join(", ")}`);
        }
      }

      // Upload videos
      if (selectedFiles.video.length > 0) {
        console.log("Uploading videos...", selectedFiles.video.length);
        const { urls, errors } = await uploadMultipleFiles(
          selectedFiles.video,
          `messages/${user.uid}/videos`
        );
        mediaUrls.push(...urls);

        if (errors.length > 0) {
          throw new Error(`Video upload failed: ${errors.join(", ")}`);
        }
      }

      // Upload audio files
      if (selectedFiles.audio.length > 0) {
        console.log("Uploading audio files...", selectedFiles.audio.length);
        const { urls, errors } = await uploadMultipleFiles(
          selectedFiles.audio,
          `messages/${user.uid}/audios`
        );
        mediaUrls.push(...urls);

        if (errors.length > 0) {
          throw new Error(`Audio upload failed: ${errors.join(", ")}`);
        }
      }

      console.log(
        "All files uploaded successfully. Total URLs:",
        mediaUrls.length
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Storage not available",
        description:
          "Please upgrade to Blaze plan to use Firebase Storage for media files.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const messageData: unknown = {
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
    };

    // Only add optional fields if they have values
    if (recipientType === "self") {
      messageData.recipientId = user.uid;
    }
    if (recipientPhone && recipientPhone.trim()) {
      messageData.recipientPhone = recipientPhone;
    }

    // Only add mediaUrls if there are any
    if (mediaUrls.length > 0) {
      messageData.mediaUrls = mediaUrls;
    }

    let result;
    if (editingMessage) {
      // Update existing message
      result = await updateMessage(editingMessage.id!, messageData);
    } else {
      // Create new message
      result = await createMessage(messageData);
    }

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
          <MessageContentCreator
            messageType={selectedTypes[0] || "text"}
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
