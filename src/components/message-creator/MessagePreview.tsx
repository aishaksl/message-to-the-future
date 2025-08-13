import { format } from "date-fns";

interface MessagePreviewProps {
  subject: string;
  selectedDate: Date | undefined;
  messageType: "text" | "image" | "video" | "audio";
  messageText: string;
}

export const MessagePreview = ({
  subject,
  selectedDate,
  messageType,
  messageText,
}: MessagePreviewProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Message Preview</h3>
        <p className="text-muted-foreground text-sm">
          Review your message before sending
        </p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Subject</span>
            <span className="text-sm">{subject}</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Delivery</span>
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
    </div>
  );
};
