
import React from 'react';

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
  // Sort color data by day to ensure chronological order
  const sortedColorData = [...colorData].sort((a, b) => a.day - b.day);
  
  // Define leaf positions in a left-to-right pattern
  // Each position represents [x%, y%] coordinates relative to the container
  const leafPositions = [
    // Left side (early month)
    [20, 30], [15, 35], [25, 40], [20, 45], [15, 50], [25, 55], [20, 60], 
    // Left-middle
    [30, 25], [35, 30], [30, 35], [35, 40], [30, 45], [35, 50], [30, 55],
    // Middle section
    [40, 20], [45, 25], [50, 30], [45, 35], [50, 40], [45, 45], [50, 50], [45, 55],
    // Right-middle
    [60, 25], [65, 30], [60, 35], [65, 40], [60, 45], [65, 50], [60, 55],
    // Right side (late month)
    [70, 30], [75, 35], [70, 40], [75, 45], [70, 50], [75, 55], [70, 60],
  ];

  return (
    <div className="relative flex flex-col items-center py-8">
      <h3 className="text-lg font-medium mb-6">Color Tree for {month}</h3>
      
      <div className="relative w-full max-w-2xl h-[600px] flex justify-center">
        {/* Tree base image */}
        <img 
          src="/lovable-uploads/b4a925c8-0789-4a93-8764-edebd279fb54.png" 
          alt="Bare tree silhouette" 
          className="h-full object-contain"
        />

        {/* Overlay leaves on the tree based on color data in chronological order */}
        <div className="absolute inset-0 pointer-events-none">
          {sortedColorData.map((data, index) => {
            // If we have more data than positions, loop around
            const position = leafPositions[index % leafPositions.length];
            
            // Skip if no position (shouldn't happen with our array, but just in case)
            if (!position) return null;
            
            // Random size for variety but consistent with day number
            // Earlier days will have slightly smaller leaves
            const size = 20 + (data.day / 30) * 10; // Size from 20-30px based on day
            
            return (
              <div 
                key={`leaf-${data.day}`}
                className="absolute rounded-full shadow-sm transform transition-all duration-700 hover:scale-110"
                style={{
                  left: `${position[0]}%`,
                  top: `${position[1]}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: data.color,
                  filter: data.colorMode === 'dark' ? 'brightness(0.8)' : 'none',
                  // Slight random rotation for natural look
                  transform: `rotate(${Math.floor(Math.random() * 60) - 30}deg)`,
                  // Animate in with delay based on day number for chronological appearance
                  animation: 'fade-in 0.5s ease-out forwards',
                  animationDelay: `${data.day * 0.05}s`,
                  zIndex: data.day, // Later days appear on top
                }}
                title={`Day ${data.day}: ${data.color} (${data.note || 'No note'})`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p className="text-center">
          {sortedColorData.length > 0 
            ? `Tree with ${sortedColorData.length} leaf colors for ${month}` 
            : 'A bare tree with no leaves'}
        </p>
      </div>
    </div>
  );
};

export default ColorTree;
