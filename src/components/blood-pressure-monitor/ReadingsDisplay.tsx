
import * as React from "react";
import { isSameDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Reading } from "./types";

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

interface ReadingsDisplayProps {
  readings: Reading[];
  selectedDate: Date | undefined;
}

export const ReadingsDisplay = ({ readings, selectedDate }: ReadingsDisplayProps) => {
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
  );
};
