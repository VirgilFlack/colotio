
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Database, ListFilter } from "lucide-react";

// Schema for form validation
const dataSchema = z.object({
  datasetName: z.string().min(2, { message: "Dataset name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  timeSeriesData: z.array(
    z.object({
      date: z.string(),
      visitors: z.number().min(0),
      engagement: z.number().min(0),
      conversions: z.number().min(0),
    })
  ).min(1, { message: "At least one data point is required" }),
  categoryData: z.array(
    z.object({
      name: z.string(),
      sales: z.number().min(0),
      profit: z.number().min(0),
      cost: z.number().min(0),
    })
  ).min(1, { message: "At least one category is required" }),
  sourceData: z.array(
    z.object({
      name: z.string(),
      value: z.number().min(0),
      color: z.string(),
    })
  ).min(1, { message: "At least one source is required" }),
});

type FormData = z.infer<typeof dataSchema>;

const DEFAULT_TIME_SERIES = { date: "", visitors: 0, engagement: 0, conversions: 0 };
const DEFAULT_CATEGORY = { name: "", sales: 0, profit: 0, cost: 0 };
const DEFAULT_SOURCE = { name: "", value: 0, color: "#3b82f6" };

// List of predefined colors for source data
const PREDEFINED_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#6b7280", // gray
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#d946ef", // fuchsia
];

