
import * as React from "react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange: DateRange | undefined;
  onDateRangeChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetClick = (from: Date) => {
    onDateRangeChange({ from, to: new Date() });
    setOpen(false);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-[300px]",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
          <div className="flex flex-col gap-1 border-r p-2">
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subDays(new Date(), 6))}>Last 7 days</Button>
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subDays(new Date(), 20))}>Last 3 weeks</Button>
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subMonths(new Date(), 1))}>Last month</Button>
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subMonths(new Date(), 3))}>Last 3 months</Button>
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subMonths(new Date(), 6))}>Last 6 months</Button>
            <Button variant="ghost" className="justify-start px-2" onClick={() => handlePresetClick(subYears(new Date(), 1))}>Last year</Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
