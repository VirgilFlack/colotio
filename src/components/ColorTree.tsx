
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
  // Define leaf positions - these are approximate positions for leaves on the tree
  // Each position represents [x%, y%] coordinates relative to the container
  const leafPositions = [
    // Top section
    [50, 10], [45, 15], [55, 15], [40, 20], [60, 20],
    // Upper middle section
    [35, 25], [45, 25], [55, 25], [65, 25], [30, 30], [40, 30], [50, 30], [60, 30], [70, 30],
    // Middle section
    [25, 35], [35, 35], [45, 35], [55, 35], [65, 35], [75, 35],
    [30, 40], [40, 40], [50, 40], [60, 40], [70, 40],
    // Lower middle section
    [25, 45], [35, 45], [45, 45], [55, 45], [65, 45], [75, 45],
    [20, 50], [30, 50], [40, 50], [50, 50], [60, 50], [70, 50], [80, 50],
    // Bottom section - branches extending wider
    [15, 55], [25, 55], [35, 55], [45, 55], [55, 55], [65, 55], [75, 55], [85, 55],
    [20, 60], [30, 60], [40, 60], [50, 60], [60, 60], [70, 60], [80, 60],
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

        {/* Overlay leaves on the tree based on color data */}
        <div className="absolute inset-0 pointer-events-none">
          {colorData.map((data, index) => {
            // If we have more data than positions, loop around
            const position = leafPositions[index % leafPositions.length];
            
            // Skip if no position (shouldn't happen with our array, but just in case)
            if (!position) return null;
            
            // Random size for variety
            const size = Math.floor(Math.random() * 10) + 20; // 20-30px
            
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
                  // Animate in
                  animation: 'fade-in 0.5s ease-out forwards',
                  // Add slight delay based on index
                  animationDelay: `${index * 0.05}s`
                }}
                title={`Day ${data.day}: ${data.color} (${data.note || 'No note'})`}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p className="text-center">
          {colorData.length > 0 
            ? `Tree with ${colorData.length} leaf colors for ${month}` 
            : 'A bare tree with no leaves'}
        </p>
      </div>
    </div>
  );
};

export default ColorTree;
