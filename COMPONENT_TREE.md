# E-Commerce Component Tree

## 📱 Screen Hierarchy

```
App
└── SafeAreaProvider
    └── EcommerceHomeScreen
        ├── SafeAreaView
        │   ├── Header
        │   │   ├── TouchableOpacity (Profile Section)
        │   │   │   ├── View (Profile Image Container)
        │   │   │   │   └── Image / View (Placeholder)
        │   │   │   └── View (Welcome Text)
        │   │   │       ├── Text (User Name)
        │   │   │       └── Text (Welcome Back)
        │   │   └── View (Actions Container)
        │   │       ├── TouchableOpacity (Wishlist)
        │   │       └── TouchableOpacity (Notification)
        │   │
        │   ├── ScrollView
        │   │   ├── Banner
        │   │   │   ├── ScrollView (Horizontal)
        │   │   │   │   └── TouchableOpacity[] (Banner Items)
        │   │   │   │       └── View (Banner Content)
        │   │   │   │           ├── View (Image Container)
        │   │   │   │           └── View (Text Container)
        │   │   │   │               ├── Text (Subtitle)
        │   │   │   │               ├── Text (Title)
        │   │   │   │               └── TouchableOpacity (Button)
        │   │   │   └── View (Pagination Dots)
        │   │   │
        │   │   ├── SearchBar
        │   │   │   ├── View (Search Container)
        │   │   │   │   ├── Text (Search Icon)
        │   │   │   │   └── TextInput
        │   │   │   └── TouchableOpacity (Filter Button)
        │   │   │
        │   │   ├── CategoryFilter
        │   │   │   └── ScrollView (Horizontal)
        │   │   │       └── TouchableOpacity[] (Categories)
        │   │   │           ├── Text (Icon)
        │   │   │           └── Text (Name)
        │   │   │
        │   │   ├── View (Section Header)
        │   │   │   ├── Text (Title)
        │   │   │   └── Text (See All)
        │   │   │
        │   │   └── View (Products Grid)
        │   │       └── ProductCard[]
        │   │           ├── TouchableOpacity (Card Container)
        │   │           │   ├── TouchableOpacity (Favorite Button)
        │   │           │   ├── View (Image Container)
        │   │           │   │   └── Image / View (Placeholder)
        │   │           │   └── View (Info Container)
        │   │           │       ├── Text (Product Name)
        │   │           │       ├── View (Rating Container)
        │   │           │       │   └── Text[] (Stars)
        │   │           │       └── View (Footer)
        │   │           │           ├── Text (Price)
        │   │           │           └── TouchableOpacity (Cart Button)
        │   │
        │   └── BottomNavigation
        │       └── View (Nav Bar)
        │           └── TouchableOpacity[] (Tab Items)
        │               └── View (Tab Content)
        │                   ├── Text (Icon)
        │                   └── Text (Label - if active)
        │
        └── StatusBar
```

## 🎯 Component Relationships

### Parent-Child Relationships

```
EcommerceHomeScreen (Parent)
├── Header (Child)
├── Banner (Child)
├── SearchBar (Child)
├── CategoryFilter (Child)
├── ProductCard (Child - Multiple instances)
└── BottomNavigation (Child)
```

### Data Flow

```
EcommerceHomeScreen (State Container)
    │
    ├─→ Header
    │   └─→ Callbacks: onProfilePress, onWishlistPress, onNotificationPress
    │
    ├─→ Banner
    │   └─→ Props: items[], onBannerPress
    │
    ├─→ SearchBar
    │   └─→ Props: value, onChangeText, onFilterPress
    │
    ├─→ CategoryFilter
    │   └─→ Props: categories[], selectedCategory, onSelectCategory
    │
    ├─→ ProductCard (x4)
    │   └─→ Props: product, onPress, onFavoritePress, onAddToCart
    │
    └─→ BottomNavigation
        └─→ Props: activeTab, onTabPress
```

## 📊 Component Complexity

### Simple Components (Low Complexity)
- **SearchBar**: Input + Button
- **Header**: Profile + Actions

### Medium Components
- **CategoryFilter**: Horizontal scroll + Selection
- **ProductCard**: Multiple interactive elements

### Complex Components
- **Banner**: Carousel with pagination
- **BottomNavigation**: Multi-tab navigation
- **EcommerceHomeScreen**: Orchestrates all components

## 🔄 State Management

### Component State (useState)

```typescript
EcommerceHomeScreen
├── activeTab: TabName
├── selectedCategory: string
└── searchQuery: string
```

### Props Flow

