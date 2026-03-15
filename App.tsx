/**
 * Urban Kashmir React Native App
 * Clean and scalable architecture with Zustand and TypeScript
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
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
} from './src/screens';
import { Product, Store, TabName } from './src/components';
import { useAuthStore } from './src/store/authStore';
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
  | 'notificationDetails';

function App(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [intendedScreen, setIntendedScreen] = useState<Screen | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const startTime = useRef(Date.now());

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
        return <CartScreen onBack={handleBack} onTabPress={handleTabPress} />;
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
    </SafeAreaProvider>
  );
}

export default App;
