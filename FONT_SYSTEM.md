# Font System Documentation

## Overview
The app uses system fonts with proper `fontWeight` properties instead of custom font families to ensure consistent rendering across platforms.

## Font Weights

We use the `FONT_WEIGHTS` constant from `/src/constants/index.ts`:

```typescript
export const FONT_WEIGHTS = {
  light: '300',      // Light weight
  regular: '400',    // Normal/Regular weight
  medium: '500',     // Medium weight
  semiBold: '600',   // Semi-bold weight
  bold: '700',       // Bold weight
}
```

## Usage

### ❌ INCORRECT (Old Way - Using fontFamily)
```typescript
const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,  // ❌ This won't work properly
    color: COLORS.text,
  },
});
```

### ✅ CORRECT (New Way - Using fontWeight)
```typescript
const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,  // ✅ This works correctly
    color: COLORS.text,
  },
});
```

## Import Statement

Always import `FONT_WEIGHTS` instead of `FONTS`:

```typescript
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
```

## Font Weight Reference

| Weight | Value | Use Case |
|--------|-------|----------|
| `light` | 300 | Subtle text, secondary information |
| `regular` | 400 | Body text, default text |
| `medium` | 500 | Emphasized text, labels |
| `semiBold` | 600 | Subheadings, important labels |
| `bold` | 700 | Headings, primary actions, prices |

## Examples

### Heading
```typescript
heading: {
  fontSize: FONT_SIZES.xl,
  fontWeight: FONT_WEIGHTS.bold,
  color: COLORS.text,
}
```

### Body Text
```typescript
body: {
  fontSize: FONT_SIZES.md,
  fontWeight: FONT_WEIGHTS.regular,
  color: COLORS.text,
}
```

### Label
```typescript
label: {
  fontSize: FONT_SIZES.sm,
  fontWeight: FONT_WEIGHTS.semiBold,
  color: COLORS.textSecondary,
}
```

### Light Text
```typescript
subtitle: {
  fontSize: FONT_SIZES.sm,
  fontWeight: FONT_WEIGHTS.light,
  color: COLORS.textSecondary,
}
```

## Why This Approach?

1. **Cross-platform compatibility**: System fonts work consistently on iOS and Android
2. **No font linking required**: No need to configure custom fonts in native projects
3. **Proper weight rendering**: `fontWeight` is the standard React Native property
4. **Better performance**: System fonts are already loaded
5. **Easier maintenance**: No custom font files to manage

## Migration

All components have been updated to use `fontWeight` instead of `fontFamily`. If you're creating new components:

1. Import `FONT_WEIGHTS` from constants
2. Use `fontWeight: FONT_WEIGHTS.{weight}` in your styles
3. Never use `fontFamily: FONTS.{weight}`

## Custom Fonts (Future)

If you want to add custom fonts in the future:

1. Link the font files properly in iOS and Android
2. Update the `FONTS` constant with actual font family names
3. Use both `fontFamily` and `fontWeight` together:

```typescript
text: {
  fontFamily: 'CustomFont',
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZES.md,
}
```