```
Parent (EcommerceHomeScreen)
    │
    ├─→ [Data Props] ─→ Child Components
    │   ├── userName: string
    │   ├── bannerItems: BannerItem[]
    │   ├── categories: Category[]
    │   └── products: Product[]
    │
    └─→ [Callback Props] ─→ Child Components
        ├── onProfilePress: () => void
        ├── onBannerPress: (item) => void
        ├── onProductPress: (product) => void
        └── onTabPress: (tab) => void
```

## 🎨 Styling Hierarchy

### Global Styles (Constants)
```
constants/index.ts
├── COLORS
│   ├── primary: #ED7745
│   ├── text: #000000
│   ├── gray: #606060
│   └── lightGray: #F3F4F6
│
├── FONTS
│   ├── bold: SofiaPro-Bold
│   ├── semiBold: SofiaPro-SemiBold
│   └── regular: SofiaPro-Regular
│
└── SPACING
    ├── xs: 4
    ├── sm: 8
    ├── md: 16
    └── lg: 24
```

### Component Styles
```
Each Component
└── StyleSheet.create({
    container: { ... },
    element1: { ... },
    element2: { ... },
})
```

## 📱 Layout Structure

### Vertical Layout (Main Screen)
```
┌─────────────────────────┐
│       Header            │ ← Fixed
├─────────────────────────┤
│                         │
│   ScrollView Content    │ ← Scrollable
│   ├── Banner            │
│   ├── SearchBar         │
│   ├── CategoryFilter    │
│   └── Products Grid     │
│                         │
├─────────────────────────┤
│   Bottom Navigation     │ ← Fixed (Absolute)
└─────────────────────────┘
```

### Horizontal Layouts
```
Banner:          [Item 1] [Item 2] [Item 3] →
CategoryFilter:  [🔥 Popular] [👟 Shoes] [👕 Clothing] →
Products Grid:   [Card 1] [Card 2]
                 [Card 3] [Card 4]
```

## 🔗 Component Dependencies

### Import Graph

```
EcommerceHomeScreen
├── imports Header
├── imports Banner
├── imports SearchBar
├── imports CategoryFilter
├── imports ProductCard
├── imports BottomNavigation
└── imports constants (COLORS, FONTS, SPACING)

Each Component
└── imports constants (COLORS, FONTS, SPACING)
```

### Export Graph

```
components/index.ts
├── exports Header
├── exports Banner
├── exports SearchBar
├── exports CategoryFilter
├── exports ProductCard
├── exports BottomNavigation
└── exports types (Product, TabName)

screens/index.ts
├── exports HomeScreen
└── exports EcommerceHomeScreen

App.tsx
└── imports EcommerceHomeScreen
```

## 🎯 Component Reusability

### Highly Reusable (Can be used anywhere)
- ✅ Header
- ✅ SearchBar
- ✅ ProductCard
- ✅ BottomNavigation

### Context-Specific (E-commerce focused)
- ⚠️ Banner (can be adapted)
- ⚠️ CategoryFilter (can be adapted)

### Screen-Specific
- 📱 EcommerceHomeScreen

## 📦 Component Sizes (Approximate)

```
Header:              ~120 lines
Banner:              ~150 lines
SearchBar:           ~60 lines
CategoryFilter:      ~80 lines
ProductCard:         ~140 lines
BottomNavigation:    ~100 lines
EcommerceHomeScreen: ~180 lines
─────────────────────────────────
Total:               ~830 lines
```

## 🚀 Performance Considerations

### Optimized
- ✅ ScrollView with proper content sizing
- ✅ TouchableOpacity with activeOpacity
- ✅ Minimal re-renders
- ✅ Efficient event handlers

### Future Optimizations
- [ ] React.memo for ProductCard
- [ ] useMemo for filtered products
- [ ] useCallback for event handlers
- [ ] FlatList for large product lists
- [ ] Image lazy loading

## 📊 Component Interaction Map

```
User Interactions:
├── Header
│   ├── Tap Profile → onProfilePress()
│   ├── Tap Wishlist → onWishlistPress()
│   └── Tap Notification → onNotificationPress()
│
├── Banner
│   ├── Scroll → Update pagination
│   └── Tap Banner → onBannerPress(item)
│
├── SearchBar
│   ├── Type Text → onChangeText(text)
│   └── Tap Filter → onFilterPress()
│
├── CategoryFilter
│   └── Tap Category → onSelectCategory(id)
│
├── ProductCard
│   ├── Tap Card → onPress(product)
│   ├── Tap Heart → onFavoritePress(product)
│   └── Tap Cart → onAddToCart(product)
│
└── BottomNavigation
    └── Tap Tab → onTabPress(tab)
```

---

**Component Count**: 6 main components
**Total Lines**: ~830 lines
**Nesting Depth**: Max 5 levels
**Reusability**: High
**Maintainability**: Excellent
