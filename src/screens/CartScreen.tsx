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
  HeaderTwo,
  CartItem,
  CartItemData,
  PromoCodeInput,
  OrderSummary,
  BottomNavigation,
  TabName,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface CartScreenProps {
  onBack?: () => void;
  onTabPress?: (tab: TabName) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onTabPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: '1',
      name: 'Top Picks Nearby',
      price: 120,
      size: 'XL',
      quantity: 1,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    },
    {
      id: '2',
      name: 'Top Picks Nearby',
      price: 120,
      size: 'XL',
      quantity: 1,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    },
    {
      id: '3',
      name: 'Top Picks Nearby',
      price: 120,
      size: 'XL',
      quantity: 1,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    },
  ]);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  const handleIncrease = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrease = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    setSwipedItemId(null);
  };

  const handleApplyPromo = () => {
    console.log('Apply promo code:', promoCode);
    // Add promo code logic here
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout');
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          title="Cart"
          leftIcon="chevron-left"
          rightIcon="home"
          onLeftPress={onBack}
          onRightPress={() => handleTabPress('home')}
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cart Items */}
          <View style={styles.cartItemsContainer}>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
                showDelete={swipedItemId === item.id}
              />
            ))}
          </View>

          {/* Promo Code */}
          <PromoCodeInput
            value={promoCode}
            onChangeText={setPromoCode}
            onApply={handleApplyPromo}
          />

          {/* Order Summary */}
          <OrderSummary subtotal={subtotal} tax={tax} itemCount={itemCount} />

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutText}>Proceed To Checkout</Text>
          </TouchableOpacity>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        {/* <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} /> */}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  cartItemsContainer: {
    marginBottom: SPACING.sm,
  },
  checkoutButton: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.md,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  checkoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
  bottomSpacer: {
    height: 20,
  },
});
