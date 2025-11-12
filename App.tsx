/**
 * Urban Kashmir React Native App
 * Clean and scalable architecture with Zustand and TypeScript
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EcommerceHomeScreen, ProductDetailsScreen } from './src/screens';
import { Product } from './src/components';

type Screen = 'home' | 'productDetails';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('productDetails');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedProduct(null);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {currentScreen === 'home' ? (
        <EcommerceHomeScreen onProductPress={handleProductPress} />
      ) : (
        <ProductDetailsScreen onBack={handleBack} onShare={() => console.log('Share')} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
