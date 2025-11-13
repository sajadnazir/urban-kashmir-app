import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

const { width } = Dimensions.get('window');

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  rating: number;
  image?: string;
}

interface CartItemProps {
  item: CartItemData;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  showDelete?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  showDelete = false,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={14}
        color={index < rating ? COLORS.primary : COLORS.gray}
        style={styles.star}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>👕</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.details}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

          {/* Price */}
          <Text style={styles.price}>${item.price}</Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {/* Size */}
          <Text style={styles.size}>Size : {item.size}</Text>

          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onDecrease(item.id)}
              activeOpacity={0.7}
            >
              <Icon name="minus" size={16} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, styles.quantityButtonActive]}
              onPress={() => onIncrease(item.id)}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={16} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delete Button - Swipe to reveal */}
      {showDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onRemove(item.id)}
          activeOpacity={0.7}
        >
          <Icon name="trash-2" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
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
    fontSize: 40,
  },
  details: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  productName: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  star: {
    marginRight: 2,
  },
  price: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  size: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonActive: {
    backgroundColor: COLORS.darkGray,
  },
  quantity: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});
