
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "./types";

interface NewReadingFormProps {
  selectedDate: Date | undefined;
  onAddReading: (values: z.infer<typeof formSchema>) => void;
}

export const NewReadingForm = ({ selectedDate, onAddReading }: NewReadingFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systolic: undefined,
      diastolic: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedDate) {
      onAddReading(values);
      form.reset({ systolic: undefined, diastolic: undefined });
      toast({
        title: "Success!",
        description: "Your blood pressure reading has been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Reading</CardTitle>
        <CardDescription>
          Select a day on the calendar and enter your reading.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="systolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Systolic (SYS)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 120" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diastolic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diastolic (DIA)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 80" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={!selectedDate}>
              Save Reading
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
