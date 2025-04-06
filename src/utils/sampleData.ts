export interface ColorData {
  day: number;
  color: string;
  colorMode: 'light' | 'dark';
  note?: string;
  lightColor?: string;
  darkColor?: string;
}

// Sample data for April 2025
export const sampleAprilData: ColorData[] = [
  { day: 1, color: '#FF0000', colorMode: 'light', note: 'Feeling energetic' },
  { day: 2, color: '#FFA500', colorMode: 'light', note: 'Creative day' },
  { day: 3, color: '#FFFF00', colorMode: 'light', note: 'Optimistic' },
  { day: 4, color: '#00FF00', colorMode: 'light', note: 'Growth mindset' },
  { day: 5, color: '#0000FF', colorMode: 'dark', note: 'Calm and focused' },
  { day: 6, color: '#800080', colorMode: 'dark', note: 'Introspective' },
  { day: 7, color: '#FF0000', colorMode: 'dark', note: 'Frustrated' },
  { day: 8, color: '#FFA500', colorMode: 'light', note: 'Warm connections' },
  { day: 9, color: '#FFFFFF', colorMode: 'light', note: 'Clear thinking' },
  { day: 10, color: '#00FF00', colorMode: 'light', note: 'Productive' },
  { day: 11, color: '#0000FF', colorMode: 'light', note: 'Peaceful' },
  { day: 12, color: '#800080', colorMode: 'light', note: 'Creative ideas' },
  { day: 13, color: '#000000', colorMode: 'dark', note: 'Deep focus' },
  { day: 14, color: '#FFA500', colorMode: 'dark', note: 'Ambitious' },
  { day: 15, color: '#FFFF00', colorMode: 'light', note: 'Happy day' },
  { day: 16, color: '#00FF00', colorMode: 'dark', note: 'Envious thoughts' },
  { day: 17, color: '#0000FF', colorMode: 'dark', note: 'Melancholy' },
  { day: 18, color: '#800080', colorMode: 'light', note: 'Spiritual' },
  { day: 19, color: '#FF0000', colorMode: 'light', note: 'Passionate' },
  { day: 20, color: '#FFFFFF', colorMode: 'light', note: 'Fresh start' },
  { day: 21, color: '#FFFF00', colorMode: 'dark', note: 'Anxious but hopeful' },
  { day: 22, color: '#00FF00', colorMode: 'light', note: 'Natural and grounded' },
  { day: 23, color: '#0000FF', colorMode: 'light', note: 'Trustworthy' },
  { day: 24, color: '#800080', colorMode: 'dark', note: 'Mysterious feelings' },
  { day: 25, color: '#FF0000', colorMode: 'dark', note: 'Intense emotions' },
  { day: 26, color: '#FFA500', colorMode: 'light', note: 'Successful day' },
  { day: 27, color: '#FFFF00', colorMode: 'light', note: 'Joyful moments' },
  { day: 28, color: '#00FF00', colorMode: 'light', note: 'Prosperous' },
  { day: 29, color: '#0000FF', colorMode: 'dark', note: 'Deeply sad' },
  { day: 30, color: '#800080', colorMode: 'light', note: 'Luxurious feelings' },
];

// Helper function to get color data for a specific month
export const getColorDataForMonth = (month: string): ColorData[] => {
  // If the month is April 2025, use our sample data
  if (month === 'April 2025') {
    return sampleAprilData;
  }
  
  // Otherwise, try to load user data from localStorage
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
