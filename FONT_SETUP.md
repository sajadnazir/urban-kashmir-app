# Sofia Pro Font Setup Guide

This guide will help you add Sofia Pro fonts to your React Native project.

## 📁 Font Files Needed

You need to obtain the following Sofia Pro font files:

- `SofiaPro-Regular.otf` or `.ttf`
- `SofiaPro-Medium.otf` or `.ttf`
- `SofiaPro-SemiBold.otf` or `.ttf`
- `SofiaPro-Bold.otf` or `.ttf`
- `SofiaPro-Light.otf` or `.ttf`

## 📂 Step 1: Add Font Files

1. Place all font files in: `src/assets/fonts/`

```bash
mkdir -p src/assets/fonts
# Copy your Sofia Pro font files to this directory
```

Your structure should look like:
```
src/assets/fonts/
├── SofiaPro-Regular.ttf
├── SofiaPro-Medium.ttf
├── SofiaPro-SemiBold.ttf
├── SofiaPro-Bold.ttf
└── SofiaPro-Light.ttf
```

## ⚙️ Step 2: Configure React Native

### For iOS and Android (Automatic Linking)

Create or update `react-native.config.js` in the project root:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};
```

## 🔧 Step 3: Link the Fonts

Run the following command to link the fonts:

```bash
npx react-native-asset
```

Or if using older React Native versions:

```bash
npx react-native link
```

## 🍎 Step 4: iOS Specific Setup

After linking, verify in Xcode:

1. Open `ios/UrbanKashmirRN.xcworkspace` in Xcode
2. Check that fonts are in "Copy Bundle Resources"
3. Verify `Info.plist` contains font entries:

```xml
<key>UIAppFonts</key>
<array>
  <string>SofiaPro-Regular.ttf</string>
  <string>SofiaPro-Medium.ttf</string>
  <string>SofiaPro-SemiBold.ttf</string>
  <string>SofiaPro-Bold.ttf</string>
  <string>SofiaPro-Light.ttf</string>
</array>
```

Then rebuild:

```bash
cd ios
bundle exec pod install
cd ..
npm run ios
```

## 🤖 Step 5: Android Specific Setup

The fonts should be automatically copied to `android/app/src/main/assets/fonts/`

If not, manually copy them there.

Then rebuild:

```bash
npm run android
```

## ✅ Step 6: Verify Installation

Create a test component to verify fonts are working:

```typescript
import { Text, StyleSheet } from 'react-native';
import { FONTS } from './src/constants';

const TestFonts = () => (
  <>
    <Text style={styles.regular}>Sofia Pro Regular</Text>
    <Text style={styles.medium}>Sofia Pro Medium</Text>
    <Text style={styles.semiBold}>Sofia Pro SemiBold</Text>
    <Text style={styles.bold}>Sofia Pro Bold</Text>
    <Text style={styles.light}>Sofia Pro Light</Text>
  </>
);

const styles = StyleSheet.create({
  regular: { fontFamily: FONTS.regular },
  medium: { fontFamily: FONTS.medium },
  semiBold: { fontFamily: FONTS.semiBold },
  bold: { fontFamily: FONTS.bold },
  light: { fontFamily: FONTS.light },
});
```

## 🔍 Troubleshooting

### Fonts not showing on iOS

1. Clean build folder in Xcode: `Product > Clean Build Folder`
2. Delete derived data
3. Rebuild the app

### Fonts not showing on Android

1. Clean gradle: `cd android && ./gradlew clean && cd ..`
2. Check fonts are in `android/app/src/main/assets/fonts/`
3. Rebuild the app

### Font names don't match

Check the actual font name using:

**iOS**: Open font file in Font Book and check the PostScript name

**Android**: The filename is usually the font name

### Still not working?

1. Restart Metro bundler: `npm start -- --reset-cache`
2. Uninstall app from device/simulator
3. Rebuild completely

## 📝 Font Usage in Code

The fonts are already configured in `src/constants/index.ts`:

```typescript
export const FONTS = {
  regular: 'SofiaPro-Regular',
  medium: 'SofiaPro-Medium',
  semiBold: 'SofiaPro-SemiBold',
  bold: 'SofiaPro-Bold',
  light: 'SofiaPro-Light',
};
```

Use them in your styles:

```typescript
import { FONTS } from './src/constants';

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
});
```

## 🎨 Already Updated Components

The following components have been updated to use Sofia Pro:

- ✅ `src/components/Button.tsx`
- ✅ `src/screens/HomeScreen.tsx`

All future components should use `FONTS` from constants.

## 📦 Alternative: Using Expo

If you're using Expo, you can use `expo-font`:

```bash
npx expo install expo-font
```

Then load fonts in `App.tsx`:

```typescript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'SofiaPro-Regular': require('./src/assets/fonts/SofiaPro-Regular.ttf'),
    'SofiaPro-Medium': require('./src/assets/fonts/SofiaPro-Medium.ttf'),
    'SofiaPro-SemiBold': require('./src/assets/fonts/SofiaPro-SemiBold.ttf'),
    'SofiaPro-Bold': require('./src/assets/fonts/SofiaPro-Bold.ttf'),
    'SofiaPro-Light': require('./src/assets/fonts/SofiaPro-Light.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  // rest of your app
}
```

## ✨ Done!

Once fonts are installed, they will be used throughout the app via the `FONTS` constant.
