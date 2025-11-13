import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  HeaderTwo,
  CategoryFilter,
  ProductCard,
  ReelCard,
  Product,
  Reel,
  BottomNavigation,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface StoreHomeScreenProps {
  storeName: string;
  storeImage?: string;
  onBack?: () => void;
  onProductPress?: (product: Product) => void;
  onReelPress?: (reel: Reel) => void;
  onTabPress?: (tab: TabName) => void;
}

export const StoreHomeScreen: React.FC<StoreHomeScreenProps> = ({
  storeName,
  storeImage,
  onBack,
  onProductPress,
  onReelPress,
  onTabPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'shoes', name: 'Shoes', icon: 'shopping-bag' },
    { id: 'clothing', name: 'Clothing', icon: 'shopping-cart' },
    { id: 'accessories', name: 'Accessories', icon: 'watch' },
  ];

  const reels: Reel[] = [
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      title: 'New Sneaker Collection 2024',
      views: '12K',
      duration: '0:45',
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      title: 'How to Style Your Kicks',
      views: '8.5K',
      duration: '1:20',
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      title: 'Unboxing Limited Edition',
      views: '15K',
      duration: '2:10',
    },
    {
      id: '4',
      thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      title: 'Best Sneakers of 2024',
      views: '20K',
      duration: '1:45',
    },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Nike Air Max 270',
      price: 150,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
    {
      id: '2',
      name: 'Adidas Ultraboost',
      price: 180,
      rating: 5,
      isFavorite: true,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    },
    {
      id: '3',
      name: 'Jordan Retro 1',
      price: 200,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    },
    {
      id: '4',
      name: 'Puma RS-X',
      price: 120,
      rating: 4,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
    },
    {
      id: '5',
      name: 'New Balance 574',
      price: 90,
      rating: 4,
      isFavorite: true,
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400',
    },
    {
      id: '6',
      name: 'Vans Old Skool',
      price: 70,
      rating: 5,
      isFavorite: false,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    },
  ];

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  const handleReelPress = (reel: Reel) => {
    console.log('Reel pressed:', reel.title);
    onReelPress?.(reel);
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
          title={storeName}
          leftIcon="chevron-left"
          rightIcon="share-2"
          onLeftPress={onBack}
          onRightPress={() => console.log('Share store')}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Store Banner */}
          {storeImage && (
            <View style={styles.storeBanner}>
              <Image source={{ uri: storeImage }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{storeName}</Text>
                  <View style={styles.storeStats}>
                    <View style={styles.statItem}>
                      <Icon name="star" size={16} color={COLORS.primary} />
                      <Text style={styles.statText}>4.8</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Icon name="package" size={16} color={COLORS.background} />
                      <Text style={styles.statText}>250+ Products</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Reels Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reels</Text>
              <TouchableOpacity onPress={() => console.log('View all reels')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reelsContainer}
            >
              {reels.map(reel => (
                <ReelCard key={reel.id} reel={reel} onPress={handleReelPress} />
              ))}
            </ScrollView>
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
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress?.(product)}
                />
              ))}
            </View>
          </View>

          {/* Bottom spacing */}
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
    backgroundColor: COLORS.lightGray,
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
  reelsContainer: {
    paddingHorizontal: SPACING.lg,
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
  bottomSpacer: {
    height: 20,
  },
});
