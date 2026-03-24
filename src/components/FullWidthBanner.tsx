import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { normalizeFont } from '../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
// Full width banner without horizontal margins
const BANNER_WIDTH = width;

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  backgroundColor?: string;
  image?: string;
  action?: {
    type: string;
    id: number | string;
  };
}

interface FullWidthBannerProps {
  items: BannerItem[];
  onBannerPress?: (item: BannerItem) => void;
}

export const FullWidthBanner: React.FC<FullWidthBannerProps> = ({ items, onBannerPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayInterval.current = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = prevIndex === items.length - 1 ? 0 : prevIndex + 1;
          scrollViewRef.current?.scrollTo({ x: nextIndex * BANNER_WIDTH, animated: true });
          return nextIndex;
        });
      }, 3500); // 3.5 seconds
    };

    startAutoPlay();

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handleScrollBeginDrag = () => {
    // Pause auto-play when user is manually scrolling
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }
  };

  const currentItem = items[activeIndex];
  const dynamicDotsColor = currentItem?.backgroundColor || COLORS.primary;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        bounces={false}
      >
        {items.map((item, index) => {
          const imageUrl = item.image?.startsWith('/') ? `https://urban.bracecodes.in${item.image}` : item.image;
          
          return (
            <TouchableOpacity
              key={item.id || index.toString()}
              activeOpacity={0.9}
              onPress={() => onBannerPress?.(item)}
              style={styles.bannerSlide}
            >
              <ImageBackground
                source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop' }}
                style={styles.backgroundImage}
                imageStyle={styles.imageStyle}
                resizeMode="cover"
              >
                {/* Dark gradient/overlay for text readability */}
                <View style={styles.overlay}>
                  <View style={styles.content}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Limited Offer</Text>
                    </View>
                    
                    <Text style={styles.title} numberOfLines={2}>
                      {item.title}
                    </Text>

                    {item.buttonText !== null && (
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>{item.buttonText || 'Shop Now'}</Text>
                        <View style={styles.arrowContainer}>
                          <Icon name="arrow-up-right" size={16} color={COLORS.darkGray} />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modern pagination positioned at the bottom center */}
      {items.length > 1 && (
        <View style={styles.paginationWrapper}>
          <View style={styles.paginationNotch}>
            {items.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex 
                    ? [styles.activeDot, { backgroundColor: dynamicDotsColor }] 
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220, // Taller banner for a more immersive feel
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  bannerSlide: {
    width: BANNER_WIDTH,
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    // No border radius to make it truly full-width Edge-to-Edge
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // More transparent (was 0.4)
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  content: {
    maxWidth: '80%',
  },
  badge: {
    backgroundColor: COLORS.primary, // Using primary color for pop
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: normalizeFont(11),
    fontFamily: getFontFamily('medium'),
  },
  title: {
    color: COLORS.background, // White text on dark overlay
    fontSize: normalizeFont(24),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
    marginBottom: SPACING.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Added subtle text shadow for readability
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingLeft: SPACING.lg,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 35,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: COLORS.darkGray,
    fontSize: normalizeFont(FONT_SIZES.md),
    fontFamily: getFontFamily('bold'),
    marginRight: SPACING.md,
  },
  arrowContainer: {
    backgroundColor: COLORS.lightGray,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: SPACING.md, // Floats above the bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  paginationNotch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Elegant frosted glass pill
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Bright, low-opacity white for inactive
  },
});
