# Color System Documentation

This document describes the color system used throughout the Urban Kashmir app.

## 🎨 Color Palette

All colors are defined in `src/constants/index.ts` and should be imported from there.

### Primary Colors

| Color Name | Hex Code | Usage | Preview |
|------------|----------|-------|---------|
| **Primary** | `#ED7745` | Primary actions, CTAs, highlights | 🟠 Orange/Coral |
| **Black** | `#000000` | Primary text, headings | ⚫ Pure Black |
| **Dark Gray** | `#0E0F10` | Secondary text, subtle elements | ⚫ Almost Black |
| **Gray** | `#606060` | Tertiary text, placeholders | 🔘 Medium Gray |
| **Light Gray** | `#F3F4F6` | Backgrounds, borders, dividers | ⚪ Light Gray |

### Semantic Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Background** | `#FFFFFF` | Main background |
| **Background Secondary** | `#F3F4F6` | Secondary backgrounds, cards |
| **Text** | `#000000` | Primary text |
| **Text Secondary** | `#606060` | Secondary text, descriptions |
| **Text Light** | `#0E0F10` | Subtle text elements |
| **Border** | `#F3F4F6` | Borders, dividers |

### Status Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Success** | `#34C759` | Success states, confirmations |
| **Warning** | `#FF9500` | Warning states, alerts |
| **Error** | `#FF3B30` | Error states, destructive actions |

## 📝 Usage

### Import Colors

```typescript
import { COLORS } from './src/constants';
```

### In StyleSheet

```typescript
import { StyleSheet } from 'react-native';
import { COLORS } from './src/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
  },
  border: {
    borderColor: COLORS.border,
  },
});
```

### In Components

```typescript
import { View, Text } from 'react-native';
import { COLORS } from './src/constants';

const MyComponent = () => (
  <View style={{ backgroundColor: COLORS.background }}>
    <Text style={{ color: COLORS.text }}>Hello</Text>
  </View>
);
```

## 🎯 Color Usage Guidelines

### Text Colors

