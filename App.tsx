/**
 * Urban Kashmir React Native App
 * Clean and scalable architecture with Zustand and TypeScript
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
} from './src/screens';
import { Product, Store, TabName } from './src/components';
import { useAuthStore } from './src/store/authStore';

type Screen =
  | 'login'
  | 'home'
  | 'shop'
  | 'cart'
  | 'profile'
  | 'editProfile'
  | 'storeHome'
  | 'reelsPlayer'
  | 'productDetails';

function App(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [intendedScreen, setIntendedScreen] = useState<Screen | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

      case 'home':
        return (
          <EcommerceHomeScreen
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
            onTabPress={handleTabPress}
            onRequireAuth={handleRequireAuth}
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
    </SafeAreaProvider>
  );
}

export default App;
