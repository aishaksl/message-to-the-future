import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus,
  Send,
  Video,
  Image,
  Type,
  Mic,
  Users,
  Inbox,
  SendHorizontal,
  Eye,
  Gift,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageDetailsDialog } from "@/components/dashboard/MessageDetailsDialog";

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

// Legacy message interface for migration
interface LegacyMessage {
  id: string;
  subject: string;
  content: string;
  type?: "text" | "image" | "video" | "audio";
  types?: ("text" | "image" | "video" | "audio")[];
  deliveryDate?: Date | string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  deliveryMethod: "email" | "whatsapp" | "both";
  status: string;
  createdAt: Date | string;
  isSurprise: boolean;
  preview: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    // Load sent messages from localStorage
    const storedMessages = localStorage.getItem("sentMessages");
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      // Convert date strings back to Date objects and fix any legacy data structure
      const processedMessages = messages.map((message: LegacyMessage) => ({
        ...message,
        // Fix legacy 'types' field to 'type' field
        type: message.type || (message.types && message.types.length > 0 ? message.types[0] : "text"),
        deliveryDate: message.deliveryDate
          ? new Date(message.deliveryDate)
          : null,
        createdAt: message.createdAt ? new Date(message.createdAt) : null,
      }));
      setSentMessages(processedMessages);
      
