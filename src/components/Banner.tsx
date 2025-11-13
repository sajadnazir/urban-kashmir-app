import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - SPACING.md * 2;

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor?: string;
  image?: string;
}

interface BannerProps {
  items: BannerItem[];
  onBannerPress?: (item: BannerItem) => void;
}

export const Banner: React.FC<BannerProps> = ({ items, onBannerPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (BANNER_WIDTH + SPACING.md));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH + SPACING.md}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.bannerItem,
              { backgroundColor: item.backgroundColor || COLORS.lightGray },
            ]}
            onPress={() => onBannerPress?.(item)}
            activeOpacity={0.9}
          >
            <View style={styles.bannerContent}>
              {/* Left side - Image placeholder */}
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                  {/* Product image would go here */}
                  {/* <Text style={styles.imagePlaceholderText}>👕</Text> */}
                  <Image source={{ uri: item.image }} style={styles.image} />
                </View>
              </View>

              {/* Right side - Text content */}
              <View style={styles.textContainer}>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{item.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  bannerItem: {
    width: BANNER_WIDTH,
    height: 200,
    borderRadius: 20,
    marginRight: SPACING.md,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING.lg,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 120,
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 28,
  },
  button: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.background,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.darkGray,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: COLORS.gray,
    opacity: 0.3,
  },
  image: {
    width: 120,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
