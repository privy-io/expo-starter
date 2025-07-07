/**
 * API-specific type definitions
 */

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  withCredentials?: boolean;
}

// API endpoints configuration
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  authenticated?: boolean;
}

// Error response from API
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    field?: string;
    details?: any;
  };
  statusCode: number;
  timestamp: string;
}

// Token types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

// File upload types
export interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Response metadata
export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  version?: string;
}