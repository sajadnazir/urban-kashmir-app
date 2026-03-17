import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Scale based on width
const scale = (size: number) => (width / guidelineBaseWidth) * size;

// Scale based on height
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

// Scale with a factor to limit extreme scaling on very large devices (like iPads)
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Specifically for fonts, to ensure crisp rendering
const normalizeFont = (size: number, factor = 0.5) => {
  const newSize = moderateScale(size, factor);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export { scale, verticalScale, moderateScale, normalizeFont };
