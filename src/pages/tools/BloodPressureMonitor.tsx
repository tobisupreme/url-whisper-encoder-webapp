import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { isSameDay, format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const formSchema = z.object({
  systolic: z.coerce.number().min(30, "Invalid systolic value").max(300, "Invalid systolic value"),
  diastolic: z.coerce.number().min(30, "Invalid diastolic value").max(300, "Invalid diastolic value"),
});

type Reading = z.infer<typeof formSchema> & {
  date: Date;
};

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--primary))",
  },
  diastolic: {
    label: "Diastolic",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

const BloodPressureMonitor = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systolic: undefined,
      diastolic: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedDate) {
      const newReading: Reading = {
        ...values,
        date: new Date(selectedDate.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())),
      };
      setReadings((prev) => [...prev, newReading]);
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

  const selectedDayReadings = readings
    .filter((reading) => selectedDate && isSameDay(reading.date, selectedDate))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const chartData = React.useMemo(() => {
    return readings
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((r) => ({
        date: format(r.date, "MMM d, h:mm a"),
        systolic: r.systolic,
        diastolic: r.diastolic,
      }));
  }, [readings]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Blood Pressure Monitor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
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
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-0 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
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

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Daily List</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              {selectedDayReadings.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Readings for {selectedDate?.toLocaleDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Systolic</TableHead>
                          <TableHead>Diastolic</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDayReadings.map((reading, index) => (
                          <TableRow key={index}>
                            <TableCell>{format(reading.date, "h:mm a")}</TableCell>
                            <TableCell>{reading.systolic}</TableCell>
                            <TableCell>{reading.diastolic}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                 <Card className="flex items-center justify-center h-48">
                    <CardHeader className="text-center">
                      <CardTitle>No Readings</CardTitle>
                      <CardDescription>
                        {selectedDate ? `No readings recorded for ${selectedDate.toLocaleDateString()}.` : "Select a day to view readings."}
                      </CardDescription>
                    </CardHeader>
                  </Card>
              )}
            </TabsContent>
            <TabsContent value="chart">
              {readings.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Pressure Trend</CardTitle>
                    <CardDescription>A chart showing your readings over time.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 6)}
                        />
                        <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={2} dot={true} />
                        <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={2} dot={true} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-48">
                  <CardHeader className="text-center">
                    <CardTitle>No Readings Yet</CardTitle>
                    <CardDescription>Add a reading to see your blood pressure trend.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BloodPressureMonitor;
