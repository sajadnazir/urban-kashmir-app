import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { HeaderTwo, ProductCard, Product } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { wishlistService, cartService } from '../api';
import { useWishlistStore } from '../store';

interface WishlistScreenProps {
  onBack?: () => void;
  onProductPress?: (product: Product) => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  onBack,
  onProductPress,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleWishlistItem } = useWishlistStore();

  // Reference IDs required for removal and move to cart
  const [wishlistMap, setWishlistMap] = useState<Record<string, number>>({});

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await wishlistService.getWishlist();
      
      if (!data || !Array.isArray(data)) {
        setWishlistItems([]);
        return;
      }

      const map: Record<string, number> = {};

      const mappedItems: Product[] = data.map(apiItem => {
        const idStr = String(apiItem.product.id);
        map[idStr] = apiItem.id; // Map productId to wishlistItemId
        return {
          id: idStr,
          name: apiItem.product.title || 'Product',
          price: apiItem.product.default_variant?.sale_price || 
                 Number(apiItem.product.price_range?.min || 0),
          rating: 5, // Defaulting since it's not present in API provided model
          image: apiItem.product.images?.[0]?.url,
          isFavorite: true,
        };
      });

      setWishlistMap(map);
      setWishlistItems(mappedItems);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      Alert.alert('Error', 'Failed to load wishlist items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (product: Product) => {
    try {
      const wishlistItemId = wishlistMap[product.id];
      if (wishlistItemId) {
        // Optimistic UI update locally on the screen
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
        const newMap = { ...wishlistMap };
        delete newMap[product.id];
        setWishlistMap(newMap);
        
        // Let the global store handle the truth / deletion api sync
        await toggleWishlistItem(product.id);
      }
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      Alert.alert('Error', 'Failed to remove product from wishlist');
      fetchWishlist(); // Revert back
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const wishlistItemId = wishlistMap[product.id];
      if (wishlistItemId) {
        await wishlistService.moveToCart(wishlistItemId);
        Alert.alert('Success', 'Item moved to cart');
        
        // Also inform the global store
        await toggleWishlistItem(product.id);

        // Refresh wishlist to reflect item removal
        fetchWishlist();
      } else {
         // Fallback to normal add to cart if not found in map (edge case)
         await cartService.addToCart(Number(product.id), 1);
         Alert.alert('Success', 'Item added to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Save items you love here and they'll be ready when you are.
      </Text>
    </View>
  );

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
          title="My Wishlist"
          leftIcon="chevron-left"
          onLeftPress={onBack}
        />

        {/* Content */}
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={wishlistItems}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={
              wishlistItems.length === 0 ? styles.emptyListContent : styles.listContent
            }
            columnWrapperStyle={wishlistItems.length > 0 ? styles.row : undefined}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={onProductPress}
                onFavoritePress={() => handleRemoveFromWishlist(item)}
                onAddToCart={() => handleAddToCart(item)}
              />
            )}
            ListEmptyComponent={renderEmptyState}
          />
        )}
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
    backgroundColor: COLORS.lightGray,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
