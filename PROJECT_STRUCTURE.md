# Project Structure

This document explains the folder structure and architecture of the Urban Kashmir React Native application.

## 📁 Folder Structure

```
urban-kashmir-rn/
├── src/
│   ├── api/                    # API layer
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── endpoints.ts       # API endpoint constants
│   │   ├── services/          # API service functions
│   │   │   ├── authService.ts
│   │   │   └── userService.ts
│   │   └── index.ts           # API exports
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Button.tsx
│   │   └── index.ts
│   │
│   ├── screens/               # Screen components
│   │   ├── HomeScreen.tsx
│   │   └── index.ts
│   │
│   ├── navigation/            # Navigation configuration
│   │   └── (navigation files)
│   │
│   ├── store/                 # Zustand state management
│   │   ├── authStore.ts       # Authentication state
│   │   ├── userStore.ts       # User profile state
│   │   └── index.ts           # Store exports
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useApi.ts          # API call hook with loading/error states
│   │   └── index.ts
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── storage.ts         # AsyncStorage wrapper
│   │   └── index.ts
│   │
│   ├── constants/             # App constants
│   │   └── index.ts           # Colors, spacing, etc.
│   │
│   └── assets/                # Static assets
│       ├── images/
│       └── fonts/
│
├── android/                   # Android native code
├── ios/                       # iOS native code
├── App.tsx                    # Root component
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## 🏗️ Architecture Patterns

### 1. API Layer (`src/api/`)

**Standalone API Services**: Each service is a collection of standalone functions that handle specific API operations.

```typescript
// Example: Using authService
import { authService } from '@/api';

const response = await authService.login({ email, password });
```

**Benefits**:
- Easy to test
- No class boilerplate
- Tree-shakeable
- Simple to use

### 2. State Management (`src/store/`)

**Zustand Stores**: Lightweight state management with a simple API.

```typescript
// Example: Using authStore
import { useAuthStore } from '@/store';

const { user, login, logout } = useAuthStore();
```

**Benefits**:
- Minimal boilerplate
- No providers needed
- TypeScript support
- Easy to debug

### 3. Custom Hooks (`src/hooks/`)

**Reusable Logic**: Extract common patterns into custom hooks.

```typescript
// Example: Using useApi hook
import { useApi } from '@/hooks';

const { data, isLoading, error, execute } = useApi();
await execute(() => userService.getProfile());
```

### 4. Type Safety (`src/types/`)

**Centralized Types**: All TypeScript interfaces and types in one place.

```typescript
import type { User, LoginCredentials } from '@/types';
```

## 🔄 Data Flow

1. **Component** → Calls Zustand store action or uses custom hook
2. **Store/Hook** → Calls API service function
3. **API Service** → Makes HTTP request via Axios client
4. **Response** → Updates store state or returns to component
5. **Component** → Re-renders with new data

## 📝 Naming Conventions

- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`storage.ts`)
- **Components**: PascalCase (`HomeScreen`, `Button`)
- **Functions**: camelCase (`login`, `fetchProfile`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `STORAGE_KEYS`)
- **Types/Interfaces**: PascalCase (`User`, `LoginCredentials`)

## 🎯 Best Practices

1. **Keep components small**: Break down large components into smaller, reusable ones
2. **Use TypeScript**: Always define types for props, state, and API responses
3. **Centralize API calls**: All API logic should be in service functions
4. **Error handling**: Always handle errors in async operations
5. **Loading states**: Show loading indicators for async operations
6. **Code organization**: Group related files together
7. **Export pattern**: Use index.ts files for clean imports

## 🚀 Adding New Features

### Adding a new API endpoint:

1. Add endpoint to `src/api/endpoints.ts`
2. Create service function in `src/api/services/`
3. Export from `src/api/index.ts`

### Adding a new screen:

1. Create screen component in `src/screens/`
2. Export from `src/screens/index.ts`
3. Add navigation route (if using navigation)

### Adding a new store:

1. Create store file in `src/store/`
2. Define state interface and actions
3. Export from `src/store/index.ts`

## 📦 Dependencies

### Core:
- **react-native**: Mobile framework
- **react**: UI library
- **typescript**: Type safety

### State Management:
- **zustand**: Lightweight state management

### API:
- **axios**: HTTP client

### Development:
- **@types/**: TypeScript definitions
- **eslint**: Code linting
- **prettier**: Code formatting
