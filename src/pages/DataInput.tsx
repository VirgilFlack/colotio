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
import { Calendar, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALLOWED_COLORS = {
  Red: "#FF0000",
  Blue: "#0000FF",
  Yellow: "#FFFF00", 
  Green: "#00FF00",
  Purple: "#800080",
  Orange: "#FFA500",
  Black: "#000000",
  White: "#FFFFFF"
};

const dataSchema = z.object({
  datasetName: z.string().min(2, { message: "Dataset name must be at least 2 characters" }),
  description: z.string().optional(),
  colorData: z.array(
    z.object({
      day: z.number().min(1).max(30),
      color: z.string(),
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

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const defaultDatasetName = `${currentMonthName} ${currentYear}`;

  const initialColorData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    color: ALLOWED_COLORS.Blue,
    colorMode: 'light' as const,
    note: "",
  }));
  
  const [colorData, setColorData] = useState(initialColorData);

  const form = useForm<FormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      datasetName: defaultDatasetName,
      description: "",
      colorData: initialColorData,
    },
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.colorData && Array.isArray(parsedData.colorData)) {
          const formattedData = parsedData.colorData.map((item: any) => {
            if (item.lightColor && item.darkColor) {
              return {
                day: item.day,
                color: item.lightColor,
                colorMode: 'light' as const,
                note: item.note || '',
              };
            }
            return item;
          });
          
          setColorData(formattedData);
          form.setValue("colorData", formattedData);
        }
        form.setValue("datasetName", defaultDatasetName);
        if (parsedData.description) {
          form.setValue("description", parsedData.description);
        }
      } catch (e) {
        console.error("Error parsing stored data", e);
      }
    }
  }, [form, defaultDatasetName]);

  const onSubmit = (data: FormData) => {
    data.datasetName = defaultDatasetName;
    
    localStorage.setItem("userData", JSON.stringify(data));
    toast.success("Color data saved successfully");
    navigate("/dashboard");
  };

  const updateColorData = (day: number, field: string, value: string | 'light' | 'dark') => {
    const updated = [...colorData];
    updated[day - 1] = { ...updated[day - 1], [field]: value };
    setColorData(updated);
    form.setValue("colorData", updated);
  };

  const getColorNameFromHex = (hexValue: string) => {
    const entry = Object.entries(ALLOWED_COLORS).find(([_, hex]) => hex === hexValue);
    return entry ? entry[0] : 'Unknown';
  };

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
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">Color Data Collection</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="Learn about color theory">
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Emotional Color Theory</DialogTitle>
                    <DialogDescription className="text-base">
                      Understanding the emotional impact of colors
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      Color theory suggests that different colors evoke different emotional responses. 
                      Here's what various colors may represent:
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            Red
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Passion, energy, excitement, love, strength</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Anger, danger, warning, aggression</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                            Orange
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Creativity, enthusiasm, warmth, success</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Frustration, immaturity, deprivation</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            Yellow
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Optimism, happiness, clarity, joy</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Caution, anxiety, fear, cowardice</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            Green
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Growth, harmony, health, nature, prosperity</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Envy, materialism, stagnation</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            Blue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Trust, calm, serenity, loyalty, stability</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Sadness, depression, coldness</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                            Purple
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Creativity, wisdom, spirituality, luxury</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Moodiness, mystery, introversion</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                            Pink
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Love, compassion, nurturing, playfulness</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Weakness, over-emotion, immaturity</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                            Black
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Sophistication, elegance, power, formality</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Mourning, evil, mystery, fear</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 border rounded-full"></div>
                            White
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Purity, cleanliness, innocence, simplicity</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Sterility, emptiness, isolation</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                            Gray
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Neutrality, balance, sophistication</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Boredom, indecision, depression</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
                            Brown
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm"><span className="font-medium">Positive:</span> Reliability, stability, warmth, earthiness</p>
                          <p className="text-sm"><span className="font-medium">Negative:</span> Dullness, heaviness, lack of humor</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground">
                        Note: Color associations can vary significantly between cultures and individuals. 
                        These are general Western interpretations and your personal experience may differ.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                    Dataset automatically named after the current month
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
                          <Input 
                            placeholder={defaultDatasetName} 
                            {...field} 
                            disabled
                            value={defaultDatasetName}
                          />
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
                    Select a color and choose light or dark mode for each day
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
                              <ColorSwatch color={colorData[currentDay - 1]?.color || "#0000FF"} />
                              <Select
                                value={getColorNameFromHex(colorData[currentDay - 1]?.color) || "Blue"}
                                onValueChange={(value) => updateColorData(currentDay, "color", ALLOWED_COLORS[value as keyof typeof ALLOWED_COLORS])}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(ALLOWED_COLORS).map(([name, hex]) => (
                                    <SelectItem key={name} value={name}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-4 h-4 rounded-full" 
                                          style={{ backgroundColor: hex }}
                                        ></div>
                                        <span>{name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                                  <Select
                                    value={getColorNameFromHex(day.color) || "Blue"}
                                    onValueChange={(value) => updateColorData(day.day, "color", ALLOWED_COLORS[value as keyof typeof ALLOWED_COLORS])}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(ALLOWED_COLORS).map(([name, hex]) => (
                                        <SelectItem key={name} value={name}>
                                          <div className="flex items-center gap-2">
                                            <div 
                                              className="w-3 h-3 rounded-full" 
                                              style={{ backgroundColor: hex }}
                                            ></div>
                                            <span>{name}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
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
