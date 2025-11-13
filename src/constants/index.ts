/**
 * App Constants
 */

export const APP_NAME = 'Urban Kashmir';

export const COLORS = {
  primary: '#ED7745', // Orange/Coral
  black: '#000000', // Pure Black
  darkGray: '#0E0F10', // Almost Black
  gray: '#606060', // Medium Gray
  lightGray: '#F3F4F6', // Light Gray Background

  // Semantic colors
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  text: '#000000',
  textSecondary: '#606060',
  textLight: '#0E0F10',
  border: '#F3F4F6',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const FONTS = {
  regular: 'SofiaPro-Regular',
  medium: 'SofiaPro-Medium',
  semiBold: 'SofiaPro-SemiBold',
  bold: 'SofiaPro-Bold',
  light: 'SofiaPro-Light',
} as const;
