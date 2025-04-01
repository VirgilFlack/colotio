
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import DatasetList from '@/components/DatasetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart as BarChartIcon, PieChart as PieChartIcon, Database, Zap, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    // Check for user data in localStorage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      setTimeSeriesData(parsedData.timeSeriesData || []);
      setCategoryData(parsedData.categoryData || []);
      setSourceData(parsedData.sourceData || []);
      setDatasets([{
        id: '1',
        name: parsedData.datasetName,
        category: parsedData.category,
        lastUpdated: 'Just now',
        size: calculateSize(parsedData) + ' KB',
        status: 'Active' as const
      }]);
      setHasData(true);
    }
  }, []);
  
  const calculateSize = (data: any) => {
    // Rough estimate of data size in KB
    const jsonSize = JSON.stringify(data).length / 1024;
    return jsonSize.toFixed(1);
  };
  
  const handleGenerateReport = () => {
    toast.success("Generating report. It will be ready shortly.", {
      description: "You'll receive a notification when it's complete.",
      duration: 5000,
    });
  };

  const goToDataInput = () => {
    navigate('/data-input');
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
            <div className="flex gap-2">
              <Button onClick={goToDataInput} variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {hasData ? 'Edit Data' : 'Add Data'}
              </Button>
              <Button onClick={handleGenerateReport} className="gap-2">
                <Zap className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          {hasData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Data Points"
                  value={timeSeriesData.length}
                  icon={<Database className="h-5 w-5" />}
                  className="animate-fade-in"
                />
                <StatsCard
                  title="Categories"
                  value={categoryData.length}
                  icon={<Activity className="h-5 w-5" />}
                  trend={{ value: 100, isPositive: true }}
                  variant="purple"
                  className="animate-fade-in [animation-delay:100ms]"
                />
                <StatsCard
                  title="Sources"
                  value={sourceData.length}
                  icon={<BarChartIcon className="h-5 w-5" />}
                  variant="blue"
                  className="animate-fade-in [animation-delay:200ms]"
                />
                <StatsCard
                  title="Total Value"
                  value={categoryData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
                  icon={<PieChartIcon className="h-5 w-5" />}
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
                    {timeSeriesData.length > 0 && (
                      <LineChart
                        title="Time Series Data"
                        data={timeSeriesData}
                        xAxisDataKey="date"
                        lines={[
                          { dataKey: 'visitors', stroke: '#3b82f6', name: 'Visitors' },
                          { dataKey: 'engagement', stroke: '#8b5cf6', name: 'Engagement' },
                          { dataKey: 'conversions', stroke: '#10b981', name: 'Conversions' }
                        ]}
                      />
                    )}
                    {categoryData.length > 0 && (
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
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sourceData.length > 0 && (
                      <div className="md:col-span-1">
                        <PieChart
                          title="Data Sources"
                          data={sourceData}
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <DatasetList datasets={datasets} />
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg mt-8">
              <Database className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-medium mb-2">No data available</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You haven't added any data yet. Add your own data to generate visualizations and insights.
              </p>
              <Button onClick={goToDataInput}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your Data
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
