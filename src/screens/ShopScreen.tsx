import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
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
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

interface ShopScreenProps {
  onProductPress?: (product: Product) => void;
  onTabPress?: (tab: TabName) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  onProductPress,
  onTabPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('search');
  const [selectedCategory, setSelectedCategory] = useState('apparel');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'apparel', name: 'Apparel', icon: 'shopping-bag' },
    { id: 'shoes', name: 'Shoes', icon: 'shopping-cart' },
    { id: 'sports', name: 'Sports', icon: 'activity' },
    { id: 'gaming', name: 'Gaming', icon: 'monitor' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Essentials Hoodie',
      price: 45,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    },
    {
      id: '2',
      name: 'Chest Logo Hoodie',
      price: 55,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    },
    {
      id: '3',
      name: 'Pullover Hoodie',
      price: 55,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    },
    {
      id: '4',
      name: 'Nike Sportswear',
      price: 78,
      rating: 5,
      isFavorite: true,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    },
    {
      id: '5',
      name: 'Classic Backpack',
      price: 65,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      id: '6',
      name: 'Running Shoes',
      price: 120,
      rating: 4,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
  ];

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product);
    onProductPress?.(product);
  };

  const handleFavoritePress = (product: Product) => {
    console.log('Favorite pressed:', product);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
    onTabPress?.(tab);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSortPress = () => {
    console.log('Sort pressed');
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <View style={styles.container}>
        {/* Search and Filter Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={handleFilterPress}
              placeholder="Search..."
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Icon name="sliders" size={20} color={COLORS.background} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={handleSortPress}
            activeOpacity={0.7}
          >
            <Icon name="grid" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Picks Nearby</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
                onFavoritePress={handleFavoritePress}
                onAddToCart={handleAddToCart}
              />
            ))}
          </View>

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-between',
  },
  bottomSpacer: {
    height: 20,
  },
});
