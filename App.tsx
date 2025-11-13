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
} from './src/screens';
import { Product, TabName } from './src/components';

type Screen = 'home' | 'shop' | 'cart' | 'profile' | 'editProfile' | 'productDetails';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetails');
  };

  const handleBack = () => {
    // Determine which screen to go back to
    if (currentScreen === 'productDetails' || currentScreen === 'cart') {
      setCurrentScreen('home');
    } else if (currentScreen === 'editProfile') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'profile') {
      setCurrentScreen('home');
    }
    setSelectedProduct(null);
  };

  const handleTabPress = (tab: TabName) => {
    console.log('Tab pressed:', tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'search') {
      setCurrentScreen('shop');
    } else if (tab === 'cart') {
      setCurrentScreen('cart');
    } else if (tab === 'profile') {
      setCurrentScreen('profile');
    }
    // Add other tab handlers as needed
  };

  const handleEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <EcommerceHomeScreen
            onProductPress={handleProductPress}
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
        return (
          <CartScreen onBack={handleBack} onTabPress={handleTabPress} />
        );
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
