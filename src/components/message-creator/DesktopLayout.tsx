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
  messageType: "text" | "image" | "video" | "audio";
  setMessageType: (type: "text" | "image" | "video" | "audio") => void;

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
  messageType,
  setMessageType,
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

  const removeFile = (fileIndex: number) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [messageType]: prev[messageType].filter(
        (_, index) => index !== fileIndex
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prev) => ({
        ...prev,
        [messageType]: Array.from(files),
      }));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center mb-8">
        Create Your Message
      </h2>

      {/* Step 1: Recipient */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
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
            {messageTypes.map(({ type, icon: Icon, label, description }) => (
              <button
                key={type}
                onClick={() => setMessageType(type)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  messageType === type
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border/40 hover:border-primary/40"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 mb-3",
                    messageType === type
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <h4 className="font-medium text-sm mb-1">{label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </button>
            ))}
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-base">Message Content</Label>
                  {selectedFiles[messageType as keyof typeof selectedFiles]
                    ?.length > 0 &&
                    messageType !== "text" && (
                      <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                    )}
                </div>
                {((selectedFiles[messageType as keyof typeof selectedFiles]
                  ?.length > 0 &&
                  messageType !== "text") ||
                  (messageType === "text" &&
                    messageText.trim().length > 0)) && (
                  <div className="flex gap-2">
                    {messageType === "text" ? (
                      <>
                        <button
                          onClick={onExpandText}
                          className="p-1 transition-transform duration-200 hover:scale-125"
                          title="Büyüt"
                        >
                          <Expand className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => setMessageText("")}
                          className="p-1 transition-transform duration-200 hover:scale-125"
                          title="Temizle"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            onExpandFile(
                              selectedFiles[
                                messageType as keyof typeof selectedFiles
                              ][0]
                            )
                          }
                          className="p-1 transition-transform duration-200 hover:scale-125"
                          title="Büyüt"
                        >
                          <Expand className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => removeFile(0)}
                          className="p-1 transition-transform duration-200 hover:scale-125"
                          title="Sil"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {messageType === "text" ? (
                <Textarea
                  placeholder="Dear future me, today I want to remember... I hope you know that... I'm grateful for... I dream that..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[240px] resize-none"
                />
              ) : (
                <>
                  <input
                    type="file"
                    multiple
                    accept={
                      messageType === "image"
                        ? "image/*"
                        : messageType === "video"
                        ? "video/*"
                        : messageType === "audio"
                        ? "audio/*"
                        : "*/*"
                    }
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id={`fileInputDesktop-${messageType}`}
                  />

                  {selectedFiles[messageType as keyof typeof selectedFiles]
                    ?.length === 0 && (
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-background/20">
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm mb-2">Upload your {messageType}</p>
                      <p className="text-muted-foreground text-xs mb-4">
                        Drag and drop or click to select files
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(
                            `fileInputDesktop-${messageType}`
                          ) as HTMLInputElement;
                          if (input) input.click();
                        }}
                        type="button"
                      >
                        Choose Files
                      </Button>
                    </div>
                  )}

                  {selectedFiles[messageType as keyof typeof selectedFiles]
                    ?.length > 0 && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl">
                      <div className="flex justify-center">
                        <div className="w-full max-w-md space-y-4">
                          {selectedFiles[
                            messageType as keyof typeof selectedFiles
                          ].map((file, index) => (
                            <div key={index} className="group">
                              <div
                                className={`w-full h-40 bg-muted rounded-xl border-2 border-primary/20 shadow-sm overflow-hidden relative transition-all duration-300 ${
                                  messageType === "audio"
                                    ? ""
                                    : "cursor-pointer hover:border-primary/40"
                                }`}
                                onClick={
                                  messageType === "audio"
                                    ? undefined
                                    : () => onExpandFile(file)
                                }
                              >
                                {messageType === "image" ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : messageType === "video" ? (
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
                                  {messageType !== "image" &&
                                    ` • ${
                                      messageType === "video"
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
            </div>
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

      {/* Step 6: Preview & Complete */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              6
            </span>
            Review & Send
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">
                    Subject
                  </span>
                  <span className="text-sm">{subject}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">
                    Delivery
                  </span>
                  <span className="text-sm">
                    {selectedDate && format(selectedDate, "PPP")}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">Type</span>
                  <span className="text-sm capitalize">{messageType}</span>
                </div>

                {messageText && (
                  <div className="p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <div className="text-sm font-medium text-primary mb-2">
                      Content
                    </div>
                    <p className="text-sm leading-relaxed">{messageText}</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              disabled={
                !subject ||
                !selectedDate ||
                (messageType === "text" && !messageText) ||
                isLoading
              }
              className="w-full h-12"
              onClick={onComplete}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling Message...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Schedule Message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
