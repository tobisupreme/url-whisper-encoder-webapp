import * as React from 'react';
import { Reading } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DataManagementProps {
  readings: Reading[];
  onImport: (newReadings: Reading[]) => void;
}

export const DataManagement = ({ readings, onImport }: DataManagementProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sampleReadings = [
    { systolic: 120, diastolic: 80, date: new Date('2025-06-13T10:00:00.000Z') },
    { systolic: 125, diastolic: 82, date: new Date('2025-06-14T10:05:00.000Z') },
    { systolic: 118, diastolic: 78, date: new Date('2025-06-15T10:10:00.000Z') },
  ];

  const handleExportJSON = () => {
    if (readings.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(readings, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `blood-pressure-readings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast({ title: 'Success!', description: 'Data exported as JSON.' });
  };

  const handleExportCSV = () => {
    if (readings.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }
    const header = 'date,systolic,diastolic\n';
    const csvRows = readings
      .map((r) => `${r.date.toISOString()},${r.systolic},${r.diastolic}`)
      .join('\n');
    
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
      header + csvRows
    )}`;
    
    const link = document.createElement('a');
    link.href = csvString;
    link.download = `blood-pressure-readings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast({ title: 'Success!', description: 'Data exported as CSV.' });
  };

  const handleDownloadSampleJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(sampleReadings.map(r => ({...r, date: r.date.toISOString()})), null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `sample-blood-pressure-readings.json`;
    link.click();
    toast({ title: 'Success!', description: 'Sample JSON file downloaded.' });
  };

  const handleDownloadSampleCSV = () => {
    const header = 'date,systolic,diastolic\n';
    const csvRows = sampleReadings
      .map((r) => `${r.date.toISOString()},${r.systolic},${r.diastolic}`)
      .join('\n');
    
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
      header + csvRows
    )}`;
    
    const link = document.createElement('a');
    link.href = csvString;
    link.download = `sample-blood-pressure-readings.csv`;
    link.click();
    toast({ title: 'Success!', description: 'Sample CSV file downloaded.' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedReadings: Reading[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            importedReadings = parsed.map((item: any) => ({
              systolic: Number(item.systolic),
              diastolic: Number(item.diastolic),
              date: new Date(item.date),
            }));
          } else {
            throw new Error('Invalid JSON format. Expected an array of readings.');
          }
        } else if (file.name.endsWith('.csv')) {
            const lines = content.split('\n').filter(line => line.trim() !== '');
            const header = lines[0].split(',').map(h => h.trim());
            const dateIndex = header.indexOf('date');
            const systolicIndex = header.indexOf('systolic');
            const diastolicIndex = header.indexOf('diastolic');

            if (dateIndex === -1 || systolicIndex === -1 || diastolicIndex === -1) {
                throw new Error('Invalid CSV format. Header must contain date, systolic, diastolic.');
            }

            importedReadings = lines.slice(1).map(line => {
                const values = line.split(',');
                return {
                    date: new Date(values[dateIndex]),
                    systolic: Number(values[systolicIndex]),
                    diastolic: Number(values[diastolicIndex]),
                };
            });
        } else {
          throw new Error('Unsupported file type. Please select a .json or .csv file.');
        }
        
        importedReadings.forEach(reading => {
            if (isNaN(reading.systolic) || isNaN(reading.diastolic) || !(reading.date instanceof Date && !isNaN(reading.date.getTime()))) {
                throw new Error('Invalid data found in file.');
            }
        });

        onImport(importedReadings);
        toast({ title: 'Success!', description: `Imported ${importedReadings.length} readings.` });

      } catch (error: any) {
        toast({
          title: 'Import Failed',
          description: error.message || 'Could not parse the file.',
          variant: 'destructive',
        });
      } finally {
        if(event.target) event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export your readings or import from a file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={handleExportJSON} variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Export JSON
        </Button>
        <Button onClick={handleExportCSV} variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={handleImportClick}>
          <Download className="mr-2 h-4 w-4" /> Import from File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json,.csv"
        />
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Download a sample file to see the required format.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleDownloadSampleJSON} variant="secondary" size="sm">
              Sample JSON
            </Button>
            <Button onClick={handleDownloadSampleCSV} variant="secondary" size="sm">
              Sample CSV
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            This data stays on your device and never on the application server.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};
