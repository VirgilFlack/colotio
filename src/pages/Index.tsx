
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import DatasetList from '@/components/DatasetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart as BarChartIcon, PieChart as PieChartIcon, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for demonstration
const generateTimeSeriesData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Math.floor(Math.random() * 1000) + 500,
      engagement: Math.floor(Math.random() * 600) + 200,
      conversions: Math.floor(Math.random() * 100) + 50,
    });
  }
  
  return data;
};

const categoryData = [
  { name: 'Electronics', sales: 4200, profit: 1800, cost: 2400 },
  { name: 'Clothing', sales: 3000, profit: 1400, cost: 1600 },
  { name: 'Food', sales: 2800, profit: 980, cost: 1820 },
  { name: 'Books', sales: 2000, profit: 800, cost: 1200 },
  { name: 'Sports', sales: 1800, profit: 700, cost: 1100 },
  { name: 'Beauty', sales: 2500, profit: 1100, cost: 1400 },
];

const sourceData = [
  { name: 'Direct', value: 35, color: '#3b82f6' },
  { name: 'Social Media', value: 25, color: '#8b5cf6' },
  { name: 'Email', value: 20, color: '#ec4899' },
  { name: 'Referral', value: 15, color: '#10b981' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const mockDatasets = [
  { id: '1', name: 'Market Analysis 2023', category: 'Business', lastUpdated: 'Today', size: '2.4 MB', status: 'Active' as const },
  { id: '2', name: 'Customer Survey Results', category: 'Marketing', lastUpdated: 'Yesterday', size: '4.8 MB', status: 'Active' as const },
  { id: '3', name: 'Global Sales Data', category: 'Finance', lastUpdated: '3 days ago', size: '8.3 MB', status: 'Processing' as const },
  { id: '4', name: 'Website Analytics', category: 'Analytics', lastUpdated: '1 week ago', size: '1.7 MB', status: 'Active' as const },
  { id: '5', name: 'Quarterly Report 2022', category: 'Business', lastUpdated: '2 months ago', size: '3.6 MB', status: 'Archived' as const },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const timeSeriesData = generateTimeSeriesData(90); // Generate 90 days of data
  
  const handleGenerateReport = () => {
    toast.success("Generating report. It will be ready shortly.", {
      description: "You'll receive a notification when it's complete.",
      duration: 5000,
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Visualize and analyze your data with interactive charts and reports.
              </p>
            </div>
            <Button onClick={handleGenerateReport} className="gap-2">
              <Zap className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Datasets"
              value="128"
              icon={<Database className="h-5 w-5" />}
              trend={{ value: 12.5, isPositive: true }}
              className="animate-fade-in"
            />
            <StatsCard
              title="Active Visualizations"
              value="87"
              icon={<Activity className="h-5 w-5" />}
              trend={{ value: 8.2, isPositive: true }}
              variant="purple"
              className="animate-fade-in [animation-delay:100ms]"
            />
            <StatsCard
              title="Data Points"
              value="1.2M"
              icon={<BarChartIcon className="h-5 w-5" />}
              trend={{ value: 3.1, isPositive: true }}
              variant="blue"
              className="animate-fade-in [animation-delay:200ms]"
            />
            <StatsCard
              title="Data Categories"
              value="24"
              icon={<PieChartIcon className="h-5 w-5" />}
              trend={{ value: 0, isPositive: true }}
              className="animate-fade-in [animation-delay:300ms]"
            />
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                  title="Metrics Trends"
                  data={timeSeriesData}
                  xAxisDataKey="date"
                  lines={[
                    { dataKey: 'visitors', stroke: '#3b82f6', name: 'Visitors' },
                    { dataKey: 'engagement', stroke: '#8b5cf6', name: 'Engagement' },
                    { dataKey: 'conversions', stroke: '#10b981', name: 'Conversions' }
                  ]}
                />
                <BarChart
                  title="Category Performance"
                  data={categoryData}
                  xAxisDataKey="name"
                  bars={[
                    { dataKey: 'sales', fill: '#3b82f6', name: 'Sales' },
                    { dataKey: 'profit', fill: '#10b981', name: 'Profit' },
                    { dataKey: 'cost', fill: '#f43f5e', name: 'Cost' }
                  ]}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <PieChart
                    title="Traffic Sources"
                    data={sourceData}
                  />
                </div>
                <div className="md:col-span-2">
                  <DatasetList datasets={mockDatasets} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="flex items-center justify-center h-60 border border-dashed rounded-md">
                <p className="text-muted-foreground">Analytics content will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="datasets">
              <div className="flex items-center justify-center h-60 border border-dashed rounded-md">
                <p className="text-muted-foreground">Datasets content will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="flex items-center justify-center h-60 border border-dashed rounded-md">
                <p className="text-muted-foreground">Reports content will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
