import * as React from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isFuture } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModernDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export function ModernDatePicker({ value, onChange, minDate = new Date(), className }: ModernDatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [isManualInput, setIsManualInput] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const [clickTimer, setClickTimer] = React.useState<NodeJS.Timeout | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows: Date[][] = [];
  let days: Date[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 51}, (_, i) => currentYear + i);

  const handleDateClick = (date: Date) => {
    if (isFuture(date) || isSameDay(date, minDate)) {
      setSelectedDate(date);
      onChange?.(date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
  };

  const handleHeaderClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      // Double click - enable manual input
      setIsManualInput(true);
      setClickCount(0);
    } else {
      // First click
      setClickCount(1);
      const timer = setTimeout(() => {
        // Single click - toggle select mode
        setIsManualInput(false);
        setClickCount(0);
      }, 300);
      setClickTimer(timer);
    }
  };

  return (
    <div className={cn("w-80 bg-background border rounded-xl shadow-lg overflow-hidden", className)}>
      {/* Header with fixed height */}
      <div className="h-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-8 w-8 p-0 hover:bg-white/20 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2" onClick={handleHeaderClick}>
          {isManualInput ? (
            <>
              <Input
                type="text"
                value={months[currentMonth.getMonth()]}
                onChange={(e) => {
                  const monthIndex = months.findIndex(m => m.toLowerCase().startsWith(e.target.value.toLowerCase()));
                  if (monthIndex !== -1) {
                    handleMonthChange(monthIndex.toString());
                  }
                }}
                className="w-32 h-8 border-0 bg-transparent font-medium text-sm text-center"
                placeholder="Month"
                autoFocus
              />

              <Input
                type="number"
                value={currentMonth.getFullYear()}
                onChange={(e) => {
                  const year = parseInt(e.target.value);
                  if (year >= currentYear && year <= currentYear + 50) {
                    handleYearChange(e.target.value);
                  }
                }}
                min={currentYear}
                max={currentYear + 50}
                className="w-24 h-8 border-0 bg-transparent font-medium text-sm text-center"
                placeholder="Year"
              />
            </>
          ) : (
            <>
              <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-32 h-8 border-0 bg-transparent font-medium text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-24 h-8 border-0 bg-transparent font-medium text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-8 w-8 p-0 hover:bg-white/20 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar body with fixed height */}
      <div className="p-4">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid with fixed height */}
        <div className="h-48 flex flex-col justify-between">
          {rows.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isDisabled = !isFuture(day) && !isSameDay(day, minDate);

                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled}
                    className={cn(
                      "h-8 w-8 text-sm rounded-lg transition-all duration-200 flex items-center justify-center",
                      "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30",
                      isCurrentMonth ? "text-foreground" : "text-muted-foreground/30",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
                      isTodayDate && !isSelected && "bg-accent text-accent-foreground font-medium",
                      isDisabled && "cursor-not-allowed opacity-20 hover:bg-transparent"
                    )}
                  >
                    {format(day, dateFormat)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}