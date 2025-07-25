import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common use cases
export const useLocalStorageState = <T>(key: string, initialValue: T) => {
  return useLocalStorage(key, initialValue);
};

// Hook for managing user preferences
export const useUserPreferences = () => {
  return useLocalStorage('userPreferences', {
    theme: 'light' as 'light' | 'dark' | 'system',
    defaultView: 'grid' as 'grid' | 'list',
    autoSave: true,
    emailNotifications: true
  });
};

// Hook for managing draft data
export const useDraftData = <T>(key: string, initialValue: T) => {
  const [draft, setDraft, clearDraft] = useLocalStorage(
    `draft_${key}`,
    initialValue
  );

  const saveDraft = useCallback(
    (data: T) => {
      setDraft(data);
    },
    [setDraft]
  );

  const hasDraft = useCallback(() => {
    try {
      if (typeof window === 'undefined') return false;
      const item = window.localStorage.getItem(`draft_${key}`);
      return item !== null && item !== 'null' && item !== 'undefined';
    } catch {
      return false;
    }
  }, [key]);

  return {
    draft,
    saveDraft,
    clearDraft,
    hasDraft
  };
};