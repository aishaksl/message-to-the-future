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

interface MessageDetailsDialogProps {
  message: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedMessage: any) => void;
  onDelete: (messageId: string) => void;
}

export const MessageDetailsDialog = ({
  message,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: MessageDetailsDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (message) {
      setEditedSubject(message.subject || "");
      setEditedContent(message.content || "");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(message.type)}
              {isEditing ? (
                <Input
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="Message subject..."
                />
              ) : (
                <span>{message.subject}</span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {message.isSurprise && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  Surprise
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {message.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Recipient</Label>
              <p className="font-medium">{message.recipientName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Delivery Date</Label>
              <p className="font-medium">
                {message.deliveryDate
                  ? format(new Date(message.deliveryDate), "MMM dd, yyyy")
                  : "Not set"}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Delivery Method</Label>
              <div className="flex items-center gap-2">
                {getDeliveryIcon(message.deliveryMethod)}
                <span className="font-medium capitalize">
                  {message.deliveryMethod}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Badge variant="outline" className="font-medium">
                {message.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Message Content */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Message Content
            </Label>
            {message.isSurprise && !isEditing ? (
              <div className="p-6 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 text-center">
                <Gift className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-primary font-medium mb-2">
                  Surprise Message
                </p>
                <p className="text-sm text-muted-foreground">
                  This is a surprise message. The content is hidden to preserve
                  the surprise!
                </p>
              </div>
            ) : isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Your message content..."
              />
            ) : (
              <div className="p-4 bg-muted/30 rounded-lg border">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content || `This is a ${message.type} message.`}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-2">
              {!message.isSurprise &&
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
