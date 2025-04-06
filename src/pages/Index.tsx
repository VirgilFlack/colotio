import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ColorChart from '@/components/ColorChart';
import { PlusCircle, Calendar, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { format, subMonths } from 'date-fns';
import { ColorData, getColorDataForMonth } from '@/utils/sampleData';

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
  const navigate = useNavigate();
  
  const [colorData, setColorData] = useState<ColorData[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hasData, setHasData] = useState(false);
  const [userName, setUserName] = useState('User');
  const [positiveMessage, setPositiveMessage] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM yyyy'));
  
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'MMMM yyyy');
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const randomIndex = Math.floor(Math.random() * positiveMessages.length);
    setPositiveMessage(positiveMessages[randomIndex]);

    loadColorData(format(new Date(), 'MMMM yyyy'));
  }, []);

  const loadColorData = (month: string) => {
    try {
      const data = getColorDataForMonth(month);
      
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setDatasetName(parsedData.datasetName || '');
        setDescription(parsedData.description || '');
      }
      
      setColorData(data);
      setHasData(data.length > 0);
    } catch (e) {
      console.error('Error loading color data for dashboard', e);
      setColorData([]);
      setDatasetName('');
      setDescription('');
      setHasData(false);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData' || e.key === null || e.key.includes('color') || e.key.includes('Color')) {
        loadColorData(selectedMonth);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    const handleDataErased = () => {
      loadColorData(selectedMonth);
      setHasData(false);
    };
    window.addEventListener('colorDataErased', handleDataErased);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('colorDataErased', handleDataErased);
    };
  }, [selectedMonth]);
  
  const handleGenerateReport = () => {
    setReportDialogOpen(true);
  };

  const generateMonthlyReport = () => {
    setReportDialogOpen(false);
    
    navigate(`/monthly-report?month=${encodeURIComponent(selectedMonth)}`);
    
    toast.success(`Generating color report for ${selectedMonth}`, {
      description: "Preparing your monthly color visualization.",
      duration: 3000,
    });
  };

  const goToDataInput = () => {
    navigate('/data-input');
  };
  
  const goToCalendar = () => {
    navigate('/calendar');
  };
  
  const goToHelp = () => {
    navigate('/help');
  };
  
  return (
    <div className="min-h-screen bg-background overflow-hidden overflow-x-hidden">
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
                onClick={goToHelp}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <HelpCircle className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Help</h2>
                    <p className="text-muted-foreground">Access mental health resources and therapy services</p>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
          
          {hasData ? (
            <div className="h-full space-y-6">
              <h2 className="text-xl font-bold">Color Calendar</h2>
              <ColorChart data={colorData} />
            </div>
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

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Monthly Color Report</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="month-select" className="text-sm font-medium">
                  Select Month
                </label>
                <Select
                  value={selectedMonth}
                  onValueChange={(value) => {
                    setSelectedMonth(value);
                    loadColorData(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {monthOptions.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={generateMonthlyReport}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
