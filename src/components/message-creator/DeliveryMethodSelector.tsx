import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryMethodSelectorProps {
  deliveryMethod: "email";
  setDeliveryMethod: (method: "email") => void;
  recipientType: "self" | "other";
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
}

export const DeliveryMethodSelector = ({
  deliveryMethod,
  setDeliveryMethod,
  recipientType,
  recipientEmail,
  setRecipientEmail,
}: DeliveryMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={recipientType === "self" ? "recipientEmailSelf" : "recipientEmail"} className="text-base">
          {recipientType === "self" ? "Your Email Address" : "Email Address"}
        </Label>
        <Input
          id={recipientType === "self" ? "recipientEmailSelf" : "recipientEmail"}
          type="email"
          placeholder={recipientType === "self" ? "your@example.com" : "recipient@example.com"}
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="mt-2"
        />
      </div>
    </div>
  );
};
