
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import ColorChart from '@/components/ColorChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
  lightColor?: string;
  darkColor?: string;
}

interface UserData {
  datasetName: string;
  description?: string;
  colorData: ColorData[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    // Check for user data in localStorage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      try {
        const parsedData: UserData = JSON.parse(userData);
        
        // Convert legacy data format if needed
        const processedColorData = parsedData.colorData?.map(item => {
          // If the data is in the old format with lightColor/darkColor
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
          
          // Return the item as is if it's already in the new format
          return item;
        });
        
        setColorData(processedColorData || []);
        setDatasetName(parsedData.datasetName || '');
        setDescription(parsedData.description || '');
        setHasData(Boolean(processedColorData?.length));
      } catch (e) {
        console.error('Error parsing stored data', e);
      }
    }
  }, []);
  
  const handleGenerateReport = () => {
    toast.success("Generating color report. It will be ready shortly.", {
      description: "You'll receive a notification when it's complete.",
      duration: 5000,
    });
  };

  const goToDataInput = () => {
    navigate('/data-input');
  };
  
  // Get color stats
  const getUniqueColorCount = (type: 'light' | 'dark') => {
    const uniqueColors = new Set(colorData
      .filter(item => item.colorMode === type)
      .map(item => item.color)
    );
    return uniqueColors.size;
  };
  
  // Get most common color
  const getMostCommonColor = (type: 'light' | 'dark') => {
    const filteredColors = colorData.filter(item => item.colorMode === type);
    const colorCounts: Record<string, number> = {};
    
    filteredColors.forEach(item => {
      colorCounts[item.color] = (colorCounts[item.color] || 0) + 1;
    });
    
    let mostCommon = '';
    let highestCount = 0;
    
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count > highestCount) {
        mostCommon = color;
        highestCount = count;
      }
    });
    
    return mostCommon;
  };
  
  const renderColorPalettes = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {colorData.map((item, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            <div className="h-32" style={{ backgroundColor: item.color }}></div>
            <div className="p-2 text-center">
              <p className="text-sm font-medium">Day {item.day}</p>
              <p className="text-xs text-muted-foreground">{item.color} ({item.colorMode})</p>
              {item.note && <p className="text-xs italic mt-1">{item.note}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Color Data Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {hasData 
                  ? `Visualize and analyze your 30-day color collection: ${datasetName}`
                  : 'Collect and visualize your daily color choices'}
              </p>
              {description && hasData && (
                <p className="text-sm mt-2 italic">{description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={goToDataInput} variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {hasData ? 'Edit Colors' : 'Add Colors'}
              </Button>
              {hasData && (
                <Button onClick={handleGenerateReport} className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Generate Report
                </Button>
              )}
            </div>
          </div>
          
          {hasData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Color Entries"
                  value={colorData.length}
                  icon={<Calendar className="h-5 w-5" />}
                  className="animate-fade-in"
                />
                <StatsCard
                  title="Unique Light Colors"
                  value={getUniqueColorCount('light')}
                  icon={<div className="w-5 h-5 rounded-full bg-primary/20" />}
                  trend={{ value: 100, isPositive: true }}
                  variant="purple"
                  className="animate-fade-in [animation-delay:100ms]"
                />
                <StatsCard
                  title="Unique Dark Colors"
                  value={getUniqueColorCount('dark')}
                  icon={<div className="w-5 h-5 rounded-full bg-secondary" />}
                  variant="blue"
                  className="animate-fade-in [animation-delay:200ms]"
                />
                <StatsCard
                  title="Most Common Dark"
                  value={getMostCommonColor('dark').toUpperCase()}
                  icon={<div className="w-5 h-5 rounded-full" style={{backgroundColor: getMostCommonColor('dark')}} />}
                  className="animate-fade-in [animation-delay:300ms]"
                />
              </div>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="palette">Color Palette</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <ColorChart
                    title="30-Day Color Collection"
                    data={colorData}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Light Colors Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {colorData.filter(item => item.colorMode === 'light').map((item, index) => (
                            <div 
                              key={index} 
                              className="w-8 h-8 rounded-md border cursor-pointer transition-transform hover:scale-110" 
                              style={{ backgroundColor: item.color }}
                              title={`Day ${item.day}: ${item.color}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Dark Colors Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {colorData.filter(item => item.colorMode === 'dark').map((item, index) => (
                            <div 
                              key={index} 
                              className="w-8 h-8 rounded-md border cursor-pointer transition-transform hover:scale-110" 
                              style={{ backgroundColor: item.color }}
                              title={`Day ${item.day}: ${item.color}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">30-Day Color Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {colorData.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="h-24" style={{backgroundColor: item.color}}></div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">Day {item.day}</h3>
                            <div className="mt-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Color: </span>
                                {item.color}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Mode: </span>
                                {item.colorMode}
                              </div>
                              {item.note && (
                                <p className="text-xs mt-2 italic">{item.note}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="palette">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Color Palette Collection</h2>
                    {renderColorPalettes()}
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Color Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="text-center p-12 max-w-md">
                        <p className="text-muted-foreground">
                          Advanced color analytics will be available in a future update.
                          This will include color harmony analysis, trend detection, and
                          color psychology insights.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg mt-8">
              <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">No color data available</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You haven't added any color data yet. Add your 30-day color collection to generate visualizations and insights.
              </p>
              <Button onClick={goToDataInput}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Color Data
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
