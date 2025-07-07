# React Native Style Guide 2025

A comprehensive guide for building maintainable, scalable React Native applications based on official React recommendations and industry best practices.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Styling Guidelines](#styling-guidelines)
3. [State Management](#state-management)
4. [Component Guidelines](#component-guidelines)
5. [TypeScript Standards](#typescript-standards)
6. [Testing Strategy](#testing-strategy)
7. [Performance Best Practices](#performance-best-practices)
8. [Code Quality](#code-quality)

---

## Directory Structure

We follow a **domain-based (feature-first) organization** as recommended by the official React documentation. This approach scales better than file-type organization and keeps related code together.

### Project Structure

```
src/
├── features/                    # Domain-based organization
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── LoginForm.test.tsx
│   │   │   └── SignupForm/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts             # Feature public API
│   │
│   ├── todos/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── services/
│   │
│   └── profile/
│       ├── components/
│       ├── screens/
│       └── hooks/
│
├── shared/                      # Shared across features
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   └── layout/              # Layout components
│   │       ├── Container/
│   │       └── Header/
│   ├── hooks/                   # Global hooks
│   ├── services/                # API client, storage, etc.
│   ├── utils/                   # Helper functions
│   └── constants/               # App constants
│
├── navigation/
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── types.ts
│
├── store/                       # Global state
│   ├── index.ts
│   └── stores/
│       ├── authStore.ts
│       └── settingsStore.ts
│
└── types/                       # Global types
    └── global.types.ts
```

### Key Rules

1. **Feature Encapsulation**: Each feature folder should be self-contained
2. **Public API**: Use `index.ts` to expose only what other features need
3. **Depth Limit**: Maximum 3-4 nested folders
4. **Shared Code**: Only put truly shared code in the `shared/` directory

### Example Feature Index

```typescript
// features/authentication/index.ts
export { LoginScreen } from './screens/LoginScreen';
export { SignupScreen } from './screens/SignupScreen';
export { useAuth } from './hooks/useAuth';
export type { LoginCredentials, User } from './types/auth.types';
```

---

## Styling Guidelines

We use **React Native Reusables** (shadcn equivalent) with **NativeWind v4** for styling. This provides type-safe, performant styling with a familiar Tailwind CSS approach.

### Setup

```bash
# Install dependencies
npm install react-native-reusables nativewind react-native-svg
npm install -D tailwindcss
```

### Styling Approach

#### 1. Use React Native Reusables Components

```typescript
// ✅ Good - Use reusable components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginForm = () => {
  return (
    <View className="p-4 gap-4">
      <Input placeholder="Email" keyboardType="email-address" className="w-full" />
      <Button onPress={handleLogin} className="w-full">
        <Text>Login</Text>
      </Button>
    </View>
  );
};
```

#### 2. NativeWind for Custom Styling

```typescript
// ✅ Good - NativeWind classes
const CustomComponent = () => {
  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-semibold text-foreground">Welcome</Text>
    </View>
  );
};
```

#### 3. StyleSheet for Complex Styles

```typescript
// ✅ Good - StyleSheet for complex/dynamic styles
import { StyleSheet } from 'react-native';

const DynamicComponent = ({ isActive }: { isActive: boolean }) => {
  return (
    <View style={[styles.container, isActive && styles.active]}>
      <Text>Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  active: {
    backgroundColor: '#3b82f6',
  },
});
```

### Design System

Create a centralized design system:

```typescript
// shared/constants/design.ts
export const Colors = {
  primary: '#3b82f6',
  secondary: '#10b981',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  border: '#e2e8f0',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
```

---

## State Management

We use **Zustand** for client-side global state and **TanStack Query** for server state management.

### Client State with Zustand

```typescript
// store/stores/authStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const user = await authService.login(credentials);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null });
        // Clear other stores if needed
      },

      updateProfile: (profile) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...profile } });
        }
      },
    }),
    { name: 'auth-store' },
  ),
);
```

### Server State with TanStack Query

```typescript
// features/todos/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todoService';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
```

### State Management Rules

1. **Zustand**: Use for client-side global state (auth, settings, UI state)
2. **TanStack Query**: Use for all server state (API data, caching)
3. **React Context**: Use only for theme/localization
4. **Local State**: Use `useState` for component-specific state

---

## Component Guidelines

### Component Structure

```typescript
// ✅ Good component structure
interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const CustomButton = ({ title, onPress, variant = 'primary', disabled = false }: Props) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [onPress, disabled]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`p-4 rounded-lg ${variant === 'primary' ? 'bg-primary' : 'bg-secondary'} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-white font-medium text-center">{title}</Text>
    </Pressable>
  );
};
```

### Hooks Pattern

```typescript
// ✅ Good custom hook
export const useAuth = () => {
  const { user, isLoading, login, logout } = useAuthStore();

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await login(credentials);
        // Navigate or show success
      } catch (error) {
        // Handle error
        console.error('Login failed:', error);
      }
    },
    [login],
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout,
  };
};
```

### Screen Component Pattern

```typescript
// ✅ Good screen structure
export const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleLogin = useCallback(async () => {
    await login(credentials);
  }, [login, credentials]);

  return (
    <Container className="flex-1 justify-center p-6">
      <Text className="text-2xl font-bold text-center mb-8">Welcome Back</Text>

      <LoginForm
        credentials={credentials}
        onCredentialsChange={setCredentials}
        onSubmit={handleLogin}
        isLoading={isLoading}
      />
    </Container>
  );
};
```

---

## TypeScript Standards

### Type Definitions

```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// features/todos/types/todo.types.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}
```

### Navigation Types

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  TodoDetail: { todoId: string };
};
```

---

## Testing Strategy

### Component Testing

```typescript
// __tests__/components/LoginForm.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  const mockProps = {
    credentials: { email: '', password: '' },
    onCredentialsChange: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
  };

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<LoginForm {...mockProps} />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('calls onSubmit when form is submitted', async () => {
    const { getByText } = render(<LoginForm {...mockProps} />);

    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });
});
```

### Hook Testing

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## Performance Best Practices

### Optimization Techniques

```typescript
// ✅ Use React.memo for components that don't change often
export const TodoItem = React.memo(({ todo, onToggle }: Props) => {
  return (
    <Pressable onPress={() => onToggle(todo.id)}>
      <Text>{todo.title}</Text>
    </Pressable>
  );
});

// ✅ Use useCallback for event handlers
const TodoList = ({ todos }: Props) => {
  const handleToggle = useCallback((id: string) => {
    // Handle toggle logic
  }, []);

  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => <TodoItem todo={item} onToggle={handleToggle} />}
      keyExtractor={(item) => item.id}
    />
  );
};

// ✅ Use useMemo for expensive calculations
const ExpensiveComponent = ({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      processed: expensiveCalculation(item),
    }));
  }, [data]);

  return <View>{/* Render processed data */}</View>;
};
```

### Image Optimization

```typescript
// ✅ Use optimized images
import { Image } from 'react-native';

const OptimizedImage = ({ source, ...props }: Props) => {
  return (
    <Image
      source={source}
      resizeMode="cover"
      loadingIndicatorSource={require('@/assets/placeholder.png')}
      {...props}
    />
  );
};
```

---

## Code Quality

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": ["@react-native-community", "@typescript-eslint/recommended", "prettier"],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-native/no-inline-styles": "warn"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Import Organization

```typescript
// ✅ Good import order
// 1. React imports
import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. Third-party imports
import { useNavigation } from '@react-navigation/native';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/authentication';

// 4. Relative imports
import { LoginForm } from './LoginForm';
import { styles } from './styles';
```

---

## Quick Reference

### Do's ✅

- Use domain-based folder structure
- Implement proper TypeScript typing
- Use React Native Reusables for UI components
- Leverage Zustand for global state
- Use TanStack Query for server state
- Write tests for critical functionality
- Use meaningful component and variable names
- Implement proper error handling

### Don'ts ❌

- Don't use deep folder nesting (>4 levels)
- Don't put everything in shared folders
- Don't use inline styles for complex styling
- Don't mix server and client state management
- Don't skip TypeScript types
- Don't ignore performance optimizations
- Don't forget accessibility considerations

---
