import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Expand, X, Video, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
}

// Video thumbnail component
const VideoThumbnail = ({
  file,
  onClick,
}: {
  file: File;
  onClick: () => void;
}) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateThumbnail = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const handleLoadedData = () => {
        // Video boyutlarını ayarla
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 1 saniyeye git veya video süresinin 1/4'üne
        video.currentTime = Math.min(1, video.duration / 4);
      };

      const handleSeeked = () => {
        // Canvas'a video frame'ini çiz
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Canvas'ı base64'e çevir
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        setThumbnail(thumbnailUrl);
        setIsLoading(false);
      };

      const handleError = () => {
        console.log("Video thumbnail oluşturulamadı");
        setIsLoading(false);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("error", handleError);

      video.src = URL.createObjectURL(file);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("seeked", handleSeeked);
        video.removeEventListener("error", handleError);
        URL.revokeObjectURL(video.src);
      };
    };

    generateThumbnail();
  }, [file]);

  return (
    <div
      className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 group cursor-pointer"
      onClick={onClick}
    >
      {/* Hidden video element for thumbnail generation */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        muted
        preload="metadata"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Thumbnail image */}
      {thumbnail && !isLoading && (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}

      {/* Fallback when no thumbnail */}
      {!thumbnail && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Video className="w-16 h-16 text-white/60 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Video Preview</p>
          </div>
        </div>
      )}

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
}: MessageContentCreatorProps) => {
  const [isWriting, setIsWriting] = useState(false);

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
                    title="Büyüt"
                  >
                    <Expand className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => {
                      setMessageText("");
                      setIsWriting(false);
                    }}
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
                      placeholder="Dear future me, today I want to remember... I hope you know that... I'm grateful for... I dream that..."
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
                            <VideoThumbnail
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
                              ` • ${
                                messageType === "video" ? "Video" : "Audio"
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
