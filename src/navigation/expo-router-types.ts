import { Href } from 'expo-router';

// Define all possible routes in your app
export type AppRoutes = 
  | '/'
  | '/login'
  | '/signup'
  | '/forgot-password'
  | '/verify-email'
  | '/home'
  | '/profile'
  | '/settings'
  | '/todos'
  | '/todos/[id]'
  | '/todos/create'
  | '/todos/[id]/edit';

// Type-safe route params
export type RouteParams = {
  '/': undefined;
  '/login': undefined;
  '/signup': undefined;
  '/forgot-password': undefined;
  '/verify-email': { email: string };
  '/home': undefined;
  '/profile': undefined;
  '/settings': undefined;
  '/todos': undefined;
  '/todos/[id]': { id: string };
  '/todos/create': undefined;
  '/todos/[id]/edit': { id: string };
};

// Helper type for type-safe navigation
export type TypedHref<T extends AppRoutes> = Href<T>;

// Helper function for creating type-safe routes
export function createRoute<T extends AppRoutes>(
  route: T,
  params?: RouteParams[T]
): string {
  if (!params) return route;
  
  let result = route as string;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`[${key}]`, String(value));
  });
  
  return result;
}

// Screen props helper for Expo Router
export type ScreenProps<T extends AppRoutes> = {
  params?: RouteParams[T];
  searchParams?: Record<string, string>;
};