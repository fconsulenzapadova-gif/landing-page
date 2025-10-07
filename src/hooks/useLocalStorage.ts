import { useState, useEffect, useCallback } from 'react';
import { getAppStorage } from '@/utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const storage = getAppStorage();
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const storage = getAppStorage();
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useLocalStorageWithMigration<T>(
  key: string, 
  initialValue: T,
  migrationFn?: (data: any) => T
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const storage = getAppStorage();
      const item = storage.getItem(key);
      if (!item) return initialValue;
      
      const parsedData = JSON.parse(item);
      return migrationFn ? migrationFn(parsedData) : parsedData;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const storage = getAppStorage();
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}