
export interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
  lightColor?: string;
  darkColor?: string;
}

// Empty array instead of sample data
export const sampleAprilData: ColorData[] = [];

// Helper function to get color data for a specific month
export const getColorDataForMonth = (month: string): ColorData[] => {
  // Try to load user data from localStorage
  try {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Process and filter data for the selected month
      // This is a simplified approach assuming the day property represents the day of the month
      const processedColorData = parsedData.colorData
        ?.filter(item => item.day >= 1 && item.day <= 31)
        .map(item => {
          if ('lightColor' in item || 'darkColor' in item) {
            if (item.lightColor) {
              return {
                day: item.day,
                color: item.lightColor,
                colorMode: 'light' as const,
                note: item.note
              };
            } else if (item.darkColor) {
              return {
                day: item.day,
                color: item.darkColor,
                colorMode: 'dark' as const,
                note: item.note
              };
            }
          }
          return item;
        })
        .sort((a, b) => a.day - b.day);
      
      return processedColorData || [];
    }
  } catch (e) {
    console.error('Error loading color data for month', month, e);
  }
  
  return [];
};
