import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Expand, X, Video, Mic } from "lucide-react";

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
                            <div className="relative w-full h-full bg-gray-900">
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                muted
                                preload="metadata"
                                onLoadedData={(e) => {
                                  // Video yüklendiğinde ilk kareyi göster
                                  const video = e.target as HTMLVideoElement;
                                  video.currentTime = 1; // 1 saniyeye git
                                }}
                                onError={() => {
                                  // Video yüklenemezse fallback göster
                                  console.log("Video yüklenemedi");
                                }}
                              />
                              {/* Fallback için video ikonu */}
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Video className="w-12 h-12 text-white/60" />
                              </div>
                              {/* Oynatma ikonu */}
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
