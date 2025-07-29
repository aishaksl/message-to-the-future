import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Upload, Image, Video, Mic, Type, Send, Sparkles, Mail, MessageCircle, User, ArrowLeft, ArrowRight, CheckCircle, Loader2, Check, Gift } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const MessageCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"text" | "image" | "video" | "audio">("text");
  const [subject, setSubject] = useState("");
  const [recipientType, setRecipientType] = useState<"self" | "other">("self");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "whatsapp" | "both">("email");
  const [isSurpriseMode, setIsSurpriseMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [completedMessageId, setCompletedMessageId] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalSteps = 6;

  const messageTypes = [
    { type: "text" as const, icon: Type, label: "Written Words", description: "Pour your thoughts onto the page" },
    { type: "image" as const, icon: Image, label: "Precious Moment", description: "Capture a memory that speaks volumes" },
    { type: "video" as const, icon: Video, label: "Living Memory", description: "Record your face, your voice, your presence" },
    { type: "audio" as const, icon: Mic, label: "Your Voice", description: "Let your future self hear your heart" },
  ];

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Close the date picker after selection for both mobile and desktop
      setIsDatePickerOpen(false);
      
      const daysFromNow = differenceInDays(date, new Date());
      if (daysFromNow > 365) {
        // Redirect to payment page for paid delivery
        navigate("/payment");
        return;
      }
    }
    setSelectedDate(date);
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2: // Delivery method selection for both mobile and desktop
        return recipientType === "self" || recipientName;
      case 3: // Message type selection
        // Check delivery method requirements for "Someone Else"
        if (recipientType === "other") {
          if (deliveryMethod === "email" || deliveryMethod === "both") {
            return recipientEmail && recipientEmail.includes("@");
          }
          if (deliveryMethod === "whatsapp" || deliveryMethod === "both") {
            return recipientPhone;
          }
        }
        if (recipientType === "self" && (deliveryMethod === "whatsapp" || deliveryMethod === "both")) {
          return recipientPhone;
        }
        return true;
      case 4: // Content creation
        return messageType; // Message type is always selected since it has a default
      case 5: // Delivery date - content should be filled
        return subject && (messageType !== "text" || messageText);
      case 6: // Preview/Complete - date should be selected
        return selectedDate;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Create message object
    const message = {
      id: Date.now().toString(),
      subject,
      content: messageText,
      type: messageType,
      deliveryDate: selectedDate,
      recipientType,
      recipientName: recipientType === "self" ? "Future Me" : recipientName,
      recipientEmail,
      recipientPhone,
      deliveryMethod,
      status: "scheduled",
      createdAt: new Date(),
      isSurprise: isSurpriseMode,
      preview: messageText ? messageText.substring(0, 100) + (messageText.length > 100 ? "..." : "") : `${messageType} message`,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to localStorage
    const existingMessages = JSON.parse(localStorage.getItem("sentMessages") || "[]");
    existingMessages.unshift(message); // Add to beginning for newest first
    localStorage.setItem("sentMessages", JSON.stringify(existingMessages));
    
    // Set flag for dashboard highlighting
    localStorage.setItem("newMessageId", message.id);
    
    // Clear loading state FIRST
    setIsLoading(false);
    
    // Show success toast
    toast({
      title: "Message scheduled successfully!",
      description: "Taking you to dashboard...",
    });
    
    // Use React Router navigation with replace to avoid adding to history
    navigate("/?view=dashboard", { replace: true });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
           <div className="space-y-6">
             <div className="text-center mb-6">
               <h3 className="text-xl font-semibold mb-2">Who is this message for?</h3>
               <p className="text-muted-foreground text-sm">Choose your recipient</p>
             </div>
             
             <div className="grid grid-cols-1 gap-3">
               <button
                 onClick={() => setRecipientType("self")}
                 className={cn(
                   "p-8 rounded-lg border transition-all text-left",
                   recipientType === "self"
                     ? "border-primary bg-primary/5"
                     : "border-border hover:border-primary/40"
                 )}
               >
                 <div className="flex items-center gap-2">
                   <User className="w-4 h-4" />
                   <span className="text-sm font-medium">Future Me</span>
                 </div>
               </button>
               
               <button
                 onClick={() => setRecipientType("other")}
                 className={cn(
                   "p-8 rounded-lg border transition-all text-left",
                   recipientType === "other"
                     ? "border-primary bg-primary/5"
                     : "border-border hover:border-primary/40"
                 )}
               >
                 <div className="flex items-center gap-2">
                   <Send className="w-4 h-4" />
                   <span className="text-sm font-medium">Someone Else</span>
                 </div>
               </button>
             </div>

             {recipientType === "self" && (
               <div className="space-y-3 animate-fade-in">
                 <div className="p-3 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="p-1.5 bg-primary/10 rounded-lg">
                       <Gift className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                       <h4 className="font-medium text-primary text-sm">Surprise Mode</h4>
                       <p className="text-xs text-muted-foreground">Keep your future self guessing!</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-2">
                     <input
                       type="checkbox"
                       id="surpriseMode"
                       checked={isSurpriseMode}
                       onChange={(e) => setIsSurpriseMode(e.target.checked)}
                       className="mt-0.5 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                     />
                     <label htmlFor="surpriseMode" className="cursor-pointer text-xs text-muted-foreground leading-relaxed">
                       <strong className="text-foreground">Make this a surprise message</strong>
                       <br />
                       You won't be able to see or edit the content later - it will remain a surprise until delivery!
                     </label>
                   </div>
                </div>
              </div>
            )}

             {recipientType === "other" && (
               <div className="space-y-3 animate-fade-in">
                <div>
                  <Label htmlFor="recipientName" className="text-base">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Who will receive this message?"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        // How should it be delivered? for both mobile and desktop
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">How should it be delivered?</h3>
              <p className="text-muted-foreground text-sm">Choose your delivery method</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setDeliveryMethod("email")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "email"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email Only</span>
                </div>
              </button>
              
              <button
                onClick={() => setDeliveryMethod("whatsapp")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "whatsapp"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp Only</span>
                </div>
              </button>
              
              <button
                onClick={() => setDeliveryMethod("both")}
                className={cn(
                  "p-3 rounded-lg border transition-all text-left",
                  deliveryMethod === "both"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Email + WhatsApp</span>
                </div>
              </button>
            </div>

            {recipientType === "other" && (
              <div className="space-y-4 animate-fade-in">
                {(deliveryMethod === "email" || deliveryMethod === "both") && (
                  <div>
                    <Label htmlFor="recipientEmail" className="text-base">Email Address</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
                {(deliveryMethod === "whatsapp" || deliveryMethod === "both") && (
                  <div>
                    <Label htmlFor="recipientPhone" className="text-base">Phone Number</Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      placeholder="+90 555 123 4567"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}

            {recipientType === "self" && (
              <div className="space-y-4 animate-fade-in">
                {(deliveryMethod === "email" || deliveryMethod === "both") && (
                  <div>
                    <Label htmlFor="recipientEmailSelf" className="text-base">Your Email Address</Label>
                    <Input
                      id="recipientEmailSelf"
                      type="email"
                      placeholder="your@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
                {(deliveryMethod === "whatsapp" || deliveryMethod === "both") && (
                  <div>
                    <Label htmlFor="recipientPhoneSelf" className="text-base">Your Phone Number</Label>
                    <Input
                      id="recipientPhoneSelf"
                      type="tel"
                      placeholder="+90 555 123 4567"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        // Choose Message Type for both mobile and desktop
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Choose Message Type</h3>
              <p className="text-muted-foreground text-sm">How do you want to express yourself?</p>
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
                  <Icon className={cn(
                    "w-6 h-6 mb-3",
                    messageType === type ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h4 className="font-medium text-sm mb-1">{label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </button>
              ))}
            </div>
          </div>
        );


      case 4:
        // Message content for both mobile and desktop
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Your Message</h3>
              <p className="text-muted-foreground text-sm">Pour your heart into words</p>
            </div>

            <div>
              <Label htmlFor="subject" className="text-base">Subject</Label>
              <Input
                id="subject"
                placeholder="Give your message a title..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base mb-2 block">Message Content</Label>
              {messageType === "text" ? (
                <Textarea
                  placeholder="Dear future me, today I want to remember... I hope you know that... I'm grateful for... I dream that..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[240px] resize-none"
                />
              ) : (
                <div className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center bg-background/20">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base mb-2">Upload your {messageType}</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Drag and drop or click to select files
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        // Delivery date for both mobile and desktop
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">When to Deliver?</h3>
              <p className="text-muted-foreground text-sm">Choose the perfect moment in time</p>
            </div>

            <div>
              <Label className="text-base mb-4 block">Delivery Date</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-center text-center font-normal h-16 rounded-xl border-2 border-dashed",
                      !selectedDate && "text-muted-foreground border-border/40",
                      selectedDate && "border-primary/30 bg-primary/5"
                    )}
                  >
                    {selectedDate ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Delivery Date</span>
                        <span className="font-medium">{format(selectedDate, "PPP")}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-0.5">Select Date</span>
                        <span>Choose when to deliver</span>
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <ModernDatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Free for first year, paid plans for up to 50 years.
              </p>
            </div>
          </div>
        );

      case 6:
        // Preview for both mobile and desktop
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Message Preview</h3>
              <p className="text-muted-foreground text-sm">Review your message before sending</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">Subject</span>
                  <span className="text-sm">{subject}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">Delivery</span>
                  <span className="text-sm">{selectedDate && format(selectedDate, "PPP")}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary">Type</span>
                  <span className="text-sm capitalize">{messageType}</span>
                </div>
                
                {messageText && (
                  <div className="p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <div className="text-sm font-medium text-primary mb-2">Content</div>
                    <p className="text-sm leading-relaxed">
                      {messageText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className={cn("mx-auto", isMobile ? "max-w-md" : "max-w-4xl")}>
        {/* Mobile: Step-by-step navigation */}
        {isMobile ? (
          <>
            {/* Header with Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create Message</h2>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>

             {/* Step Content */}
             <Card className="mb-3">
               <CardContent className="p-4">
                 {renderStepContent()}
               </CardContent>
             </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pb-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  disabled={!subject || !selectedDate || (messageType === "text" && !messageText)}
                  className="flex-1"
                  onClick={handleComplete}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Desktop: Single column layout with all steps visible */
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center mb-8">Create Your Message</h2>
            
            {/* Step 1: Recipient */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
                  Who is this message for?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setRecipientType("self")}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        recipientType === "self"
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/40 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <User className={cn(
                          "w-6 h-6",
                          recipientType === "self" ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <h4 className="font-medium">Future Me</h4>
                          <p className="text-sm text-muted-foreground">Send a message to your future self</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setRecipientType("other")}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        recipientType === "other"
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/40 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Send className={cn(
                          "w-6 h-6",
                          recipientType === "other" ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <h4 className="font-medium">Someone Else</h4>
                          <p className="text-sm text-muted-foreground">Send a message to another person</p>
                        </div>
                      </div>
                    </button>
                   </div>

                   {recipientType === "self" && (
                     <div className="space-y-4 animate-fade-in">
                       <div className="p-4 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                         <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 bg-primary/10 rounded-lg">
                             <Gift className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                             <h4 className="font-medium text-primary">Surprise Mode</h4>
                             <p className="text-sm text-muted-foreground">Keep your future self guessing!</p>
                           </div>
                         </div>
                         <div className="flex items-start gap-3">
                           <input
                             type="checkbox"
                             id="surpriseModeDesktop"
                             checked={isSurpriseMode}
                             onChange={(e) => setIsSurpriseMode(e.target.checked)}
                             className="mt-1 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                           />
                           <label htmlFor="surpriseModeDesktop" className="cursor-pointer text-sm text-muted-foreground leading-relaxed">
                             <strong className="text-foreground">Make this a surprise message</strong>
                             <br />
                             You won't be able to see or edit the content later - it will remain a surprise until delivery!
                           </label>
                         </div>
                       </div>
                     </div>
                   )}

                  {recipientType === "other" && (
                    <div className="space-y-4 animate-fade-in">
                      <div>
                        <Label htmlFor="recipientNameDesktop" className="text-base">Recipient Name</Label>
                        <Input
                          id="recipientNameDesktop"
                          placeholder="Who will receive this message?"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
                  How should it be delivered?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setDeliveryMethod("email")}
                      className={cn(
                        "p-3 rounded-lg border transition-all text-left",
                        deliveryMethod === "email"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">Email Only</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setDeliveryMethod("whatsapp")}
                      className={cn(
                        "p-3 rounded-lg border transition-all text-left",
                        deliveryMethod === "whatsapp"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">WhatsApp Only</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setDeliveryMethod("both")}
                      className={cn(
                        "p-3 rounded-lg border transition-all text-left",
                        deliveryMethod === "both"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Email + WhatsApp</span>
                      </div>
                    </button>
                  </div>

                  {recipientType === "other" && (
                    <div className="space-y-4 animate-fade-in">
                      {(deliveryMethod === "email" || deliveryMethod === "both") && (
                        <div>
                          <Label htmlFor="recipientEmailDesktop" className="text-base">Email Address</Label>
                          <Input
                            id="recipientEmailDesktop"
                            type="email"
                            placeholder="recipient@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                      {(deliveryMethod === "whatsapp" || deliveryMethod === "both") && (
                        <div>
                          <Label htmlFor="recipientPhoneDesktop" className="text-base">Phone Number</Label>
                          <Input
                            id="recipientPhoneDesktop"
                            type="tel"
                            placeholder="+90 555 123 4567"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {recipientType === "self" && (
                    <div className="space-y-4 animate-fade-in">
                      {(deliveryMethod === "email" || deliveryMethod === "both") && (
                        <div>
                          <Label htmlFor="recipientEmailSelfDesktop" className="text-base">Your Email Address</Label>
                          <Input
                            id="recipientEmailSelfDesktop"
                            type="email"
                            placeholder="your@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                      {(deliveryMethod === "whatsapp" || deliveryMethod === "both") && (
                        <div>
                          <Label htmlFor="recipientPhoneSelfDesktop" className="text-base">Your Phone Number</Label>
                          <Input
                            id="recipientPhoneSelfDesktop"
                            type="tel"
                            placeholder="+90 555 123 4567"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Message Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</span>
                  Choose Message Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {messageTypes.map(({ type, icon: Icon, label, description }) => (
                    <button
                      key={type}
                      onClick={() => setMessageType(type)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        messageType === type
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/40 hover:border-primary/40"
                      )}
                    >
                      <Icon className={cn(
                        "w-6 h-6 mb-3",
                        messageType === type ? "text-primary" : "text-muted-foreground"
                      )} />
                      <h4 className="font-medium text-sm mb-1">{label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Message Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">4</span>
                  Your Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="subjectDesktop" className="text-base">Subject</Label>
                    <Input
                      id="subjectDesktop"
                      placeholder="Give your message a title..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-base mb-2 block">Message Content</Label>
                    {messageType === "text" ? (
                      <Textarea
                        placeholder="Dear future me, today I want to remember... I hope you know that... I'm grateful for... I dream that..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-background/20">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-base mb-2">Upload your {messageType}</p>
                        <p className="text-muted-foreground text-sm mb-4">
                          Drag and drop or click to select files
                        </p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Delivery Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">5</span>
                  When to Deliver?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Delivery Date</Label>
                     <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                       <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-center text-center font-normal h-14 rounded-xl border-2 border-dashed",
                            !selectedDate && "text-muted-foreground border-border/40",
                            selectedDate && "border-primary/30 bg-primary/5"
                          )}
                        >
                          {selectedDate ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-0.5">Delivery Date</span>
                              <span className="font-medium">{format(selectedDate, "PPP")}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-0.5">Select Date</span>
                              <span>Choose when to deliver</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <ModernDatePicker
                          value={selectedDate}
                          onChange={handleDateChange}
                          minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      Free for first year, paid plans for up to 50 years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 6: Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">6</span>
                  Message Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                      <span className="text-sm font-medium text-primary">Delivery</span>
                      <span className="text-sm">{selectedDate ? format(selectedDate, "PPP") : "No date selected"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                      <span className="text-sm font-medium text-primary">Subject</span>
                      <span className="text-sm">{subject || "No subject"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                      <span className="text-sm font-medium text-primary">Type</span>
                      <span className="text-sm capitalize">{messageType}</span>
                    </div>
                    
                    {messageText && (
                      <div className="p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                        <div className="text-sm font-medium text-primary mb-2">Content</div>
                        <p className="text-sm leading-relaxed">
                          {messageText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complete Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                disabled={!subject || !selectedDate || (messageType === "text" && !messageText)}
                className="px-8"
                onClick={handleComplete}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Message
              </Button>
            </div>
          </div>
        )}

        {/* Loading Overlay - Clean and Simple */}
        {isLoading && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-background/95 backdrop-blur border border-border/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin">
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-lg font-medium">Creating your message...</p>
                <p className="text-sm text-muted-foreground text-center">This will just take a moment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};