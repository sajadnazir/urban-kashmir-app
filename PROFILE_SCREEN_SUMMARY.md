# ProfileScreen Implementation

## Overview
Created a complete ProfileScreen matching the provided design with reusable components.

## Reusable Components

### 1. **ProfileHeader.tsx**
- Displays user profile information
- Avatar with image or initials fallback
- User name and email
- Rounded white card design

**Props:**
- `name: string` - User's full name
- `email: string` - User's email address
- `avatarUrl?: string` - Optional avatar image URL

### 2. **ProfileMenuItem.tsx**
- Reusable menu item component
- Icon, title, subtitle, and chevron
- Touchable with press handler
- Consistent styling across all menu items

**Props:**
- `item: ProfileMenuItemData` - Menu item data
- `onPress: (id: string) => void` - Press handler

**ProfileMenuItemData Interface:**
```typescript
{
  id: string;
  icon: string;        // Feather icon name
  title: string;       // Main title
  subtitle: string;    // Description text
}
```

## ProfileScreen Features

### Header Section
- Dark gray background
- Menu button (left) - circular white button
- "Profile" title (center)
- Edit button (right) - circular white button with edit icon

### Profile Card
- White rounded card
- 80x80 circular avatar
- User name: "Sajad Nazir"
- Email: "terri_greene@gmail.com"
- Centered layout

### Main Menu Items (5 items)
1. **Profile** - Shopping, Email, Password, Shoe Size
2. **Buying** - Active Bids, In Progress, Orders
3. **Selling** - Active Asks, Sales, Seller Profile
4. **Favorites** - Items and Lists You,ve Saved
5. **Portfolio** - See The Value of Your Items

### Settings Section (2 items)
1. **Wallet** - Payments, Payout, Gift Cards, Credits
2. **Settings** - Security And Notifications

### Bottom Navigation
- Profile tab active
- Consistent with other screens

## Navigation Flow

```
Bottom Navigation (Profile Icon)
    ↓
ProfileScreen
    ↓ Menu button
Back to Home
```

## Styling Details

- **Background**: Light gray (`COLORS.lightGray`)
- **Header**: Dark gray (`COLORS.darkGray`)
- **Cards**: White with rounded corners (16px radius)
- **Icons**: Circular gray background (48x48)
- **Typography**: Bold titles, regular subtitles
- **Spacing**: Consistent padding and margins

## Files Created

1. `/src/components/ProfileHeader.tsx`
2. `/src/components/ProfileMenuItem.tsx`
3. `/src/screens/ProfileScreen.tsx`

## Files Updated

1. `/src/components/index.ts` - Exported new components
2. `/src/screens/index.ts` - Exported ProfileScreen
3. `/App.tsx` - Added profile navigation logic

## Usage

Click the **Profile icon** in the bottom navigation to access the ProfileScreen from any screen in the app.
