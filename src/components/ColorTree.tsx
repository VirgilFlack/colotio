
import React from 'react';
import { cn } from "@/lib/utils";

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
  
  // Define leaf positions following the natural branch structure of the tree
  // Each position represents [x%, y%] coordinates relative to the container
  const leafPositions = [
    // Left branch (early month)
    [25, 25], [20, 30], [23, 35], [18, 40], [22, 45], [19, 50], [24, 55],
    
    // Left-middle branch
    [35, 22], [32, 28], [37, 34], [33, 40], [38, 46], [34, 52], [39, 58],
    
    // Center branch (mid-month)
    [50, 15], [48, 22], [52, 28], [47, 35], [51, 42], [49, 48], [53, 55],
    
    // Right-middle branch
    [63, 22], [60, 28], [65, 34], [62, 40], [67, 46], [63, 52], [68, 58],
    
    // Right branch (late month)
    [75, 25], [72, 30], [77, 35], [73, 40], [78, 45], [74, 50], [79, 55],
  ];
  
  // Function to determine if a color is light
  const isLightColor = (color: string): boolean => {
    // If it's a hex color
    if (color.startsWith('#')) {
      let hex = color.substring(1);
      
      // Convert 3-digit hex to 6-digit
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      // Convert hex to RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      // Calculate perceived brightness
      // Formula: (R * 0.299 + G * 0.587 + B * 0.114) > 186 is light color
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
    }
    
    // For simple named colors like "white", "ivory", etc.
    const lightColors = ['white', 'ivory', 'snow', 'ghostwhite', 'aliceblue', 'azure', 'mintcream'];
    return lightColors.includes(color.toLowerCase());
  };

  return (
    <div className="relative flex flex-col items-center py-8">
      <h3 className="text-lg font-medium mb-6">Color Visualization for {month}</h3>
      
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
            
            // Adjust size based on day but keep within reasonable limits
            // Earlier days will have slightly smaller leaves
            const size = 16 + (data.day / 31) * 12; // Size from 16-28px based on day
            
            // Determine if this is a light color that needs a border
            const needsBorder = isLightColor(data.color);
            
            return (
              <div 
                key={`leaf-${data.day}`}
                className={cn(
                  "absolute rounded-full shadow-sm transform transition-all duration-700 hover:scale-110",
                  needsBorder && "border border-black dark:border-white"
                )}
                style={{
                  left: `${position[0]}%`,
                  top: `${position[1]}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: data.color,
                  filter: data.colorMode === 'dark' ? 'brightness(0.8)' : 'none',
                  // Slight random rotation for natural look, but keep it subtle
                  transform: `rotate(${Math.floor(Math.random() * 40) - 20}deg)`,
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
