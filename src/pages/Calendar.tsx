
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ColorCalendar from '@/components/ColorCalendar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
}

// Define an interface for possible legacy data formats
interface LegacyColorData {
  day: number;
  lightColor?: string;
  darkColor?: string;
  note?: string;
}

interface UserData {
  datasetName: string;
  description?: string;
  colorData: (ColorData | LegacyColorData)[];
}

const CalendarPage = () => {
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load color data from localStorage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      try {
        const parsedData: UserData = JSON.parse(userData);
        
        // Process color data
        const processedColorData = parsedData.colorData?.map((item: ColorData | LegacyColorData) => {
          // Handle both new and legacy data formats
          if ('lightColor' in item && item.lightColor) {
            return {
              day: item.day,
              color: item.lightColor,
              colorMode: 'light' as const,
              note: item.note
            };
          } else if ('darkColor' in item && item.darkColor) {
            return {
              day: item.day,
              color: item.darkColor,
              colorMode: 'dark' as const,
              note: item.note
            };
          }
          
          // Return the item as is if it's already in the new format
          return item as ColorData;
        });
        
        setColorData(processedColorData || []);
        setDatasetName(parsedData.datasetName || '');
      } catch (e) {
        console.error('Error parsing stored data', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Colotio Calendar</h1>
              <p className="text-muted-foreground mt-1">
                View your colors organized in a calendar format
              </p>
            </div>
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          {colorData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <ColorCalendar data={colorData} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
              <h2 className="text-xl font-medium mb-2">No color data available</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Add your color data to view them on a calendar.
              </p>
              <Button onClick={() => navigate('/data-input')}>
                Add Color Data
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
