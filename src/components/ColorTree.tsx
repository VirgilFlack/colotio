
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
      
      <div className="relative w-full max-w-2xl h-[600px]">
        {/* Tree trunk/log */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-20 h-[350px] bg-gradient-to-b from-gray-700 to-gray-800 rounded-md">
          {/* Tree texture lines */}
          <div className="absolute left-3 top-5 w-2 h-[320px] bg-gray-600 rounded-full opacity-30"></div>
          <div className="absolute left-10 top-10 w-1.5 h-[300px] bg-gray-600 rounded-full opacity-30"></div>
          <div className="absolute right-5 top-15 w-2 h-[290px] bg-gray-600 rounded-full opacity-30"></div>
        </div>
        
        {/* Main branches */}
        <div className="absolute bottom-[300px] left-1/2 -translate-x-1/2">
          {/* Left main branch */}
          <div className="absolute bottom-10 -left-[180px] w-[200px] h-6 bg-gradient-to-r from-transparent to-gray-700 rounded-full transform rotate-12"></div>
          
          {/* Right main branch */}
          <div className="absolute bottom-10 -right-[180px] w-[200px] h-6 bg-gradient-to-l from-transparent to-gray-700 rounded-full transform -rotate-12"></div>
          
          {/* Upper main branch */}
          <div className="absolute bottom-20 left-0 w-4 h-[150px] bg-gradient-to-t from-gray-700 to-gray-600 rounded-full"></div>
          
          {/* Secondary branches - Left side */}
          <div className="absolute bottom-[140px] -left-[80px] w-[100px] h-4 bg-gradient-to-r from-transparent to-gray-600 rounded-full transform rotate-30"></div>
          <div className="absolute bottom-[180px] -left-[60px] w-[80px] h-3 bg-gradient-to-r from-transparent to-gray-600 rounded-full transform rotate-15"></div>
          <div className="absolute bottom-[220px] -left-[40px] w-[70px] h-3 bg-gradient-to-r from-transparent to-gray-600 rounded-full transform rotate-5"></div>
          
          {/* Secondary branches - Right side */}
          <div className="absolute bottom-[140px] -right-[80px] w-[100px] h-4 bg-gradient-to-l from-transparent to-gray-600 rounded-full transform -rotate-30"></div>
          <div className="absolute bottom-[180px] -right-[60px] w-[80px] h-3 bg-gradient-to-l from-transparent to-gray-600 rounded-full transform -rotate-15"></div>
          <div className="absolute bottom-[220px] -right-[40px] w-[70px] h-3 bg-gradient-to-l from-transparent to-gray-600 rounded-full transform -rotate-5"></div>

          {/* Upper secondary branches */}
          <div className="absolute bottom-[260px] -left-[30px] w-[60px] h-3 bg-gradient-to-r from-transparent to-gray-600 rounded-full transform rotate-30"></div>
          <div className="absolute bottom-[260px] -right-[30px] w-[60px] h-3 bg-gradient-to-l from-transparent to-gray-600 rounded-full transform -rotate-30"></div>
          
          {/* Uppermost small branches */}
          <div className="absolute bottom-[300px] -left-[20px] w-[40px] h-2 bg-gradient-to-r from-transparent to-gray-600 rounded-full transform rotate-20"></div>
          <div className="absolute bottom-[300px] -right-[20px] w-[40px] h-2 bg-gradient-to-l from-transparent to-gray-600 rounded-full transform -rotate-20"></div>
        </div>
        
        {/* Leaves on branches */}
        <div className="absolute inset-0">
          {sortedData.map((item, index) => {
            const totalItems = sortedData.length;
            // Distribute leaves around the tree in a more natural way
            const branchPositions = [
              { bottom: 140, left: -100, rotate: 30 },  // Lower left branch
              { bottom: 140, left: 100, rotate: -30 },  // Lower right branch
              { bottom: 180, left: -80, rotate: 15 },   // Mid-left branch
              { bottom: 180, left: 80, rotate: -15 },   // Mid-right branch
              { bottom: 220, left: -60, rotate: 5 },    // Upper-left branch
              { bottom: 220, left: 60, rotate: -5 },    // Upper-right branch
              { bottom: 260, left: -40, rotate: 20 },   // Upper-left small branch
              { bottom: 260, left: 40, rotate: -20 },   // Upper-right small branch
              { bottom: 300, left: -20, rotate: 10 },   // Top-left tiny branch
              { bottom: 300, left: 20, rotate: -10 },   // Top-right tiny branch
              { bottom: 340, left: 0, rotate: 0 }       // Tree top
            ];
            
            // Select position based on index
            const position = branchPositions[index % branchPositions.length];
            
            // Add some randomness to leaf positioning
            const randomOffset = {
              left: Math.random() * 20 - 10,
              bottom: Math.random() * 10 - 5,
            };
            
            return (
              <div 
                key={`leaf-${item.day}`} 
                className="absolute"
                style={{
                  bottom: `${position.bottom + randomOffset.bottom}px`, 
                  left: `calc(50% + ${position.left + randomOffset.left}px)`,
                }}
              >
                <div 
                  className="relative transition-all duration-500 hover:scale-125 cursor-pointer"
                  title={`Day ${item.day}: ${item.color}${item.note ? ` - ${item.note}` : ''}`}
                >
                  <Leaf
                    className="h-8 w-8 drop-shadow-md"
                    style={{
                      color: item.color,
                      filter: item.colorMode === 'dark' ? 'brightness(0.8)' : 'none',
                      transform: `rotate(${position.rotate}deg)`,
                    }}
                  />
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium mt-1 bg-background/80 px-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    Day {item.day}
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
