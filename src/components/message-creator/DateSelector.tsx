import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
}

export const DateSelector = ({
  selectedDate,
  onDateChange,
  isDatePickerOpen,
  setIsDatePickerOpen,
}: DateSelectorProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">When to Deliver?</h3>
        <p className="text-muted-foreground text-sm">
          Choose the perfect moment in time
        </p>
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
                  <span className="text-xs text-muted-foreground mb-0.5">
                    Delivery Date
                  </span>
                  <span className="font-medium">
                    {format(selectedDate, "PPP")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-0.5">
                    Select Date
                  </span>
                  <span>Choose when to deliver</span>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <ModernDatePicker
              value={selectedDate}
              onChange={onDateChange}
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
};
