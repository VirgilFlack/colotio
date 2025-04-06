
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
  return (
    <div className="relative flex flex-col items-center py-8">
      <h3 className="text-lg font-medium mb-6">Color Tree for {month}</h3>
      
      <div className="relative w-full max-w-2xl h-[600px] flex justify-center">
        {/* Use the uploaded tree image instead of drawing the tree */}
        <img 
          src="/lovable-uploads/b4a925c8-0789-4a93-8764-edebd279fb54.png" 
          alt="Bare tree silhouette" 
          className="h-full object-contain"
        />
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p className="text-center">A bare tree with no leaves</p>
      </div>
    </div>
  );
};

export default ColorTree;
