import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, RefreshControl,
  TouchableOpacity, } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  FullWidthBanner,
  SearchBar,
  CategoryFilter,
  ProductCard,
  StoreCard,
  BottomNavigation,
  Product,
  Store,
  TabName,
  HomeHeader,
  SortModal,
  SortOption,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { productService, categoryService, cartService, vendorService, bannerService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import type { Category } from '../api/services/categoryService';
import { useUserStore, useAuthStore, useWishlistStore, useCartStore, useBannerStore, useAddressStore, useNotificationStore } from '../store';
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
  const { fetchAddresses, getDefaultAddress, addresses } = useAddressStore();
  const { fetchNotifications, unreadCount } = useNotificationStore();
  const { wishlistIds } = useWishlistStore();
  const defaultAddress = getDefaultAddress();
  const hasAddress = addresses.length > 0;

  // Search & Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('none');

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
      fetchAddresses();
      fetchNotifications();
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
      const vendorArray = response.data || [];
      
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

  // Suggestive Search Logic
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await productService.searchProducts(searchQuery, 1, 5);
        // Map product titles to suggestions and unique them
        const titles = [...new Set(response.data.map(p => p.name))];
        setSuggestions(titles);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionPress = async (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    // Immediately trigger search
    setPage(1);
    setIsSearching(true);
    try {
      const response = await productService.searchProducts(suggestion, 1);
      setProducts(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Search failed',
        text2: 'Could not fetch search results',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option);
    setIsSortModalVisible(false); // Close modal after selection
    // Refresh products with sort
    setPage(1);
    fetchProducts(1, searchQuery, option);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setPage(1);
    fetchProducts(1);
  };

  const fetchProducts = async (pageNumber: number, search: string = '', sort: SortOption = 'none') => {
    if (pageNumber === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await productService.getProducts(pageNumber, 10, search, sort);
      
      setProducts(p => 
        pageNumber === 1 
          ? response.data 
          : [...p, ...response.data]
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
      fetchProducts(page + 1, searchQuery, selectedSort);
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

  const handleRefresh = async () => {
    fetchProducts(1);
    if (isAuthenticated) {
      fetchAddresses();
      fetchNotifications();
    }
  };

  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', icon: 'grid' }
  ]);

  /* 
   * Extract header into ListHeaderComponent so FlatList takes over memory-efficient
   * scrolling for the dynamic products grid.
   */
  const renderHeader = useCallback(() => (
    <View style={styles.headerBlock}>
      <FullWidthBanner items={banners} onBannerPress={handleBannerPress} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={[styles.sectionHeader, {marginTop: SPACING.md}]}>
        <Text style={styles.sectionTitle}>Featured Stores</Text>
        {/* <Text style={styles.seeAll}>See All</Text> */}
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

      <View style={[styles.sectionHeader, {marginBottom: 0}]}>
        <Text style={styles.sectionTitle}>Top Picks Nearby</Text>
      <TouchableOpacity onPress={() => onTabPress?.('search' as TabName)}>  <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
      </View>
    </View>
  ), [searchQuery, selectedCategory, categories, stores, isLoadingStores, banners]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <View style={styles.container}>
        <HomeHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
          isLoggedIn={isAuthenticated}
          hasAddress={hasAddress}
          hasUnreadNotifications={unreadCount > 0}
          wishlistCount={wishlistIds.size}
          location={defaultAddress ? `${defaultAddress.address_line_1}, ${defaultAddress.city}` : undefined}
          onNotificationPress={() => onNotificationsPress?.()}
          onWishlistPress={() => {
            if (!isAuthenticated) {
              onRequireAuth?.();
            } else {
              onTabPress?.('wishlist' as TabName);
            }
          }}
          onLocationPress={() => {
            if (isAuthenticated && !hasAddress) {
              onTabPress?.('profile'); 
            } else if (isAuthenticated) {
               onTabPress?.('address' as any);
            }
          }}
          onSortPress={() => setIsSortModalVisible(true)}
          suggestions={suggestions}
          onSuggestionPress={handleSuggestionPress}
        />

      <SortModal 
        isVisible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        selectedOption={selectedSort}
        onSelectOption={handleSortSelect}
      />

        <View style={styles.contentContainer}>

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
            refreshControl={
              <RefreshControl
                refreshing={(isLoading && products.length > 0) || (isLoadingStores && stores.length > 0)}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
              />
            }
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
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background, // Match StoreHomeScreen
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
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
    // Remove bottom padding from headerBlock as it applies globally and we now use full width banner
    paddingBottom: SPACING.md,
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
