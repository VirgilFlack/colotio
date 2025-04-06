
import React from 'react';
import { Leaf, TreePine } from 'lucide-react';

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
}

interface ColorTreeProps {
  colorData: ColorData[];
  month: string;
}

const ColorTree = ({ colorData, month }: ColorTreeProps) => {
  // Sort data by day to ensure consistent leaf placement
  const sortedData = [...colorData].sort((a, b) => a.day - b.day);
  
  return (
    <div className="relative flex flex-col items-center py-8">
      <h3 className="text-lg font-medium mb-6">Color Tree for {month}</h3>
      
      <div className="relative w-full max-w-2xl h-[400px]">
        {/* Tree trunk */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          <TreePine className="text-green-900 h-40 w-40" />
        </div>
        
        {/* Leaves arranged in a circular pattern around the tree */}
        <div className="absolute inset-0 flex items-center justify-center">
          {sortedData.map((item, index) => {
            // Calculate position in a circular pattern
            const totalItems = sortedData.length;
            const angle = (index / totalItems) * 2 * Math.PI;
            const radius = 150; // Adjust based on your container size
            
            // Calculate x and y coordinates for circular arrangement
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * (radius - 50) - 20; // Slightly offset to place above tree
            
            return (
              <div
                key={`leaf-${item.day}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-125 cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  zIndex: item.day,
                }}
                title={`Day ${item.day}: ${item.color}${item.note ? ` - ${item.note}` : ''}`}
              >
                <Leaf
                  className="h-8 w-8 drop-shadow-md"
                  style={{
                    color: item.color,
                    filter: item.colorMode === 'dark' ? 'brightness(0.8)' : 'none',
                    transform: `rotate(${index * 30}deg)`,
                  }}
                />
                <div className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium mt-1">
                  Day {item.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p className="text-center">Hover over leaves to see details</p>
      </div>
    </div>
  );
};

export default ColorTree;
