import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  HeaderTwo,
  CategoryFilter,
  ProductCard,
  Product,
  BottomNavigation,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { vendorService, productService, cartService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import { useAuthStore } from '../store/authStore';

interface StoreHomeScreenProps {
  vendorSlug: string;
  onBack?: () => void;
  onProductPress?: (product: Product) => void;
  onTabPress?: (tab: TabName) => void;
  onRequireAuth?: () => void;
}

export const StoreHomeScreen: React.FC<StoreHomeScreenProps> = ({
  vendorSlug,
  onBack,
  onProductPress,
  onTabPress,
  onRequireAuth,
}) => {
  const { isAuthenticated } = useAuthStore();
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
    if (vendor?.id) {
      fetchProducts();
    }
  }, [vendor?.id, selectedCategory]);

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
    ...(vendor?.categories?.map(cat => ({
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
      Alert.alert('Error', 'Product variant not found');
      return;
    }
    try {
      await cartService.addToCart(Number(product.id), product.variantId, 1);
      Alert.alert('Success', `${product.name} added to cart!`);
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      Alert.alert('Error', error?.message || 'Failed to add to cart');
    }
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
          title={vendor?.name || 'Store'}
          leftIcon="chevron-left"
          rightIcon="share-2"
          onLeftPress={onBack}
          onRightPress={() => console.log('Share store')}
        />

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.storeBanner}>
              <Image 
                source={{ uri: vendor?.cover_url || vendor?.banner_url || vendor?.logo_url || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' }} 
                style={styles.bannerImage} 
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

            {/* Products Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Products</Text>
                <TouchableOpacity onPress={() => console.log('View all products')}>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productsGrid}>
                {products.length > 0 ? (
                  products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onPress={() => onProductPress?.(product)}
                      onAddToCart={handleAddToCart}
                    />
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products found for this vendor.</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
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
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  viewAll: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  categoriesSection: {
    marginBottom: SPACING.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
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
  bottomSpacer: {
    height: 20,
  },
});