      // Save the migrated data back to localStorage
      localStorage.setItem("sentMessages", JSON.stringify(processedMessages));
    }

    // Check for newly created message ID
    const messageId = localStorage.getItem("newMessageId");
    if (messageId) {
      setNewMessageId(messageId);
      localStorage.removeItem("newMessageId");

      // Clear the new message ID after 3 seconds
      setTimeout(() => {
        setNewMessageId(null);
      }, 3000);
    }
  }, []);

  // Mock data for demonstration
  const receivedMessages: Message[] = [
    {
      id: "1",
      subject: "Birthday Message",
      content: "Happy birthday! I hope you achieved everything you wanted...",
      type: "text",
      deliveryDate: new Date(2023, 5, 15),
      recipientName: "You",
      recipientEmail: "user@example.com",
      recipientPhone: "",
      deliveryMethod: "email",
      status: "delivered",
      createdAt: new Date(2023, 5, 15),
      isSurprise: false,
      preview: "Happy birthday! I hope you achieved everything you wanted...",
    },
    {
      id: "2",
      subject: "New Year Wishes",
      content: "A special video message from your past self",
      type: "video",
      deliveryDate: new Date(2023, 8, 22),
      recipientName: "You",
      recipientEmail: "user@example.com",
      recipientPhone: "",
      deliveryMethod: "email",
      status: "delivered",
      createdAt: new Date(2023, 8, 22),
      isSurprise: false,
      preview: "A special video message from your past self",
    },
  ];

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
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageTypes = (message: Message) => {
    const types = [];
    
    // Check for text content
    if (message.content && message.content.trim()) {
      types.push('text');
    }
    
    // Check for media files
    if (message.mediaFiles) {
      if (message.mediaFiles.images && message.mediaFiles.images.length > 0) {
        types.push('image');
      }
      if (message.mediaFiles.videos && message.mediaFiles.videos.length > 0) {
        types.push('video');
      }
      if (message.mediaFiles.audios && message.mediaFiles.audios.length > 0) {
        types.push('audio');
      }
    }
    
    // Fallback to the original type if no content detected
    if (types.length === 0) {
      types.push(message.type || 'text');
    }
    
    return types;
  };

  const renderMessageCard = (message: Message, type: 'sent' | 'received') => {
    const messageTypes = getMessageTypes(message);
    const isNewMessage = newMessageId === message.id;
    
    return (
      <div
        key={message.id}
        className={`group relative bg-gradient-to-br from-white/80 to-blue-50/40 border border-blue-200/30 rounded-xl p-8 cursor-pointer transition-all duration-500 hover:bg-gradient-to-br hover:from-white/90 hover:to-purple-50/40 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-100/20 ${
          isNewMessage ? "bg-gradient-to-br from-white/95 to-blue-100/50 border-blue-400/60 shadow-lg shadow-blue-200/30" : ""
        }`}
        onClick={() => handleViewMessage(message, type)}
      >
        {/* Zen Header - Minimal */}
        <div className="mb-8">
          <h4 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-blue-700 mb-3 leading-relaxed">
            {message.subject || 'Untitled'}
          </h4>
          <div className="w-12 h-px bg-gradient-to-r from-blue-300/60 to-purple-300/60 mb-6"></div>
          <div className="flex items-center justify-between text-xs font-light text-blue-600/70">
            <span>{message.recipientName}</span>
            {message.isSurprise && (
              <div className="text-purple-600/70">
                ✦
              </div>
            )}
          </div>
        </div>

        {/* Content - Minimal Preview */}
        <div className="mb-8">
          <p className="text-sm font-light text-slate-600 leading-loose line-clamp-1">
            {message.preview || message.content || '...'}
          </p>
        </div>

        {/* Footer - Essential Info Only */}
        <div className="flex items-center justify-between pt-6 border-t border-blue-200/20">
          <div className="flex items-center gap-4">
            {messageTypes.map((msgType, index) => (
              <div key={index} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-blue-600/80">
                  {getTypeIcon(msgType)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs font-light text-blue-500/70">
            {message.deliveryDate ? format(new Date(message.deliveryDate), "MMM yyyy") : format(new Date(message.createdAt), "MMM yyyy")}
          </div>
        </div>

        {/* Subtle Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`w-2 h-2 rounded-full ${
            message.status === 'delivered' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' :
            message.status === 'scheduled' ? 'bg-gradient-to-br from-blue-400 to-purple-500' :
            'bg-gradient-to-br from-slate-400 to-slate-500'
          }`}></div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewMessage = (message: Message, type: 'sent' | 'received' = 'sent') => {
    setSelectedMessage(message);
    setSelectedMessageType(type);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateMessage = (updatedMessage: Message) => {
    if (selectedMessageType === 'sent') {
      const updatedMessages = sentMessages.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      );
      setSentMessages(updatedMessages);
      localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
    }
    // For received messages, we don't update anything since they're read-only
  };

  const handleDeleteMessage = (messageId: string) => {
    if (selectedMessageType === 'sent') {
      const updatedMessages = sentMessages.filter((msg) => msg.id !== messageId);
      setSentMessages(updatedMessages);
      localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
    }
    // For received messages, we don't delete anything since they're read-only
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-200/25 to-pink-200/25 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header - Zen minimalist style */}
        <div className="text-center mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight">
              Your Journey
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-blue-600 opacity-70">Through Time</span>
            </h1>
            
            <div className="w-16 h-px bg-slate-300 mx-auto"></div>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
              Every message is a bridge between moments, connecting your past, present, and future.
            </p>
          </div>
          
          <div className="mt-8">
            <Button
              onClick={() => navigate("/create-message")}
              size="lg"
              className="text-white font-bold px-8 py-4 rounded-xl bg-gradient-to-r from-purple-300 to-purple-400 hover:brightness-110 hover:shadow-lg transition-all duration-200 border-0"
            >
              <MessageCircleHeart className="w-5 h-5 mr-3" />
              Create New Message
              <Sparkles className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </div>

        {/* Stats Cards - Glassmorphism design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">{sentMessages.length}</p>
                <p className="text-sm text-blue-600/70 font-light">
                  Messages Sent
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-blue-600">{sentMessages.filter(msg => msg.status === 'scheduled').length}</p>
                <p className="text-sm text-purple-600/70 font-light">
                  Scheduled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">{sentMessages.filter(msg => msg.status === 'delivered').length}</p>
                <p className="text-sm text-blue-600/70 font-light">
                  Delivered
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                <MessageCircleHeart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-blue-600">{receivedMessages.length}</p>
                <p className="text-sm text-purple-600/70 font-light">
                  Received
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs - Zen Design */}
        <div className="lg:hidden">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 overflow-hidden">
            <Tabs defaultValue="received" className="w-full">
              <div className="border-b border-blue-200/30">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent rounded-none p-0">
                  <TabsTrigger
                    value="received"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-300 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/30 transition-all font-light text-blue-600/70 hover:text-blue-800"
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="text-sm">Received</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sent"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-300 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/30 transition-all font-light text-blue-600/70 hover:text-blue-800"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="text-sm">Sent</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="received" className="m-0 p-6 animate-fade-in">
                {receivedMessages.length > 0 ? (
                  <div className="space-y-12">
                    {receivedMessages.map((message) => renderMessageCard(message, 'received'))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100/30">
                      <Inbox className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-blue-700/70 font-light">No received messages yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sent" className="m-0 p-6 animate-fade-in">
                {sentMessages.length > 0 ? (
                  <div className="space-y-12">
                    {sentMessages.map((message) => renderMessageCard(message, 'sent'))}
                    <div className="p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                      <p className="text-purple-700/70 text-sm mb-3 font-light">
                        Ready to send another message through time?
                      </p>
                      <button
                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto"
                        onClick={() => navigate("/create-message")}
                      >
                        <Plus className="h-4 w-4" />
                        Create New Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-100/30">
                      <SendHorizontal className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-purple-700/70 font-light mb-4">No sent messages yet</p>
                    <button
                      className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto"
                      onClick={() => navigate("/create-message")}
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Message
                    </button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Desktop Side-by-Side Layout - Zen Design */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Received Messages */}
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 overflow-hidden">
            <div className="p-6 border-b border-blue-200/30">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                  <Inbox className="h-4 w-4 text-white" />
                </div>
                Received Messages
              </h3>
            </div>
            <div className="p-6">
                {receivedMessages.length > 0 ? (
                  <div className="space-y-12">
                    {receivedMessages.map((message) => renderMessageCard(message, 'received'))}
                  </div>
                ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100/30">
                    <Inbox className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-blue-700/70 font-light">No received messages yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sent Messages */}
          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 overflow-hidden">
            <div className="p-6 border-b border-purple-200/30">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                  <SendHorizontal className="h-4 w-4 text-white" />
                </div>
                Sent Messages
              </h3>
            </div>
            <div className="p-6">
                {sentMessages.length > 0 ? (
                  <div className="space-y-12">
                    {sentMessages.map((message) => renderMessageCard(message, 'sent'))}
                  </div>
                ) : (
                <div className="p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                  <p className="text-purple-700/70 text-sm mb-3 font-light">
                    Ready to send another message through time?
                  </p>
                  <button
                    className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto"
                    onClick={() => navigate("/create-message")}
                  >
                    <Plus className="h-4 w-4" />
                    Create New Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Details Dialog */}
        <MessageDetailsDialog
          message={selectedMessage}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onUpdate={handleUpdateMessage}
          onDelete={handleDeleteMessage}
          isEditable={selectedMessageType === 'sent'}
        />
      </div>
    </div>
  );
};
