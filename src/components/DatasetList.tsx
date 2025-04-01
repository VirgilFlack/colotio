
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, MoreHorizontal } from "lucide-react";

interface Dataset {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  size: string;
  status: 'Active' | 'Processing' | 'Archived';
}

interface DatasetListProps {
  datasets: Dataset[];
  className?: string;
}

const DatasetList = ({ datasets, className }: DatasetListProps) => {
  const getStatusColor = (status: Dataset['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Available Datasets</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id} className="animate-fade-in">
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>{dataset.category}</TableCell>
                  <TableCell>{dataset.lastUpdated}</TableCell>
                  <TableCell>{dataset.size}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(dataset.status)}>
                      {dataset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetList;
