import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryMethodSelectorProps {
  deliveryMethod: "email" | "whatsapp" | "both";
  setDeliveryMethod: (method: "email" | "whatsapp" | "both") => void;
  recipientType: "self" | "other";
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
  recipientPhone: string;
  setRecipientPhone: (phone: string) => void;
}

export const DeliveryMethodSelector = ({
  deliveryMethod,
  setDeliveryMethod,
  recipientType,
  recipientEmail,
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone,
}: DeliveryMethodSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          How should it be delivered?
        </h3>
        <p className="text-muted-foreground text-sm">
          Choose your delivery method
        </p>
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
              <Label htmlFor="recipientEmail" className="text-base">
                Email Address
              </Label>
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
              <Label htmlFor="recipientPhone" className="text-base">
                Phone Number
              </Label>
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
              <Label htmlFor="recipientEmailSelf" className="text-base">
                Your Email Address
              </Label>
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
              <Label htmlFor="recipientPhoneSelf" className="text-base">
                Your Phone Number
              </Label>
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
};
