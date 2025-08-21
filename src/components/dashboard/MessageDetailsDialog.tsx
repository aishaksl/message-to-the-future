import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Edit3,
  Save,
  X,
  Gift,
  Mail,
  MessageCircle,
  Type,
  Image,
  Video,
  Mic,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  subject: string;
  content: string;
  type: "text" | "image" | "video" | "audio";
  deliveryDate?: Date | string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  deliveryMethod: "email" | "whatsapp" | "both";
  status: string;
  createdAt: Date | string;
  isSurprise: boolean;
  preview: string;
  // Media file data
  mediaFiles?: {
    images?: string[]; // base64 encoded images
    videos?: string[]; // base64 encoded videos
    audios?: string[]; // base64 encoded audio files
  };
}

interface MessageDetailsDialogProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedMessage: Message) => void;
  onDelete: (messageId: string) => void;
  isEditable?: boolean;
}

export const MessageDetailsDialog = ({
  message,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isEditable = true,
}: MessageDetailsDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    if (message) {
      setEditedSubject(message.subject || "");
      setEditedContent(message.content || "");
      setIsTextExpanded(false); // Reset text expansion when message changes
    }
  }, [message]);

  if (!message) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "audio":
        return <Mic className="h-4 w-4" />;
      case "text":
        return <Type className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "both":
        return (
          <div className="flex gap-1">
            <Mail className="h-3 w-3" />
            <MessageCircle className="h-3 w-3" />
          </div>
        );
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const handleSave = () => {
    const updatedMessage = {
      ...message,
      subject: editedSubject,
      content: editedContent,
      preview: editedContent
        ? editedContent.substring(0, 100) +
        (editedContent.length > 100 ? "..." : "")
        : `${message.type} message`,
    };

    onUpdate(updatedMessage);
    setIsEditing(false);

    toast({
      title: "Message updated",
      description: "Your message has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedSubject(message.subject || "");
    setEditedContent(message.content || "");
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
    onClose();

    toast({
      title: "Message deleted",
      description: "Your message has been removed.",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-slate-600 to-slate-800">Message Details</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Recipient & Delivery Info */}
            <div className="p-6 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100/50 rounded-xl border border-blue-200/40">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-light text-lg text-slate-700">
                      {message.recipientName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-500 font-light">
                        Message recipient
                      </p>
                      {message.isSurprise && (
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
                      {format(new Date(message.createdAt), "MM.dd.yyyy")}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-light text-slate-600">
                      <span className="text-blue-500">To </span>
                      {message.deliveryDate && format(new Date(message.deliveryDate), "MM.dd.yyyy")}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-light">
                    {message.deliveryDate ?
                      `${Math.ceil((new Date(message.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days from now` :
                      '...days from now'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="text-center">
              {isEditing ? (
                <Input
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="text-xl md:text-2xl font-light border-none p-0 h-auto focus-visible:ring-0 bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight text-center bg-transparent"
                  placeholder="Message subject..."
                />
              ) : (
                <h3 className="text-xl md:text-2xl font-light bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight">
                  {message.subject}
                </h3>
              )}
            </div>

            {/* Text Content */}
            {message.isSurprise && !isEditing ? (
              <div className="p-6 border-2 border-dashed border-blue-200/40 rounded-2xl bg-gradient-to-br from-blue-50/30 to-purple-50/30 text-center">
                <Gift className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-blue-600 font-light mb-2">
                  Surprise Message
                </p>
                <p className="text-sm text-slate-500 font-light">
                  This is a surprise message. The content is hidden to preserve
                  the surprise!
                </p>
              </div>
            ) : isEditing ? (
              <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px] resize-none border-none bg-transparent text-slate-700 font-light leading-relaxed focus-visible:ring-0 p-0"
                  placeholder="Your message content..."
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Text Content */}
                {message.content && (
                  <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 font-light leading-relaxed italic break-all whitespace-pre-wrap max-w-full overflow-hidden line-clamp-3">
                        "{message.content}"
                      </div>
                      {message.content.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewFile(
                              new File([message.content || ""], "message.txt", {
                                type: "text/plain",
                              })
                            );
                            setIsPreviewOpen(true);
                          }}
                          className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600 font-light underline mt-2"
                        >
                          See more
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Media Content */}
                {(() => {
                  const hasMediaFiles = message.mediaFiles && (
                    (message.mediaFiles.images && message.mediaFiles.images.length > 0) ||
                    (message.mediaFiles.videos && message.mediaFiles.videos.length > 0) ||
                    (message.mediaFiles.audios && message.mediaFiles.audios.length > 0)
                  );

                  if (hasMediaFiles) {
                    const allMediaFiles = [
                      ...(message.mediaFiles.images || []).map((file, index) => ({ file, type: "image" as const, index })),
                      ...(message.mediaFiles.videos || []).map((file, index) => ({ file, type: "video" as const, index })),
                      ...(message.mediaFiles.audios || []).map((file, index) => ({ file, type: "audio" as const, index }))
                    ];

                    return (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="text-sm font-light text-slate-600">
                            Media Files ({allMediaFiles.length})
                          </h4>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {allMediaFiles.map(({ file, type, index }, globalIndex) => (
                            <div
                              key={globalIndex}
                              className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 relative group w-32 h-32 border border-slate-200/60"
                              onClick={() => {
                                if (type === "image") {
                                  setPreviewFile(
                                    new File([file], `image-${index + 1}.jpg`, {
                                      type: "image/jpeg",
                                    })
                                  );
                                  setIsPreviewOpen(true);
                                } else if (type === "video") {
                                  setPreviewFile(
                                    new File([file], `video-${index + 1}.mp4`, {
                                      type: "video/mp4",
                                    })
                                  );
                                  setIsPreviewOpen(true);
                                } else if (type === "audio") {
                                  setPreviewFile(
                                    new File([file], `audio-${index + 1}.mp3`, {
                                      type: "audio/mp3",
                                    })
                                  );
                                  setIsPreviewOpen(true);
                                }
                              }}
                            >
                              {type === "image" && (
                                <img
                                  src={file}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}

                              {type === "video" && (
                                <>
                                  <video
                                    src={file}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-8 h-8 text-white drop-shadow-lg">
                                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {type === "audio" && (
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center">
                                  <Mic className="w-8 h-8 text-slate-500 mb-2" />
                                  <span className="text-xs text-slate-500 font-light">
                                    AUDIO
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
                    );
                  } else {
                    // No media files to display
                    return null;
                  }
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                {!message.isSurprise && isEditable &&
                  (isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Message
                    </Button>
                  ))}
              </div>

              {isEditable && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Message
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this message? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Message
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Preview Dialog */}
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
                  <div
                    className="w-full h-full resize-none border-none outline-none text-base leading-relaxed text-gray-800 bg-transparent overflow-y-auto p-4"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {message?.content || ""}
                  </div>
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
    </>
  );
};
