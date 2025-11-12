# E-Commerce Components Documentation

This document describes the e-commerce UI components created for the Urban Kashmir app, based on the Behance design reference.

## 📱 Components Overview

### 1. **Header Component** (`src/components/Header.tsx`)

A reusable header with user profile, welcome message, and action icons.

**Features:**
- User profile image or placeholder with initial
- User name and welcome text
- Wishlist icon button
- Notification icon button

**Props:**
```typescript
interface HeaderProps {
  userName: string;
  userImage?: string;
  onProfilePress?: () => void;
  onWishlistPress?: () => void;
  onNotificationPress?: () => void;
}
```

**Usage:**
```typescript
<Header
  userName="Billy Hanson"
  userImage="https://..."
  onProfilePress={() => console.log('Profile')}
  onWishlistPress={() => console.log('Wishlist')}
  onNotificationPress={() => console.log('Notification')}
/>
```

---

### 2. **Banner Component** (`src/components/Banner.tsx`)

A horizontal scrollable carousel for promotional content.

**Features:**
- Horizontal scroll with pagination
- Auto-pagination dots
- Customizable background colors
- Product image placeholder
- Call-to-action button

**Props:**
```typescript
interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor?: string;
}

interface BannerProps {
  items: BannerItem[];
  onBannerPress?: (item: BannerItem) => void;
}
```

**Usage:**
```typescript
const bannerItems = [
  {
    id: '1',
    title: 'Top Trending Hoodies',
    subtitle: 'Introducing',
    buttonText: 'Shop Now',
    backgroundColor: '#F3F4F6',
  },
];

<Banner items={bannerItems} onBannerPress={handlePress} />
```

---

### 3. **SearchBar Component** (`src/components/SearchBar.tsx`)

A search input with filter button.

**Features:**
- Search icon
- Text input field
- Filter/settings button

**Props:**
```typescript
interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}
```

**Usage:**
```typescript
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  onFilterPress={() => console.log('Filter')}
  placeholder="Search..."
/>
```

---

### 4. **CategoryFilter Component** (`src/components/CategoryFilter.tsx`)

A horizontal scrollable category filter with icons.

**Features:**
- Horizontal scroll
- Icon + text labels
- Active state styling
- Smooth selection

