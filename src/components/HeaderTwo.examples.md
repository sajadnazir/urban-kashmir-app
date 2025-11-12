# HeaderTwo Component Usage Examples

## Basic Usage - Back and Share buttons
```tsx
<HeaderTwo
  leftIcon="chevron-left"
  rightIcon="share-2"
  onLeftPress={() => navigation.goBack()}
  onRightPress={() => handleShare()}
/>
```

## With Title Only
```tsx
<HeaderTwo
  title="Product Details"
  leftIcon="chevron-left"
  rightIcon="more-vertical"
  onLeftPress={() => navigation.goBack()}
  onRightPress={() => showMenu()}
/>
```

## With Title and Subtitle
```tsx
<HeaderTwo
  title="My Cart"
  subtitle="3 items"
  leftIcon="chevron-left"
  rightIcon="trash-2"
  onLeftPress={() => navigation.goBack()}
  onRightPress={() => clearCart()}
/>
```

## Only Left Icon (No Right Icon)
```tsx
<HeaderTwo
  title="Settings"
  leftIcon="chevron-left"
  onLeftPress={() => navigation.goBack()}
  showRightIcon={false}
/>
```

## Custom Icons
```tsx
<HeaderTwo
  title="Favorites"
  leftIcon="menu"
  rightIcon="search"
  onLeftPress={() => openMenu()}
  onRightPress={() => openSearch()}
/>
```

## No Icons, Title Only
```tsx
<HeaderTwo
  title="About Us"
  showLeftIcon={false}
  showRightIcon={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | undefined | Main header title |
| subtitle | string | undefined | Subtitle below title |
| leftIcon | string | 'chevron-left' | Feather icon name for left button |
| rightIcon | string | 'share-2' | Feather icon name for right button |
| onLeftPress | () => void | undefined | Left button press handler |
| onRightPress | () => void | undefined | Right button press handler |
| showLeftIcon | boolean | true | Show/hide left icon |
| showRightIcon | boolean | true | Show/hide right icon |
