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

  const [currentScreen, setCurrentScreen] = useState<Screen>(
    isAuthenticated ? 'home' : 'login',
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
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
      setCurrentScreen('cart');
    } else if (tab === 'profile') {
      setCurrentScreen('profile');
    }
  };

  const handleEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const renderScreen = () => {
    // Gate: show login if not authenticated
    if (!isAuthenticated && currentScreen !== 'login') {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

      case 'home':
        return (
          <EcommerceHomeScreen
            onProductPress={handleProductPress}
            onStorePress={handleStorePress}
            onTabPress={handleTabPress}
          />
        );
      case 'shop':
        return (
          <ShopScreen
            onProductPress={handleProductPress}
            onTabPress={handleTabPress}
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
            storeName={selectedStore?.name || 'Store'}
            storeImage={selectedStore?.image}
            onBack={handleBack}
            onProductPress={handleProductPress}
            onReelPress={handleReelPress}
            onTabPress={handleTabPress}
          />
        );
      case 'reelsPlayer':
        return <ReelsPlayerScreen onBack={handleBack} />;
      case 'productDetails':
        return (
          <ProductDetailsScreen
            onBack={handleBack}
            onShare={() => console.log('Share')}
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
