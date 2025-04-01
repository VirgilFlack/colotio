
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema for form validation
const dataSchema = z.object({
  datasetName: z.string().min(2, { message: "Dataset name must be at least 2 characters" }),
  description: z.string().optional(),
  colorData: z.array(
    z.object({
      day: z.number().min(1).max(30),
      color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, { 
        message: "Must be a valid hex color code (e.g. #FF5733)" 
      }),
      colorMode: z.enum(['light', 'dark']),
      note: z.string().optional(),
    })
  ).length(30, { message: "Must provide data for all 30 days" }),
});

type FormData = z.infer<typeof dataSchema>;

const DataInput = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("single-day");
  const [currentDay, setCurrentDay] = useState(1);

  // Initialize with 30 days of empty color data
  const initialColorData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    color: "#CCCCCC",
    colorMode: 'light' as const,
    note: "",
  }));
  
  const [colorData, setColorData] = useState(initialColorData);

  const form = useForm<FormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      datasetName: "",
      description: "",
      colorData: initialColorData,
    },
  });

  useEffect(() => {
    // Check if there's existing data in localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.colorData && Array.isArray(parsedData.colorData)) {
          // Handle potential format change from old format to new format
          const formattedData = parsedData.colorData.map((item: any) => {
            // If the data is in old format (with lightColor and darkColor)
            if (item.lightColor && item.darkColor) {
              return {
                day: item.day,
                color: item.lightColor, // Default to light color
                colorMode: 'light' as const,
                note: item.note || '',
              };
            }
            // If the data is already in the new format
            return item;
          });
          
          setColorData(formattedData);
          form.setValue("colorData", formattedData);
        }
        if (parsedData.datasetName) {
          form.setValue("datasetName", parsedData.datasetName);
        }
        if (parsedData.description) {
          form.setValue("description", parsedData.description);
        }
      } catch (e) {
        console.error("Error parsing stored data", e);
      }
    }
  }, [form]);

  const onSubmit = (data: FormData) => {
    // Store data in localStorage
    localStorage.setItem("userData", JSON.stringify(data));
    toast.success("Color data saved successfully");
    navigate("/"); // Navigate to dashboard
  };

  // Update color data for a specific day
  const updateColorData = (day: number, field: string, value: string | 'light' | 'dark') => {
    const updated = [...colorData];
    updated[day - 1] = { ...updated[day - 1], [field]: value };
    setColorData(updated);
    form.setValue("colorData", updated);
  };

  // Generate a preview swatch
  const ColorSwatch = ({ color }: { color: string }) => (
    <div 
      className="w-6 h-6 rounded-full border border-border" 
      style={{ backgroundColor: color }}
    />
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Color Data Collection</h1>
            <p className="text-muted-foreground mt-1">
              Enter your color data for each of the 30 days
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                  <CardDescription>
                    Provide basic information about your color collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="datasetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dataset Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Color Collection" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your color collection"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Color Data (30 Days)
                  </CardTitle>
                  <CardDescription>
                    Enter a color and choose light or dark mode for each day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="single-day">Day by Day</TabsTrigger>
                      <TabsTrigger value="all-days">All Days</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="single-day" className="space-y-4">
                      <div className="flex flex-col gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Select day (1-30)</p>
                          <div className="flex items-center gap-4">
                            <Slider 
                              value={[currentDay]} 
                              min={1} 
                              max={30} 
                              step={1} 
                              onValueChange={(value) => setCurrentDay(value[0])}
                              className="max-w-md"
                            />
                            <span className="font-medium">Day {currentDay}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <FormLabel htmlFor={`color-${currentDay}`}>Color</FormLabel>
                            <div className="flex items-center gap-3">
                              <ColorSwatch color={colorData[currentDay - 1]?.color || "#CCCCCC"} />
                              <Input
                                id={`color-${currentDay}`}
                                type="color"
                                className="w-20 h-10 p-1"
                                value={colorData[currentDay - 1]?.color || "#CCCCCC"}
                                onChange={(e) => updateColorData(currentDay, "color", e.target.value)}
                              />
                              <Input
                                value={colorData[currentDay - 1]?.color || "#CCCCCC"}
                                onChange={(e) => updateColorData(currentDay, "color", e.target.value)}
                                placeholder="#CCCCCC"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel>Color Mode</FormLabel>
                            <RadioGroup 
                              value={colorData[currentDay - 1]?.colorMode || "light"}
                              onValueChange={(value) => updateColorData(
                                currentDay, 
                                "colorMode", 
                                value as 'light' | 'dark'
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <FormLabel htmlFor="light" className="font-normal">Light</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <FormLabel htmlFor="dark" className="font-normal">Dark</FormLabel>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                        
                        <div>
                          <FormLabel htmlFor={`note-${currentDay}`}>Note (optional)</FormLabel>
                          <Input
                            id={`note-${currentDay}`}
                            placeholder="Any notes about this day's colors"
                            value={colorData[currentDay - 1]?.note || ""}
                            onChange={(e) => updateColorData(currentDay, "note", e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="all-days">
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {colorData.map((day, index) => (
                          <div key={index} className="p-4 border rounded-md">
                            <h3 className="text-sm font-medium mb-3">Day {day.day}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2">
                                <FormLabel className="min-w-16 text-xs">Color:</FormLabel>
                                <div className="flex items-center gap-2">
                                  <ColorSwatch color={day.color} />
                                  <Input
                                    type="text"
                                    className="h-8 text-xs"
                                    value={day.color}
                                    onChange={(e) => updateColorData(day.day, "color", e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FormLabel className="min-w-16 text-xs">Mode:</FormLabel>
                                <div className="flex items-center gap-2">
                                  <RadioGroup 
                                    value={day.colorMode}
                                    onValueChange={(value) => updateColorData(
                                      day.day, 
                                      "colorMode", 
                                      value as 'light' | 'dark'
                                    )}
                                    className="flex space-x-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="light" id={`light-${day.day}`} />
                                      <FormLabel htmlFor={`light-${day.day}`} className="text-xs font-normal">Light</FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="dark" id={`dark-${day.day}`} />
                                      <FormLabel htmlFor={`dark-${day.day}`} className="text-xs font-normal">Dark</FormLabel>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <FormLabel className="min-w-16 text-xs">Note:</FormLabel>
                                <Input
                                  type="text"
                                  className="h-8 text-xs"
                                  value={day.note || ""}
                                  onChange={(e) => updateColorData(day.day, "note", e.target.value)}
                                  placeholder="Note"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit">Save Color Data & View Dashboard</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DataInput;
