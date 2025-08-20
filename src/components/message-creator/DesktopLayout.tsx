import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Send,
  Gift,
  Mail,
  MessageCircle,
  Type,
  Image,
  Video,
  Mic,
  Upload,
  CheckCircle,
  Expand,
  X,
  CalendarIcon,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessagePreview } from "./MessagePreview";

interface DesktopLayoutProps {
  // Recipient props
  recipientType: "self" | "other";
  setRecipientType: (type: "self" | "other") => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  isSurpriseMode: boolean;
  setIsSurpriseMode: (surprise: boolean) => void;

  // Delivery method props
  deliveryMethod: "email" | "whatsapp" | "both";
  setDeliveryMethod: (method: "email" | "whatsapp" | "both") => void;
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
  recipientPhone: string;
  setRecipientPhone: (phone: string) => void;

  // Message type props
  selectedTypes: ("text" | "image" | "video" | "audio")[];
  setSelectedTypes: (types: ("text" | "image" | "video" | "audio")[]) => void;

  // Content props
  subject: string;
  setSubject: (subject: string) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  selectedFiles: {
    image: File[];
    video: File[];
    audio: File[];
  };
  setSelectedFiles: React.Dispatch<
    React.SetStateAction<{
      image: File[];
      video: File[];
      audio: File[];
    }>
  >;
  onExpandFile: (file: File) => void;
  onExpandText: () => void;

  // Date props
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;

  // Complete props
  isLoading: boolean;
  onComplete: () => void;
}

