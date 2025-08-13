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
                          className="w-full h-40 bg-muted rounded-xl border-2 border-primary/20 shadow-sm overflow-hidden relative cursor-pointer hover:border-primary/40 transition-all duration-300"
                          onClick={() => onExpandFile(file)}
                        >
                          {messageType === "image" ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : messageType === "video" ? (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                              <div className="flex flex-col items-center gap-2">
                                <Mic className="w-8 h-8 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                  Audio File
                                </span>
                              </div>
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
