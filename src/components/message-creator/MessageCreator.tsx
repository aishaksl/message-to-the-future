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

// Import new components
import { RecipientSelector } from "./RecipientSelector";
import { DeliveryMethodSelector } from "./DeliveryMethodSelector";
import { MessageTypeSelector } from "./MessageTypeSelector";
import { MessageContentCreator } from "./MessageContentCreator";
import { DateSelector } from "./DateSelector";
import { MessagePreview } from "./MessagePreview";
import { DesktopLayout } from "./DesktopLayout";

export const MessageCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load saved form state on component mount
  useEffect(() => {
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
  }, [toast]);

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

  const handleComplete = async () => {
    setIsLoading(true);

    const message = {
      id: Date.now().toString(),
      subject,
      content: messageText,
      types: selectedTypes,
      deliveryDate: selectedDate,
      recipientType,
      recipientName: recipientType === "self" ? "Future Me" : recipientName,
      recipientEmail,
      recipientPhone,
      deliveryMethod,
      status: "scheduled",
      createdAt: new Date(),
      isSurprise: isSurpriseMode,
      preview: messageText
        ? messageText.substring(0, 100) +
          (messageText.length > 100 ? "..." : "")
        : `${selectedTypes.join(", ")} message`,
    };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const existingMessages = JSON.parse(
      localStorage.getItem("sentMessages") || "[]"
    );
    existingMessages.unshift(message);
    localStorage.setItem("sentMessages", JSON.stringify(existingMessages));
    localStorage.setItem("newMessageId", message.id);

    setIsLoading(false);

    toast({
      title: "Message scheduled successfully!",
      description: "Taking you to dashboard...",
    });

    navigate("/?view=dashboard", { replace: true });
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
            subject={subject}
            selectedDate={selectedDate}
            messageType={selectedTypes[0] || "text"}
            messageText={messageText}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className={cn("mx-auto", isMobile ? "max-w-md" : "max-w-4xl")}>
        {/* Mobile: Step-by-step navigation */}
        {isMobile ? (
          <>
            {/* Header with Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create Message</h2>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="h-2"
              />
            </div>

            {/* Step Content */}
            <Card className="mb-3">
              <CardContent className="p-4">{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pb-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  disabled={
                    !subject ||
                    !selectedDate ||
                    (selectedTypes.includes("text") && !messageText)
                  }
                  className="flex-1"
                  onClick={handleComplete}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </>
        ) : (
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
          />
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

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-background/95 backdrop-blur border border-border/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin">
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-lg font-medium">Creating your message...</p>
                <p className="text-sm text-muted-foreground text-center">
                  This will just take a moment
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
