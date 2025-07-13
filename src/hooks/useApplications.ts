import { useState, useEffect, useCallback } from 'react';
import {
  createApplication,
  updateApplication,
  deleteApplication,
  getUserApplications,
  subscribeToUserApplications,
  batchUpdateApplications,
  batchDeleteApplications
} from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { Application, ApplicationFormData, ApplicationFilters } from '../types/application';
import { filterApplications, sortApplications } from '../utils/helpers';

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  create: (data: ApplicationFormData) => Promise<string>;
  update: (id: string, data: Partial<ApplicationFormData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  batchUpdate: (updates: Array<{ id: string; data: Partial<ApplicationFormData> }>) => Promise<void>;
  batchDelete: (ids: string[]) => Promise<void>;
  refresh: () => Promise<void>;
  filter: (filters: ApplicationFilters) => void;
  sort: (field: string, direction: 'asc' | 'desc') => void;
  filteredApplications: Application[];
}

export const useApplications = (): UseApplicationsReturn => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting
  useEffect(() => {
    let filtered = filterApplications(applications, filters);
    filtered = sortApplications(filtered, sortField, sortDirection);
    setFilteredApplications(filtered);
  }, [applications, filters, sortField, sortDirection]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) {
      setApplications([]);
      setFilteredApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserApplications(
      user.uid,
      (apps) => {
        setApplications(apps);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const create = useCallback(async (data: ApplicationFormData): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setError(null);
      const id = await createApplication(user.uid, data);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create application';
      setError(message);
      throw err;
    }
  }, [user]);

  const update = useCallback(async (id: string, data: Partial<ApplicationFormData>): Promise<void> => {
    try {
      setError(null);
      await updateApplication(id, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update application';
      setError(message);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteApplication(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete application';
      setError(message);
      throw err;
    }
  }, []);

  const batchUpdate = useCallback(async (updates: Array<{ id: string; data: Partial<ApplicationFormData> }>): Promise<void> => {
    try {
      setError(null);
      await batchUpdateApplications(updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update applications';
      setError(message);
      throw err;
    }
  }, []);

  const batchDelete = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setError(null);
      await batchDeleteApplications(ids);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete applications';
      setError(message);
      throw err;
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const apps = await getUserApplications(user.uid);
      setApplications(apps);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh applications';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const filter = useCallback((newFilters: ApplicationFilters) => {
    setFilters(newFilters);
  }, []);

  const sort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  return {
    applications,
    loading,
    error,
    create,
    update,
    remove,
    batchUpdate,
    batchDelete,
    refresh,
    filter,
    sort,
    filteredApplications
  };
};