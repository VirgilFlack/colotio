
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
      
      <div className="relative w-full max-w-2xl h-[500px]">
        {/* Tree trunk/log */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-16 h-[250px] bg-gradient-to-b from-yellow-800 to-amber-900 rounded-md">
          {/* Tree texture lines */}
          <div className="absolute left-2 top-5 w-2 h-[220px] bg-amber-700 rounded-full opacity-30"></div>
          <div className="absolute left-6 top-10 w-1 h-[200px] bg-amber-700 rounded-full opacity-30"></div>
          <div className="absolute right-3 top-15 w-1.5 h-[190px] bg-amber-700 rounded-full opacity-30"></div>
        </div>
        
        {/* Branches with leaves */}
        <div className="absolute inset-0">
          {sortedData.map((item, index) => {
            const totalItems = sortedData.length;
            const sideOfTree = index % 2 === 0 ? -1 : 1; // Alternate left and right
            const branchLevel = Math.floor(index / 2) % 5; // Divide tree into 5 vertical levels
            const branchAngle = (20 + (branchLevel * 10)) * sideOfTree; // Angle increases with height
            const branchLength = 70 + (Math.random() * 50); // Random branch length
            
            return (
              <div key={`branch-${item.day}`} className="absolute left-1/2 bottom-[150px]">
                <div 
                  className="relative"
                  style={{
                    height: `${branchLength}px`,
                    width: `${branchLength}px`,
                    transformOrigin: 'left bottom',
                    transform: `translateY(-${80 + branchLevel * 40}px) rotate(${branchAngle}deg)`,
                  }}
                >
                  {/* Branch */}
                  <div 
                    className="absolute left-0 top-1/2 h-2 rounded-full bg-gradient-to-r from-amber-800 to-amber-700"
                    style={{ width: `${branchLength}px` }}
                  ></div>
                  
                  {/* Leaf at the end of branch */}
                  <div 
                    className="absolute right-0 top-0 transform -translate-y-1/2 transition-all duration-500 hover:scale-125 cursor-pointer"
                    title={`Day ${item.day}: ${item.color}${item.note ? ` - ${item.note}` : ''}`}
                  >
                    <Leaf
                      className="h-8 w-8 drop-shadow-md"
                      style={{
                        color: item.color,
                        filter: item.colorMode === 'dark' ? 'brightness(0.8)' : 'none',
                        transform: `rotate(${branchAngle}deg)`,
                      }}
                    />
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium mt-1 bg-background/80 px-1 rounded"
                      style={{
                        transform: `rotate(${-branchAngle}deg)`, // Counter-rotate the text to make it readable
                      }}
                    >
                      Day {item.day}
                    </div>
                  </div>
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
