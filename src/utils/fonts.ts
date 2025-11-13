import { TextStyle } from 'react-native';
import { FONT_WEIGHTS } from '../constants';

type FontWeight = keyof typeof FONT_WEIGHTS;

/**
 * Helper function to get proper font style with weight
 * Use this instead of just fontFamily to ensure font weights work correctly
 */
export const getFontStyle = (weight: FontWeight = 'regular'): TextStyle => {
  return {
    fontWeight: FONT_WEIGHTS[weight],
  };
};

/**
 * Font style presets for common use cases
 */
export const fontStyles = {
  light: getFontStyle('light'),
  regular: getFontStyle('regular'),
  medium: getFontStyle('medium'),
  semiBold: getFontStyle('semiBold'),
  bold: getFontStyle('bold'),
};
