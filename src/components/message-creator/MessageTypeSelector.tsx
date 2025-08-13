import { Type, Image, Video, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageTypeSelectorProps {
  messageType: "text" | "image" | "video" | "audio";
  setMessageType: (type: "text" | "image" | "video" | "audio") => void;
}

export const MessageTypeSelector = ({
  messageType,
  setMessageType,
}: MessageTypeSelectorProps) => {
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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Choose Message Type</h3>
        <p className="text-muted-foreground text-sm">
          How do you want to express yourself?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {messageTypes.map(({ type, icon: Icon, label, description }) => (
          <button
            key={type}
            onClick={() => setMessageType(type)}
            className={cn(
              "p-6 rounded-xl border-2 transition-all duration-200 text-left",
              messageType === type
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border/40 hover:border-primary/40"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 mb-3",
                messageType === type ? "text-primary" : "text-muted-foreground"
              )}
            />
            <h4 className="font-medium text-sm mb-1">{label}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
