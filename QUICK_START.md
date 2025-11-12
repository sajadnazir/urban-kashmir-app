# Quick Start Guide

Get up and running with Urban Kashmir React Native in minutes!

## 🚀 Installation

```bash
# 1. Ensure you're using Node 22
nvm use 22

# 2. Install dependencies
npm install

# 3. For iOS only - Install CocoaPods
cd ios && bundle install && bundle exec pod install && cd ..
```

## 📱 Running the App

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Start Metro Bundler Separately

```bash
npm start
```

## 📂 Project Overview

```
src/
├── api/          → API services and configuration
├── components/   → Reusable UI components
├── screens/      → Screen components
├── store/        → Zustand state management
├── hooks/        → Custom React hooks
├── types/        → TypeScript definitions
├── utils/        → Utility functions
├── constants/    → App constants
└── assets/       → Images, fonts, etc.
```

## 🎯 Key Features

### 1. API Services (Standalone Functions)

```typescript
import { authService } from './src/api';

// Simple function calls - no classes needed
const response = await authService.login({ email, password });
```

### 2. Zustand State Management

```typescript
import { useAuthStore } from './src/store';

// Use in any component
const { user, login, logout } = useAuthStore();
```

### 3. Custom Hooks

```typescript
import { useApi } from './src/hooks';

// Reusable API call logic
const { data, isLoading, error, execute } = useApi();
```

### 4. TypeScript Types

```typescript
import type { User, LoginCredentials } from './src/types';

// Full type safety everywhere
```

## 🔧 Common Tasks

### Add a New Screen

1. Create `src/screens/NewScreen.tsx`
2. Export from `src/screens/index.ts`
3. Use in your navigation or App.tsx

### Add a New API Endpoint

1. Add endpoint to `src/api/endpoints.ts`
2. Create service in `src/api/services/`
3. Export from `src/api/index.ts`

### Add a New Zustand Store

1. Create `src/store/newStore.ts`
2. Define state and actions
3. Export from `src/store/index.ts`

### Add a New Component

1. Create `src/components/NewComponent.tsx`
2. Export from `src/components/index.ts`
3. Use anywhere in your app

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed architecture documentation
- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Code examples and patterns
- **[README.md](./README.md)** - Full project documentation

## 🎨 Customization

### Update Colors

Edit `src/constants/index.ts`:

```typescript
export const COLORS = {
  primary: '#007AFF',    // Your brand color
  secondary: '#5856D6',  // Secondary color
  // ... more colors
};
```

### Update API Base URL

Edit `src/api/client.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'      // Development
  : 'https://api.yourapp.com';       // Production
```

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache
```

### iOS Build Issues

```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

### Android Build Issues

```bash
# Clean gradle
cd android
./gradlew clean
cd ..
```

### TypeScript Errors

```bash
# Restart TypeScript server in your IDE
# Or check tsconfig.json settings
```

## 🎓 Learning Resources

- **Zustand**: https://github.com/pmndrs/zustand
- **Axios**: https://axios-http.com/
- **React Native**: https://reactnative.dev/
- **TypeScript**: https://www.typescriptlang.org/

## 💡 Tips

1. **Use the custom hooks** - They handle loading and error states for you
2. **Keep API logic in services** - Don't make API calls directly in components
3. **Use TypeScript** - It will save you from bugs
4. **Follow the folder structure** - It keeps the codebase organized
5. **Check USAGE_EXAMPLES.md** - For common patterns and examples

## 🚀 Next Steps

1. Explore the example `HomeScreen` in `src/screens/HomeScreen.tsx`
2. Check out the `Button` component in `src/components/Button.tsx`
3. Review the API services in `src/api/services/`
4. Look at the Zustand stores in `src/store/`
5. Read through `USAGE_EXAMPLES.md` for practical examples

Happy coding! 🎉
