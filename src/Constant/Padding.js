import { Platform } from 'react-native';

// Standardized padding constants for consistent spacing across iOS and Android
export const PADDING = {
  // Container padding
  container: {
    horizontal: Platform.OS === 'ios' ? 10 : 8,
    vertical: Platform.OS === 'ios' ? 0 : 0,
    bottom: Platform.OS === 'ios' ? 10 : 8,
  },
  
  // Header padding
  header: {
    horizontal: Platform.OS === 'ios' ? 8 : 6,
    vertical: Platform.OS === 'ios' ? 8 : 5,
    top: Platform.OS === 'ios' ? 2 : 0,
  },
  
  // Content padding
  content: {
    horizontal: Platform.OS === 'ios' ? 15 : 12,
    vertical: Platform.OS === 'ios' ? 12 : 10,
    bottom: Platform.OS === 'ios' ? 12 : 10,
  },
  
  // FlatList padding
  flatList: {
    horizontal: Platform.OS === 'ios' ? 5 : 3,
    bottom: Platform.OS === 'ios' ? 25 : 20,
    top: Platform.OS === 'ios' ? 5 : 3,
  },
  
  // Card padding
  card: {
    horizontal: Platform.OS === 'ios' ? 10 : 8,
    vertical: Platform.OS === 'ios' ? 8 : 6,
  },
  
  // Button padding
  button: {
    horizontal: Platform.OS === 'ios' ? 25 : 20,
    vertical: Platform.OS === 'ios' ? 8 : 6,
  },
  
  // Section padding
  section: {
    horizontal: Platform.OS === 'ios' ? 12 : 10,
    vertical: Platform.OS === 'ios' ? 8 : 6,
  },
  
  // Margin constants
  margin: {
    small: Platform.OS === 'ios' ? 5 : 3,
    medium: Platform.OS === 'ios' ? 8 : 6,
    large: Platform.OS === 'ios' ? 12 : 10,
    xlarge: Platform.OS === 'ios' ? 15 : 12,
  },
};

// Helper function to get consistent padding
export const getPadding = (type, direction = 'all') => {
  const padding = PADDING[type];
  if (!padding) return 0;
  
  switch (direction) {
    case 'horizontal':
      return padding.horizontal;
    case 'vertical':
      return padding.vertical;
    case 'top':
      return padding.top || padding.vertical;
    case 'bottom':
      return padding.bottom || padding.vertical;
    case 'all':
    default:
      return {
        paddingHorizontal: padding.horizontal,
        paddingVertical: padding.vertical,
        paddingTop: padding.top || padding.vertical,
        paddingBottom: padding.bottom || padding.vertical,
      };
  }
};

// Helper function to get consistent margin
export const getMargin = (size) => {
  return PADDING.margin[size] || PADDING.margin.medium;
};
