import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
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
import { cartService } from '../api';
import { useCartStore } from '../store';

interface CartScreenProps {
  onBack?: () => void;
  onTabPress?: (tab: TabName) => void;
  onProceedToCheckout?: (totals: { total: number; subtotal: number; tax: number; discount: number; itemCount: number }) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onTabPress,
  onProceedToCheckout,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('cart');
  const [promoCode, setPromoCode] = useState('');
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({ 
    subtotal: 0, 
    tax: 0, 
    discount: 0, 
    total: 0, 
    itemCount: 0 
  });
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const { updateCartCount, fetchCartCount } = useCartStore();

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      
      if (!data || !data.items) {
        setCartItems([]);
        setTotals({ 
          subtotal: 0, 
          tax: 0, 
          discount: 0, 
          total: 0, 
          itemCount: 0 
        });
        return;
      }

      const mappedItems: CartItemData[] = data.items.map(apiItem => ({
        id: String(apiItem.id),
        name: apiItem.product?.title || 'Product',
        price: apiItem.variant?.sale_price || apiItem.variant?.price || 0,
        size: 'XL', 
        quantity: apiItem.quantity || 0,
        rating: 5,
        image: apiItem.product?.images?.[0]?.url,
      }));

      setCartItems(mappedItems);
      setTotals({
        subtotal: data.summary.subtotal || 0,
        tax: data.summary.tax || 0,
        discount: data.summary.discount || 0,
        total: data.summary.total || 0,
        itemCount: data.items_count || 0,
      });
      updateCartCount(data.items_count || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load cart items',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleIncrease = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    
    try {
      await cartService.updateCartItem(Number(id), item.quantity + 1);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to increase quantity:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
      });
    }
  };

  const handleDecrease = async (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (!item || item.quantity <= 1) return;
    
    try {
      await cartService.updateCartItem(Number(id), item.quantity - 1);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await cartService.removeCartItem(Number(id));
      setSwipedItemId(null);
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Failed to remove item:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item',
      });
    }
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cartService.clearCart();
              updateCartCount(0);
              fetchCart();
            } catch (error) {
              console.error('Failed to clear cart:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear cart',
              });
            }
          }
        },
      ]
    );
  };

  const handleApplyPromo = () => {
    console.log('Apply promo code:', promoCode);
    // Add promo code logic here
  };

  const handleCheckout = () => {
    onProceedToCheckout?.(totals);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  // Calculate totals (with safety checks)
  const cartItemsSafe = cartItems || [];
  const subtotalValue = cartItemsSafe.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0,
  );
  const taxValue = subtotalValue * 0.1;
  const itemCountValue = cartItemsSafe.reduce((sum, item) => sum + (item.quantity || 0), 0);

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
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : (
            <>
              {/* Cart Items */}
              <View style={styles.cartItemsContainer}>
                {cartItems.length > 0 ? (
                  <>
                    <View style={styles.listHeader}>
                      <Text style={styles.itemCountText}>{totals.itemCount} Items in your cart</Text>
                      <TouchableOpacity onPress={handleClearCart}>
                        <Text style={styles.clearText}>Clear All</Text>
                      </TouchableOpacity>
                    </View>
                    {cartItems.map(item => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                        showDelete={true} 
                      />
                    ))}
                  </>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Icon name="shopping-cart" size={64} color={COLORS.gray} />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity
                      style={styles.continueShoppingButton}
                      onPress={() => handleTabPress('home')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {cartItems.length > 0 && (
                <>
                  {/* Promo Code */}
                  <PromoCodeInput
                    value={promoCode}
                    onChangeText={setPromoCode}
                    onApply={handleApplyPromo}
                  />

                  {/* Order Summary */}
                  <OrderSummary
                    subtotal={totals.subtotal}
                    tax={totals.tax}
                    discount={totals.discount}
                    total={totals.total}
                    itemCount={totals.itemCount}
                  />

                  {/* Checkout Button */}
                  <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.checkoutText}>Proceed To Checkout</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

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
  loader: {
    marginTop: SPACING.xl * 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray,
    marginTop: SPACING.md,
  },
  continueShoppingButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    marginTop: SPACING.xl,
  },
  continueShoppingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  itemCountText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  clearText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
});
