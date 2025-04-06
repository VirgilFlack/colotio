
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
import { Calendar, Info, EyeIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface DayColorData {
  day: number;
  color?: string;
  colorMode?: 'light' | 'dark';
  note?: string;
}

const dataSchema = z.object({
  datasetName: z.string().min(2, { message: "Dataset name must be at least 2 characters" }),
  description: z.string().optional(),
  colorData: z.array(
    z.object({
      day: z.number().min(1).max(30),
      color: z.string().optional(),
      colorMode: z.enum(['light', 'dark']).optional(),
      note: z.string().optional(),
    })
  ).optional(),
});

type FormData = z.infer<typeof dataSchema>;

const DataInput = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [previousDaysDialogOpen, setPreviousDaysDialogOpen] = useState(false);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const defaultDatasetName = `${currentMonthName} ${currentYear}`;

  const initialColorData: DayColorData[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
  }));
  
  const [colorData, setColorData] = useState<DayColorData[]>(initialColorData);

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
          const formattedData = Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const existingData = parsedData.colorData.find((item: any) => item.day === day);
            
            return {
              day,
              ...(existingData?.color && { color: existingData.color }),
              ...(existingData?.colorMode && { colorMode: existingData.colorMode }),
              ...(existingData?.note && { note: existingData.note }),
            };
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
    
    const cleanedColorData = data.colorData?.map(day => {
      const hasColorData = day.color && day.colorMode;
      
      if (hasColorData) {
        return {
          day: day.day,
          color: day.color,
          colorMode: day.colorMode,
          ...(day.note && { note: day.note }),
        };
      } else {
        return { day: day.day };
      }
    }) || [];
    
    const dataToSave = {
      ...data,
      colorData: cleanedColorData,
    };
    
    localStorage.setItem("userData", JSON.stringify(dataToSave));
    toast.success("Color data saved successfully");
    navigate("/dashboard");
  };

  const updateColorData = (day: number, field: string, value: string | 'light' | 'dark') => {
    const updated = [...colorData];
    const dayIndex = updated.findIndex(item => item.day === day);
    
    if (dayIndex !== -1) {
      updated[dayIndex] = { 
        ...updated[dayIndex], 
        [field]: value 
      };
      
      setColorData(updated);
      form.setValue("colorData", updated);
    }
  };

  const getColorNameFromHex = (hexValue: string) => {
    const entry = Object.entries(ALLOWED_COLORS).find(([_, hex]) => hex === hexValue);
    return entry ? entry[0] : '';
  };

  const ColorSwatch = ({ color }: { color: string }) => (
    <div 
      className="w-6 h-6 rounded-full border border-border" 
      style={{ backgroundColor: color }}
    />
  );

  // Generate array of days 1-30 for the dropdown
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Filter color data to get only days with colors
  const daysWithColors = colorData.filter(day => day.color && day.colorMode);

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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <CardTitle>Color Data (30 Days)</CardTitle>
                    </div>
                    <Dialog open={previousDaysDialogOpen} onOpenChange={setPreviousDaysDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <EyeIcon className="h-4 w-4" />
                          View Previous Days
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Previous Days Color Data</DialogTitle>
                          <DialogDescription>
                            Overview of all the days you've already recorded colors for
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          {daysWithColors.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                              No color data recorded yet. Start by selecting a day and adding a color.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {daysWithColors.map((day) => (
                                <Card key={day.day} className="overflow-hidden">
                                  <div 
                                    className="h-2" 
                                    style={{ backgroundColor: day.color }}
                                  />
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-medium">Day {day.day}</h3>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-4 h-4 rounded-full border" 
                                          style={{ backgroundColor: day.color }}
                                        />
                                        <span className="text-sm">{getColorNameFromHex(day.color || '')}</span>
                                        <span className="text-xs text-muted-foreground">
                                          ({day.colorMode})
                                        </span>
                                      </div>
                                    </div>
                                    {day.note && (
                                      <p className="text-sm text-muted-foreground truncate">
                                        {day.note}
                                      </p>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="mt-2 w-full text-xs"
                                      onClick={() => {
                                        setCurrentDay(day.day);
                                        setPreviousDaysDialogOpen(false);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={() => setPreviousDaysDialogOpen(false)}>Close</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>
                    Select a color and choose light or dark mode for each day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Select day (1-30)</p>
                      <div className="max-w-xs">
                        <Select
                          value={currentDay.toString()}
                          onValueChange={(value) => setCurrentDay(parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                Day {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <FormLabel htmlFor={`color-${currentDay}`}>Color</FormLabel>
                        <div className="flex items-center gap-3">
                          <ColorSwatch color={colorData[currentDay - 1]?.color || "#FFFFFF"} />
                          <Select
                            value={getColorNameFromHex(colorData[currentDay - 1]?.color || "")}
                            onValueChange={(value) => {
                              updateColorData(currentDay, "color", ALLOWED_COLORS[value as keyof typeof ALLOWED_COLORS]);
                              if (!colorData[currentDay - 1]?.colorMode) {
                                updateColorData(currentDay, "colorMode", "light");
                              }
                            }}
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
                          value={colorData[currentDay - 1]?.colorMode || ""}
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