**Props:**
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}
```

**Usage:**
```typescript
const categories = [
  { id: 'popular', name: 'Popular', icon: '🔥' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
];

<CategoryFilter
  categories={categories}
  selectedCategory={selectedCategory}
  onSelectCategory={setSelectedCategory}
/>
```

---

### 5. **ProductCard Component** (`src/components/ProductCard.tsx`)

A product card with image, details, rating, and actions.

**Features:**
- Product image or placeholder
- Favorite button (heart icon)
- Product name
- Star rating display
- Price
- Add to cart button

**Props:**
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image?: string;
  isFavorite?: boolean;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onFavoritePress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}
```

**Usage:**
```typescript
const product = {
  id: '1',
  name: 'Nike Kobe 5 Protro',
  price: 120,
  rating: 5,
  isFavorite: false,
};

<ProductCard
  product={product}
  onPress={handleProductPress}
  onFavoritePress={handleFavorite}
  onAddToCart={handleAddToCart}
/>
```

---

### 6. **BottomNavigation Component** (`src/components/BottomNavigation.tsx`)

A modern bottom navigation bar with active state.

**Features:**
- 4 navigation tabs (Home, Search, Cart, Profile)
- Active tab highlighting with white background
- Icon + label for active tab
- Icon only for inactive tabs
- Rounded pill design

**Props:**
```typescript
type TabName = 'home' | 'search' | 'cart' | 'profile';

interface BottomNavigationProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}
```

**Usage:**
```typescript
<BottomNavigation
  activeTab={activeTab}
  onTabPress={setActiveTab}
/>
```

---

## 🎨 Design System Integration

All components use the centralized design system:

### Colors
```typescript
import { COLORS } from '../constants';

// Primary: #ED7745
// Text: #000000
// Secondary Text: #606060
// Background: #FFFFFF
// Light Gray: #F3F4F6
// Dark Gray: #0E0F10
```

### Fonts
```typescript
import { FONTS } from '../constants';

// FONTS.bold - Headings
// FONTS.semiBold - Buttons, labels
// FONTS.medium - Emphasized text
// FONTS.regular - Body text
```

### Spacing
```typescript
import { SPACING } from '../constants';

// xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
```

---

## 📱 Complete Screen Implementation

### EcommerceHomeScreen (`src/screens/EcommerceHomeScreen.tsx`)

A complete e-commerce home screen combining all components.

**Features:**
- Header with user info
- Banner carousel
- Search bar
- Category filters
- Product grid
- Bottom navigation
- Scrollable content

**Structure:**
```typescript
<SafeAreaView>
  <Header />
  <ScrollView>
    <Banner />
    <SearchBar />
    <CategoryFilter />
    <ProductGrid />
  </ScrollView>
  <BottomNavigation />
</SafeAreaView>
```

---

## 🎯 Component Best Practices

### 1. **Reusability**
All components are designed to be reusable across different screens:
```typescript
// Can be used anywhere
<Header userName="John Doe" />
<ProductCard product={product} />
```

### 2. **Type Safety**
Full TypeScript support with interfaces:
```typescript
interface HeaderProps {
  userName: string;
  // ... other props
}
```

### 3. **Customization**
Components accept callbacks for custom behavior:
```typescript
<ProductCard
  onPress={customHandler}
  onFavoritePress={customFavoriteHandler}
/>
```

### 4. **Styling**
All styles use the centralized constants:
```typescript
import { COLORS, FONTS, SPACING } from '../constants';
```

### 5. **Performance**
- Optimized for smooth scrolling
- Minimal re-renders
- Efficient event handling

---

## 🔄 State Management

### Local State (Component Level)
```typescript
const [activeTab, setActiveTab] = useState<TabName>('home');
const [selectedCategory, setSelectedCategory] = useState('popular');
const [searchQuery, setSearchQuery] = useState('');
```

### Global State (Zustand - Future)
For cart, wishlist, and user data:
```typescript
// Example future implementation
const { cart, addToCart } = useCartStore();
const { wishlist, toggleWishlist } = useWishlistStore();
```

---

## 📦 Component Exports

All components are exported from `src/components/index.ts`:

```typescript
export { Header } from './Header';
export { Banner } from './Banner';
export { SearchBar } from './SearchBar';
export { CategoryFilter } from './CategoryFilter';
export { ProductCard } from './ProductCard';
export { BottomNavigation } from './BottomNavigation';
export type { Product } from './ProductCard';
export type { TabName } from './BottomNavigation';
```

**Usage:**
```typescript
import {
  Header,
  Banner,
  ProductCard,
  BottomNavigation,
} from '../components';
```

---

## 🎨 UI Reference

Design based on: [Fashion E-Commerce Mobile App Design](https://www.behance.net/gallery/234410629/Fashion-E-Commerce-Mobile-App-Design)

**Key Design Elements:**
- ✅ Clean, modern interface
- ✅ Card-based layout
- ✅ Rounded corners
- ✅ Subtle shadows
- ✅ Icon-based navigation
- ✅ Horizontal scrolling sections
- ✅ Product grid layout
- ✅ Bottom navigation bar

---

## 🚀 Next Steps

### Enhancements
1. **Add Images**: Replace emoji placeholders with actual product images
2. **Add Navigation**: Implement React Navigation for multi-screen flow
3. **Add State Management**: Implement Zustand stores for cart and wishlist
4. **Add Animations**: Add smooth transitions and micro-interactions
5. **Add API Integration**: Connect to real backend API

### Additional Screens
- Product Detail Screen
- Cart Screen
- Wishlist Screen
- Profile Screen
- Search Results Screen
- Category Screen

### Additional Features
- Pull-to-refresh
- Infinite scroll
- Product filtering
- Sort options
- Price range filter
- Reviews and ratings
- Product variants (size, color)

---

## ✅ Summary

**Components Created:**
- ✅ Header (6 components total)
- ✅ Banner
- ✅ SearchBar
- ✅ CategoryFilter
- ✅ ProductCard
- ✅ BottomNavigation

**Features:**
- ✅ Fully typed with TypeScript
- ✅ Reusable and modular
- ✅ Follows design system
- ✅ Responsive layout
- ✅ Touch-optimized
- ✅ Production-ready

**Files:**
- 6 new component files
- 1 new screen file
- All properly exported
- Fully documented

---

**Last Updated**: November 11, 2025
**Design Version**: 1.0
**Status**: ✅ Ready for Development
