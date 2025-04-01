
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
}

interface ColorCalendarProps {
  data: ColorData[];
  className?: string;
}

const ColorCalendar = ({ data, className }: ColorCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedColorData, setSelectedColorData] = useState<ColorData | null>(null);
  
  // Create a mapping of day numbers to color data for easy lookup
  const dayToColorMap = new Map<number, ColorData>();
  data.forEach((item) => {
    dayToColorMap.set(item.day, item);
  });
  
  // Function to find data for specific date
  const getDataForDate = (date: Date | undefined) => {
    if (!date) return null;
    
    // Convert the date to a day number (1-30)
    const currentDate = new Date();
    const dateDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const dayNumber = dateDiff >= 0 && dateDiff < 30 ? 30 - dateDiff : null;
    
    if (dayNumber && dayToColorMap.has(dayNumber)) {
      return dayToColorMap.get(dayNumber) || null;
    }
    return null;
  };
  
  // Update selected color data when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedColorData(getDataForDate(newDate));
  };
  
  // Function to render the custom day content with color indicators
  const renderDay = (day: Date) => {
    const colorData = getDataForDate(day);
    if (colorData) {
      return (
        <div className="relative">
          <div>{day.getDate()}</div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-sm"
            style={{ backgroundColor: colorData.color }}
          />
        </div>
      );
    }
    return day.getDate();
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Color Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex justify-between w-full mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border"
          classNames={{
            day_today: "bg-muted text-foreground",
            day_selected: "bg-primary text-primary-foreground font-medium"
          }}
          components={{
            Day: ({ date, displayMonth }) => {
              const isCurrentMonth = displayMonth.getMonth() === date.getMonth();
              const colorData = getDataForDate(date);
              const hasData = colorData !== null;
              
              if (!isCurrentMonth) {
                return <div className="flex h-9 w-9 p-0 justify-center items-center text-muted-foreground">{date.getDate()}</div>;
              }
              
              return (
                <div 
                  className={`flex h-9 w-9 p-0 justify-center items-center relative ${hasData ? 'font-medium' : ''}`}
                >
                  <div>{date.getDate()}</div>
                  {hasData && (
                    <div 
                      className="absolute bottom-0.5 left-1 right-1 h-1 rounded-full"
                      style={{ backgroundColor: colorData.color }}
                    />
                  )}
                </div>
              );
            }
          }}
        />

        {selectedColorData && (
          <div className="mt-6 p-4 border rounded-md w-full">
            <h3 className="text-lg font-medium mb-2">Day {selectedColorData.day} Color</h3>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: selectedColorData.color }}
              />
              <div>
                <p className="font-medium">{selectedColorData.color}</p>
                <p className="text-sm text-muted-foreground">{selectedColorData.colorMode} mode</p>
              </div>
            </div>
            {selectedColorData.note && (
              <p className="mt-2 text-sm italic">{selectedColorData.note}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorCalendar;
