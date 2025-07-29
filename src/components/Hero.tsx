import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Clock, Layers, Shield, Users, Calendar, Heart, Star, CheckCircle, Lock, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-foreground">
            Send Messages Through Time
          </h1>
          <div className="text-lg md:text-xl text-muted-foreground font-light">
            <span>Bridge time with love - to yourself or others</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Capture this moment - your hopes, dreams, fears, and triumphs. 
          Send your heart across time to your future self or someone special.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Button 
            size="lg" 
            className="px-8 py-3 text-base font-normal rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/create-message")}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Create Message
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 text-base font-normal rounded-lg border-border hover:bg-muted"
              >
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-semibold text-foreground text-center">
                  Your Personal Time Machine
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Calendar className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Scheduled Messages</h3>
                  <p className="text-muted-foreground text-sm">Plan your messages from 1 day to 50 years into the future</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Multiple Recipients</h3>
                  <p className="text-muted-foreground text-sm">Send messages to your loved ones, future self, or friends</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Layers className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Rich Content</h3>
                  <p className="text-muted-foreground text-sm">Express your emotions with text, photos, voice recordings, and videos</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Send className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Multi-Channel Delivery</h3>
                  <p className="text-muted-foreground text-sm">Your messages are safely delivered via Email and WhatsApp</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Lock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Secure Storage</h3>
                  <p className="text-muted-foreground text-sm">Your messages are encrypted and protected on secure servers</p>
                </div>
                
                <div className="p-6 rounded-xl bg-background/50 border border-border/30">
                  <Heart className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-3">Flexible Pricing</h3>
                  <p className="text-muted-foreground text-sm">Pay only once for each message you want to send</p>
                </div>
              </div>

              <div className="border-t border-border/30 pt-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">How It Works?</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-2">Write Your Message</h4>
                    <p className="text-sm text-muted-foreground">Share your emotions, thoughts, and memories</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-2">Choose Date</h4>
                    <p className="text-sm text-muted-foreground">Decide when your message should arrive</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-medium text-foreground mb-2">Make Payment</h4>
                    <p className="text-sm text-muted-foreground">First year free, affordable prices afterward</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-primary w-6 h-6" />
                    </div>
                    <h4 className="font-medium text-foreground mb-2">Delivered</h4>
                    <p className="text-sm text-muted-foreground">Your message is safely delivered on the chosen date</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card border border-border hover:bg-accent/30 transition-colors text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-3">Perfect Timing</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Deliver your memories exactly when you need them most</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card border border-border hover:bg-accent/30 transition-colors text-center">
            <Layers className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-3">Every Memory</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Share your voice, face, and heartfelt words</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card border border-border hover:bg-accent/30 transition-colors text-center">
            <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-3">Sacred Trust</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Your most precious thoughts, safely protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};