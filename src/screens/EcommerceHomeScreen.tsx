import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import {
  Header,
  Banner,
  SearchBar,
  CategoryFilter,
  ProductCard,
  BottomNavigation,
  Product,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

export const EcommerceHomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const bannerItems = [
    {
      id: '1',
      title: 'Top Trending Hoodies',
      subtitle: 'Introducing',
      buttonText: 'Shop Now',
      backgroundColor: '#F3F4F6',
    },
    {
      id: '2',
      title: 'Summer Collection',
      subtitle: 'New Arrivals',
      buttonText: 'Explore',
      backgroundColor: '#FFF5E1',
    },
    {
      id: '3',
      title: 'Special Offers',
      subtitle: 'Limited Time',
      buttonText: 'Get Deal',
      backgroundColor: '#E8F5E9',
    },
  ];

  const categories = [
    { id: 'popular', name: 'Popular', icon: 'trending-up' },
    { id: 'shoes', name: 'Shoes', icon: 'shopping-bag' },
    { id: 'clothing', name: 'Clothing', icon: 'shopping-cart' },
    { id: 'accessories', name: 'Accessories', icon: 'watch' },
    { id: 'sports', name: 'Sports', icon: 'activity' },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Nike Kobe 5 Protro',
      price: 120,
      rating: 5,
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Nick Hoops Elite',
      price: 40,
      rating: 5,
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Air Jordan Retro',
      price: 180,
      rating: 4,
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Classic Backpack',
      price: 65,
      rating: 5,
      isFavorite: false,
    },
  ];

  const handleBannerPress = (item: any) => {
    console.log('Banner pressed:', item);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product);
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
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkGray}
        translucent={false}
      />
      <View style={styles.container}>
        {/* Header */}
        <Header
          userName="Billy Hanson"
          onProfilePress={() => console.log('Profile pressed')}
          onWishlistPress={() => console.log('Wishlist pressed')}
          onNotificationPress={() => console.log('Notification pressed')}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Banner/Carousel - Overlapping header */}
          <View style={styles.bannerContainer}>
            <Banner items={bannerItems} onBannerPress={handleBannerPress} />
          </View>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => console.log('Filter pressed')}
            placeholder="Search..."
          />

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
    </View>
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
  },
  scrollView: {
    flex: 1,
    marginTop: -50, // Pull content up to overlap header
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  bannerContainer: {
    marginTop: SPACING.sm,
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
    // flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    // paddingHorizontal: SPACING.xl,
    // justifyContent: 'space-between',
  },
  bottomSpacer: {
    height: 20,
  },
});
