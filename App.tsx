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
} from './src/screens';
import { Product, TabName } from './src/components';

type Screen = 'home' | 'shop' | 'cart' | 'productDetails';

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
      // Go back to the previous screen (could be home or shop)
      setCurrentScreen('home'); // Default to home for now
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
    }
    // Add other tab handlers as needed
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
