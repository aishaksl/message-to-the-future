import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("5-10");

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/create-message")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Message Creation
        </Button>

        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Choose Your Message Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            One-time payment per message based on delivery timeframe
          </p>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm border-border/40 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-semibold flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Choose Your Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card 
                className={`border-2 transition-colors cursor-pointer ${
                  selectedPlan === "1-5" 
                    ? "border-primary bg-primary/5" 
                    : "border-border/40 hover:border-primary/40"
                }`}
                onClick={() => setSelectedPlan("1-5")}
              >
                <CardHeader>
                  <CardTitle className="text-xl">1-5 Years</CardTitle>
                  <div className="text-3xl font-bold">$5<span className="text-sm font-normal text-muted-foreground">/message</span></div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• Send messages 1-5 years in future</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay $5
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 relative cursor-pointer ${
                  selectedPlan === "5-10" 
                    ? "border-primary bg-primary/5" 
                    : "border-border/40 hover:border-primary/40"
                }`}
                onClick={() => setSelectedPlan("5-10")}
              >
                {selectedPlan === "5-10" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">5-10 Years</CardTitle>
                  <div className="text-3xl font-bold">$10<span className="text-sm font-normal text-muted-foreground">/message</span></div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• Send messages 5-10 years in future</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay $10
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`border-2 transition-colors cursor-pointer ${
                  selectedPlan === "10-50" 
                    ? "border-primary bg-primary/5" 
                    : "border-border/40 hover:border-primary/40"
                }`}
                onClick={() => setSelectedPlan("10-50")}
              >
                <CardHeader>
                  <CardTitle className="text-xl">10-50 Years</CardTitle>
                  <div className="text-3xl font-bold">$20<span className="text-sm font-normal text-muted-foreground">/message</span></div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• Send messages 10-50 years in future</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay $20
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>First year delivery is free. One-time payment per message for future years.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;