import type { ApplicationStatus } from '../types';
import { STATUS_COLORS } from './constants';

export const getStatusColor = (status: ApplicationStatus): string => {
  return STATUS_COLORS[status] || 'gray';
};

export const formatCurrency = (amount: string | number, currency = 'USD'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const filterApplications = (
  applications: any[],
  filters: any
): any[] => {
  return applications.filter(app => {
    if (filters.status?.length && !filters.status.includes(app.status)) {
      return false;
    }
    
    if (filters.companies?.length && !filters.companies.includes(app.company)) {
      return false;
    }
    
    if (filters.dateRange) {
      const appDate = new Date(app.dateApplied);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (appDate < startDate || appDate > endDate) {
        return false;
      }
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableText = `${app.title} ${app.company} ${app.notes || ''}`.toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });
};

export const sortApplications = (
  applications: any[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
): any[] => {
  return [...applications].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle dates
    if (sortField === 'dateApplied' || sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Handle strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getApplicationStats = (applications: any[]) => {
  const stats = {
    total: applications.length,
    byStatus: {} as Record<string, number>,
    responseRate: 0,
    averageResponseTime: 0,
    offerRate: 0,
  };
  
  applications.forEach(app => {
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
  });
  
  const responses = applications.filter(app => 
    !['Applied', 'Ghosted'].includes(app.status)
  ).length;
  
  stats.responseRate = stats.total > 0 ? (responses / stats.total) * 100 : 0;
  stats.offerRate = stats.total > 0 
    ? (stats.byStatus['Offer'] || 0) / stats.total * 100 
    : 0;
  
  return stats;
};