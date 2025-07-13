export * from './application';
export * from './user';

// Common types
export interface PageProps {
  children?: React.ReactNode;
}

export interface ErrorState {
  message: string;
  code?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}