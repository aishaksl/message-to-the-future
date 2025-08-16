import { format, differenceInDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Send,
  Calendar,
  Image,
  Video,
  Mic,
  CheckCircle,
  Gift,
  Loader2,
  Play,
  Expand,
} from "lucide-react";

interface MessagePreviewProps {
  // Recipient data
  recipientType: "self" | "other";
  recipientName: string;
  isSurpriseMode: boolean;

  // Delivery data
  deliveryMethod: "email" | "whatsapp" | "both";
  recipientEmail: string;
  recipientPhone: string;

  // Message data
  selectedTypes: ("text" | "image" | "video" | "audio")[];
  subject: string;
  messageText: string;
  selectedFiles: {
    image: File[];
    video: File[];
    audio: File[];
  };

  // Date data
  selectedDate: Date | undefined;

  // Actions
  isLoading: boolean;
  onComplete: () => void;
  onExpandFile: (file: File) => void;
  onExpandText: () => void;
}

export const MessagePreview = ({
  recipientType,
  recipientName,
  isSurpriseMode,
  selectedTypes,
  subject,
  messageText,
  selectedFiles,
  selectedDate,
  isLoading,
  onComplete,
  onExpandFile,
  onExpandText,
}: MessagePreviewProps) => {
  const daysFromNow = selectedDate
    ? differenceInDays(selectedDate, new Date())
    : 0;
  const yearsFromNow = Math.floor(daysFromNow / 365);

  // Tüm dosyaları birleştir
  const allFiles = [
    ...selectedFiles.image.map((file) => ({ file, type: "image" as const })),
    ...selectedFiles.video.map((file) => ({ file, type: "video" as const })),
    ...selectedFiles.audio.map((file) => ({ file, type: "audio" as const })),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          Review your message before scheduling delivery
        </p>
      </div>

      {/* Single Unified Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-6 space-y-6">
          {/* Recipient & Delivery Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {recipientType === "self" ? (
                <User className="w-5 h-5 text-primary" />
              ) : (
                <Send className="w-5 h-5 text-primary" />
              )}
              <div className="font-medium">
                {recipientType === "self" ? "Future Me" : recipientName}
                {isSurpriseMode && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <Gift className="w-3 h-3 mr-1" />
                    Surprise
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Calendar className="w-4 h-4 text-blue-600" />
                {selectedDate && format(selectedDate, "MMM d, yyyy")}
              </div>
              <div className="text-xs text-muted-foreground">
                {yearsFromNow > 0
                  ? `${yearsFromNow} year${yearsFromNow > 1 ? "s" : ""}`
                  : daysFromNow > 0
                  ? `${daysFromNow} day${daysFromNow > 1 ? "s" : ""}`
                  : "Today"}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="text-lg font-medium text-primary text-center">
            {subject}
          </div>

          {/* Text Content */}
          {selectedTypes.includes("text") && messageText && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground line-clamp-3 mb-2 italic">
                "{messageText}"
              </div>
              {messageText.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpandText}
                  className="h-auto p-0 text-xs text-blue-600 hover:text-blue-600"
                >
                  See more
                </Button>
              )}
            </div>
          )}

          {/* Media Files - Unified Grid */}
          {allFiles.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-primary">
                Media Files ({allFiles.length})
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {allFiles.map(({ file, type }, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group w-32 h-32"
                    onClick={() => onExpandFile(file)}
                  >
                    {type === "image" && (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {type === "video" && (
                      <div className="relative w-full h-full">
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {type === "audio" && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                        <Mic className="w-6 h-6 text-blue-600" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* File type indicator */}
                    <div className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                      {type === "image" && (
                        <Image className="w-3 h-3 text-white" />
                      )}
                      {type === "video" && (
                        <Video className="w-3 h-3 text-white" />
                      )}
                      {type === "audio" && (
                        <Mic className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Button */}
          <div className="pt-4">
            <Button
              onClick={onComplete}
              disabled={isLoading}
              className="w-full h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling Message...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
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
