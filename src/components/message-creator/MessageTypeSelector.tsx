import { Type, Image, Video, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageTypeSelectorProps {
  selectedTypes: ("text" | "image" | "video" | "audio")[];
  setSelectedTypes: (types: ("text" | "image" | "video" | "audio")[]) => void;
  messageText: string;
  selectedFiles: {
    image: File[];
    video: File[];
    audio: File[];
  };
}

export const MessageTypeSelector = ({
  selectedTypes,
  setSelectedTypes,
  messageText,
  selectedFiles,
}: MessageTypeSelectorProps) => {
  const toggleType = (type: "text" | "image" | "video" | "audio") => {
    console.log("toggleType called with:", type);
    console.log("selectedTypes:", selectedTypes);
    console.log("setSelectedTypes:", setSelectedTypes);

    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
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
        {messageTypes.map(({ type, icon: Icon, label, description }) => {
          const isSelected = selectedTypes.includes(type);

          // İçerik var mı kontrol et
          const hasContent = () => {
            switch (type) {
              case "text":
                return messageText.trim().length > 0;
              case "image":
                return selectedFiles.image.length > 0;
              case "video":
                return selectedFiles.video.length > 0;
              case "audio":
                return selectedFiles.audio.length > 0;
              default:
                return false;
            }
          };

          const typeHasContent = hasContent();
          const shouldHighlight = isSelected && typeHasContent;

          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                "p-6 rounded-xl border-2 transition-all duration-200 text-left",
                shouldHighlight
                  ? "border-primary bg-primary/5 shadow-lg"
                  : isSelected
                  ? "border-primary/50 bg-primary/2"
                  : "border-border/40 hover:border-primary/40"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 mb-3",
                  shouldHighlight
                    ? "text-primary"
                    : isSelected
                    ? "text-primary/70"
                    : "text-muted-foreground"
                )}
              />
              <h4 className="font-medium text-sm mb-1">{label}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
