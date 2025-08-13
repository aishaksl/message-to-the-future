import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Send, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipientSelectorProps {
  recipientType: "self" | "other";
  setRecipientType: (type: "self" | "other") => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  isSurpriseMode: boolean;
  setIsSurpriseMode: (surprise: boolean) => void;
}

export const RecipientSelector = ({
  recipientType,
  setRecipientType,
  recipientName,
  setRecipientName,
  isSurpriseMode,
  setIsSurpriseMode,
}: RecipientSelectorProps) => {
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
                <h4 className="font-medium text-primary text-sm">
                  Surprise Mode
                </h4>
                <p className="text-xs text-muted-foreground">
                  Keep your future self guessing!
                </p>
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
              <label
                htmlFor="surpriseMode"
                className="cursor-pointer text-xs text-muted-foreground leading-relaxed"
              >
                <strong className="text-foreground">
                  Make this a surprise message
                </strong>
                <br />
                You won't be able to see or edit the content later - it will
                remain a surprise until delivery!
              </label>
            </div>
          </div>
        </div>
      )}

      {recipientType === "other" && (
        <div className="space-y-3 animate-fade-in">
          <div>
            <Label htmlFor="recipientName" className="text-base">
              Recipient Name
            </Label>
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
};
