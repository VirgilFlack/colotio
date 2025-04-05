
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, getWeek, getDay } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
}

interface ColorCalendarWidgetProps {
  data: ColorData[];
  className?: string;
}

const ColorCalendarWidget = ({ data, className }: ColorCalendarWidgetProps) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  
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
  
  // Group data by weeks
  const groupByWeek = () => {
    // Create a map to organize data by week
    const weekMap: Map<number, ColorData[]> = new Map();
    
    // Current date as reference
    const currentDate = new Date();
    
    data.forEach(item => {
      // Calculate the date for this item
      const itemDate = new Date();
      itemDate.setDate(currentDate.getDate() - (30 - item.day));
      
      // Get week number
      const weekNumber = getWeek(itemDate);
      
      // Add to the appropriate week
      if (!weekMap.has(weekNumber)) {
        weekMap.set(weekNumber, []);
      }
      weekMap.get(weekNumber)?.push(item);
    });
    
    // Convert map to array for rendering
    return Array.from(weekMap.entries()).sort((a, b) => b[0] - a[0]); // Sort by week number descending
  };
  
  const weeklyData = groupByWeek();
  
  // Toggle expanded week
  const toggleWeek = (weekNumber: number) => {
    if (expandedWeek === weekNumber) {
      setExpandedWeek(null);
    } else {
      setExpandedWeek(weekNumber);
    }
  };
  
  // Function to get days of a specific week as an array
  const getDaysOfWeek = (weekNumber: number) => {
    // Find a date in that week
    const weekData = weeklyData.find(([week]) => week === weekNumber);
    if (!weekData || weekData[1].length === 0) return [];
    
    // Get the date of the first item
    const firstItem = weekData[1][0];
    const currentDate = new Date();
    const itemDate = new Date();
    itemDate.setDate(currentDate.getDate() - (30 - firstItem.day));
    
    // Get start and end of the week
    const start = startOfWeek(itemDate, { weekStartsOn: 0 });
    const end = endOfWeek(itemDate, { weekStartsOn: 0 });
    
    // Get all days in the interval
    return eachDayOfInterval({ start, end });
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Color Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] w-full pr-4">
          <div className="space-y-3">
            {weeklyData.map(([weekNumber, items]) => {
              // Find first and last day of the week
              const days = getDaysOfWeek(weekNumber);
              const startDate = days.length > 0 ? days[0] : null;
              const endDate = days.length > 0 ? days[days.length - 1] : null;
              
              return (
                <Collapsible 
                  key={weekNumber}
                  open={expandedWeek === weekNumber}
                  onOpenChange={() => toggleWeek(weekNumber)}
                  className="border rounded-md overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                    <div className="flex items-center">
                      {expandedWeek === weekNumber ? 
                        <ChevronDown className="h-4 w-4 mr-2" /> : 
                        <ChevronRight className="h-4 w-4 mr-2" />
                      }
                      <span className="font-medium">
                        Week {weekNumber}
                        {startDate && endDate && (
                          <span className="text-muted-foreground ml-2 text-sm">
                            ({format(startDate, "MMM d")} - {format(endDate, "MMM d")})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex -space-x-1">
                      {items.slice(0, 4).map((item, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-background" 
                          style={{ backgroundColor: item.color }}
                          title={`${item.color} (${item.colorMode})`}
                        />
                      ))}
                      {items.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{items.length - 4}
                        </div>
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {days.map((day, index) => {
                        const dayName = format(day, "EEE");
                        const dayNum = format(day, "d");
                        const colorData = getDataForDate(day);
                        
                        return (
                          <div key={index} className="flex items-center p-2 border rounded-md">
                            <div className="w-10 text-center">
                              <div className="text-xs text-muted-foreground">{dayName}</div>
                              <div className="text-lg font-medium">{dayNum}</div>
                            </div>
                            <div className="ml-3 flex-1">
                              {colorData ? (
                                <div>
                                  <div 
                                    className="h-8 w-full rounded-md border" 
                                    style={{ backgroundColor: colorData.color }}
                                  />
                                  <div className="mt-1 text-xs">{colorData.color}</div>
                                  <div className="text-xs text-muted-foreground">{colorData.colorMode} mode</div>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground italic">No data</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ColorCalendarWidget;
