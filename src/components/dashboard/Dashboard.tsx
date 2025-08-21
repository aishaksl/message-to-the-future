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
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">{sentMessages.length}</p>
                <p className="text-sm text-slate-500 font-light">
                  Messages Sent
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-blue-600">{sentMessages.filter(msg => msg.status === 'scheduled').length}</p>
                <p className="text-sm text-slate-500 font-light">
                  Scheduled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-emerald-600">{sentMessages.filter(msg => msg.status === 'delivered').length}</p>
                <p className="text-sm text-slate-500 font-light">
                  Delivered
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <MessageCircleHeart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-pink-600">{receivedMessages.length}</p>
                <p className="text-sm text-slate-500 font-light">
                  Received
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs - Zen Design */}
        <div className="lg:hidden">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden">
            <Tabs defaultValue="received" className="w-full">
              <div className="border-b border-slate-200/50">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent rounded-none p-0">
                  <TabsTrigger
                    value="received"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-purple-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:shadow-none transition-all font-light"
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="text-sm">Received</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sent"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-purple-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:shadow-none transition-all font-light"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="text-sm">Sent</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="received" className="m-0 p-6 animate-fade-in">
                <div className="space-y-4">
                  {receivedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="group py-4 px-2 cursor-pointer transition-all duration-300 hover:bg-slate-50/50 rounded-lg border-b border-slate-100/50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors">
                            {getTypeIcon(message.type)}
                          </div>
                          <div>
                            <p className="font-light text-slate-800 group-hover:text-slate-900">
                              {message.subject}
                            </p>
                            <p className="text-sm text-slate-500 font-light">
                              {format(new Date(message.createdAt), "MMM dd")}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 font-light">
                          received
                        </div>
                      </div>
                    </div>
                  ))}

                  {receivedMessages.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Inbox className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-light mb-1">
                        No received messages yet
                      </p>
                      <p className="text-xs text-slate-500 font-light">
                        Your future messages will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sent" className="m-0 p-6 animate-fade-in">
                <div className="space-y-4">
                  {sentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`group py-4 px-2 cursor-pointer transition-all duration-300 hover:bg-slate-50/50 rounded-lg border-b border-slate-100/50 last:border-b-0 ${newMessageId === message.id
                          ? "bg-blue-50/50 animate-fade-in"
                          : ""
                        }`}
                      onClick={() => handleViewMessage(message, 'sent')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors">
                            {getTypeIcon(message.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-light text-slate-800 group-hover:text-slate-900">
                              {message.subject}
                            </p>
                            <p className="text-sm text-slate-500 font-light line-clamp-2 mb-1 break-words">
                              {message.preview || message.content}
                            </p>
                            <p className="text-xs text-slate-400 font-light">
                              {message.deliveryDate && format(
                                new Date(message.deliveryDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.isSurprise && (
                            <div className="text-xs text-purple-600 font-light">
                              🎁
                            </div>
                          )}
                          <div className={`text-xs font-light ${message.status === 'delivered' ? 'text-green-600' :
                              message.status === 'scheduled' ? 'text-blue-600' :
                                'text-slate-500'
                            }`}>
                            {message.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-6 border-2 border-dashed border-slate-200/50 rounded-xl text-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-slate-600 text-sm mb-3 font-light">
                      Ready to send another message through time?
                    </p>
                    <button
                      className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                      onClick={() => navigate("/create-message")}
                    >
                      <Plus className="h-4 w-4" />
                      Create New Message
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Desktop Side-by-Side Layout - Zen Design */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Received Messages */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden">
            <div className="p-6 border-b border-slate-200/50">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-slate-600 to-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <Inbox className="h-4 w-4 text-blue-600" />
                </div>
                Received Messages
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {receivedMessages.map((message) => (
                <div
                  key={message.id}
                  className="group py-4 px-2 cursor-pointer transition-all duration-300 hover:bg-slate-50/50 rounded-lg border-b border-slate-100/50 last:border-b-0"
                  onClick={() => handleViewMessage(message, 'received')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {getTypeIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-slate-800 group-hover:text-slate-900">{message.subject}</p>
                        <p className="text-sm text-slate-500 font-light line-clamp-2 mb-1 break-words">
                          {message.preview || message.content}
                        </p>
                        <p className="text-xs text-slate-400 font-light">
                          {format(new Date(message.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-light">
                      received
                    </div>
                  </div>
                </div>
              ))}

              {receivedMessages.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Inbox className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-light">No received messages yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sent Messages */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden">
            <div className="p-6 border-b border-slate-200/50">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-slate-600 to-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <SendHorizontal className="h-4 w-4 text-blue-600" />
                </div>
                Sent Messages
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {sentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group py-4 px-2 cursor-pointer transition-all duration-300 hover:bg-slate-50/50 rounded-lg border-b border-slate-100/50 last:border-b-0 ${newMessageId === message.id
                      ? "bg-blue-50/50 animate-fade-in"
                      : ""
                    }`}
                  onClick={() => handleViewMessage(message, 'sent')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {getTypeIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-slate-800 group-hover:text-slate-900">
                          {message.subject}
                        </p>
                        <p className="text-sm text-slate-500 font-light line-clamp-2 mb-1 break-words">
                          {message.preview || message.content}
                        </p>
                        <p className="text-xs text-slate-400 font-light">
                          {message.deliveryDate && format(
                            new Date(message.deliveryDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.isSurprise && (
                        <div className="text-xs text-purple-600 font-light">
                          🎁
                        </div>
                      )}
                      <div className={`text-xs font-light ${message.status === 'delivered' ? 'text-green-600' :
                          message.status === 'scheduled' ? 'text-blue-600' :
                            'text-slate-500'
                        }`}>
                        {message.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-6 border-2 border-dashed border-slate-200/50 rounded-xl text-center bg-gradient-to-br from-slate-50 to-slate-100">
                <p className="text-slate-600 text-sm mb-3 font-light">
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
