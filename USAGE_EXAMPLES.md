# Usage Examples

This document provides practical examples of how to use the different parts of the application architecture.

## 📡 API Services

### Making API Calls

```typescript
import { authService, userService } from './src/api';

// Login
try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('User:', response.user);
  console.log('Token:', response.token);
} catch (error) {
  console.error('Login failed:', error);
}

// Get user profile
try {
  const profile = await userService.getProfile();
  console.log('Profile:', profile);
} catch (error) {
  console.error('Failed to fetch profile:', error);
}
```

### Adding a New API Service

1. **Define the endpoint** in `src/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  // ... existing endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
  },
};
```

2. **Create the service** in `src/api/services/productService.ts`:

```typescript
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Product } from '../../types/product';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(ENDPOINTS.PRODUCTS.LIST);
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(
      ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>(
      ENDPOINTS.PRODUCTS.CREATE,
      data
    );
    return response.data;
  },
};
```

3. **Export the service** in `src/api/index.ts`:

```typescript
export { productService } from './services/productService';
```

## 🏪 Zustand Stores

### Using Stores in Components

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from './src/store';

export const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};
```

### Creating a New Store

```typescript
// src/store/productStore.ts
import { create } from 'zustand';
import { productService } from '../api';
import type { Product } from '../types/product';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  selectProduct: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  selectProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProduct(id);
      set({ selectedProduct: product, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
```

## 🪝 Custom Hooks

### Using the useApi Hook

```typescript
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useApi } from './src/hooks';
import { userService } from './src/api';

export const UserProfileScreen = () => {
  const { data: profile, isLoading, error, execute } = useApi();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await execute(() => userService.getProfile());
    } catch (err) {
      // Error is already set in the hook
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!profile) return <Text>No profile data</Text>;

  return (
    <View>
      <Text>Name: {profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Button title="Refresh" onPress={loadProfile} />
    </View>
  );
};
```

### Creating a Custom Hook

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <TextInput
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder="Search..."
    />
  );
};
```

## 🎨 Components

### Using the Button Component

```typescript
import React from 'react';
import { View } from 'react-native';
import { Button } from './src/components';

export const ExampleScreen = () => {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <View>
      <Button title="Primary Button" onPress={handlePress} />
      
      <Button 
        title="Secondary Button" 
        variant="secondary" 
        onPress={handlePress} 
      />
      
      <Button 
        title="Outline Button" 
        variant="outline" 
        onPress={handlePress} 
      />
      
      <Button 
        title="Loading..." 
        isLoading={true} 
        onPress={handlePress} 
      />
      
      <Button 
        title="Full Width" 
        fullWidth 
        onPress={handlePress} 
      />
    </View>
  );
};
```

### Creating a New Component

```typescript
// src/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface CardProps extends ViewProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  style,
  ...props
}) => {
  return (
    <View style={[styles.card, style]} {...props}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
});
```

## 🎯 TypeScript Types

### Defining Types

```typescript
// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  inStock?: boolean;
}
```

### Using Types

```typescript
import type { Product, CreateProductData } from './src/types/product';

const product: Product = {
  id: '1',
  name: 'Sample Product',
  description: 'A great product',
  price: 29.99,
  imageUrl: 'https://example.com/image.jpg',
  category: 'Electronics',
  inStock: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const newProduct: CreateProductData = {
  name: 'New Product',
  description: 'Another great product',
  price: 39.99,
  category: 'Electronics',
};
```

## 🔧 Utilities

### Using Storage

```typescript
import { storage, STORAGE_KEYS } from './src/utils';

// Save data
await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'your-token-here');

// Retrieve data
const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);

// Remove data
await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

// Clear all data
await storage.clear();
```

## 🎨 Constants

### Using Constants

```typescript
import { COLORS, SPACING, FONT_SIZES } from './src/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  text: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
  },
});
```

## 🔄 Complete Example: Login Flow

```typescript
// LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Button } from './src/components';
import { useAuthStore } from './src/store';
import { COLORS, SPACING, FONT_SIZES } from './src/constants';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Navigation will happen automatically when auth state changes
    } catch (err) {
      // Error is already set in the store
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <Button
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});
```
