import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  HeaderTwo,
  CategoryFilter,
  ProductCard,
  Product,
  BottomNavigation,
  TabName,
  ReelCard,
  Reel,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { vendorService, productService, cartService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import { useAuthStore, useCartStore } from '../store';

const STATIC_REELS: Reel[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    title: 'Autumn Collection Showcases',
    views: '12K',
    duration: '0:15',
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1583071299210-c6c113f4cb91?w=400',
    title: 'Behind the Scenes: Handcrafting',
    views: '8.5K',
    duration: '0:30',
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    title: 'New Arrivals: Winter Essentials',
    views: '15K',
    duration: '0:20',
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    title: 'Store Tour: Our Kashmir Outlet',
    views: '5.2K',
    duration: '0:45',
  },
];

interface StoreHomeScreenProps {
  vendorSlug: string;
  onBack?: () => void;
  onProductPress?: (product: Product) => void;
  onTabPress?: (tab: TabName) => void;
  onRequireAuth?: () => void;
  onReelPress?: (reel: Reel) => void;
}

export const StoreHomeScreen: React.FC<StoreHomeScreenProps> = ({
  vendorSlug,
  onBack,
  onProductPress,
  onTabPress,
  onRequireAuth,
  onReelPress,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { fetchCartCount } = useCartStore();
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vendor, setVendor] = useState<ApiVendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (vendorSlug) {
      fetchVendorDetails();
    }
  }, [vendorSlug]);

  useEffect(() => {
    // if (vendor?.id) {
      fetchProducts();
    // }
  }, [vendor?.id, selectedCategory]);
  // }, [vendor?.id, selectedCategory]);

  const fetchVendorDetails = async () => {
    try {
      if (!vendor) setIsLoading(true);
      const data = await vendorService.getVendorBySlug(vendorSlug);
      setVendor(data);
    } catch (error) {
      console.error('Failed to fetch vendor details:', error);
    } finally {
      if (!vendor?.id) setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsResponse = await productService.getProducts(
        1, 
        20, 
        '',
        'none',
        selectedCategory === 'all' ? undefined : selectedCategory, 
        vendor?.id
      );
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    ...(vendor?.categories?.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
      icon: 'tag'
    })) || [])
  ];

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    if (!product.variantId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Product variant not found',
      });
      return;
    }
    try {
      await cartService.addToCart(Number(product.id), product.variantId, 1);
      fetchCartCount();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${product.name} added to cart!`,
      });
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to add to cart',
      });
    }
  };

  const renderReelsSection = () => (
    <View style={styles.reelsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Store Reels</Text>
      </View>
      <FlatList
        data={STATIC_REELS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reelsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReelCard reel={item} onPress={onReelPress || (() => {})} />
        )}
      />
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
          title={vendor?.name || 'Store'}
          leftIcon="chevron-left"
          rightIcon="share-2"
          onLeftPress={onBack}
          onRightPress={() => console.log('Share store')}
        />

        {isLoading && !vendor ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            style={styles.scrollView}
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            ListHeaderComponent={
              <>
                <View style={styles.storeBanner}>
                  <Image 
                    source={{ uri: vendor?.cover_url || vendor?.banner_url || vendor?.logo_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop' }} 
                    style={styles.bannerImage} 
                    onError={(e) => console.log(`Store Banner Image Load Error (${vendor?.name}):`, e.nativeEvent.error)}
                  />
                  <View style={styles.bannerOverlay}>
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>{vendor?.display_name || vendor?.name}</Text>
                      <View style={styles.storeStats}>
                        <View style={styles.statItem}>
                          <Icon name="star" size={16} color={COLORS.primary} />
                          <Text style={styles.statText}>{Number(vendor?.statistics?.avg_rating || 0).toFixed(1)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                          <Icon name="package" size={16} color={COLORS.background} />
                          <Text style={styles.statText}>{vendor?.statistics?.total_products || 0} Products</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Categories */}
                <View style={styles.categoriesSection}>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </View>

                {/* Reels Section */}
                {renderReelsSection()}

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Products</Text>
                </View>
              </>
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => onProductPress?.(item)}
                onAddToCart={handleAddToCart}
                onRequireAuth={onRequireAuth}
              />
            )}
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found for this vendor.</Text>
                </View>
              ) : null
            }
            ListFooterComponent={<View style={styles.bottomSpacer} />}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  storeBanner: {
    height: 200,
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.lg,
  },
  storeInfo: {
    gap: SPACING.sm,
  },
  storeName: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.background,
    opacity: 0.3,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.background,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  categoriesSection: {
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  reelsSection: {
    marginBottom: SPACING.lg,
  },
  reelsList: {
    paddingHorizontal: SPACING.md,
  },
  bottomSpacer: {
    height: 20,
  },
});