export const DesktopLayout = ({
  recipientType,
  setRecipientType,
  recipientName,
  setRecipientName,
  isSurpriseMode,
  setIsSurpriseMode,
  deliveryMethod,
  setDeliveryMethod,
  recipientEmail,
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone,
  selectedTypes,
  setSelectedTypes,
  subject,
  setSubject,
  messageText,
  setMessageText,
  selectedFiles,
  setSelectedFiles,
  onExpandFile,
  onExpandText,
  selectedDate,
  onDateChange,
  isDatePickerOpen,
  setIsDatePickerOpen,
  isLoading,
  onComplete,
}: DesktopLayoutProps) => {
  const messageTypes = [
    {
      type: "text" as const,
      icon: Type,
      label: "Written Words",
      description: "Pour your thoughts onto the page",
    },
    {
      type: "image" as const,
      icon: Image,
      label: "Precious Moment",
      description: "Capture a memory that speaks volumes",
    },
    {
      type: "video" as const,
      icon: Video,
      label: "Living Memory",
      description: "Record your face, your voice, your presence",
    },
    {
      type: "audio" as const,
      icon: Mic,
      label: "Your Voice",
      description: "Let your future self hear your heart",
    },
  ];

  const [currentType, setCurrentType] = React.useState<
    "text" | "image" | "video" | "audio"
  >("text");

  const [isWriting, setIsWriting] = React.useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    type: "text" | "image" | "video" | "audio" | null;
    hasContent: boolean;
  }>({
    isOpen: false,
    type: null,
    hasContent: false,
  });

  // currentType'ı selectedTypes değiştiğinde güncelle
  React.useEffect(() => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(currentType)) {
      setCurrentType(selectedTypes[0]);
    }
  }, [selectedTypes, currentType]);

  const removeFile = (fileIndex: number) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [currentType]: prev[currentType].filter(
        (_, index) => index !== fileIndex
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prev) => ({
        ...prev,
        [currentType]: Array.from(files),
      }));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight text-center mb-8">
        Create Your Message
      </h2>

      {/* Step 1: Recipient */}
      <Card>
        <CardHeader >
          <CardTitle className="text-md md:text-lg lg:text-2xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 text-white rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 opacity-30 flex items-center justify-center text-sm font-semibold">
              1
            </span>
            Who is this message for?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setRecipientType("self")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  recipientType === "self"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/40 hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <User
                    className={cn(
                      "w-6 h-6",
                      recipientType === "self"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <h4 className="font-medium">Future Me</h4>
                    <p className="text-sm text-muted-foreground">
                      Send a message to your future self
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRecipientType("other")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  recipientType === "other"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/40 hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <Send
                    className={cn(
                      "w-6 h-6",
                      recipientType === "other"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <h4 className="font-medium">Someone Else</h4>
                    <p className="text-sm text-muted-foreground">
                      Send a message to another person
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {recipientType === "self" && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary">
                        Surprise Mode
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Keep your future self guessing!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="surpriseModeDesktop"
                      checked={isSurpriseMode}
                      onChange={(e) => setIsSurpriseMode(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label
                      htmlFor="surpriseModeDesktop"
                      className="cursor-pointer text-sm text-muted-foreground leading-relaxed"
                    >
                      <strong className="text-foreground">
                        Make this a surprise message
                      </strong>
                      <br />
                      You won't be able to see or edit the content later - it
                      will remain a surprise until delivery!
                    </label>
                  </div>
                </div>
              </div>
            )}

            {recipientType === "other" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Label htmlFor="recipientNameDesktop" className="text-base">
                    Recipient Name
                  </Label>
                  <Input
                    id="recipientNameDesktop"
                    placeholder="Who will receive this message?"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              2
            </span>
            How should it be delivered?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setDeliveryMethod("email")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "email"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email Only</span>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMethod("whatsapp")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "whatsapp"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp Only</span>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMethod("both")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "both"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Email + WhatsApp</span>
                </div>
              </button>
            </div>

            {recipientType === "other" && (
              <div className="space-y-4 animate-fade-in">
                {(deliveryMethod === "email" || deliveryMethod === "both") && (
                  <div>
                    <Label
                      htmlFor="recipientEmailDesktop"
                      className="text-base"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="recipientEmailDesktop"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
                {(deliveryMethod === "whatsapp" ||
                  deliveryMethod === "both") && (
                    <div>
                      <Label
                        htmlFor="recipientPhoneDesktop"
                        className="text-base"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="recipientPhoneDesktop"
                        type="tel"
                        placeholder="+90 555 123 4567"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
              </div>
            )}

            {recipientType === "self" && (
              <div className="space-y-4 animate-fade-in">
                {(deliveryMethod === "email" || deliveryMethod === "both") && (
                  <div>
                    <Label
                      htmlFor="recipientEmailSelfDesktop"
                      className="text-base"
                    >
                      Your Email Address
                    </Label>
                    <Input
                      id="recipientEmailSelfDesktop"
                      type="email"
                      placeholder="your@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
                {(deliveryMethod === "whatsapp" ||
                  deliveryMethod === "both") && (
                    <div>
                      <Label
                        htmlFor="recipientPhoneSelfDesktop"
                        className="text-base"
                      >
                        Your Phone Number
                      </Label>
                      <Input
                        id="recipientPhoneSelfDesktop"
                        type="tel"
                        placeholder="+90 555 123 4567"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Message Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              3
            </span>
            Choose Message Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {messageTypes.map(({ type, icon: Icon, label, description }) => {
              const isSelected = selectedTypes.includes(type);

              // İçerik var mı kontrol et
              const hasContent = () => {
                switch (type) {
                  case "text":
                    return messageText.trim().length > 0;
                  case "image":
                    return selectedFiles.image.length > 0;
                  case "video":
                    return selectedFiles.video.length > 0;
                  case "audio":
                    return selectedFiles.audio.length > 0;
                  default:
                    return false;
                }
              };

              const typeHasContent = hasContent();

              const handleRemoveType = (e: React.MouseEvent) => {
                e.stopPropagation();

                if (typeHasContent) {
                  // İçerik varsa modern confirmation dialog göster
                  setConfirmDialog({
                    isOpen: true,
                    type: type,
                    hasContent: true,
                  });
                } else {
                  // İçerik yoksa direkt kaldır
                  setSelectedTypes(selectedTypes.filter((t) => t !== type));
                }
              };

              const handleConfirmRemove = () => {
                if (confirmDialog.type) {
                  // Type'ı kaldır ve içeriği temizle
                  setSelectedTypes(
                    selectedTypes.filter((t) => t !== confirmDialog.type)
                  );

                  // İçeriği temizle
                  if (confirmDialog.type === "text") {
                    setMessageText("");
                  } else {
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [confirmDialog.type!]: [],
                    }));
                  }
                }

                // Dialog'u kapat
                setConfirmDialog({
                  isOpen: false,
                  type: null,
                  hasContent: false,
                });
              };

              const handleCancelRemove = () => {
                setConfirmDialog({
                  isOpen: false,
                  type: null,
                  hasContent: false,
                });
              };

              return (
                <div key={type} className="relative">
                  <button
                    onClick={() => {
                      if (!isSelected) {
                        // Type'ı seç ve currentType olarak ayarla
                        setSelectedTypes([...selectedTypes, type]);
                        setCurrentType(type);
                      } else {
                        // Zaten seçiliyse, currentType olarak ayarla (Step 4'te göster)
                        setCurrentType(type);
                      }
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative h-[140px] flex flex-col",
                      isSelected && typeHasContent
                        ? currentType === type
                          ? "border-primary bg-primary/20 shadow-lg"
                          : "border-primary bg-primary/4 shadow-lg"
                        : isSelected && currentType === type
                          ? "border-primary/60 bg-primary/10 shadow-md"
                          : isSelected
                            ? "border-border/60 bg-background/50"
                            : "border-border/40 hover:border-primary/40"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 mb-3 flex-shrink-0",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <h4 className="font-medium text-sm mb-1 whitespace-nowrap">
                      {label}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>

                    {/* Content status indicator - minimal yeşil tik, sağ alt köşe */}
                    {isSelected && typeHasContent && (
                      <div
                        className="absolute bottom-3 right-3"
                        title="Content added"
                      >
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </button>

                  {/* Çarpı butonu - eski yeri, üst sağ köşe içeride */}
                  {isSelected && (
                    <button
                      onClick={handleRemoveType}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center hover:bg-primary/10 rounded-full transition-colors duration-200"
                      title={`Remove ${type}`}
                    >
                      <X className="w-4 h-4 text-primary hover:text-primary/80" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Message Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              4
            </span>
            Your Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="subjectDesktop" className="text-base">
                Subject
              </Label>
              <Input
                id="subjectDesktop"
                placeholder="Give your message a title..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>

            {selectedTypes.length > 0 && (
              <>
                {currentType === "text" ? (
                  // Always show textarea for text type - no start writing button needed
                  <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl relative">
                    {/* Action buttons - only show when there's text content */}
                    {messageText.trim().length > 0 && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={onExpandText}
                          className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5"
                          title="Expand"
                        >
                          <Expand className="w-4 h-4 text-blue-500 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => {
                            setMessageText("");
                          }}
                          className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5"
                          title="Clear"
                        >
                          <X className="w-4 h-4 text-red-500 transition-colors duration-200" />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-center mt-4">
                      <div className="w-full max-w-4xl space-y-4">
                        <div className="group">
                          <div className="w-full h-52 bg-muted rounded-lg border border-primary/20 shadow-sm overflow-hidden relative transition-all duration-300">
                            <Textarea
                              placeholder={
                                recipientType === "self"
                                  ? "Dear future me, today I want to remember... I hope you know that... I'm grateful for... I dream that..."
                                  : recipientName
                                    ? `Dear ${recipientName}, I want you to know... I hope you remember... I'm grateful for...`
                                    : "Dear friend, I want you to know... I hope you remember... I'm grateful for..."
                              }
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              className="w-full h-full resize-none border-0 bg-transparent focus:ring-0 p-3 text-base leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      multiple
                      accept={
                        currentType === "image"
                          ? "image/*"
                          : currentType === "video"
                            ? "video/*"
                            : currentType === "audio"
                              ? "audio/*"
                              : "*/*"
                      }
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id={`fileInputDesktop-${currentType}`}
                    />

                    {selectedFiles[currentType as keyof typeof selectedFiles]
                      ?.length === 0 && (
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-background/20">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm mb-2">
                            Upload your {currentType}
                          </p>
                          <p className="text-muted-foreground text-xs mb-4">
                            Drag and drop or click to select files
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById(
                                `fileInputDesktop-${currentType}`
                              ) as HTMLInputElement;
                              if (input) input.click();
                            }}
                            type="button"
                          >
                            Choose Files
                          </Button>
                        </div>
                      )}

                    {selectedFiles[currentType as keyof typeof selectedFiles]
                      ?.length > 0 && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl relative">
                          {/* Action buttons - mavi container'ın sağ üst köşesi */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={() =>
                                onExpandFile(
                                  selectedFiles[
                                  currentType as keyof typeof selectedFiles
                                  ][0]
                                )
                              }
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5"
                              title="Expand"
                            >
                              <Expand className="w-4 h-4 text-blue-500 transition-colors duration-200" />
                            </button>
                            <button
                              onClick={() => removeFile(0)}
                              className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5"
                              title="Remove"
                            >
                              <X className="w-4 h-4 text-red-500 transition-colors duration-200" />
                            </button>
                          </div>
                          <div className="flex justify-center mt-4">
                            <div className="w-full max-w-md space-y-4">
                              {selectedFiles[
                                currentType as keyof typeof selectedFiles
                              ].map((file, index) => (
                                <div key={index} className="group">
                                  <div
                                    className={`w-full h-40 bg-muted rounded-xl border-2 border-primary/20 shadow-sm overflow-hidden relative transition-all duration-300 ${currentType === "audio"
                                      ? ""
                                      : "cursor-pointer hover:border-primary/40"
                                      }`}
                                    onClick={
                                      currentType === "audio"
                                        ? undefined
                                        : () => onExpandFile(file)
                                    }
                                  >
                                    {currentType === "image" ? (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : currentType === "video" ? (
                                      <div className="relative w-full h-full">
                                        <video
                                          src={URL.createObjectURL(file)}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 p-4 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const audio =
                                            e.currentTarget.querySelector(
                                              "audio"
                                            ) as HTMLAudioElement;
                                          if (audio) {
                                            if (audio.paused) {
                                              audio.play();
                                            } else {
                                              audio.pause();
                                            }
                                          }
                                        }}
                                      >
                                        <div className="flex flex-col items-center gap-3 mb-4">
                                          <Mic className="w-8 h-8 text-primary" />
                                          <span className="text-sm font-medium text-primary">
                                            Audio File
                                          </span>
                                        </div>
                                        <audio
                                          src={URL.createObjectURL(file)}
                                          controls
                                          className="w-full max-w-sm h-10"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-2 text-center">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                                      {currentType !== "image" &&
                                        ` • ${currentType === "video"
                                          ? "Video"
                                          : "Audio"
                                        }`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Delivery Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              5
            </span>
            When to Deliver?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Delivery Date</Label>
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-center text-center font-normal h-16 rounded-xl border-2 border-dashed",
                      !selectedDate && "text-muted-foreground border-border/40",
                      selectedDate && "border-primary/30 bg-primary/5"
                    )}
                  >
                    {selectedDate ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">
                          Delivery Date
                        </span>
                        <span className="font-medium">
                          {format(selectedDate, "PPP")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">
                          Select Date
                        </span>
                        <span>Choose when to deliver</span>
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <ModernDatePicker
                    value={selectedDate}
                    onChange={onDateChange}
                    minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Free for first year, paid plans for up to 50 years.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review & Send - No longer a numbered step */}
      <div className="mt-8 pt-8 border-t-2 border-dashed border-primary/20">
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
          onComplete={onComplete}
          onExpandFile={onExpandFile}
          onExpandText={onExpandText}
        />
      </div>

      {/* Modern Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({
              isOpen: false,
              type: null,
              hasContent: false,
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-red-600" />
              </div>
              Remove {confirmDialog.type} content?
            </DialogTitle>
            <DialogDescription className="text-left">
              You're about to remove <strong>{confirmDialog.type}</strong> from
              your message. This will permanently delete all{" "}
              {confirmDialog.type} content you've added.
              <br />
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({
                  isOpen: false,
                  type: null,
                  hasContent: false,
                })
              }
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDialog.type) {
                  // Type'ı kaldır ve içeriği temizle
                  setSelectedTypes(
                    selectedTypes.filter((t) => t !== confirmDialog.type)
                  );

                  // İçeriği temizle
                  if (confirmDialog.type === "text") {
                    setMessageText("");
                  } else {
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [confirmDialog.type!]: [],
                    }));
                  }
                }

                // Dialog'u kapat
                setConfirmDialog({
                  isOpen: false,
                  type: null,
                  hasContent: false,
                });
              }}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Remove {confirmDialog.type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