const DataInput = () => {
  const navigate = useNavigate();
  const [timeSeriesFields, setTimeSeriesFields] = useState([{ ...DEFAULT_TIME_SERIES }]);
  const [categoryFields, setCategoryFields] = useState([{ ...DEFAULT_CATEGORY }]);
  const [sourceFields, setSourceFields] = useState([{ ...DEFAULT_SOURCE }]);

  const form = useForm<FormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      datasetName: "",
      category: "",
      description: "",
      timeSeriesData: [{ ...DEFAULT_TIME_SERIES }],
      categoryData: [{ ...DEFAULT_CATEGORY }],
      sourceData: [{ ...DEFAULT_SOURCE }],
    },
  });

  const onSubmit = (data: FormData) => {
    // Store data in localStorage
    localStorage.setItem("userData", JSON.stringify(data));
    toast.success("Data saved successfully");
    navigate("/"); // Navigate to dashboard
  };

  // Add new field handlers
  const addTimeSeriesField = () => {
    setTimeSeriesFields([...timeSeriesFields, { ...DEFAULT_TIME_SERIES }]);
  };

  const addCategoryField = () => {
    setCategoryFields([...categoryFields, { ...DEFAULT_CATEGORY }]);
  };

  const addSourceField = () => {
    setSourceFields([
      ...sourceFields,
      {
        ...DEFAULT_SOURCE,
        color: PREDEFINED_COLORS[sourceFields.length % PREDEFINED_COLORS.length],
      },
    ]);
  };

  // Remove field handlers
  const removeTimeSeriesField = (index: number) => {
    if (timeSeriesFields.length > 1) {
      const updated = [...timeSeriesFields];
      updated.splice(index, 1);
      setTimeSeriesFields(updated);
    }
  };

  const removeCategoryField = (index: number) => {
    if (categoryFields.length > 1) {
      const updated = [...categoryFields];
      updated.splice(index, 1);
      setCategoryFields(updated);
    }
  };

  const removeSourceField = (index: number) => {
    if (sourceFields.length > 1) {
      const updated = [...sourceFields];
      updated.splice(index, 1);
      setSourceFields(updated);
    }
  };

  // Field update handlers
  const updateTimeSeriesField = (index: number, field: string, value: string | number) => {
    const updated = [...timeSeriesFields];
    updated[index] = { ...updated[index], [field]: field === "date" ? value : Number(value) };
    setTimeSeriesFields(updated);
    form.setValue("timeSeriesData", updated as any);
  };

  const updateCategoryField = (index: number, field: string, value: string | number) => {
    const updated = [...categoryFields];
    updated[index] = { ...updated[index], [field]: field === "name" ? value : Number(value) };
    setCategoryFields(updated);
    form.setValue("categoryData", updated as any);
  };

  const updateSourceField = (index: number, field: string, value: string | number) => {
    const updated = [...sourceFields];
    updated[index] = { ...updated[index], [field]: value };
    setSourceFields(updated);
    form.setValue("sourceData", updated as any);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Input</h1>
            <p className="text-muted-foreground mt-1">
              Enter your custom data to visualize on the dashboard.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                  <CardDescription>
                    Provide basic information about your dataset
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
                          <Input placeholder="My Dataset" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Business, Marketing, etc." {...field} />
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
                            placeholder="A brief description of your dataset"
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
                    <ListFilter className="h-5 w-5" />
                    Time Series Data
                  </CardTitle>
                  <CardDescription>
                    Enter time-based data points for the line chart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeSeriesFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                        <div className="md:col-span-2">
                          <Label htmlFor={`date-${index}`}>Date</Label>
                          <Input
                            id={`date-${index}`}
                            placeholder="Jan 1"
                            value={field.date}
                            onChange={(e) =>
                              updateTimeSeriesField(index, "date", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`visitors-${index}`}>Visitors</Label>
                          <Input
                            id={`visitors-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.visitors}
                            onChange={(e) =>
                              updateTimeSeriesField(index, "visitors", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`engagement-${index}`}>Engagement</Label>
                          <Input
                            id={`engagement-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.engagement}
                            onChange={(e) =>
                              updateTimeSeriesField(index, "engagement", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`conversions-${index}`}>Conversions</Label>
                          <Input
                            id={`conversions-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.conversions}
                            onChange={(e) =>
                              updateTimeSeriesField(index, "conversions", e.target.value)
                            }
                          />
                        </div>
                        {timeSeriesFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-6"
                            onClick={() => removeTimeSeriesField(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimeSeriesField}
                  >
                    Add Time Series Data Point
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Category Data
                  </CardTitle>
                  <CardDescription>
                    Enter category-based data for the bar chart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
                        <div>
                          <Label htmlFor={`name-${index}`}>Category Name</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Electronics"
                            value={field.name}
                            onChange={(e) =>
                              updateCategoryField(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sales-${index}`}>Sales</Label>
                          <Input
                            id={`sales-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.sales}
                            onChange={(e) =>
                              updateCategoryField(index, "sales", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`profit-${index}`}>Profit</Label>
                          <Input
                            id={`profit-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.profit}
                            onChange={(e) =>
                              updateCategoryField(index, "profit", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`cost-${index}`}>Cost</Label>
                          <Input
                            id={`cost-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.cost}
                            onChange={(e) =>
                              updateCategoryField(index, "cost", e.target.value)
                            }
                          />
                        </div>
                        {categoryFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategoryField(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCategoryField}
                  >
                    Add Category
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Source Data
                  </CardTitle>
                  <CardDescription>
                    Enter source-based data for the pie chart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sourceFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
                        <div>
                          <Label htmlFor={`source-name-${index}`}>Source Name</Label>
                          <Input
                            id={`source-name-${index}`}
                            placeholder="Direct, Social, etc."
                            value={field.name}
                            onChange={(e) =>
                              updateSourceField(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`value-${index}`}>Value</Label>
                          <Input
                            id={`value-${index}`}
                            type="number"
                            placeholder="0"
                            value={field.value}
                            onChange={(e) =>
                              updateSourceField(index, "value", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`color-${index}`}>Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`color-${index}`}
                              type="color"
                              className="w-16 p-1 h-10"
                              value={field.color}
                              onChange={(e) =>
                                updateSourceField(index, "color", e.target.value)
                              }
                            />
                            <Input
                              value={field.color}
                              onChange={(e) =>
                                updateSourceField(index, "color", e.target.value)
                              }
                              placeholder="#HEX"
                            />
                          </div>
                        </div>
                        {sourceFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-6"
                            onClick={() => removeSourceField(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSourceField}
                  >
                    Add Source
                  </Button>
                </CardFooter>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit">Save Data & View Dashboard</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DataInput;
