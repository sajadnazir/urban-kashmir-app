import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  Banner,
  SearchBar,
  CategoryFilter,
  ProductCard,
  StoreCard,
  BottomNavigation,
  Product,
  Store,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { productService, categoryService, cartService, vendorService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import type { Category } from '../api/services/categoryService';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';

interface EcommerceHomeScreenProps {
  onProductPress?: (product: Product) => void;
  onStorePress?: (store: Store) => void;
  onTabPress?: (tab: TabName) => void;
  onRequireAuth?: () => void;
}

export const EcommerceHomeScreen: React.FC<EcommerceHomeScreenProps> = ({
  onProductPress,
  onStorePress,
  onTabPress,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useUserStore();
  const { isAuthenticated } = useAuthStore();

  // Pagination State
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchVendors();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from API...');
      const apiCats = await categoryService.getCategories();
      console.log('Categories API response:', JSON.stringify(apiCats, null, 2));
      console.log('Fetched categories count:', apiCats?.length);
      
      setCategories([
        { id: 'all', name: 'All', icon: 'grid' },
        ...(apiCats || [])
      ]);
      
      if (!apiCats || apiCats.length === 0) {
        Alert.alert('Categories Empty', 'No categories returned or array is empty');
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      Alert.alert('Fetch Error', String(error?.message || JSON.stringify(error)));
    }
  };

  const fetchVendors = async () => {
    setIsLoadingStores(true);
    try {
      const response = await vendorService.getVendors(1, 10);
      console.log('Vendors API response:', JSON.stringify(response, null, 2));
      const vendorArray = response.data || [];
      console.log('Vendor array count:', vendorArray.length);
      
      const organicFallbacks = [
        'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400&auto=format&fit=crop', // Honey
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop', // Perfume
        'https://images.unsplash.com/photo-1589135303604-b936d1ffbc90?q=80&w=400&auto=format&fit=crop', // Pickles/Jars
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop', // Organic Food
        'https://images.unsplash.com/photo-1596040033229-a9821ebd05ed?q=80&w=400&auto=format&fit=crop', // Spices
      ];
      
      const mappedStores: Store[] = vendorArray.map((vendor: ApiVendor, index: number) => ({
        id: String(vendor.id),
        name: vendor.display_name || vendor.name,
        slug: vendor.slug,
        description: vendor.description || 'No description available',
        image: vendor.banner_url || vendor.logo_url || organicFallbacks[index % organicFallbacks.length],
        rating: Number(vendor.statistics?.avg_rating || 0),
        productsCount: vendor.statistics?.total_products || 0,
      }));
      setStores(mappedStores);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const fetchProducts = async (pageNumber: number) => {
    if (pageNumber === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await productService.getProducts(pageNumber, 10);
      
      setProducts(prev => 
        pageNumber === 1 
          ? response.data 
          : [...prev, ...response.data]
      );
      
      setPage(response.pagination.current_page);
      setHasMore(response.pagination.current_page < response.pagination.last_page);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore && !isLoading && products.length > 0) {
      fetchProducts(page + 1);
    }
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

  // Sample data (Banners / Stores)
const bannerItems = [
  {
    id: '1',
    title: 'Authentic Kashmiri Saffron',
    subtitle: 'Pure Pampore Kesar',
    buttonText: 'Shop Now',
    backgroundColor: '#FFF4E6',
    image: 'https://images.unsplash.com/photo-1699365604604-KeoViDKy-zA?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    title: 'Handmade Pashmina Shawls',
    subtitle: 'Luxury From Kashmir',
    buttonText: 'Explore',
    backgroundColor: '#F3F4F6',
    image: 'https://images.unsplash.com/photo-1539345285273-G9ndSNnIqkk?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    title: 'Kashmiri Walnuts & Dry Fruits',
    subtitle: 'Fresh From The Valley',
    buttonText: 'Buy Now',
    backgroundColor: '#E8F5E9',
    image: 'https://images.unsplash.com/photo-1524656855800-59465ad9d27a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '4',
    title: 'Walnut Wood Handicrafts',
    subtitle: 'Traditional Kashmiri Art',
    buttonText: 'View Collection',
    backgroundColor: '#F5EFE6',
    image: 'https://images.unsplash.com/photo-1677856219110-Odv0CwCz7gw?auto=format&fit=crop&w=1200&q=80',
  },
];

  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', icon: 'grid' }
  ]);

  /* 
   * Extract header into ListHeaderComponent so FlatList takes over memory-efficient
   * scrolling for the dynamic products grid.
   */
  const renderHeader = useCallback(() => (
    <View style={styles.headerBlock}>
      <View style={styles.bannerContainer}>
        <Banner items={bannerItems} onBannerPress={(item) => console.log('Banner pressed', item)} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => console.log('Filter pressed')}
        placeholder="Search..."
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Stores</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storesContainer}
        data={stores}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StoreCard store={item} onPress={(store) => onStorePress?.(store)} />}
        ListEmptyComponent={isLoadingStores ? <ActivityIndicator size="small" color={COLORS.primary} /> : null}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Picks Nearby</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
    </View>
  ), [searchQuery, selectedCategory, categories, stores, isLoadingStores]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkGray}
        translucent={false}
      />
      <View style={styles.container}>
        <Header
          userName={profile?.name || "User"}
          onProfilePress={() => console.log('Profile pressed')}
          onWishlistPress={() => console.log('Wishlist pressed')}
          onNotificationPress={() => console.log('Notification pressed')}
        />

        {isLoading && page === 1 ? (
          <View style={[styles.listWrapper, styles.centerAll]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            style={styles.listWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            data={products}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={onProductPress}
                onFavoritePress={(p) => console.log('Fav', p)}
                onAddToCart={handleAddToCart}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : <View style={styles.bottomSpacer} />
            }
          />
        )}

        <BottomNavigation 
          activeTab={activeTab} 
          onTabPress={(tab) => {
            setActiveTab(tab);
            onTabPress?.(tab);
          }} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.darkGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  listContent: {
    paddingBottom: 100, // Space for BottomNavigation
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBlock: {
    // Top padding handled by contentContainer, but we add space before grid begins
    paddingBottom: SPACING.md,
  },
  bannerContainer: {
    marginTop: -SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  storesContainer: {
    paddingHorizontal: SPACING.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  footerLoader: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
