import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, FONTS, getFontFamily } from '../constants';
import { wishlistService } from '../api/services/wishlistService';
import { useWishlistStore, useAuthStore } from '../store';
import { normalizeFont, scale } from '../utils/responsive';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image?: string;
  isFavorite?: boolean;
  variantId?: number;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onFavoritePress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onRequireAuth?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
  onAddToCart,
  onRequireAuth,
}) => {
  const { wishlistIds, toggleWishlistItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  
  // Calculate true favorite status 
  // It's favorite if it's explicitly set on the model (from certain APIs) 
  // OR if it's currently tracked in our global wishlist store
  const isFavorite = React.useMemo(() => {
    return product.isFavorite || wishlistIds.has(String(product.id));
  }, [product.isFavorite, product.id, wishlistIds]);

  const handleFavoritePress = async () => {
    if (onFavoritePress) {
      onFavoritePress(product);
      return;
    }

    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    try {
      await toggleWishlistItem(product.id);
    } catch (error) {
       // Error inherently handled and reverted via optimistic UI logic in store
    }
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={14}
        color={index < rating ? '#FFD700' : COLORS.gray}
        style={styles.star}
      />
    ));
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(product)}
      activeOpacity={0.9}
    >
      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        activeOpacity={0.7}
      >
        <Icon
          name="heart"
          size={18}
          color={isFavorite ? COLORS.primary : COLORS.gray}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image 
            source={{ uri: product.image }} 
            style={styles.image} 
            onError={(e) => console.log(`Product Image Load Error (${product.name}):`, e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          {renderStars(product.rating)}
        </View>

        {/* Price and Cart */}
        <View style={styles.footer}>
          <Text style={styles.price}>₹ {product.price}</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => onAddToCart?.(product)}
            activeOpacity={0.7}
          >
            <Icon name="shopping-bag" size={18} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(165),
    backgroundColor: COLORS.background,
  //  backgroundColor:"red",
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 18,
    color: COLORS.primary,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
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
    fontSize: normalizeFont(50),
  },
  infoContainer: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: normalizeFont(FONT_SIZES.xs),
    fontFamily: getFontFamily('semiBold'),
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    minHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  star: {
    fontSize: normalizeFont(12),
    marginRight: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: normalizeFont(FONT_SIZES.md),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 16,
  },
});
