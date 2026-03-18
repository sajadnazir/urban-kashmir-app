/**
 * Urban Kashmir React Native App
 * Clean and scalable architecture with Zustand and TypeScript
 *
 * @format
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar, BackHandler, View, Text, StyleSheet, TouchableOpacity, Modal, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {
  EcommerceHomeScreen,
  ProductDetailsScreen,
  ShopScreen,
  CartScreen,
  ProfileScreen,
  EditProfileScreen,
  StoreHomeScreen,
  ReelsPlayerScreen,
  LoginScreen,
  SplashScreen,
  WishlistScreen,
  AddressScreen,
  NotificationsScreen,
  NotificationDetailsScreen,
  CheckoutScreen,
  OrderConfirmationScreen,
  OrdersScreen,
  OrderDetailsScreen,
  TrackOrderScreen,
} from './src/screens';
import { Product, Store, TabName } from './src/components';
import { Order } from './src/types/order';
import { useAuthStore } from './src/store/authStore';
import { notificationService } from './src/api/services/notificationService';
import type { Notification } from './src/types/notification';

type Screen =
  | 'login'
  | 'home'
  | 'shop'
  | 'cart'
  | 'profile'
  | 'editProfile'
  | 'storeHome'
  | 'reelsPlayer'
  | 'productDetails'
  | 'wishlist'
  | 'address'
  | 'notifications'
  | 'notificationDetails'
  | 'checkout'
  | 'orderConfirmation'
  | 'orders'
  | 'orderDetails'
  | 'trackOrder';

function App(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [intendedScreen, setIntendedScreen] = useState<Screen | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({ total: 0, subtotal: 0, tax: 0, discount: 0, itemCount: 0 });
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber?: string; errorMessage?: string } | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState<string | null>(null);
  const startTime = useRef(Date.now());

  // Helper for FCM token registration
  const handleFcmRegistration = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('\n\n=== YOUR FCM TOKEN ===\n', token, '\n========================\n\n');
        await notificationService.registerFcmToken({
          fcm_token: token,
          device_type: Platform.OS === 'ios' ? 'ios' : 'android',
          device_id: `app_install_${Platform.OS}`, // Basic fallback device_id
        });
        console.log('FCM token registered.');
      }
    } catch (error) {
      console.warn('FCM registration failed:', error);
    }
  }, []);

  // Request Notification Permissions
  useEffect(() => {
    async function requestNotificationPermission() {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted.');
            if (isAuthenticated) handleFcmRegistration();
          }
        } catch (err) {
          console.warn('Failed to request notification permission:', err);
        }
      } else {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            console.log('Notification authorization status:', authStatus);
            if (isAuthenticated) handleFcmRegistration();
          }
        } catch (err) {
          console.warn('Failed to setup firebase messaging permission:', err);
        }
      }
    }
    requestNotificationPermission();
  }, [isAuthenticated, handleFcmRegistration]);

  // Listen for Token Refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((token) => {
      if (isAuthenticated) {
        notificationService.registerFcmToken({
          fcm_token: token,
          device_type: Platform.OS === 'ios' ? 'ios' : 'android',
          device_id: `app_install_${Platform.OS}`,
        }).catch(err => console.warn('Token refresh registration failed', err));
      }
    });
    return unsubscribe;
  }, [isAuthenticated]);

  // Handle Foreground Messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in foreground!', JSON.stringify(remoteMessage));

      try {
        // Request permissions (required for iOS, no-op on Android 13+ if already granted)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // Display a notification
        if (remoteMessage.notification) {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
              },
            },
          });
        }
      } catch (error) {
        console.warn('Failed to display foreground notification:', error);
      }
    });

    return unsubscribe;
  }, []);

  // Global Auth Guard — check when auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      // If we just logged out, reset to home or login
      if (currentScreen !== 'login' && currentScreen !== 'home' && currentScreen !== 'shop' && currentScreen !== 'productDetails' && currentScreen !== 'storeHome' && currentScreen !== 'reelsPlayer') {
        setCurrentScreen('login');
      }
    } else {
      // Register token if user is logged in
      handleFcmRegistration();
    }
  }, [isAuthenticated, currentScreen, handleFcmRegistration]);

  // Hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      const screensWithBack: Screen[] = [
        'productDetails', 'cart', 'storeHome', 'reelsPlayer',
        'editProfile', 'profile', 'wishlist', 'address',
        'notifications', 'notificationDetails', 'shop',
        'orders', 'orderDetails',
      ];
      if (screensWithBack.includes(currentScreen)) {
        handleBack();
        return true; // Consumed — don't exit
      }
      // On home screen — show custom exit dialog
      setShowExitDialog(true);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen]);

  // Safety timeout for splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 5000); // 5 seconds maximum
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setCurrentScreen(intendedScreen || 'home');
    setIntendedScreen(null);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetails');
  };

  const handleStorePress = (store: Store) => {
    setSelectedStore(store);
    setCurrentScreen('storeHome');
  };

  const handleReelPress = () => {
    setCurrentScreen('reelsPlayer');
  };

  const handleBack = () => {
    if (currentScreen === 'productDetails' || currentScreen === 'cart') {
      setCurrentScreen('home');
    } else if (currentScreen === 'storeHome') {
      setCurrentScreen('home');
    } else if (currentScreen === 'reelsPlayer') {
      setCurrentScreen('home');
    } else if (currentScreen === 'editProfile') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'profile') {
      setCurrentScreen('home');
    } else if (currentScreen === 'wishlist') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'address') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'notifications') {
      setCurrentScreen('home');
    } else if (currentScreen === 'notificationDetails') {
      setCurrentScreen('notifications');
    } else if (currentScreen === 'checkout') {
      setCurrentScreen('cart');
    } else if (currentScreen === 'orderConfirmation') {
      setCurrentScreen('home');
    } else if (currentScreen === 'orders') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'orderDetails') {
      setCurrentScreen('orders');
    } else if (currentScreen === 'trackOrder') {
      setCurrentScreen('orderDetails');
    }
    setSelectedProduct(null);
    setSelectedStore(null);
  };

  const handleTabPress = (tab: TabName) => {
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'search') {
      setCurrentScreen('shop');
    } else if (tab === 'cart') {
      if (!isAuthenticated) {
        setIntendedScreen('cart');
        setCurrentScreen('login');
      } else {
        setCurrentScreen('cart');
      }
    } else if (tab === 'profile') {
      if (!isAuthenticated) {
        setIntendedScreen('profile');
        setCurrentScreen('login');
      } else {
        setCurrentScreen('profile');
      }
    } else if (tab === 'wishlist' as any) {
      if (!isAuthenticated) {
         setIntendedScreen('wishlist');
         setCurrentScreen('login');
      } else {
         setCurrentScreen('wishlist');
      }
    }
  };

  const handleEditProfile = () => {
    if (!isAuthenticated) {
      setIntendedScreen('editProfile');
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen('editProfile');
  };

  const handleRequireAuth = () => {
    setIntendedScreen('cart');
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess} 
            onHome={() => setCurrentScreen('home')}
          />
        );

      case 'home':
        return (
          <EcommerceHomeScreen
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
            onTabPress={handleTabPress}
            onRequireAuth={handleRequireAuth}
            onNotificationsPress={() => setCurrentScreen('notifications')}
            onDataLoaded={() => {
              const elapsed = Date.now() - startTime.current;
              const remaining = Math.max(0, 3000 - elapsed);
              setTimeout(() => setIsAppLoading(false), remaining);
            }}
          />
        );
      case 'shop':
        return (
          <ShopScreen
            onProductPress={handleProductPress}
            onTabPress={handleTabPress}
            onRequireAuth={handleRequireAuth}
          />
        );
      case 'cart':
        return (
          <CartScreen
            onBack={handleBack}
            onTabPress={handleTabPress}
            onProceedToCheckout={(totals) => {
              setCheckoutTotals(totals);
              setCurrentScreen('checkout');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBack={handleBack}
            onTabPress={handleTabPress}
            onEditProfile={handleEditProfile}
            onMenuPress={(id) => {
              if (id === 'wishlist') {
                if (!isAuthenticated) {
                  setIntendedScreen('wishlist');
                  setCurrentScreen('login');
                } else {
                  setCurrentScreen('wishlist');
                }
              } else if (id === 'address') {
                if (!isAuthenticated) {
                  setIntendedScreen('address');
                  setCurrentScreen('login');
                } else {
                  setCurrentScreen('address');
                }
              } else if (id === 'orders') {
                if (!isAuthenticated) {
                  setIntendedScreen('orders');
                  setCurrentScreen('login');
                } else {
                  setCurrentScreen('orders');
                }
              }
            }}
          />
        );
      case 'editProfile':
        return <EditProfileScreen onBack={handleBack} />;
      case 'storeHome':
        return (
          <StoreHomeScreen
            vendorSlug={selectedStore?.slug || ''}
            onBack={handleBack}
            onProductPress={handleProductPress}
            onTabPress={handleTabPress}
            onRequireAuth={handleRequireAuth}
          />
        );
      case 'reelsPlayer':
        return <ReelsPlayerScreen onBack={handleBack} />;
      case 'productDetails':
        return (
          <ProductDetailsScreen
            productId={selectedProduct?.id || ''}
            onBack={handleBack}
            onShare={() => console.log('Share')}
            onRequireAuth={handleRequireAuth}
          />
        );
      case 'wishlist':
        return (
          <WishlistScreen
            onBack={handleBack}
            onProductPress={handleProductPress}
            onTabPress={handleTabPress}
          />
        );
      case 'address':
        return <AddressScreen onBack={handleBack} />;
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={handleBack}
            onNotificationPress={(notification) => {
              setSelectedNotification(notification);
              setCurrentScreen('notificationDetails');
            }}
          />
        );
      case 'notificationDetails':
        return selectedNotification ? (
          <NotificationDetailsScreen notification={selectedNotification} onBack={handleBack} />
        ) : null;
      case 'checkout':
        return (
          <CheckoutScreen
            onBack={handleBack}
            cartTotal={checkoutTotals.total}
            cartSubtotal={checkoutTotals.subtotal}
            cartTax={checkoutTotals.tax}
            cartDiscount={checkoutTotals.discount}
            itemCount={checkoutTotals.itemCount}
            onOrderSuccess={(orderId, orderNumber) => {
              setOrderResult({ success: true, orderNumber: orderNumber });
              setCurrentScreen('orderConfirmation');
            }}
            onOrderError={(error) => {
              setOrderResult({ success: false, errorMessage: error });
              setCurrentScreen('orderConfirmation');
            }}
          />
        );
      case 'orderConfirmation':
        return orderResult ? (
          <OrderConfirmationScreen
            success={orderResult.success}
            orderNumber={orderResult.orderNumber}
            errorMessage={orderResult.errorMessage}
            onContinueShopping={() => setCurrentScreen('home')}
            onRetry={() => setCurrentScreen('checkout')}
          />
        ) : null;
      case 'orders':
        return (
          <OrdersScreen 
            onBack={handleBack} 
            onOrderPress={(order: Order) => {
              setSelectedOrderId(order.id);
              setCurrentScreen('orderDetails');
            }} 
          />
        );
      case 'orderDetails':
        return selectedOrderId ? (
          <OrderDetailsScreen 
            orderId={selectedOrderId} 
            onBack={handleBack} 
            onTrackOrder={(trackingNumber: string) => {
              setSelectedTrackingNumber(trackingNumber);
              setCurrentScreen('trackOrder');
            }}
          />
        ) : null;
      case 'trackOrder':
        return selectedTrackingNumber ? (
          <TrackOrderScreen trackingNumber={selectedTrackingNumber} onBack={handleBack} />
        ) : null;
      default:
        return (
          <EcommerceHomeScreen
            onProductPress={handleProductPress}
            onTabPress={handleTabPress}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {renderScreen()}
      {isAppLoading && <SplashScreen />}
      <Toast />

      {/* Custom Exit Dialog */}
      <Modal
        visible={showExitDialog}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExitDialog(false)}
      >
        <TouchableOpacity
          style={exitStyles.overlay}
          activeOpacity={1}
          onPress={() => setShowExitDialog(false)}
        >
          <View style={exitStyles.sheet}>
            {/* Handle */}
            <View style={exitStyles.handle} />

            {/* Icon */}
            <View style={exitStyles.iconWrap}>
              <Text style={exitStyles.iconEmoji}>🚪</Text>
            </View>

            <Text style={exitStyles.title}>Exit Urban Kashmir?</Text>
            <Text style={exitStyles.subtitle}>
              You can always come back and explore more.
            </Text>

            <View style={exitStyles.buttonRow}>
              <TouchableOpacity
                style={exitStyles.cancelButton}
                onPress={() => setShowExitDialog(false)}
              >
                <Text style={exitStyles.cancelText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={exitStyles.exitButton}
                onPress={() => BackHandler.exitApp()}
              >
                <Text style={exitStyles.exitText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaProvider>
  );
}

const exitStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFF3EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  exitButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#ED7745',
    alignItems: 'center',
    shadowColor: '#ED7745',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  exitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default App;
