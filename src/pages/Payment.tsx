import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Crown, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("5-10");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [daysFromNow, setDaysFromNow] = useState(0);
  const [requiredPlan, setRequiredPlan] = useState<string | null>(null);
  const [isMobileDatePickerOpen, setIsMobileDatePickerOpen] = useState(false);
  const [isDesktopDatePickerOpen, setIsDesktopDatePickerOpen] = useState(false);

  useEffect(() => {
    // Get selected date from localStorage (saved from MessageCreator)
    const savedFormState = localStorage.getItem("messageFormState");
    if (savedFormState) {
      try {
        const formState = JSON.parse(savedFormState);
        if (formState.selectedDate) {
          const date = new Date(formState.selectedDate);
          setSelectedDate(date);

          const days = differenceInDays(date, new Date());
          setDaysFromNow(days);

          // Determine required plan based on selected date
          let plan = null;
          if (days <= 365) {
            plan = "free"; // First year is free
          } else if (days <= 365 * 5) {
            plan = "1-5";
          } else if (days <= 365 * 10) {
            plan = "5-10";
          } else {
            plan = "10-50";
          }

          setRequiredPlan(plan);
          setSelectedPlan(plan);
        }
      } catch (error) {
        console.error("Error parsing saved form state:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background py-4 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => navigate("/create-message", { state: { fromButton: true, originalSource: '/' } })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Message Creation
        </Button>

        {/* Elegant Header */}
        <div className="text-center">
          <Crown className="w-10 h-10 text-primary mx-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-foreground">
              Complete Payment
            </h1>
            <p className="text-muted-foreground">
              Secure your message to the future
            </p>
          </div>
        </div>

        {/* Payment Info Bar */}
        {selectedDate && (
          <div className="max-w-2xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="relative p-4">
                {/* Mobile Layout */}
                <div className="flex flex-col space-y-4 sm:hidden">
                  <div className="flex items-center space-x-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Scheduled Delivery
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {selectedDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {daysFromNow <= 0 ? 'Delivered' : `${Math.floor(daysFromNow / 365)} years from now`}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <Popover
                      open={isMobileDatePickerOpen}
                      onOpenChange={setIsMobileDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          Change Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <ModernDatePicker
                          value={selectedDate || undefined}
                          onChange={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              const days = differenceInDays(date, new Date());
                              setDaysFromNow(days);

                              // Determine required plan based on new selected date
                              let plan = null;
                              if (days <= 365) {
                                plan = "free"; // First year is free
                              } else if (days <= 365 * 5) {
                                plan = "1-5";
                              } else if (days <= 365 * 10) {
                                plan = "5-10";
                              } else {
                                plan = "10-50";
                              }

                              setRequiredPlan(plan);
                              setSelectedPlan(plan);

                              // Update localStorage with new date
                              const savedFormState =
                                localStorage.getItem("messageFormState");
                              if (savedFormState) {
                                try {
                                  const formState = JSON.parse(savedFormState);
                                  formState.selectedDate = date;
                                  localStorage.setItem(
                                    "messageFormState",
                                    JSON.stringify(formState)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error updating form state:",
                                    error
                                  );
                                }
                              }

                              setIsMobileDatePickerOpen(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Scheduled Delivery
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {selectedDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {daysFromNow <= 0 ? 'Delivered' : `${Math.floor(daysFromNow / 365)} years from now`}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                    <Popover
                      open={isDesktopDatePickerOpen}
                      onOpenChange={setIsDesktopDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Change Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <ModernDatePicker
                          value={selectedDate || undefined}
                          onChange={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              const days = differenceInDays(date, new Date());
                              setDaysFromNow(days);

                              // Determine required plan based on new selected date
                              let plan = null;
                              if (days <= 365) {
                                plan = "free"; // First year is free
                              } else if (days <= 365 * 5) {
                                plan = "1-5";
                              } else if (days <= 365 * 10) {
                                plan = "5-10";
                              } else {
                                plan = "10-50";
                              }

                              setRequiredPlan(plan);
                              setSelectedPlan(plan);

                              // Update localStorage with new date
                              const savedFormState =
                                localStorage.getItem("messageFormState");
                              if (savedFormState) {
                                try {
                                  const formState = JSON.parse(savedFormState);
                                  formState.selectedDate = date;
                                  localStorage.setItem(
                                    "messageFormState",
                                    JSON.stringify(formState)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error updating form state:",
                                    error
                                  );
                                }
                              }

                              setIsDesktopDatePickerOpen(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              💡 Changing the date may update your payment amount
            </p>
          </div>
        )}

        <Card className="bg-card/60 backdrop-blur-sm border-border/40 rounded-2xl shadow-xl">
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Free Plan - First Year */}
              <Card
                className={`border-2 transition-colors relative ${requiredPlan === "free"
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border/20 bg-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                onClick={() =>
                  requiredPlan === "free" && setSelectedPlan("free")
                }
              >
                {requiredPlan === "free" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      FREE
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">First Year</CardTitle>
                  <div className="text-3xl font-bold text-foreground">
                    $0
                    <span className="text-sm font-normal text-muted-foreground">
                      /message
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Completely free
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs mb-6">
                    <li>• Send messages within 1 year</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• No payment required</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={requiredPlan === "free" ? "default" : "outline"}
                    disabled={requiredPlan !== "free"}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {requiredPlan === "free" ? "Create Free" : "Not Available"}
                  </Button>
                </CardContent>
              </Card>
              {/* 1-5 Years Plan */}
              <Card
                className={`border-2 transition-colors relative ${requiredPlan === "1-5"
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border/20 bg-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                onClick={() => requiredPlan === "1-5" && setSelectedPlan("1-5")}
              >
                {requiredPlan === "1-5" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Your Plan
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">1-5 Years</CardTitle>
                  <div className="text-3xl font-bold">
                    $5
                    <span className="text-sm font-normal text-muted-foreground">
                      /message
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-time payment
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs mb-6">
                    <li>• Send messages 1-5 years in future</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={requiredPlan === "1-5" ? "default" : "outline"}
                    disabled={requiredPlan !== "1-5"}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {requiredPlan === "1-5" ? "Pay $5" : "Not Available"}
                  </Button>
                </CardContent>
              </Card>

              {/* 5-10 Years Plan */}
              <Card
                className={`border-2 transition-colors relative ${requiredPlan === "5-10"
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border/20 bg-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                onClick={() =>
                  requiredPlan === "5-10" && setSelectedPlan("5-10")
                }
              >
                {requiredPlan === "5-10" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Your Plan
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">5-10 Years</CardTitle>
                  <div className="text-3xl font-bold">
                    $10
                    <span className="text-sm font-normal text-muted-foreground">
                      /message
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-time payment
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs mb-6">
                    <li>• Send messages 5-10 years in future</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={requiredPlan === "5-10" ? "default" : "outline"}
                    disabled={requiredPlan !== "5-10"}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {requiredPlan === "5-10" ? "Pay $10" : "Not Available"}
                  </Button>
                </CardContent>
              </Card>

              {/* 10-50 Years Plan */}
              <Card
                className={`border-2 transition-colors relative ${requiredPlan === "10-50"
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-border/20 bg-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                onClick={() =>
                  requiredPlan === "10-50" && setSelectedPlan("10-50")
                }
              >
                {requiredPlan === "10-50" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Your Plan
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">10-50 Years</CardTitle>
                  <div className="text-3xl font-bold">
                    $20
                    <span className="text-sm font-normal text-muted-foreground">
                      /message
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-time payment
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs mb-6">
                    <li>• Send messages 10-50 years ahead</li>
                    <li>• All message types supported</li>
                    <li>• Email + WhatsApp delivery</li>
                    <li>• Safely protected</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={requiredPlan === "10-50" ? "default" : "outline"}
                    disabled={requiredPlan !== "10-50"}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {requiredPlan === "10-50" ? "Pay $20" : "Not Available"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                First year delivery is free. One-time payment per message for
                future years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
