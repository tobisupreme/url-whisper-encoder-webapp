
import * as React from 'react';
import { Reading } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Export, Import } from 'lucide-react';

interface DataManagementProps {
  readings: Reading[];
  onImport: (newReadings: Reading[]) => void;
}

export const DataManagement = ({ readings, onImport }: DataManagementProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={handleExportJSON} variant="outline">
          <Export className="mr-2 h-4 w-4" /> Export JSON
        </Button>
        <Button onClick={handleExportCSV} variant="outline">
          <Export className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button onClick={handleImportClick}>
          <Import className="mr-2 h-4 w-4" /> Import from File
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json,.csv"
        />
      </CardContent>
    </Card>
  );
};