- **Primary text**: Use `COLORS.text` (#000000)
- **Secondary text**: Use `COLORS.textSecondary` (#606060)
- **Subtle text**: Use `COLORS.textLight` (#0E0F10)

```typescript
// Example
<Text style={{ color: COLORS.text }}>Main heading</Text>
<Text style={{ color: COLORS.textSecondary }}>Description text</Text>
```

### Background Colors

- **Main backgrounds**: Use `COLORS.background` (#FFFFFF)
- **Cards/sections**: Use `COLORS.backgroundSecondary` (#F3F4F6)
- **Highlighted areas**: Use `COLORS.lightGray` (#F3F4F6)

```typescript
// Example
<View style={{ backgroundColor: COLORS.background }}>
  <View style={{ backgroundColor: COLORS.backgroundSecondary }}>
    {/* Card content */}
  </View>
</View>
```

### Interactive Elements

- **Primary buttons**: Use `COLORS.primary` (#ED7745)
- **Secondary buttons**: Use `COLORS.darkGray` (#0E0F10)
- **Links**: Use `COLORS.primary` (#ED7745)

```typescript
// Example
<TouchableOpacity style={{ backgroundColor: COLORS.primary }}>
  <Text style={{ color: COLORS.background }}>Primary Action</Text>
</TouchableOpacity>
```

### Borders & Dividers

- **Subtle borders**: Use `COLORS.border` (#F3F4F6)
- **Emphasized borders**: Use `COLORS.gray` (#606060)
- **Accent borders**: Use `COLORS.primary` (#ED7745)

```typescript
// Example
<View style={{ 
  borderWidth: 1, 
  borderColor: COLORS.border 
}} />
```

## 🚫 Don'ts

❌ **Don't hardcode colors**
```typescript
// Bad
<Text style={{ color: '#000000' }}>Text</Text>

// Good
<Text style={{ color: COLORS.text }}>Text</Text>
```

❌ **Don't use inline hex values**
```typescript
// Bad
<View style={{ backgroundColor: '#ED7745' }} />

// Good
<View style={{ backgroundColor: COLORS.primary }} />
```

❌ **Don't create custom colors without adding to constants**
```typescript
// Bad
const customColor = '#123456';

// Good - Add to src/constants/index.ts first
export const COLORS = {
  // ... existing colors
  customColor: '#123456',
};
```

## ✅ Best Practices

### 1. Always Import from Constants

```typescript
import { COLORS } from './src/constants';
```

### 2. Use Semantic Names

Prefer semantic color names over descriptive ones:

```typescript
// Good
backgroundColor: COLORS.primary
color: COLORS.textSecondary

// Avoid
backgroundColor: COLORS.orange
color: COLORS.gray
```

### 3. Maintain Consistency

Use the same color for the same purpose throughout the app:

- Primary actions → `COLORS.primary`
- Body text → `COLORS.text`
- Descriptions → `COLORS.textSecondary`

### 4. Consider Accessibility

Ensure sufficient contrast ratios:

- Text on white: Use `COLORS.text` or `COLORS.darkGray`
- Text on primary: Use `COLORS.background` (white)
- Small text: Use darker colors for better readability

## 🎨 Color Combinations

### Recommended Combinations

**High Contrast (Best for text)**
- Text: `COLORS.text` on Background: `COLORS.background`
- Text: `COLORS.background` on Background: `COLORS.primary`

**Medium Contrast (Good for secondary text)**
- Text: `COLORS.textSecondary` on Background: `COLORS.background`
- Text: `COLORS.darkGray` on Background: `COLORS.lightGray`

**Subtle (For borders and dividers)**
- Border: `COLORS.border` on Background: `COLORS.background`
- Border: `COLORS.lightGray` on Background: `COLORS.background`

## 📱 Component Examples

### Button

```typescript
// Primary Button
<View style={{ 
  backgroundColor: COLORS.primary,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: COLORS.background }}>
    Primary Action
  </Text>
</View>

// Secondary Button
<View style={{ 
  backgroundColor: COLORS.darkGray,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: COLORS.background }}>
    Secondary Action
  </Text>
</View>

// Outline Button
<View style={{ 
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: COLORS.primary,
  padding: 16,
  borderRadius: 8,
}}>
  <Text style={{ color: COLORS.primary }}>
    Outline Action
  </Text>
</View>
```

### Card

```typescript
<View style={{
  backgroundColor: COLORS.backgroundSecondary,
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: COLORS.border,
}}>
  <Text style={{ 
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  }}>
    Card Title
  </Text>
  <Text style={{ 
    color: COLORS.textSecondary,
    fontSize: 14,
  }}>
    Card description text
  </Text>
</View>
```

### Input Field

```typescript
<TextInput
  style={{
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    color: COLORS.text,
  }}
  placeholderTextColor={COLORS.textSecondary}
/>
```

## 🔄 Updating Colors

To update or add colors:

1. Edit `src/constants/index.ts`
2. Add or modify color in the `COLORS` object
3. Use TypeScript autocomplete to access the new color
4. Update this documentation

```typescript
// In src/constants/index.ts
export const COLORS = {
  // ... existing colors
  newColor: '#HEXCODE',
} as const;
```

## 📊 Color Accessibility

### Contrast Ratios

- **Normal text (16px+)**: Minimum 4.5:1
- **Large text (24px+)**: Minimum 3:1
- **UI components**: Minimum 3:1

### Current Ratios

- Black (#000000) on White (#FFFFFF): 21:1 ✅ Excellent
- Dark Gray (#0E0F10) on White: ~20:1 ✅ Excellent
- Gray (#606060) on White: 5.74:1 ✅ Good
- Primary (#ED7745) on White: 3.4:1 ⚠️ Use for large text only
- White on Primary (#ED7745): 6.2:1 ✅ Good

## 🎯 Summary

- ✅ All colors defined in `src/constants/index.ts`
- ✅ Import using `import { COLORS } from './src/constants'`
- ✅ Use semantic color names
- ✅ Never hardcode hex values
- ✅ Maintain consistency across the app
- ✅ Consider accessibility and contrast

---

**Last Updated**: November 11, 2025
**Color Palette Version**: 1.0
