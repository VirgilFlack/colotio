
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, addDays, startOfMonth, getDaysInMonth } from 'date-fns';
import { CalendarDays } from 'lucide-react';

interface ColorChartProps {
  title: string;
  data: Array<{
    day: number;
    lightColor?: string;
    darkColor?: string;
    color: string;
    colorMode: 'light' | 'dark';
    note?: string;
  }>;
  className?: string;
}

const ColorChart = ({ title, data, className }: ColorChartProps) => {
  const [viewMode, setViewMode] = useState<'all' | '7d' | '15d'>('7d');
  
  // Filter data based on selected view mode
  const getFilteredData = () => {
    switch (viewMode) {
      case '7d': return data.slice(0, 7);
      case '15d': return data.slice(0, 15);
      case 'all': return data;
      default: return data.slice(0, 7);
    }
  };
  
  const filteredData = getFilteredData();
  
  // Get current month data for calendar view
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfCurrentMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  // Find color data for a specific day
  const getColorForDay = (day: number) => {
    return data.find(item => item.day === day);
  };
  
  // Day names for the calendar header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Chart configuration object required by ChartContainer
  const chartConfig = {
    color: {
      label: "Color",
      color: "#8B5CF6" // Default purple color
    },
    light: {
      label: "Light Mode",
      color: "#D6BCFA" // Light purple
    },
    dark: {
      label: "Dark Mode",
      color: "#6E59A5" // Dark purple
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
            <Button 
              variant={viewMode === '7d' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setViewMode('7d')}
            >
              7D
            </Button>
            <Button 
              variant={viewMode === '15d' ? 'default' : 'ghost'} 
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setViewMode('15d')}
            >
              15D
            </Button>
            <Button 
              variant={viewMode === 'all' ? 'default' : 'ghost'} 
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setViewMode('all')}
            >
              All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'all' ? (
          <div className="mt-4">
            {/* Calendar View */}
            <div className="grid grid-cols-7 gap-1">
              {/* Calendar Header - Day Names */}
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Cells */}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  // Empty cell
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }
                
                const colorData = getColorForDay(day);
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className="aspect-square border rounded-md p-1 relative hover:bg-muted/30 transition-colors"
                  >
                    <div className="text-xs font-medium absolute top-1 left-1">{day}</div>
                    {colorData && (
                      <div 
                        className="absolute inset-4 rounded-md border overflow-hidden cursor-pointer"
                        style={{ backgroundColor: colorData.color }}
                        title={`${colorData.color} (${colorData.colorMode})`}
                      >
                        {colorData.note && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full m-0.5"></div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center mt-6 gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50"></div>
                <span className="text-xs">Light Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary border border-secondary/50"></div>
                <span className="text-xs">Dark Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs">Has Note</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] mt-4">
            <ChartContainer config={chartConfig}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {filteredData.map((item, index) => (
                  <div key={index} className="p-2 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">Day {item.day}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(addDays(startOfCurrentMonth, item.day - 1), 'MMM d')}
                      </div>
                    </div>
                    <div 
                      className="h-24 w-full rounded-md border" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="mt-2">
                      <p className="text-xs">{item.color} ({item.colorMode})</p>
                      {item.note && (
                        <p className="text-xs italic mt-1 truncate" title={item.note}>
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorChart;
