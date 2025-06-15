
import * as React from "react";
import { isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Reading } from "./types";

interface ReadingsCalendarProps {
  readings: Reading[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export const ReadingsCalendar = ({ readings, selectedDate, onSelectDate }: ReadingsCalendarProps) => {
  return (
    <Card>
      <CardContent className="p-0 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          modifiers={{
            recorded: (date) => readings.some((r) => isSameDay(r.date, date)),
          }}
          modifiersClassNames={{
            recorded: "bg-primary/20",
          }}
          disabled={(date) => date > new Date()}
        />
      </CardContent>
    </Card>
  );
};
