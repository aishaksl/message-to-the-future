import { format, differenceInDays } from "date-fns";
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
  Trash2,
} from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  type: string;
  deliveryDate: Date | undefined;
  recipientType: "self" | "other";
  recipientName: string;
  recipientEmail: string;
  deliveryMethod: "email";
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

interface MessagePreviewProps {
  // Recipient props
  recipientType: "self" | "other";
  recipientName: string;
  isSurpriseMode: boolean;

  // Delivery method props
  deliveryMethod: "email";
  recipientEmail: string;

  // Message type props
  selectedTypes: ("text" | "image" | "video" | "audio")[];
  subject: string;
  messageText: string;
  selectedFiles: {
    image: File[];
    video: File[];
    audio: File[];
  };

  // Date props
  selectedDate: Date | undefined;

  // Complete props
  isLoading: boolean;
  onComplete: () => void;
  onExpandFile: (file: File) => void;
  onExpandText: () => void;

  // Edit mode props
  editingMessage?: Message;
  onDelete?: () => void;
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
  editingMessage,
  onDelete,
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
    <div className="space-y-8">
      {/* Recipient & Delivery Info */}
      <div className="p-4 md:p-6 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-100/50 rounded-xl border border-blue-200/40">
              {recipientType === "self" ? (
                <User className="w-5 h-5 text-blue-500" />
              ) : (
                <Send className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <h4 className="font-light text-lg text-slate-700">
                {recipientType === "self" ? "Future Me" : recipientName}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500 font-light">
                  Message recipient
                </p>
                {isSurpriseMode && (
                  <Badge variant="secondary" className="text-xs bg-blue-100/50 text-blue-600 border-blue-200/40">
                    <Gift className="w-3 h-3 mr-1" />
                    Surprise
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm font-light text-slate-600">
                <span className="text-blue-500">From </span>
                {format(new Date(), "MM.dd.yyyy")}
              </div>
              <div className="flex items-center gap-1 text-sm font-light text-slate-600">
                <span className="text-blue-500">To </span>
                {selectedDate && format(selectedDate, "MM.dd.yyyy")}
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-light">
              {yearsFromNow > 0
                ? `${yearsFromNow} year${yearsFromNow > 1 ? "s" : ""} from now`
                : daysFromNow > 0
                  ? `${daysFromNow} day${daysFromNow > 1 ? "s" : ""} from now`
                  : daysFromNow === 0
                    ? "Today"
                    : "Delivered"}
            </div>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-light bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight">
          {subject}
        </h3>
      </div>

      {/* Text Content */}
      {selectedTypes.includes("text") && messageText && (
        <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50">
          <div className="text-center space-y-4">
            <div className="text-sm text-slate-600 font-light leading-relaxed italic line-clamp-3">
              "{messageText}"
            </div>
            {messageText.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpandText}
                className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600 font-light underline"
              >
                See more
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Media Files - Unified Grid */}
      {allFiles.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-sm font-light text-slate-600">
              Media Files ({allFiles.length})
            </h4>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allFiles.map(({ file, type }, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 relative group w-32 h-32 border border-slate-200/60"
                onClick={() => onExpandFile(file)}
              >
                {type === "image" && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {type === "video" && (
                  <>
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </>
                )}

                {type === "audio" && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center">
                    <Mic className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-xs text-slate-500 font-light">
                      {file.name.split(".").pop()?.toUpperCase()}
                    </span>
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

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        {editingMessage && onDelete && (
          <Button
            onClick={onDelete}
            disabled={isLoading}
            variant="destructive"
            className="px-8 py-4 rounded-2xl font-light text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Message
          </Button>
        )}
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className=" hover:bg-[#8279E6]
                bg-[#938ef6]
                 text-white px-12 py-4 rounded-2xl font-light text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingMessage ? "Updating..." : "Scheduling..."}
            </>
          ) : (
            editingMessage ? "Edit Message" : "Schedule Message"
          )}
        </Button>
      </div>
    </div>
  );
};
