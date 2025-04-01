
import { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BarChartProps {
  title: string;
  data: Array<Record<string, any>>;
  bars: Array<{
    dataKey: string;
    fill: string;
    name?: string;
  }>;
  xAxisDataKey: string;
  className?: string;
}

const BarChart = ({ title, data, bars, xAxisDataKey, className }: BarChartProps) => {
  const [view, setView] = useState<'grouped' | 'stacked'>('grouped');
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
            <Button 
              variant={view === 'grouped' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setView('grouped')}
            >
              Grouped
            </Button>
            <Button 
              variant={view === 'stacked' ? 'default' : 'ghost'} 
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setView('stacked')}
            >
              Stacked
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisDataKey} 
                tick={{ fontSize: 12 }} 
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              {bars.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.dataKey}
                  name={bar.name || bar.dataKey}
                  fill={bar.fill}
                  stackId={view === 'stacked' ? 'stack' : undefined}
                  radius={view === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
