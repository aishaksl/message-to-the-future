import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Expand, X, Video, Mic, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getFilePreview, formatFileSize } from "@/utils/filePreview";

interface MessageContentCreatorProps {
  messageType: "text" | "image" | "video" | "audio";
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
  recipientType: "self" | "other";
  recipientName: string;
  totalFileSize?: number;
  maxFileSize?: number;
}

// Enhanced file preview component
const FilePreview = ({
  file,
  onClick,
}: {
  file: File;
  onClick: () => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        const previewUrl = await getFilePreview(file, {
          thumbnailSize: { width: 200, height: 200 },
          quality: 0.7
        });
        setPreview(previewUrl);
      } catch (error) {
        console.error('Error generating preview:', error);
        // Fallback to file URL for images
        if (file.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(file));
        }
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [file]);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div
      className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 group cursor-pointer rounded-lg overflow-hidden"
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Preview image/thumbnail */}
      {preview && !isLoading && (
        <img
          src={preview}
          alt={`${file.type.split('/')[0]} preview`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}

      {/* Fallback when no preview */}
      {!preview && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {file.type.startsWith('video/') && <Video className="w-16 h-16 text-white/60 mx-auto mb-2" />}
            {file.type.startsWith('audio/') && <Mic className="w-16 h-16 text-white/60 mx-auto mb-2" />}
            {file.type.startsWith('image/') && <Upload className="w-16 h-16 text-white/60 mx-auto mb-2" />}
            <p className="text-white/60 text-sm">{file.type.split('/')[0]} Preview</p>
          </div>
        </div>
      )}

      {/* File info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
        <p className="truncate">{file.name}</p>
        <p>{formatFileSize(file.size)}</p>
      </div>

      {/* Expand button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent ml-1"></div>
        </div>
      </div>
    </div>
  );
};

export const MessageContentCreator = ({
  messageType,
  subject,
  setSubject,
  messageText,
  setMessageText,
  selectedFiles,
  setSelectedFiles,
  onExpandFile,
  onExpandText,
  recipientType,
  recipientName,
  totalFileSize = 0,
  maxFileSize = 60 * 1024 * 1024,
}: MessageContentCreatorProps) => {
  const [isWriting, setIsWriting] = useState(false);

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Calculate percentage for progress bar
  const getUsagePercentage = () => {
    return Math.min((totalFileSize / maxFileSize) * 100, 100);
  };

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
      const fileArray = Array.from(files);

      // Calculate total size of new files
      const newFilesSize = fileArray.reduce((sum, file) => sum + file.size, 0);

      // Check if adding these files would exceed the limit
      if (totalFileSize + newFilesSize > maxFileSize) {
        alert(
          `Adding these files would exceed the 60MB limit. Current size: ${formatFileSize(
            totalFileSize
          )}, New files: ${formatFileSize(newFilesSize)}`
        );
        return;
      }

      // Check individual file sizes
      const oversizedFiles = fileArray.filter(
        (file) => file.size > maxFileSize
      );
      if (oversizedFiles.length > 0) {
        alert(
          `Some files exceed the 60MB limit: ${oversizedFiles
            .map((f) => `${f.name} (${formatFileSize(f.size)})`)
            .join(", ")}`
        );
        return;
      }

      setSelectedFiles((prev) => ({
        ...prev,
        [messageType]: fileArray,
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Your Message</h3>
        <p className="text-muted-foreground text-sm">
          Pour your heart into words
        </p>
      </div>

      <div>
        <Label htmlFor="subject" className="text-base">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="Give your message a title..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* File Size Indicator */}
      {totalFileSize > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              Content Size: {formatFileSize(totalFileSize)} /{" "}
              {formatFileSize(maxFileSize)}
            </span>
            <span className="text-xs text-blue-600">
              {getUsagePercentage().toFixed(0)}% used
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsagePercentage() > 90
                ? "bg-red-500"
                : getUsagePercentage() > 70
                  ? "bg-yellow-500"
                  : "bg-blue-500"
                }`}
              style={{ width: `${getUsagePercentage()}%` }}
            />
          </div>
          {getUsagePercentage() > 90 && (
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Approaching size limit. Consider removing some files.
            </p>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Label className="text-base">Message Content</Label>
            {selectedFiles[messageType as keyof typeof selectedFiles]?.length >
              0 &&
              messageType !== "text" && (
                <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                </div>
              )}
          </div>
          {((selectedFiles[messageType as keyof typeof selectedFiles]?.length >
            0 &&
            messageType !== "text") ||
            (messageType === "text" && messageText.trim().length > 0)) && (
              <div className="flex gap-2">
                {messageType === "text" ? (
                  <>
                    <button
                      onClick={onExpandText}
                      className="p-1 transition-transform duration-200 hover:scale-125"
                      title="Expand"
                    >
                      <Expand className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => {
                        setMessageText("");
                        setIsWriting(false);
                      }}
                      className="p-1 transition-transform duration-200 hover:scale-125"
                      title="Clear"
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
                      title="Expand"
                    >
                      <Expand className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => removeFile(0)}
                      className="p-1 transition-transform duration-200 hover:scale-125"
                      title="Delete"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            )}
        </div>

        {messageType === "text" ? (
          <>
            {!isWriting && messageText.length === 0 ? (
              // Upload-style interface when no text is entered
              <div className="relative border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-background/20 min-h-[240px] flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm mb-2">Start writing your message</p>
                <p className="text-muted-foreground text-xs mb-4">
                  Click to begin typing your thoughts
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsWriting(true);
                  }}
                  type="button"
                >
                  Start Writing
                </Button>
              </div>
            ) : (
              // Normal textarea when user has started typing - with expanded layout like other file types
              <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl">
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
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
                      className="h-56 resize-none border-primary/20 bg-background/50 p-3"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}
          </>
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
              id={`fileInput-${messageType}`}
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
                        `fileInput-${messageType}`
                      ) as HTMLInputElement;
                      if (input) input.click();
                    }}
                    type="button"
                  >
                    Choose Files
                  </Button>
                </div>
              )}

            {selectedFiles[messageType as keyof typeof selectedFiles]?.length >
              0 && (
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-xl">
                  <div className="flex justify-center">
                    <div className="w-full max-w-md space-y-4">
                      {selectedFiles[
                        messageType as keyof typeof selectedFiles
                      ].map((file, index) => (
                        <div key={index} className="group">
                          <div
                            className={`w-full h-40 bg-muted rounded-xl border-2 border-primary/20 shadow-sm overflow-hidden relative transition-all duration-300 ${messageType === "audio"
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
                              <FilePreview
                                file={file}
                                onClick={() => onExpandFile(file)}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 p-4 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const audio = e.currentTarget.querySelector(
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
                                ` • ${messageType === "video" ? "Video" : "Audio"
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
  );
};
