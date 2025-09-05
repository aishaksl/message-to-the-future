import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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
  Sparkles,
  Loader2,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageDetailsDialog } from "@/components/dashboard/MessageDetailsDialog";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserMessages,
  getReceivedMessages,
  Message as FirebaseMessage,
} from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id?: string;
  senderId: string;
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName: string;
  recipientType: 'self' | 'other';
  subject: string;
  content: string;
  type: "text" | "image" | "video" | "audio";
  deliveryDate: Date;
  deliveryMethod: "email" | "whatsapp" | "both";
  status: "scheduled" | "delivered" | "failed";
  isSurprise: boolean;
  mediaUrls?: string[];
  createdAt: Date;
  deliveredAt?: Date;
  preview?: string; // Optional field for UI display
  senderName?: string;
  // Legacy media file data for backward compatibility
  mediaFiles?: {
    images?: string[];
    videos?: string[];
    audios?: string[];
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<
    "sent" | "received"
  >("sent");
  const [activeTab, setActiveTab] = useState<string>("received");

  // Handle tab change with scroll position preservation
  const handleTabChange = (newTab: string) => {
    // Store current scroll position
    const currentScrollY = window.scrollY;

    setActiveTab(newTab);

    // Restore scroll position after tab change
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  // Load messages from Firebase
  const loadMessages = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load sent messages
      const { messages: sent, error: sentError } = await getUserMessages(
        user.uid
      );
      if (sentError) {
        toast({
          title: "Error loading sent messages",
          description: sentError,
          variant: "destructive",
        });
      } else {
        // Add preview field to Firebase messages
        const messagesWithPreview = (sent || []).map((msg: FirebaseMessage) => ({
          ...msg,
          preview: msg.content ? msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '') : ''
        }));
        setSentMessages(messagesWithPreview);
      }

      // Load received messages
      const { messages: received, error: receivedError } =
        await getReceivedMessages(user.email || "");
      if (receivedError) {
        toast({
          title: "Error loading received messages",
          description: receivedError,
          variant: "destructive",
        });
      } else {
        // Add preview field to Firebase messages
        const receivedWithPreview = (received || []).map((msg: FirebaseMessage) => ({
          ...msg,
          preview: msg.content ? msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '') : ''
        }));
        setReceivedMessages(receivedWithPreview);
      }
    } catch (error) {
      toast({
        title: "Error loading messages",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMessages();
    }

    // Check for newly created message ID
    const messageId = localStorage.getItem("newMessageId");
    if (messageId) {
      setNewMessageId(messageId);
      localStorage.removeItem("newMessageId");

      // Clear the new message ID after 5 seconds
      setTimeout(() => {
        setNewMessageId(null);
      }, 5000);
    }

    // Listen for new message creation events
    const handleNewMessage = (event: CustomEvent) => {
      const { messageId } = event.detail;

      // Reload messages from Firebase
      if (user) {
        loadMessages();
      }

      // Set the new message ID for animation
      setNewMessageId(messageId);

      // Clear the animation after 5 seconds
      setTimeout(() => {
        setNewMessageId(null);
      }, 5000);
    };

    window.addEventListener(
      "newMessageCreated",
      handleNewMessage as EventListener
    );

    return () => {
      window.removeEventListener(
        "newMessageCreated",
        handleNewMessage as EventListener
      );
    };
  }, [user]);

  // Handle auto-scrolling to specific message
  useEffect(() => {
    const hash = window.location.hash;

    if (hash && hash.startsWith("#message-")) {
      const messageId = hash.replace("#message-", "");

      // Switch to sent tab when there's a message fragment
      const currentScrollY = window.scrollY;
      setActiveTab("sent");

      // Restore scroll position immediately after tab change
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });

      const messageElement = document.getElementById(`message-${messageId}`);

      if (messageElement) {
        // Detect mobile device and viewport
        const isMobile =
          window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        const delay = isMobile ? 1200 : 500; // Increased mobile delay

        const scrollToMessage = () => {
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });

          // Additional mobile-specific scroll adjustment
          if (isMobile) {
            setTimeout(() => {
              const rect = messageElement.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const offset = viewportHeight * 0.15; // 15% offset from top for mobile nav/status bars

              window.scrollBy({
                top: -offset,
                behavior: "smooth",
              });
            }, 300);
          }
        };

        setTimeout(scrollToMessage, delay);

        // Handle orientation changes on mobile
        if (isMobile) {
          const handleOrientationChange = () => {
            setTimeout(scrollToMessage, 300);
          };
          window.addEventListener("orientationchange", handleOrientationChange);

          return () => {
            window.removeEventListener(
              "orientationchange",
              handleOrientationChange
            );
          };
        }
      } else {
        // Retry after a longer delay if element not found (for mobile)
        setTimeout(() => {
          const retryElement = document.getElementById(`message-${messageId}`);
          if (retryElement) {
            retryElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 1000);
      }
    }
  }, [sentMessages]); // Re-run when messages are loaded

  // receivedMessages is now loaded from Firebase in useEffect

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
      types.push("text");
    }

    // Check for media URLs (new format)
    if (message.mediaUrls && message.mediaUrls.length > 0) {
      message.mediaUrls.forEach(url => {
        if (url.includes('/images/')) {
          if (!types.includes('image')) types.push('image');
        } else if (url.includes('/videos/')) {
          if (!types.includes('video')) types.push('video');
        } else if (url.includes('/audios/')) {
          if (!types.includes('audio')) types.push('audio');
        }
      });
    }

    // Check for legacy media files format
    if (message.mediaFiles) {
      if (message.mediaFiles.images && message.mediaFiles.images.length > 0) {
        types.push("image");
      }
      if (message.mediaFiles.videos && message.mediaFiles.videos.length > 0) {
        types.push("video");
      }
      if (message.mediaFiles.audios && message.mediaFiles.audios.length > 0) {
        types.push("audio");
      }
    }

    // Fallback to the original type if no content detected
    if (types.length === 0) {
      types.push(message.type || "text");
    }

    return types;
  };

  const renderMessageCard = (message: Message, type: "sent" | "received") => {
    const messageTypes = getMessageTypes(message);
    const isNewMessage = newMessageId === message.id;

    return (
      <motion.div
        key={message.id}
        id={`message-${message.id}`}
        className="group relative bg-gradient-to-br from-white/80 to-blue-50/40 border border-blue-200/30 rounded-xl p-8 cursor-pointer transition-all duration-500 hover:bg-gradient-to-br hover:from-white/90 hover:to-purple-50/40 hover:border-blue-300/50 hover:shadow-lg hover:shadow-blue-100/20"
        onClick={() => handleViewMessage(message, type)}
        initial={
          isNewMessage
            ? {
              opacity: 0.6,
              scale: 0.98,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }
            : false
        }
        animate={
          isNewMessage
            ? {
              opacity: [0.6, 1, 0.6, 1, 1],
              scale: [0.98, 1, 0.98, 1, 1],
              backgroundColor: [
                "rgba(255, 255, 255, 0.8)",
                "rgba(219, 234, 254, 0.9)",
                "rgba(255, 255, 255, 0.8)",
                "rgba(219, 234, 254, 0.9)",
                "rgba(255, 255, 255, 0.8)",
              ],
            }
            : {}
        }
        transition={
          isNewMessage
            ? { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" }
            : {}
        }
      >
        {/* Zen Header - Minimal */}
        <div className="mb-8">
          <h4 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-blue-700 mb-3 leading-relaxed">
            {message.subject || "Untitled"}
          </h4>
          <div className="w-12 h-px bg-gradient-to-r from-blue-300/60 to-purple-300/60 mb-6"></div>
          <div className="flex items-center justify-between text-xs font-light text-blue-600/70">
            <span>{message.recipientName}</span>
            {message.isSurprise && <div className="text-purple-600/70">✦</div>}
          </div>
        </div>

        {/* Content - Minimal Preview */}
        <div className="mb-8">
          <p className="text-sm font-light text-slate-600 leading-loose line-clamp-1">
            {message.preview || message.content || "..."}
          </p>
        </div>

        {/* Footer - Essential Info Only */}
        <div className="flex items-center justify-between pt-6 border-t border-blue-200/20">
          <div className="flex items-center gap-4">
            {messageTypes.map((msgType, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
              >
                <div className="text-blue-600/80">{getTypeIcon(msgType)}</div>
              </div>
            ))}
          </div>
          <div className="text-xs font-light text-blue-500/70">
            {message.deliveryDate
              ? format(new Date(message.deliveryDate), "MMM yyyy")
              : format(new Date(message.createdAt), "MMM yyyy")}
          </div>
        </div>

        {/* Subtle Status Indicator */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-2 h-2 rounded-full ${message.status === "delivered"
              ? "bg-gradient-to-br from-emerald-400 to-emerald-500"
              : message.status === "scheduled"
                ? "bg-gradient-to-br from-blue-400 to-purple-500"
                : "bg-gradient-to-br from-slate-400 to-slate-500"
              }`}
          ></div>
        </div>
      </motion.div>
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

  const handleViewMessage = (
    message: Message,
    type: "sent" | "received" = "sent"
  ) => {
    setSelectedMessage(message);
    setSelectedMessageType(type);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateMessage = (updatedMessage: Message) => {
    if (selectedMessageType === "sent") {
      const updatedMessages = sentMessages.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      );
      setSentMessages(updatedMessages);
      localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
    }
    // For received messages, we don't update anything since they're read-only
  };

  const handleDeleteMessage = (messageId: string) => {
    if (selectedMessageType === "sent") {
      const updatedMessages = sentMessages.filter(
        (msg) => msg.id !== messageId
      );
      setSentMessages(updatedMessages);
      localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
    }
    // For received messages, we don't delete anything since they're read-only
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your messages...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-light mb-2">
            Sign in to view your messages
          </h2>
          <p className="text-muted-foreground mb-4">
            Access your dashboard and manage your time messages
          </p>
          <Button onClick={() => navigate("/?view=signin")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large bubbles */}
        <div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 top-10 left-10"
          style={{ borderRadius: "50% 30% 70% 40%" }}
        ></div>
        <div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-300/20 to-purple-400/20 top-32 right-16"
          style={{ borderRadius: "60% 40% 30% 70%" }}
        ></div>
        <div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-300/15 to-blue-400/15 bottom-20 left-20"
          style={{ borderRadius: "40% 60% 70% 30%" }}
        ></div>
        <div
          className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-violet-300/18 to-purple-500/18 top-16 right-1/3"
          style={{ borderRadius: "45% 55% 65% 35%" }}
        ></div>

        {/* Medium bubbles */}
        <div
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-300/30 bottom-1/3 right-10"
          style={{ borderRadius: "30% 70% 40% 60%" }}
        ></div>
        <div
          className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-amber-300/22 to-yellow-400/22 top-2/3 left-1/2"
          style={{ borderRadius: "55% 45% 35% 65%" }}
        ></div>

        {/* Small bubbles */}
        <div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-emerald-200/25 to-green-300/25 top-1/2 right-1/4"
          style={{ borderRadius: "65% 35% 45% 55%" }}
        ></div>
        <div
          className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-300/20 bottom-1/2 left-1/4"
          style={{ borderRadius: "40% 60% 30% 70%" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-2 sm:pt-36 max-w-7xl relative z-10">
        {/* Header - Zen minimalist style */}
        <div className="text-center mb-4 md:mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 to-purple-600 leading-tight tracking-tight">
              Your Journey
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-blue-600 opacity-70">
                Through Time
              </span>
            </h1>

            <div className="w-16 h-px bg-slate-300 mx-auto"></div>

            <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed font-light">
              Every message is a bridge between moments, connecting your past,
              present, and future.
            </p>
          </div>

          <div className="md:mt-8 mt-4">
            <Button
              onClick={() =>
                navigate("/create-message", { state: { fromButton: true } })
              }
              size="lg"
              className="text-white font-bold px-8 py-4 rounded-xl bg-[#938ef6] hover:bg-[#8279E6] border-0"
            >
              <Plus className="w-5 h-5" />
              Create New Message
            </Button>
          </div>
        </div>

        {/* Stats Cards - Glassmorphism design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-8 md:mb-12">
          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-[#938ef6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">
                  {sentMessages.length}
                </p>
                <p className="text-sm text-blue-600/70 font-light">Sent</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-[#938ef6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-blue-600">
                  {
                    sentMessages.filter((msg) => msg.status === "scheduled")
                      .length
                  }
                </p>
                <p className="text-sm text-purple-600/70 font-light">
                  Scheduled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-[#938ef6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-purple-600">
                  {
                    sentMessages.filter((msg) => msg.status === "delivered")
                      .length
                  }
                </p>
                <p className="text-sm text-blue-600/70 font-light">Delivered</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/30 p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-[#938ef6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                <Inbox className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-blue-600">
                  {receivedMessages.length}
                </p>
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
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="border-b border-blue-200/30">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent rounded-none p-0">
                  <TabsTrigger
                    value="received"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-[#938ef6] data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/30 transition-all font-light text-blue-600/70 hover:text-blue-800"
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="text-sm">Received</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sent"
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-[#938ef6] data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/30 transition-all font-light text-blue-600/70 hover:text-blue-800"
                  >
                    <Send className="h-4 w-4" />
                    <span className="text-sm">Sent</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="received" className="m-0 p-6 animate-fade-in">
                {receivedMessages.length > 0 ? (
                  <div className="space-y-12">
                    {receivedMessages.map((message) =>
                      renderMessageCard(message, "received")
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 space-y-4">
                    <div >
                      <Inbox className="w-8 h-8 text-[#938ef6]" />
                    </div>
                    <p className="text-black/50 text-sm mb-3 font-light">
                      No received messages yet
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sent" className="m-0 p-6 animate-fade-in">
                {sentMessages.length > 0 ? (
                  <div className="space-y-12">
                    {sentMessages.map((message) =>
                      renderMessageCard(message, "sent")
                    )}
                    <div className="p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                      <p className="text-purple-700/70 text-sm mb-3 font-light">
                        Ready to send another message through time?
                      </p>
                      <button
                        className="bg-purple-400 text-white px-4 py-2 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto"
                        onClick={() =>
                          navigate("/create-message", {
                            state: { fromButton: true },
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Create New Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center">
                    <p className="text-black/50 text-sm mb-3 font-light">
                      No sent messages yet
                    </p>
                    <button
                      className="bg-purple-400 text-white px-4 py-2 rounded-xl font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mx-auto"
                      onClick={() =>
                        navigate("/create-message", {
                          state: { fromButton: true },
                        })
                      }
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
          <div className="backdrop-blur-xl border border-blue-200/40 rounded-2xl shadow-lg shadow-blue-100/20 overflow-hidden">
            <div className="p-6 border-b border-blue-200/30">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#938ef6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
                  <Inbox className="h-4 w-4 text-white" />
                </div>
                Received Messages
              </h3>
            </div>
            <div className="p-6">
              {receivedMessages.length > 0 ? (
                <div className="space-y-12">
                  {receivedMessages.map((message) =>
                    renderMessageCard(message, "received")
                  )}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center p-6 border-2 border-dashed border-purple-200/50 rounded-xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 space-y-4">
                  <div>
                    <Inbox className="h-8 w-8 text-[#938ef6]" />
                  </div>
                  <p className="text-slate-600 font-light">
                    No received messages yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sent Messages */}
          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-purple-200/40 rounded-2xl shadow-lg shadow-purple-100/20 overflow-hidden">
            <div className="p-6 border-b border-purple-200/30">
              <h3 className="text-xl font-extralight bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#938ef6] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                  <Send className="h-4 w-4 text-white" />
                </div>
                Sent Messages
              </h3>
            </div>
            <div className="p-6">
              {sentMessages.length > 0 ? (
                <div className="space-y-12">
                  {sentMessages.map((message) =>
                    renderMessageCard(message, "sent")
                  )}
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                  <p className="text-slate-600 text-sm mb-3 font-light">
                    Ready to send another message through time?
                  </p>
                  <button
                    className="bg-[#938ef6] hover:bg-[#8279E6] text-white px-4 py-2 rounded-xl font-light transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    onClick={() =>
                      navigate("/create-message", {
                        state: { fromButton: true },
                      })
                    }
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
          isEditable={selectedMessageType === "sent"}
        />
      </div>
    </div>
  );
};
