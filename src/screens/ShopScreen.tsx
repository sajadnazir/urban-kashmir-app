import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  SearchBar,
  CategoryFilter,
  ProductCard,
  BottomNavigation,
  Product,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { productService, categoryService, cartService } from '../api';
import type { Category } from '../api/services/categoryService';
import { useAuthStore } from '../store/authStore';

interface ShopScreenProps {
  onProductPress?: (product: Product) => void;
  onTabPress?: (tab: TabName) => void;
  onRequireAuth?: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  onProductPress,
  onTabPress,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('search');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { isAuthenticated } = useAuthStore();

  // Pagination State
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', icon: 'grid' }
  ]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Initial Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when query or category changes
  useEffect(() => {
    fetchProducts(1, debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const apiCats = await categoryService.getCategories();
      setCategories([
        { id: 'all', name: 'All', icon: 'grid' },
        ...apiCats
      ]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async (pageNumber: number, query: string = debouncedQuery, catId: string = selectedCategory) => {
    if (pageNumber === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      let response;
      if (query.trim()) {
        response = await productService.searchProducts(query, pageNumber, 20);
      } else {
        response = await productService.getProducts(pageNumber, 20, catId);
      }
      
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
      fetchProducts(page + 1, debouncedQuery, selectedCategory);
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

  const renderHeader = useCallback(() => (
    <View style={styles.headerBlock}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Picks Nearby</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
    </View>
  ), [categories, selectedCategory]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={() => {}}
              placeholder="Search..."
            />
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Icon name="sliders" size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {isLoading && page === 1 ? (
          <View style={styles.centerAll}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
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
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerBlock: {
    paddingBottom: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  footerLoader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});
