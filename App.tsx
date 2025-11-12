/**
 * Urban Kashmir React Native App
 * Clean and scalable architecture with Zustand and TypeScript
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EcommerceHomeScreen } from './src/screens';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <EcommerceHomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
