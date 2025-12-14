/**
 * FamilyPlate Theme Configuration
 * Central theme file for colors, spacing, typography, and other design tokens
 */

export const theme = {
  // Color Palette - matching FamilyPlate brand
  colors: {
    // Primary brand colors (orange to rose gradient)
    primary: '#EA580C',           // Orange-600
    primaryLight: '#FB923C',      // Orange-400
    primaryDark: '#C2410C',       // Orange-700
    
    secondary: '#FB7185',         // Rose-400
    secondaryLight: '#FDA4AF',    // Rose-300
    secondaryDark: '#E11D48',     // Rose-600
    
    // Background colors
    background: '#FFF7ED',        // Orange-50 (warm cream)
    backgroundLight: '#FFFBEB',   // Amber-50
    
    // Surface colors
    surface: '#FFFFFF',           // White
    surfaceAlt: '#FFF7ED',        // Orange-50
    
    // Text colors
    text: '#1F2937',              // Gray-800 (primary text)
    textSecondary: '#6B7280',     // Gray-500 (secondary text)
    textLight: '#9CA3AF',         // Gray-400 (tertiary text)
    textInverse: '#FFFFFF',       // White (on dark backgrounds)
    
    // Border colors
    border: '#E5E7EB',            // Gray-200
    borderDark: '#D1D5DB',        // Gray-300
    
    // Status colors
    success: '#10B981',           // Green-500
    error: '#EF4444',             // Red-500
    warning: '#F59E0B',           // Amber-500
    info: '#3B82F6',              // Blue-500
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Spacing system (based on 4px grid)
  spacing: {
    xs: 4,      // 4px
    sm: 8,      // 8px
    md: 16,     // 16px
    lg: 24,     // 24px
    xl: 32,     // 32px
    xxl: 48,    // 48px
    xxxl: 64,   // 64px
  },
  
  // Border radius values
  borderRadius: {
    sm: 8,      // Small elements
    md: 12,     // Medium elements
    lg: 16,     // Large cards
    xl: 24,     // Extra large containers
    full: 9999, // Fully rounded (pills, circles)
  },
  
  // Typography system
  typography: {
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      huge: 48,
    },
    
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
    
    // Predefined text styles
    title: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
      color: '#1F2937',
    },
    heading: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 1.3,
      color: '#1F2937',
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.4,
      color: '#1F2937',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
      color: '#1F2937',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
      color: '#6B7280',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.4,
      color: '#9CA3AF',
    },
  },
  
  // Shadow styles (for cards and elevated elements)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Export individual parts for convenience
export const colors = theme.colors;
export const spacing = theme.spacing;
export const borderRadius = theme.borderRadius;
export const typography = theme.typography;
export const shadows = theme.shadows;

export default theme;