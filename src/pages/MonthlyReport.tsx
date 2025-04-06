import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import ColorTree from '@/components/ColorTree';
import { parse, format } from 'date-fns';
import { ColorData, sampleAprilData } from '@/utils/sampleData';

interface UserData {
  datasetName: string;
  description?: string;
  colorData: ColorData[];
}

const MonthlyReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get the selected month from URL parameters
    const params = new URLSearchParams(location.search);
    const month = params.get('month');
    
    if (!month) {
      navigate('/dashboard');
      return;
    }
    
    setSelectedMonth(month);
    loadColorData(month);
  }, [location, navigate]);
  
  const loadColorData = (month: string) => {
    setLoading(true);
    
    try {
      // If the month is April 2025, use our sample data
      if (month === 'April 2025') {
        setColorData(sampleAprilData);
        setLoading(false);
        return;
      }
      
      // Otherwise, load user data from localStorage as before
      const userData = localStorage.getItem('userData');
      
      if (userData) {
        const parsedData: UserData = JSON.parse(userData);
        
        // Process and filter data for the selected month
        const monthDate = parse(month, 'MMMM yyyy', new Date());
        const processedColorData = parsedData.colorData
          ?.filter(item => {
            // We need to check if the color data belongs to the selected month
            // This is a simplified approach assuming the day property represents the day of the month
            return item.day >= 1 && item.day <= 31;
          })
          .map(item => {
            if ('lightColor' in item || 'darkColor' in item) {
              if (item.lightColor) {
                return {
                  day: item.day,
                  color: item.lightColor,
                  colorMode: 'light' as const,
                  note: item.note
                };
              } else if (item.darkColor) {
                return {
                  day: item.day,
                  color: item.darkColor,
                  colorMode: 'dark' as const,
                  note: item.note
                };
              }
            }
            return item;
          })
          .sort((a, b) => a.day - b.day); // Sort by day ascending
        
        setColorData(processedColorData || []);
      } else {
        setColorData([]);
      }
    } catch (e) {
      console.error('Error loading color data', e);
      setColorData([]);
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button 
                variant="ghost" 
                className="pl-0 mb-2" 
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Color Report: {selectedMonth}</h1>
              <p className="text-muted-foreground mt-1">
                Visualizing your color journey throughout the month
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p>Loading color data...</p>
            </div>
          ) : colorData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Color Tree Visualization</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ColorTree colorData={colorData} month={selectedMonth} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Color Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {colorData.map((item) => (
                      <div 
                        key={`color-${item.day}`} 
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <div 
                          className="w-10 h-10 rounded-full border" 
                          style={{ 
                            backgroundColor: item.color,
                            backgroundImage: item.colorMode === 'dark' 
                              ? 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))' 
                              : 'none'
                          }}
                        />
                        <div>
                          <p className="font-medium">Day {item.day}</p>
                          <p className="text-sm text-muted-foreground">{item.color}</p>
                          {item.note && (
                            <p className="text-xs mt-1 italic">{item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
              <h2 className="text-xl font-medium mb-2">No color data available</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                There is no color data available for the selected month. Try selecting a different month or add color data.
              </p>
              <Button onClick={goBack}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MonthlyReport;
