
import { useMemo } from 'react';

interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
}

interface ColorFadeCircleProps {
  colorData: ColorData[];
  month: string;
}

const ColorFadeCircle = ({ colorData, month }: ColorFadeCircleProps) => {
  // Generate the segments for the circle
  const segments = useMemo(() => {
    if (!colorData.length) return [];
    
    // Sort data by day
    const sortedData = [...colorData].sort((a, b) => a.day - b.day);
    
    // If we have at least one color, use it as the starting color
    const startColor = sortedData[0].color;
    
    // Calculate the total number of segments (one per day in the data)
    const totalSegments = sortedData.length;
    
    return sortedData.map((item, index) => {
      // For the circular arrangement
      const angle = (index / totalSegments) * 360;
      const size = 130 + (index / totalSegments) * 50; // Gradually increase size
      
      // Calculate rotation and position
      const radians = (angle * Math.PI) / 180;
      const x = 150 + Math.cos(radians) * size;
      const y = 150 + Math.sin(radians) * size;
      
      // Calculate opacity for the fade effect (from 0.1 to 1)
      const opacity = 0.1 + (index / totalSegments) * 0.9;
      
      return {
        ...item,
        angle,
        x,
        y,
        opacity,
        size: 10 + (index / totalSegments) * 15, // Size of the circle
      };
    });
  }, [colorData]);
  
  // Create an SVG path for a smooth curve connecting all points
  const createSmoothPath = () => {
    if (segments.length < 2) return '';
    
    // Start at the first point
    let path = `M ${segments[0].x} ${segments[0].y}`;
    
    // Add curve to each subsequent point
    for (let i = 1; i < segments.length; i++) {
      const current = segments[i];
      const previous = segments[i - 1];
      
      // Calculate control points for a smooth curve
      const controlX1 = previous.x + (current.x - previous.x) / 2;
      const controlY1 = previous.y;
      const controlX2 = previous.x + (current.x - previous.x) / 2;
      const controlY2 = current.y;
      
      // Add cubic Bezier curve command
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${current.x} ${current.y}`;
    }
    
    // Connect back to the first point for a closed path
    if (segments.length > 2) {
      const first = segments[0];
      const last = segments[segments.length - 1];
      
      const controlX1 = last.x + (first.x - last.x) / 2;
      const controlY1 = last.y;
      const controlX2 = last.x + (first.x - last.x) / 2;
      const controlY2 = first.y;
      
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${first.x} ${first.y} Z`;
    }
    
    return path;
  };
  
  // Create radial gradients between colors
  const createRadialGradient = () => {
    if (segments.length < 2) return null;
    
    return (
      <defs>
        <radialGradient id="colorFade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          {segments.map((segment, index) => (
            <stop 
              key={`stop-${index}`}
              offset={`${(index / (segments.length - 1)) * 100}%`} 
              stopColor={segment.color} 
              stopOpacity={segment.opacity} 
            />
          ))}
        </radialGradient>
      </defs>
    );
  };
  
  return (
    <div className="relative w-[350px] h-[350px] mx-auto my-4">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {createRadialGradient()}
        
        {/* Base circle with gradient fill */}
        {segments.length > 0 && (
          <circle 
            cx="150" 
            cy="150" 
            r="120" 
            fill="url(#colorFade)" 
            stroke="none" 
          />
        )}
        
        {/* Path connecting all points */}
        {segments.length > 2 && (
          <path 
            d={createSmoothPath()} 
            fill="none" 
            stroke={segments[0].color} 
            strokeWidth="2" 
            strokeOpacity="0.4" 
          />
        )}
        
        {/* Individual day circles */}
        {segments.map((segment, index) => (
          <g key={`segment-${index}`}>
            <circle
              cx={segment.x}
              cy={segment.y}
              r={segment.size}
              fill={segment.color}
              opacity={segment.opacity}
              stroke="#fff"
              strokeWidth="1"
            />
            <text
              x={segment.x}
              y={segment.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="8"
              fontWeight="bold"
            >
              {segment.day}
            </text>
          </g>
        ))}
        
        {/* Center text with month */}
        {segments.length > 0 && (
          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
            fontSize="14"
            fontWeight="bold"
          >
            {month}
          </text>
        )}
      </svg>
    </div>
  );
};

export default ColorFadeCircle;
