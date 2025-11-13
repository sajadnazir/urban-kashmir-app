import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  HeaderTwo,
  ColorSelector,
  SizeSelector,
  QuantitySelector,
  BuyButton,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

const { width } = Dimensions.get('window');

interface ProductDetailsScreenProps {
  onBack?: () => void;
  onShare?: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  onBack,
  onShare,
}) => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample data
  const product = {
    name: 'Cotton Sweater',
    subtitle: 'Clean 90 Triode Huddy',
    price: 44.5,
    rating: 5,
    reviewCount: 250,
    inStock: true,
    description:
      'A Cozy Cotton Hoodie Sweater, Perfect For Cooler Weather. Soft, Breathable, And Stylish, Offering A Relaxed Fit With A Comfortable Hood And Front Pocket.',
  };

  const colors = [
    { id: 'navy', color: '#1E3A5F', name: 'Navy' },
    { id: 'black', color: '#000000', name: 'Black' },
    { id: 'blue', color: '#0066CC', name: 'Blue' },
    { id: 'lightBlue', color: '#4A90E2', name: 'Light Blue' },
  ];

  const sizes = [
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'L', label: 'L' },
    { id: 'XL', label: 'XL' },
    { id: 'XXL', label: 'XXL' },
  ];

  const images = [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
  ];

  const handleBuyNow = () => {
    console.log('Buy now pressed', {
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={12}
        color={index < rating ? '#FFD700' : COLORS.gray}
        style={styles.star}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <View style={styles.container}>
        {/* Header */}
        <HeaderTwo
          leftIcon="chevron-left"
          rightIcon="share-2"
          onLeftPress={onBack}
          onRightPress={onShare}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Image Section */}
          <View style={styles.imageSection}>
            {/* Color Selector - Positioned on left */}
            <View style={styles.colorSelectorVertical}>
              <Text style={styles.colorTitle}>Color</Text>
              {colors.map(color => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOptionVertical,
                    { backgroundColor: color.color },
                    selectedColor === color.id && styles.selectedColorVertical,
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                  activeOpacity={0.7}
                >
                  {selectedColor === color.id && (
                    <Icon name="check" size={12} color={COLORS.background} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Main Product Image */}
            <View style={styles.imageContainer}>
              {images[activeImageIndex] ? (
                <Image
                  source={{ uri: images[activeImageIndex] }}
                  style={styles.productImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>👕</Text>
                </View>
              )}

              {/* Favorite Button */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => setIsFavorite(!isFavorite)}
                activeOpacity={0.7}
              >
                <Icon name="refresh-cw" size={20} color={COLORS.background} />
              </TouchableOpacity>
            </View>

            {/* Image Pagination Dots */}
            <View style={styles.pagination}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeImageIndex
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <View style={styles.ratingStars}>
              {renderStars(product.rating)}
            </View>
            <Text style={styles.ratingText}>
              ( {product.reviewCount} Review)
            </Text>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSubtitle}>{product.subtitle}</Text>
              </View>
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity(quantity + 1)}
                onDecrease={() => setQuantity(quantity - 1)}
              />
            </View>

            {/* Stock Status */}
            <Text style={styles.stockStatus}>
              {product.inStock ? 'Available In Stock' : 'Out of Stock'}
            </Text>

            {/* Size Selector */}
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buy Button */}
        <BuyButton price={product.price} onPress={handleBuyNow} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom buy button
  },
  imageSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  colorSelectorVertical: {
    position: 'absolute',
    left: SPACING.lg,
    top: SPACING.lg,
    zIndex: 10,
  },
  colorTitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  colorOptionVertical: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorVertical: {
    borderColor: COLORS.darkGray,
    borderWidth: 2,
  },
  imageContainer: {
    width: width,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    position: 'absolute',
    bottom: SPACING.xl,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.darkGray,
    width: 8,
  },
  inactiveDot: {
    backgroundColor: COLORS.gray,
    opacity: 0.3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  productInfo: {
    paddingHorizontal: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  productName: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  stockStatus: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    marginBottom: SPACING.md,
  },
  descriptionSection: {
    marginTop: SPACING.md,
  },
  descriptionTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  descriptionText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
