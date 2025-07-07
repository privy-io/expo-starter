# Navigation Types Usage

This directory contains type definitions for type-safe navigation in the app.

## Expo Router Usage

```typescript
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createRoute, type RouteParams } from '@/navigation';

// In a component
const router = useRouter();

// Type-safe navigation
router.push('/todos/123'); // ✅ Valid
router.push(createRoute('/todos/[id]', { id: '123' })); // ✅ Also valid

// Getting params
const { id } = useLocalSearchParams<RouteParams['/todos/[id]']>();
```

## React Navigation Usage (if needed)

```typescript
import { useNavigation } from '@react-navigation/native';
import type { AuthStackParamList } from '@/navigation';
import type { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const navigation = useNavigation<LoginScreenNavigationProp>();
navigation.navigate('Signup'); // ✅ Type-safe
```

## Adding New Routes

1. Add the route to `AppRoutes` type in `expo-router-types.ts`
2. Add params to `RouteParams` type if the route has parameters
3. Update the corresponding stack param list in `types.ts` if using React Navigation