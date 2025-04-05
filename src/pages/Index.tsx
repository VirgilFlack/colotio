
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ColorChart from '@/components/ColorChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, BarChart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const positiveMessages = [
  "Today is a great day to explore colors!",
  "Your color choices reflect your unique perspective.",
  "Feeling creative? Let's explore your palette!",
  "Colors can change your mood. Make today bright!",
  "Every color tells a story. What's yours?",
  "Your color journey is looking fantastic!",
  "Embrace the colorful moments in life.",
  "Ready to add some color to your day?",
  "Your color choices are as unique as you are!",
  "Explore the power of colors in your everyday life."
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hasData, setHasData] = useState(false);
  const [userName, setUserName] = useState('User');
  const [positiveMessage, setPositiveMessage] = useState('');
  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const randomIndex = Math.floor(Math.random() * positiveMessages.length);
    setPositiveMessage(positiveMessages[randomIndex]);

    const userData = localStorage.getItem('userData');
    
    if (userData) {
      try {
        const parsedData: UserData = JSON.parse(userData);
        
        const processedColorData = parsedData.colorData?.map(item => {
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
  
  const goToCalendar = () => {
    navigate('/calendar');
  };
  
  const goToAnalytics = () => {
    toast.info("Analytics page coming soon!", {
      description: "This feature is under development.",
      duration: 3000,
    });
  };
  
  const getUniqueColorCount = (type: 'light' | 'dark') => {
    const uniqueColors = new Set(colorData
      .filter(item => item.colorMode === type)
      .map(item => item.color)
    );
    return uniqueColors.size;
  };
  
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
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-7xl">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-full">
              <h1 className="text-3xl font-bold tracking-tight">Welcome {userName}</h1>
              <p className="text-muted-foreground mt-1 whitespace-normal break-words">
                {positiveMessage}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
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
          
          <ScrollArea className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-4">
              <Card 
                className="aspect-square border-2 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-center animate-fade-in"
                onClick={goToDataInput}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <PlusCircle className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Data Input</h2>
                    <p className="text-muted-foreground">Add or edit your color collection data</p>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="aspect-square border-2 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-center animate-fade-in [animation-delay:100ms]"
                onClick={goToCalendar}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Calendar View</h2>
                    <p className="text-muted-foreground">See your color data in a calendar format</p>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="aspect-square border-2 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-center animate-fade-in [animation-delay:200ms]"
                onClick={goToAnalytics}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <BarChart className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Analytics</h2>
                    <p className="text-muted-foreground">View detailed analytics of your color data</p>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
          
          {hasData ? (
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="w-full overflow-x-auto no-scrollbar">
                <TabsList className="w-full sm:w-auto flex flex-nowrap">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="space-y-6">
                <ScrollArea className="w-full max-h-[calc(100vh-360px)]">
                  <ColorChart
                    data={colorData}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Light Colors Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-full max-h-48">
                          <div className="flex flex-wrap gap-2 pb-2">
                            {colorData.filter(item => item.colorMode === 'light').map((item, index) => (
                              <div 
                                key={index} 
                                className="w-8 h-8 rounded-md border cursor-pointer transition-transform hover:scale-110" 
                                style={{ backgroundColor: item.color }}
                                title={`Day ${item.day}: ${item.color}`}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Dark Colors Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-full max-h-48">
                          <div className="flex flex-wrap gap-2 pb-2">
                            {colorData.filter(item => item.colorMode === 'dark').map((item, index) => (
                              <div 
                                key={index} 
                                className="w-8 h-8 rounded-md border cursor-pointer transition-transform hover:scale-110" 
                                style={{ backgroundColor: item.color }}
                                title={`Day ${item.day}: ${item.color}`}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">30-Day Color Timeline</h2>
                  <ScrollArea className="max-h-[calc(100vh-360px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
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
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <ScrollArea className="max-h-[calc(100vh-360px)]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Color Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-4">
                      <div className="text-center p-12 max-w-md">
                        <p className="text-muted-foreground">
                          Advanced color analytics will be available in a future update.
                          This will include color harmony analysis, trend detection, and
                          color psychology insights.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            </Tabs>
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
