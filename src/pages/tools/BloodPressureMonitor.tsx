
import * as React from "react";
import { useState, useEffect } from "react";
import * as z from "zod";
import { Reading, formSchema } from "@/components/blood-pressure-monitor/types";
import { NewReadingForm } from "@/components/blood-pressure-monitor/NewReadingForm";
import { ReadingsCalendar } from "@/components/blood-pressure-monitor/ReadingsCalendar";
import { ReadingsDisplay } from "@/components/blood-pressure-monitor/ReadingsDisplay";

const BloodPressureMonitor = () => {
  const [readings, setReadings] = useState<Reading[]>(() => {
    try {
      const item = window.localStorage.getItem("bloodPressureReadings");
      if (item) {
        const parsed: (Omit<Reading, 'date'> & { date: string })[] = JSON.parse(item);
        // Dates are stored as strings in JSON, so we need to convert them back to Date objects
        return parsed.map((r) => ({
          ...r,
          date: new Date(r.date),
        }));
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    return [];
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    try {
      window.localStorage.setItem("bloodPressureReadings", JSON.stringify(readings));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [readings]);

  function handleAddReading(values: z.infer<typeof formSchema>) {
    if (selectedDate) {
      const newReading: Reading = {
        ...values,
        date: new Date(selectedDate.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())),
      };
      setReadings((prev) => [...prev, newReading]);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Blood Pressure Monitor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <NewReadingForm selectedDate={selectedDate} onAddReading={handleAddReading} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ReadingsCalendar readings={readings} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <ReadingsDisplay readings={readings} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default BloodPressureMonitor;
