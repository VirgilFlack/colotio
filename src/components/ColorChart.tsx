
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  Rectangle,
  RectangleProps,
  ComposedChart,
  ResponsiveContainer 
} from 'recharts';

interface ColorChartProps {
  title: string;
  data: Array<{
    day: number;
    lightColor: string;
    darkColor: string;
    note?: string;
  }>;
  className?: string;
}

// Custom component to render rectangles with the color data
const ColorRectangle = (props: RectangleProps) => {
  const { x, y, width, height, dataKey, fill } = props;
  
  if (!x || !y || !width || !height || typeof fill !== 'string') return null;
  
  return (
    <Rectangle 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={fill} 
      stroke="#fff"
      strokeWidth={1}
      radius={2}
    />
  );
};

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
  
  // Transform data for the chart
  const chartData = filteredData.map((item) => ({
    day: `Day ${item.day}`,
    lightColor: item.lightColor,
    darkColor: item.darkColor,
    note: item.note || '',
  }));
  
  // Custom chart config
  const chartConfig = {
    light: { color: "#F0F4F8" },
    dark: { color: "#1F2937" },
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
        <div className="h-[400px] mt-4">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                barGap={0}
              >
                <XAxis 
                  dataKey="day"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-background border rounded-md shadow-md">
                          <p className="font-bold">{data.day}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: data.lightColor }}></div>
                              <span className="text-xs">{data.lightColor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: data.darkColor }}></div>
                              <span className="text-xs">{data.darkColor}</span>
                            </div>
                          </div>
                          {data.note && <p className="text-xs mt-2">{data.note}</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {chartData.map((entry, index) => {
                  // Calculate x position for placing the color squares
                  const barWidth = (100 / chartData.length);
                  const xPos = (index * barWidth) + '%';
                  
                  return (
                    <g key={`color-${index}`}>
                      <foreignObject 
                        x={`calc(${xPos} + 5%)`} 
                        y="20%" 
                        width={`${barWidth * 0.9}%`} 
                        height="25%"
                      >
                        <div 
                          className="w-full h-full rounded-md border border-white/30"
                          style={{ backgroundColor: entry.lightColor }}
                        />
                      </foreignObject>
                      
                      <foreignObject 
                        x={`calc(${xPos} + 5%)`}
                        y="55%" 
                        width={`${barWidth * 0.9}%`} 
                        height="25%"
                      >
                        <div 
                          className="w-full h-full rounded-md border border-white/30"
                          style={{ backgroundColor: entry.darkColor }}
                        />
                      </foreignObject>
                    </g>
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center mt-2 gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50"></div>
              <span className="text-xs">Light Colors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary border border-secondary/50"></div>
              <span className="text-xs">Dark Colors</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorChart;
