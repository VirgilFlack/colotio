
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, startOfMonth, getDaysInMonth } from 'date-fns';
import { cn } from "@/lib/utils";

interface ColorChartProps {
  title?: string;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Get current month data for calendar view
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfCurrentMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // Get current month name
  const currentMonthName = format(currentDate, 'MMMM yyyy');
  
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
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title || currentMonthName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea 
          className="h-[520px] mt-4 pr-4 color-chart-scroll-area"
          ref={scrollAreaRef}
        >
          <div className="pb-4">
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
                        className={cn(
                          "absolute inset-4 rounded-md border overflow-hidden cursor-pointer",
                          colorData.colorMode === 'dark' && "bg-gray-800"
                        )}
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
                <div className="w-3 h-3 rounded bg-gray-800 border border-secondary/50"></div>
                <span className="text-xs">Dark Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs">Has Note</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ColorChart;
