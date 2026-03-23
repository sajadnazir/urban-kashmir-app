import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, RefreshControl,
  TouchableOpacity, } from 'react-native';
import Toast from 'react-native-toast-message';
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
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { productService, categoryService, cartService, vendorService, bannerService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import type { Category } from '../api/services/categoryService';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useBannerStore } from '../store/bannerStore';
import { normalizeFont } from '../utils/responsive';

interface EcommerceHomeScreenProps {
  onProductPress?: (product: Product) => void;
  onStorePress?: (store: Store) => void;
  onTabPress?: (tab: TabName) => void;
  onRequireAuth?: () => void;
  onDataLoaded?: () => void;
  onNotificationsPress?: () => void;
}

export const EcommerceHomeScreen: React.FC<EcommerceHomeScreenProps> = ({
  onProductPress,
  onStorePress,
  onTabPress,
  onRequireAuth,
  onDataLoaded,
  onNotificationsPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useUserStore();
  const { isAuthenticated } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();
  const { fetchCartCount } = useCartStore();

  // Pagination State
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const { banners: cachedBanners, setBanners: setCachedBanners } = useBannerStore();
  const [banners, setBanners] = useState<any[]>(cachedBanners.length > 0 ? cachedBanners : []);

  // Initial Fetch
  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
    fetchVendors();
    fetchBanners();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
      fetchCartCount();
    }
  }, [isAuthenticated]);

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
        Toast.show({
          type: 'error',
          text1: 'Categories Empty',
          text2: 'No categories returned or array is empty',
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      Toast.show({
        type: 'error',
        text1: 'Fetch Error',
        text2: String(error?.message || JSON.stringify(error)),
      });
    }
  };

  const fetchBanners = async () => {
    try {
      const apiBanners = await bannerService.getBanners();
      const mappedBanners = apiBanners.map((b: any) => ({
        id: String(b.id),
        title: b.title,
        subtitle: b.subtitle,
        buttonText: 'Shop Now',
        image: b.image_url,
        action: b.action,
        backgroundColor: '#FFF4E6', // Fallback color
        position: b.position || 0,
      }));
      const sortedBanners = mappedBanners.sort((a: any, b: any) => (a.position - b.position));
      setBanners(sortedBanners);
      setCachedBanners(sortedBanners as any);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleBannerPress = (item: any) => {
    if (item.action) {
      const { type, id } = item.action;
      if (type === 'product') {
        onProductPress?.({ id: String(id) } as Product);
      } else if (type === 'vendor') {
        // Find the vendor in the stores list to get the real slug
        const vendor = stores.find(s => s.id === String(id));
        if (vendor) {
          onStorePress?.(vendor);
        } else {
          // Fallback if not in featured list - we can't navigate without slug
          console.warn(`Vendor with ID ${id} not found in loaded stores list`);
          // Try to pass ID as slug as absolute fallback, though it may 404
          onStorePress?.({ id: String(id), slug: String(id) } as Store);
        }
      } else if (type === 'category') {
        setSelectedCategory(String(id));
      }
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
      if (pageNumber === 1) {
        onDataLoaded?.();
      }
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

  // Sample data (Banners / Stores) no longer needed for banners as they are fetched from API

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
        <Banner items={banners} onBannerPress={handleBannerPress} />
      </View>


<View style={{marginTop:-SPACING.xxl}}> 
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => console.log('Filter pressed')}
        placeholder="Search..."
      />
 </View>

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
  ), [searchQuery, selectedCategory, categories, stores, isLoadingStores, banners]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkGray}
        translucent={false}
      />
      <View style={styles.container}>
        <Header
          userName={profile?.name || "Guest"}
          onProfilePress={() => console.log('Profile pressed')}
          onWishlistPress={() => {
            if (!isAuthenticated) {
              onRequireAuth?.();
            } else {
              // Hacky way to simulate a tab press for routing or add explicit prop handling
              // Adding an explicit prop makes more sense:
              onTabPress?.('wishlist' as TabName); // using cast as we expand types
            }
          }}
          onNotificationPress={() => onNotificationsPress?.()}
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
                onAddToCart={handleAddToCart}
                onRequireAuth={onRequireAuth}
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
    paddingVertical: SPACING.xl,
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
    fontSize: normalizeFont(FONT_SIZES.lg),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: normalizeFont(FONT_SIZES.sm),
    fontFamily: getFontFamily('medium'),
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  storesContainer: {
    paddingHorizontal: SPACING.md,
  },
  columnWrapper: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  footerLoader: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
