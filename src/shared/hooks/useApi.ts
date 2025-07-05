import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ErrorResponse } from '@/src/types/global.types';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
      code: response.status.toString(),
    }));
    throw error;
  }

  return response.json();
}

// Generic query hook
export function useApiQuery<T>(
  key: string | string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, ErrorResponse>, 'queryKey' | 'queryFn'>
) {
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery<T, ErrorResponse>({
    queryKey,
    queryFn: () => fetchApi<T>(endpoint),
    ...options,
  });
}

// Generic mutation hook
export function useApiMutation<TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: UseMutationOptions<TData, ErrorResponse, TVariables>
) {
  return useMutation<TData, ErrorResponse, TVariables>({
    mutationFn: async (variables) => {
      return fetchApi<TData>(endpoint, {
        method,
        body: JSON.stringify(variables),
      });
    },
    ...options,
  });
}