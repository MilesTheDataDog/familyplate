import { Platform } from 'react-native';

/**
 * FamilyPlate Theme Configuration
 * Provides consistent colors, spacing, typography, and styling across all platforms
 */

export const theme = {
  colors: {
    primary: '#EA580C',
    secondary: '#FB923C',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
    },
  },
  // Deprecated: Use getShadow() function instead
  shadows: {
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

/**
 * Platform-specific shadow styles
 * Web uses CSS boxShadow, while iOS and Android use native shadow properties
 * 
 * @param {number} elevation - Shadow elevation (affects Android elevation and shadow intensity)
 * @returns {Object} Platform-appropriate shadow styles
 * 
 * @example
 * const styles = StyleSheet.create({
 *   card: {
 *     backgroundColor: '#FFFFFF',
 *     ...getShadow(),
 *   }
 * });
 */
export const getShadow = (elevation = 3) => {
  if (Platform.OS === 'web') {
    // Web uses CSS boxShadow property
    return {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
  }
  
  // iOS and Android use native shadow properties
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: elevation, // Android only
  };
};