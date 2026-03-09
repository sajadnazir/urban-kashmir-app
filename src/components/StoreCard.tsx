import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

const { width } = Dimensions.get('window');

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  rating: number;
  productsCount: number;
}

interface StoreCardProps {
  store: Store;
  onPress: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(store)}
      activeOpacity={0.7}
    >
      {/* Store Image */}
      <Image source={{ uri: store.image }} style={styles.image} />

      {/* Store Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {store.description}
        </Text>

        {/* Rating and Products */}
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Icon name="star" size={14} color={COLORS.primary} />
            <Text style={styles.ratingText}>{store.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.productsCount}>
            {store.productsCount} Products
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.42,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginRight: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.lightGray,
  },
  infoContainer: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
  },
  productsCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
  },
});
