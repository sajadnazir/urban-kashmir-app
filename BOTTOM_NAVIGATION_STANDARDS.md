# Bottom Navigation & Footer Standards

## Uniform Positioning Across All Screens

All bottom navigation and footer components now follow consistent standards:

### **BottomNavigation Component**
- **Position**: `absolute` at bottom (0)
- **Padding**: 
  - Horizontal: `SPACING.xxl` (48px)
  - Bottom: `SPACING.lg` (24px)
- **Height**: Auto (based on content + padding)
- **Background**: Transparent wrapper with dark gray rounded bar

### **BuyButton Component** (Product Details)
- **Position**: `absolute` at bottom (0)
- **Padding**:
  - Horizontal: `SPACING.lg` (24px)
  - Vertical: `SPACING.md` (16px)
- **Height**: Auto (based on content + padding)
- **Background**: White wrapper with light gray rounded container

### **Screen ScrollView Padding**

All screens with bottom navigation/footer must have consistent `paddingBottom`:

#### EcommerceHomeScreen
```typescript
scrollContent: {
  paddingBottom: 100, // Space for bottom navigation
}
```

#### ShopScreen
```typescript
scrollContent: {
  paddingBottom: 100, // Space for bottom navigation
}
```

#### ProductDetailsScreen
```typescript
scrollContent: {
  paddingBottom: 120, // Space for bottom buy button
}
```

## Implementation Checklist

✅ All bottom components use `position: 'absolute'`
✅ Consistent padding values across components
✅ Proper scroll content padding to prevent overlap
✅ Uniform styling and spacing

## Product Images

All product data now includes real Unsplash images:
- EcommerceHomeScreen: 4 products with images
- ShopScreen: 6 products with images
- ProductDetailsScreen: 4 product images in carousel

Image sources:
- Sneakers: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400`
- Hoodies: `https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400`
- Backpacks: `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400`
- Sportswear: Various Unsplash hoodie images
