
import React, { useEffect, useRef } from 'react';
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
  const treeRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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

  // Function to color the tree branches - enhanced version with better contrast
  const colorTreeBranches = () => {
    if (!treeRef.current || !canvasRef.current || sortedColorData.length === 0) return;
    
    const img = treeRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the original tree image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Get image data to manipulate
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Define better section distribution for more complete tree coloring
    const sections = [
      // Top sections
      { x: 0, y: 0, width: canvas.width * 0.3, height: canvas.height * 0.25 },
      { x: canvas.width * 0.3, y: 0, width: canvas.width * 0.4, height: canvas.height * 0.2 },
      { x: canvas.width * 0.7, y: 0, width: canvas.width * 0.3, height: canvas.height * 0.25 },
      
      // Upper middle sections
      { x: 0, y: canvas.height * 0.25, width: canvas.width * 0.2, height: canvas.height * 0.2 },
      { x: canvas.width * 0.2, y: canvas.height * 0.2, width: canvas.width * 0.2, height: canvas.height * 0.25 },
      { x: canvas.width * 0.4, y: canvas.height * 0.2, width: canvas.width * 0.2, height: canvas.height * 0.25 },
      { x: canvas.width * 0.6, y: canvas.height * 0.2, width: canvas.width * 0.2, height: canvas.height * 0.25 },
      { x: canvas.width * 0.8, y: canvas.height * 0.25, width: canvas.width * 0.2, height: canvas.height * 0.2 },
      
      // Middle sections
      { x: 0, y: canvas.height * 0.45, width: canvas.width * 0.25, height: canvas.height * 0.2 },
      { x: canvas.width * 0.25, y: canvas.height * 0.45, width: canvas.width * 0.25, height: canvas.height * 0.2 },
      { x: canvas.width * 0.5, y: canvas.height * 0.45, width: canvas.width * 0.25, height: canvas.height * 0.2 },
      { x: canvas.width * 0.75, y: canvas.height * 0.45, width: canvas.width * 0.25, height: canvas.height * 0.2 },
      
      // Lower sections
      { x: 0, y: canvas.height * 0.65, width: canvas.width * 0.33, height: canvas.height * 0.35 },
      { x: canvas.width * 0.33, y: canvas.height * 0.65, width: canvas.width * 0.33, height: canvas.height * 0.35 },
      { x: canvas.width * 0.66, y: canvas.height * 0.65, width: canvas.width * 0.34, height: canvas.height * 0.35 },
    ];

    // Distribute colors across sections
    sections.forEach((section, i) => {
      const colorIndex = i % sortedColorData.length;
      const colorObj = sortedColorData[colorIndex];
      
      // Convert color to RGB
      let r = 0, g = 0, b = 0;
      
      if (colorObj.color.startsWith('#')) {
        const hex = colorObj.color.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (colorObj.color === 'white') {
        r = g = b = 245; // Slightly off-white for better visibility
      } else {
        // Default color for named colors we can't parse
        r = 100; g = 100; b = 100;
      }
      
      // Apply darker shade for "dark" colorMode
      const multiplier = colorObj.colorMode === 'dark' ? 0.7 : 1.0; 
      r = Math.floor(r * multiplier);
      g = Math.floor(g * multiplier);
      b = Math.floor(b * multiplier);
      
      // Colorize only the dark pixels in this section (which are the tree branches)
      for (let y = section.y; y < section.y + section.height; y++) {
        for (let x = section.x; x < section.x + section.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          
          // Only color pixels that are part of the tree (dark pixels)
          if (data[idx + 3] > 50) { // If there's significant opacity (part of the tree)
            data[idx] = Math.min(r, 255);     // Red
            data[idx + 1] = Math.min(g, 255); // Green
            data[idx + 2] = Math.min(b, 255); // Blue
            // Keep alpha the same to preserve the tree shape
          }
        }
      }
    });
    
    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);
  };
  
  // Run the coloring effect when the component mounts or data changes
  useEffect(() => {
    if (treeRef.current && treeRef.current.complete) {
      colorTreeBranches();
    } else if (treeRef.current) {
      treeRef.current.onload = colorTreeBranches;
    }
  }, [sortedColorData, treeRef.current]);

  return (
    <div className="relative flex flex-col items-center py-8">
      <h3 className="text-lg font-medium mb-6">Color Visualization for {month}</h3>
      
      <div className="relative w-full max-w-2xl h-[600px] flex justify-center">
        {/* Hidden original tree image, used as reference */}
        <img 
          ref={treeRef}
          src="/lovable-uploads/b4a925c8-0789-4a93-8764-edebd279fb54.png" 
          alt="Bare tree silhouette" 
          className="hidden"
        />
        
        {/* Canvas for the colored tree */}
        <canvas 
          ref={canvasRef} 
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
