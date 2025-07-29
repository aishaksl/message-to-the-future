import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, CheckCircle, MessageSquare, Plus, Send, Video, Image, Type, Users, Inbox, SendHorizontal, Eye, Gift } from "lucide-react";
import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageDetailsDialog } from "@/components/MessageDetailsDialog";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load sent messages from localStorage
    const storedMessages = localStorage.getItem("sentMessages");
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      // Convert date strings back to Date objects
      const processedMessages = messages.map((message: any) => ({
        ...message,
        deliveryDate: message.deliveryDate ? new Date(message.deliveryDate) : null,
        createdAt: message.createdAt ? new Date(message.createdAt) : null,
      }));
      setSentMessages(processedMessages);
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
  const receivedMessages = [
    {
      id: 1,
      subject: "Birthday Message",
      type: "text",
      receivedDate: new Date(2023, 5, 15),
      preview: "Happy birthday! I hope you achieved everything you wanted...",
    },
    {
      id: 2,
      subject: "New Year Wishes",
      type: "video",
      receivedDate: new Date(2023, 8, 22),
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
        return <Type className="h-4 w-4" />;
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

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateMessage = (updatedMessage: any) => {
    const updatedMessages = sentMessages.map(msg => 
      msg.id === updatedMessage.id ? updatedMessage : msg
    );
    setSentMessages(updatedMessages);
    localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = sentMessages.filter(msg => msg.id !== messageId);
    setSentMessages(updatedMessages);
    localStorage.setItem("sentMessages", JSON.stringify(updatedMessages));
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4 md:py-8 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">Track your messages across time</p>
          </div>
          <Button 
            className="flex items-center gap-2 w-full md:w-auto"
            onClick={() => navigate("/create-message")}
          >
            <Plus className="h-4 w-4" />
            Create Message
          </Button>
        </div>
        
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold">12</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Messages Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold">3</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold">8</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold">5</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Recipients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Card className="overflow-hidden">
            <Tabs defaultValue="received" className="w-full">
              <div className="border-b border-border">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent rounded-none p-0">
                  <TabsTrigger 
                    value="received" 
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all"
                  >
                    <Inbox className="h-4 w-4" />
                    <span className="text-sm font-medium">Received</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sent" 
                    className="flex items-center justify-center gap-2 h-full rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="text-sm font-medium">Sent</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="received" className="m-0 p-6 animate-fade-in">
                <div className="space-y-4">
                  {receivedMessages.map((message) => (
                    <div key={message.id} className="p-4 border border-border rounded-xl hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getTypeIcon(message.type)}
                          </div>
                          <h4 className="font-medium text-base">{message.subject}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 bg-background">
                          {format(message.receivedDate, "MMM dd")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {message.preview}
                      </p>
                    </div>
                  ))}
                  
                  {receivedMessages.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm font-medium mb-1">No received messages yet</p>
                      <p className="text-xs opacity-75">Your future messages will appear here</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sent" className="m-0 p-6 animate-fade-in">
                <div className="space-y-4">
                  {sentMessages.map((message) => (
                     <div 
                      key={message.id} 
                      className={`p-4 border border-border rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer ${
                        newMessageId === message.id
                          ? "bg-blue-50 border-blue-200 shadow-md animate-fade-in" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            {getTypeIcon(message.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-base truncate">{message.subject}</h4>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {message.deliveryDate && (
                            <Badge variant="outline" className="text-xs bg-background">
                              {format(new Date(message.deliveryDate), "MMM dd, yyyy")}
                            </Badge>
                          )}
                          {message.isSurprise && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 font-medium text-xs">
                              Surprise
                            </Badge>
                          )}
                          <Badge className={`${getStatusColor(message.status)} border text-xs`}>
                            {message.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {message.isSurprise ? "🎁 Surprise message - content hidden!" : message.preview}
                      </p>
                    </div>
                  ))}
                  
                  <div className="p-6 border-2 border-dashed border-border rounded-xl text-center bg-muted/20">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 font-medium">
                      Ready to send another message through time?
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-background hover:bg-muted border-border"
                      onClick={() => navigate("/create-message")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Message
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Desktop Side-by-Side Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Received Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Received Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {receivedMessages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(message.type)}
                      <h4 className="font-medium">{message.subject}</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {format(message.receivedDate, "MMM dd, yyyy")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.preview}
                  </p>
                </div>
              ))}
              
              {receivedMessages.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No received messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SendHorizontal className="h-5 w-5" />
                Sent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {sentMessages.map((message) => (
                 <div 
                  key={message.id} 
                  className={`p-4 border border-border rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer ${
                    newMessageId === message.id
                      ? "bg-blue-50 border-blue-200 shadow-md animate-fade-in" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(message.type)}
                      </div>
                      <h4 className="font-medium text-base">{message.subject}</h4>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {message.deliveryDate && (
                        <Badge variant="outline" className="text-xs bg-background">
                          {format(new Date(message.deliveryDate), "MMM dd, yyyy")}
                        </Badge>
                      )}
                      {message.isSurprise && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 font-medium text-xs">
                          Surprise
                        </Badge>
                      )}
                      <Badge className={`${getStatusColor(message.status)} border text-xs`}>
                        {message.status}
                      </Badge>
                    </div>
                  </div>
                   <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                     {message.isSurprise ? "🎁 Surprise message - content hidden!" : message.preview}
                   </p>
                 </div>
               ))}

              <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                <p className="text-muted-foreground text-sm mb-3">
                  Ready to send another message through time?
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/create-message")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Details Dialog */}
        <MessageDetailsDialog
          message={selectedMessage}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onUpdate={handleUpdateMessage}
          onDelete={handleDeleteMessage}
        />
      </div>
    </div>
  );
};