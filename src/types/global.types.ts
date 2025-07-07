/**
 * Global type definitions used across the application
 */

// Common response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
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

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  status: LoadingState;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched?: boolean;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

// Common props
export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithStyle {
  style?: any; // React Native style
}

// Theming
export type ColorScheme = 'light' | 'dark' | 'system';

// Platform types
export type Platform = 'ios' | 'android' | 'web';

// Permission types
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

// Network types
export type NetworkStatus = 'online' | 'offline' | 'unknown';